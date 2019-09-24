/*
Copyright 2015-2019 Perspectiva di Formentini Filippo

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Copyright 2015-2019 Perspectiva di Formentini Filippo
Concesso in licenza secondo i termini della Licenza Apache, versione 2.0 (la "Licenza"); è proibito usare questo file se non in conformità alla Licenza. Una copia della Licenza è disponibile all'indirizzo:

http://www.apache.org/licenses/LICENSE-2.0

Se non richiesto dalla legislazione vigente o concordato per iscritto,
il software distribuito nei termini della Licenza è distribuito
"COSÌ COM'È", SENZA GARANZIE O CONDIZIONI DI ALCUN TIPO, esplicite o implicite.
Consultare la Licenza per il testo specifico che regola le autorizzazioni e le limitazioni previste dalla medesima.

*/

/**
 * Classe per la gestione delle funzionalità di info
 */
let AppMapInfo = (function() {
  "use strict";

  //Array with the requests to elaborate
  let requestQueue = {};
  //Array with the requests results. Data are features of different types.
  let requestQueueData = [];

  let vectorInfo = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: []
    }),
    style: AppMapStyles.getInfoStyle()
  });

  let init = function() {
    vectorInfo.setMap(AppMap.getMap());
    Dispatcher.bind("show-info-items", function(payload) {
      AppMapInfo.showRequestInfoFeatures(payload.features, payload.element);
    });
    Dispatcher.bind("show-info-geometries", function(payload) {
      AppMapInfo.showRequestInfoFeaturesGeometries(payload.features);
    });
  };

  /**
   * Restituisce l'url per ricavare le informazioni sulla mappa
   * @param {Object} layer
   * @param {Array} coordinate
   * @param {float} viewResolution
   * @param {String} infoFormat
   * @param {int} featureCount
   */
  let getGetFeatureInfoUrl = function(layer, coordinate, viewResolution, infoFormat, featureCount, bbox) {
    let url = layer.getSource().getGetFeatureInfoUrl(coordinate, viewResolution, "EPSG:3857", {
      INFO_FORMAT: infoFormat,
      feature_count: featureCount
    });
    return url;
  };

  /**
   * Execute the info request on map click. The function generates a RequestQueue
   * Object with the layer request to be executed. Because the user can click multiple times
   * the RequestQueue has a pending state and an unique ID in order to keep track of the
   * requests and stop them if needed
   * The pipeline is
   * 1. getRequestInfo
   * 2. getFeatureInfoRequest
   * 3. processRequestInfo/processRequestInfoAll based on the variable visibleLayers
   * @param {Array} coordinate Coordinate of the point clicked
   * @param {Array} pixel pixel clicked on map
   * @param {boolean} visibleLayers Visibile Layers
   */
  let getRequestInfo = function getRequestInfo(coordinate, pixel, visibleLayers) {
    if (!AppStore.getInfoClickEnabled()) {
      return;
    }
    dispatch("hide-map-tooltip");
    //checking if there is a vector feature
    let featuresClicked = [];
    let featuresInfoClicked = [];

    if (pixel) {
      AppMap.getMap().forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (layer === null) {
          featuresInfoClicked.push(feature);
        } else {
          feature.layerGid = layer.get("gid").replace("_preload", "");
          featuresClicked.push(feature);
        }
      });
    }
    if (featuresInfoClicked.length > 0) {
      showInfoFeatureTooltipAtPixel(featuresInfoClicked[0], pixel);
      return;
    }
    if (featuresClicked.length > 0) {
      showVectorInfoFeatures(featuresClicked);
      return;
    }

    requestQueue = new RequestQueue(coordinate, visibleLayers);
    requestQueueData = [];
    let viewResolution = AppMap.getMap()
      .getView()
      .getResolution();
    //ricavo i livelli visibili e li ordino per livello di visualizzazione
    AppMap.getMap()
      .getLayers()
      .forEach(function(layer) {
        if (layer.queryable) {
          if (!requestQueue.visibleLayers || layer.getVisible()) {
            let url = getGetFeatureInfoUrl(layer, coordinate, viewResolution, "text/javascript", 50);
            requestQueue.layers.push(new RequestLayer(url, layer.zIndex, layer.gid, layer.srs));
          }
        }
      });
    requestQueue.layers = requestQueue.layers.sort(SortByZIndex);

    //eseguo il loop delle richieste
    if (!requestQueue.ajaxPending) {
      getFeatureInfoRequest(requestQueue.visibleLayers);
    } else {
      //resetto la richiesta
      requestQueue.mustRestart = true;
    }
  };

  /**
   * Executes the request on the first layer not sent in the RequestQueue
   */
  let getFeatureInfoRequest = function getFeatureInfoRequest() {
    let url = "";
    //ricavo l'url corrente dalla coda globale e setto il layer come completato
    //TODO refactor whe IE support will drop
    for (let i = 0; i < requestQueue.layers.length; i++) {
      if (!requestQueue.layers[i].sent) {
        requestQueue.layers[i].sent = true;
        requestQueue.currentLayerIndex = i;
        url = requestQueue.layers[i].url;
        break;
      }
    }
    if (!url) {
      //the loop has ended
      requestQueue.ajaxPending = false;
      AppMapInfo.clearLayerInfo();
      if (requestQueueData.length > 0) {
        dispatch({
          eventName: "show-info-items",
          data: {
            features: requestQueueData
          }
        });
        dispatch({
          eventName: "show-info-geometries",
          data: {
            features: requestQueueData
          }
        });
      }

      return;
    }
    //adding the right callback on request
    url += "&format_options=callback:AppMapInfo.processRequestInfoAll";
    //if (requestQueue.visibleLayers) {
    //  url += "&format_options=callback:AppMapInfo.processRequestInfo";
    //} else {
    //  url += "&format_options=callback:AppMapInfo.processRequestInfoAll";
    //}
    requestQueue.ajaxPending = true;
    dispatch("show-loader");
    $.ajax({
      type: "GET",
      url: url,
      jsonp: "callback",
      dataType: "jsonp",
      crossDomain: true,
      contentType: "application/json",
      success: function(response) {},
      error: function(jqXHR, textStatus, errorThrown) {
        requestQueue.ajaxPending = false;
      }
    });
  };

  // /**
  //  * Precess the results after an info click on the map
  //  * @param {object} featureCollection Object with the results. It must have a features property with the array of features
  //  */
  // let processRequestInfo = function processRequestInfo(featureCollection) {
  //   requestQueue.ajaxPending = false;
  //   dispatch("hide-loader");
  //   //se il dato è presente lo visualizzo
  //   if (featureCollection && featureCollection.features.length > 0) {
  //     if (featureCollection.features[0].geometry) {
  //       let srid = AppMap.getSRIDfromCRSName(featureCollection.crs.properties.name);
  //       addGeometryInfoToMap(featureCollection.features[0].geometry, srid, AppMap.getGeometryFormats().GeoJson);
  //     }
  //     for (let i = 0; i < featureCollection.features.length; i++) {
  //       featureCollection.features[i].layerGid = requestQueue.layers[requestQueue.currentLayerIndex].gid;
  //     }
  //     Dispatcher.dispatch({
  //       eventName: "show-info-items",
  //       data: featureCollection
  //     });
  //   }

  //   if (requestQueue.mustRestart) {
  //     requestQueue.mustRestart = false;
  //     getFeatureInfoRequest();
  //   }
  //   //se il dato a questo punto è nullo procedo al secondo step nella coda delle richieste
  //   if (!featureCollection || featureCollection.features.length == 0) {
  //     getFeatureInfoRequest();
  //   }
  // };

  /**
   * Process the next step on a Request Queue
   * @param {object} featureCollection Object with the results. It must have a features property with the array of features
   */
  let processRequestInfoAll = function processRequestInfoAll(featureCollection) {
    dispatch("hide-loader");
    //se il dato è presente lo aggiungo al contenitore global
    if (featureCollection && featureCollection.features.length > 0) {
      for (let i = 0; i < featureCollection.features.length; i++) {
        featureCollection.features[i].layerGid = requestQueue.layers[requestQueue.currentLayerIndex].gid;
        featureCollection.features[i].SRID = requestQueue.layers[requestQueue.currentLayerIndex].srs;
        requestQueueData.push(featureCollection.features[i]);
      }
    }

    //se non è presente o una nuova richiesta è stata accodata procedo al passo successivo
    if (requestQueue.mustRestart) {
      requestQueue.mustRestart = false;
      getFeatureInfoRequest();
    }
    getFeatureInfoRequest(false);
  };

  /**
   * Process the results after the click on a vector feature on the map
   * @param {Array} featureCollection Array of OL featurs with the results. It must have a features property with the array of features
   */
  let showVectorInfoFeatures = function showVectorInfoFeatures(features) {
    clearLayerInfo();
    requestQueue.ajaxPending = false;
    dispatch("hide-loader");

    let featureArray = [];
    if (features && features.length > 0) {
      features.forEach(function(feature) {
        addFeatureInfoToMap(feature, 3857);
        //transform OL feature in GeoJson
        featureArray.push({
          layerGid: feature.layerGid,
          geometry: AppMap.getGeoJsonGeometryFromGeometry(feature.getGeometry()),
          properties: feature.getProperties()
        });
      });
      //tooltip
      if (features.length > 0) {
        showInfoFeatureTooltip(features[0]);
      }

      let featuresCollection = {
        features: featureArray,
        SRID: 3857 //TODO introduce parameter
      };

      Dispatcher.dispatch({
        eventName: "show-info-items",
        features: featuresCollection
      });
    }
  };

  /**
   * Show the click geometries on the map
   * @param {Object} featureInfoCollection GeoJson feature collection
   */
  let showRequestInfoFeaturesGeometries = function(featureInfoCollection) {
    featureInfoCollection.features.forEach(function(feature) {
      //let geometryOl = AppMap.convertGeometryToOl(feature.geometry, AppMap.getGeometryFormats().GeoJson);
      addFeatureInfoToMap(AppMap.convertGeoJsonFeatureToOl(feature), 3857);
    });
  };

  /**
   * Show the click info results in menu
   * @param {Object} featureInfoCollection GeoJson feature collection
   */
  let showRequestInfoFeatures = function(featureInfoCollection, htmlElement) {
    var title = "Risultati";
    var body = "";
    if (!featureInfoCollection) {
      return;
    }
    //single feature sent
    if (!featureInfoCollection.features) {
      featureInfoCollection = {
        features: [featureInfoCollection]
      };
    }
    AppStore.getAppState().currentInfoItems = featureInfoCollection;
    if (featureInfoCollection.features.length > 0) {
      title += " (" + featureInfoCollection.features.length + ")";
    }
    let index = 0;
    featureInfoCollection.features.forEach(function(feature) {
      var props = feature.properties ? feature.properties : feature;
      let layer = AppStore.getLayer(feature.layerGid);
      var template = AppTemplates.getTemplate(feature.layerGid, layer.templateUrl, AppStore.getAppState().templatesRepositoryUrl);
      var tempBody = AppTemplates.processTemplate(template, props, layer);
      if (!tempBody) {
        tempBody += AppTemplates.standardTemplate(props, layer);
      }
      //sezione relations
      var layerRelations = AppStore.getRelations().filter(function(relation) {
        return $.inArray(feature.layerGid, relation.layerGids) >= 0;
      });
      tempBody += AppTemplates.relationsTemplate(layerRelations, props, index);

      tempBody += AppTemplates.featureIconsTemplate(index);

      body += "<div class='lk-feature z-depth-1 lk-mb-3'>" + tempBody + "</div>";
      index++;
    });

    AppMapInfo.showInfoWindow(title, body, htmlElement !== null ? htmlElement : "info-results");
  };

  let showInfoFeatureTooltip = function(feature) {
    let layer = AppStore.getLayer(feature.layerGid);
    let tooltip = AppTemplates.getLabelFeature(feature.getProperties(), layer.labelField, layer.title);
    dispatch({
      eventName: "show-map-tooltip",
      geometry: feature.getGeometry().flatCoordinates,
      tooltip: tooltip
    });
  };

  let showInfoFeatureTooltipAtPixel = function(feature, pixel) {
    let coordinate = AppMap.getCoordinateFromPixel(pixel[0], pixel[1]);
    let layer = AppStore.getLayer(feature.layerGid);
    let tooltip = AppTemplates.getLabelFeature(feature.getProperties(), layer.labelField, layer.title);
    dispatch({
      eventName: "show-map-tooltip",
      geometry: coordinate,
      tooltip: tooltip
    });
  };

  let showInfoWindow = function(title, body, htmlElement) {
    AppToolbar.toggleToolbarItem(htmlElement, true);
    $("#" + htmlElement + "__content").html(body);
    $("#" + htmlElement + "__title").html(title);
    $("#" + htmlElement + "").show();
    // $("#info-window__title").html(title);
    // $("#info-window__body").html(body);
    // $("#info-window").show();
    // $("#info-window").animate(
    //   {
    //     scrollTop: 0
    //   },
    //   "fast"
    // );
  };

  let addWktInfoToMap = function addWktInfoToMap(wkt) {
    /// <summary>
    /// Aggiunge una geometria in formato GeoJson nella mappa dopo una selezione
    /// </summary>
    /// <param name="wkt">Geometria da caricare</param>
    /// <returns type=""></returns>

    let feature = formatWKT.readFeature(wkt);
    /*let feature = formatWKT.readFeature(
    'POLYGON ((10.6112420275072 44.7089045353454, 10.6010851023631 44.6981632996669, 10.6116329324321 44.685907897919, 10.6322275666758 44.7050600304689, 10.6112420275072 44.7089045353454))');*/
    feature.getGeometry().transform("EPSG:4326", "EPSG:3857");

    //feature.getGeometry().transform(projection, 'EPSG:3857');
    vectorInfo.getSource().addFeature(feature);

    return feature;
  };

  /**
   * Add a geometry info to the map
   * @param {Ol/Geometry} geometry
   * @param {int} srid
   */
  let addGeometryInfoToMap = function(geometry, srid) {
    return AppMap.addGeometryToMap(geometry, srid, vectorInfo);
  };

  /**
   * Add a feature to the map
   * @param {Ol/feature} feature
   * @param {int} srid
   */
  let addFeatureInfoToMap = function(feature, srid) {
    return AppMap.addFeatureToMap(feature, srid, vectorInfo);
  };

  /**
   * Rimuove tutte le geometrie dal layer feature info
   * @return {null} La funzione non restituisce un valore
   */
  let clearLayerInfo = function() {
    vectorInfo.getSource().clear(true);
  };

  //Private Classes
  let featureInfo = function() {
    this.layerGid = "";
    this.properties = {};
    this.geometry = {};
    this.geometryType = "";
    this.SRID = "";
  };

  /**
   * Request that is sent on map click
   * @param {Array} coordinate X,Y of the request position
   */
  let RequestQueue = function(coordinate, visibleLayers) {
    this.id = AppStore.guid();
    this.layers = []; //Array of RequestLayer
    this.coordinate = coordinate;
    this.visibleLayers = visibleLayers;
    this.mustRestart = false;
    this.currentLayerIndex = 0;
  };

  /**
   * This class represents an HTTP request of a WFS layer to be call to inspect a feature
   * @param {string} url Url to be invoked
   * @param {int} zIndex Index of the layer
   * @param {string} gid Unique id of the layer
   */
  let RequestLayer = function(url, zIndex, gid, srs) {
    this.url = url;
    this.zIndex = zIndex;
    this.sent = false;
    this.gid = gid;
    this.srs = srs;
  };

  function SortByZIndex(a, b) {
    let aName = a.zIndex;
    let bName = b.zIndex;
    return aName > bName ? -1 : aName < bName ? 1 : 0;
  }

  return {
    addGeometryInfoToMap: addGeometryInfoToMap,
    addFeatureInfoToMap: addFeatureInfoToMap,
    addWktInfoToMap: addWktInfoToMap,
    clearLayerInfo: clearLayerInfo,
    getRequestInfo: getRequestInfo,
    init: init,
    //processRequestInfo: processRequestInfo,
    processRequestInfoAll: processRequestInfoAll,
    showRequestInfoFeatures: showRequestInfoFeatures,
    showRequestInfoFeaturesGeometries: showRequestInfoFeaturesGeometries,
    showInfoWindow: showInfoWindow
  };
})();
