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
let LamMapInfo = (function() {
  "use strict";

  //Array with the requests to elaborate
  let requestQueue = {};
  //Array with the requests results. Data are features of different types.
  let requestQueueData = [];

  let vectorInfo = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: []
    }),
    style: LamMapStyles.getInfoStyle(),
    zIndex: 100
  });

  let vectorFlash = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: []
    }),
    style: LamMapStyles.getFlashStyle(),
    zIndex: 101
  });

  let init = function() {
    vectorInfo.setMap(LamMap.getMap());
    vectorFlash.setMap(LamMap.getMap());

    LamDispatcher.bind("show-info-items", function(payload) {
      LamMapInfo.showRequestInfoFeatures(payload.features, payload.element);
    });
    LamDispatcher.bind("show-info-geometries", function(payload) {
      LamMapInfo.showRequestInfoFeaturesGeometries(payload.features);
    });
    LamDispatcher.bind("flash-feature", function(payload) {
      let featureOl = LamMap.convertGeoJsonFeatureToOl(payload.feature);
      featureOl = LamMap.transform3857(featureOl, featureOl.srid);
      LamMapInfo.addFeatureFlashToMap(featureOl);
      setTimeout(function() {
        LamMapInfo.clearLayerFlash();
      }, 800);
    });
    LamDispatcher.bind("show-mobile-info-results", function(payload) {
      //LamToolbar.toggleToolbarItem("info-results", true);
      LamToolbar.showMenu();
      $("#bottom-info").hide();
    });

    LamDispatcher.bind("clear-layer-info", function(payload) {
      clearLayerInfo(payload.layerGid);
      LamMapTooltip.hideMapTooltip();
    });

    LamDispatcher.bind("zoom-info-feature", function(payload) {
      try {
        let feature = LamStore.getCurrentInfoItems().features[payload.index];
        if (feature.layerGid) {
          let layer = LamStore.getLayer(feature.layerGid);
          LamDispatcher.dispatch({
            eventName: "set-layer-visibility",
            gid: feature.layerGid,
            visibility: 1
          });
        }
        let featureOl = LamMap.convertGeoJsonFeatureToOl(feature);
        featureOl = LamMap.transform3857(featureOl, feature.srid);
        LamMap.goToGeometry(featureOl.getGeometry());
        if (feature.tooltip) {
          setTimeout(function() {
            LamDispatcher.dispatch({ eventName: "show-map-tooltip", geometry: featureOl.getGeometry().getCoordinates(), tooltip: feature.tooltip });
          }, 400);
        }
        setTimeout(function() {
          LamDispatcher.dispatch({
            eventName: "flash-feature",
            feature: feature
          });
        }, 200);
        if (LamDom.isMobile()) {
          LamDispatcher.dispatch("show-bottom-info");
          LamDispatcher.dispatch("hide-menu");
        }
        return;
      } catch (error) {
        LamDispatcher.dispatch({ eventName: "log", message: error });
      }
    });

    LamDispatcher.bind("add-info-point", function(payload) {
      let geometryOl = new ol.geom.Point([payload.lon, payload.lat]);
      let featureOl = new ol.Feature({
        geometry: geometryOl
      });
      featureOl.srid = 4326;
      LamMapInfo.addFeatureInfoToMap(featureOl);
    });

    LamDispatcher.bind("add-geometry-info-map", function(payload) {
      let geometryOl = LamMap.convertGeometryToOl(payload.geometry, LamEnums.geometryFormats().GeoJson);
      LamMapInfo.addGeometryInfoToMap(geometryOl, payload.srid);
    });

    LamDispatcher.bind("enable-map-info", function(payload) {
      LamStore.setInfoClickEnabled(true);
    });

    LamDispatcher.bind("disable-map-info", function(payload) {
      LamStore.setInfoClickEnabled(false);
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
  let getFeatureInfoUrl = function(layer, coordinate, viewResolution, infoFormat, featureCount, bbox) {
    let url = layer.getSource().getFeatureInfoUrl(coordinate, viewResolution, "EPSG:3857", {
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
   * 3. processRequestInfoAll based on the variable visibleLayers
   * @param {Array} coordinate Coordinate of the point clicked
   * @param {Array} pixel pixel clicked on map
   * @param {boolean} visibleLayers Visibile Layers
   */
  let getRequestInfo = function getRequestInfo(coordinate, pixel, visibleLayers) {
    if (!LamStore.getInfoClickEnabled()) {
      return;
    }
    lamDispatch("hide-map-tooltip");
    //checking if there is a vector feature
    let featuresClicked = [];
    let featuresInfoClicked = [];

    if (pixel) {
      LamMap.getMap().forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (layer === null) {
          featuresInfoClicked.push(feature);
        } else {
          feature.layerGid = layer.gid.replace("_preload", "");
          featuresClicked.push(feature);
        }
      });
    }
    // if (featuresInfoClicked.length > 0) {
    //   showInfoFeatureTooltipAtPixel(featuresInfoClicked[0], pixel);
    //   return;
    // }
    if (featuresClicked.length > 0) {
      //verifing info behaviour
      if (LamStore.getAppState().infoSelectBehaviour == LamEnums.infoSelectBehaviours().SingleFeature) {
        featuresClicked = featuresClicked.slice(0, 1);
      }
      showVectorInfoFeatures(featuresClicked, pixel);
      return;
    }

    //disabilita le richieste globali
    if (LamStore.getAppState().disableAjaxRequestInfo) return;

    //Ajax requests
    requestQueue = new RequestQueue(coordinate, visibleLayers);
    requestQueueData = [];
    let viewResolution = LamMap.getMap()
      .getView()
      .getResolution();
    //ricavo i livelli visibili e li ordino per livello di visualizzazione
    LamMap.getMap()
      .getLayers()
      .forEach(function(layer) {
        if (layer.queryable) {
          if (!requestQueue.visibleLayers || layer.getVisible()) {
            let url = getFeatureInfoUrl(layer, coordinate, viewResolution, "text/javascript", 50);
            requestQueue.layers.push(new RequestLayer(url, layer.zIndex, layer.gid, layer.srid, layer.labelField, layer.layerName));
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
  let getFeatureInfoRequest = function() {
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
      LamMapInfo.clearLayerInfo();
      lamDispatch("hide-loader");
      if (requestQueueData.length > 0) {
        lamDispatch({
          eventName: "show-info-items",
          features: {
            features: requestQueueData
          }
        });
        lamDispatch({
          eventName: "show-info-geometries",
          features: {
            features: requestQueueData
          }
        });
        // lamDispatch({
        //   eventName: "show-map-tooltip",
        //   features: {
        //     features: requestQueueData[0]
        //   }
        // });
      } else {
        showInfoWindow("Risultati", LamTemplates.getInfoResultEmpty());
      }
      return;
    }
    //adding the right callback on request
    url += "&format_options=callback:LamMapInfo.processRequestInfoAll";
    //if (requestQueue.visibleLayers) {
    //  url += "&format_options=callback:LamMapInfo.processRequestInfo";
    //} else {
    //  url += "&format_options=callback:LamMapInfo.processRequestInfoAll";
    //}
    requestQueue.ajaxPending = true;
    lamDispatch("show-loader");
    $.ajax({
      type: "GET",
      url: url,
      jsonp: "callback",
      dataType: "jsonp",
      crossDomain: true,
      contentType: "application/json",
      cache: false,
      success: function(response) {},
      error: function(jqXHR, textStatus, errorThrown) {
        //requestQueue.ajaxPending = false;
        //procede to next step
        lamDispatch({
          eventName: "log",
          message: "Error in ajax request " + requestQueue.layers[requestQueue.currentLayerIndex].gid
        });
        getFeatureInfoRequest();
      }
    });
  };

  // /**
  //  * Process the results after an info click on the map
  //  * @param {object} featureCollection Object with the results. It must have a features property with the array of features
  //  */
  // let processRequestInfo = function processRequestInfo(featureCollection) {
  //   requestQueue.ajaxPending = false;
  //   lamDispatch("hide-loader");
  //   //se il dato è presente lo visualizzo
  //   if (featureCollection && featureCollection.features.length > 0) {
  //     if (featureCollection.features[0].geometry) {
  //       let srid = LamMap.getSRIDfromCRSName(featureCollection.crs.properties.name);
  //       addGeometryInfoToMap(featureCollection.features[0].geometry, srid, LamMap.getGeometryFormats().GeoJson);
  //     }
  //     for (let i = 0; i < featureCollection.features.length; i++) {
  //       featureCollection.features[i].layerGid = requestQueue.layers[requestQueue.currentLayerIndex].gid;
  //     }
  //     LamDispatcher.dispatch({
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
    lamDispatch("hide-loader");
    //se il dato è presente lo aggiungo al contenitore global
    if (featureCollection && featureCollection.features.length > 0) {
      for (let i = 0; i < featureCollection.features.length; i++) {
        let layer = requestQueue.layers[requestQueue.currentLayerIndex];
        featureCollection.features[i].layerGid = layer.gid;
        featureCollection.features[i].srid = layer.srid;
        featureCollection.features[i].tooltip = LamTemplates.getLabelFeature(featureCollection.features[i].properties, layer.labelField, layer.layerName);
        requestQueueData.push(featureCollection.features[i]);
      }
    }

    //se non è presente o una nuova richiesta è stata accodata procedo al passo successivo
    if (requestQueue.mustRestart) {
      requestQueue.mustRestart = false;
      getFeatureInfoRequest();
    }
    //getFeatureInfoRequest(false);
  };

  /**
   * Process the results after the click on a vector feature on the map
   * @param {Array} featureCollection Array of OL featurs with the results. It must have a features property with the array of features
   */
  let showVectorInfoFeatures = function showVectorInfoFeatures(features, pixel) {
    clearLayerInfo();
    requestQueue.ajaxPending = false;
    lamDispatch("hide-loader");

    let featureArray = [];
    if (features && features.length > 0) {
      features.forEach(function(feature) {
        addFeatureInfoToMap(feature);
        //transform OL feature in GeoJson
        featureArray.push({
          type: "Feature",
          layerGid: feature.layerGid,
          geometry: LamMap.getGeoJsonGeometryFromGeometry(feature.getGeometry()),
          properties: feature.getProperties()
        });
      });
      //tooltip
      if (features.length > 0) {
        if (pixel) {
          showInfoFeatureTooltipAtPixel(features[0], pixel);
        } else {
          showInfoFeatureTooltip(features[0]);
        }
      }
      let featuresCollection = {
        features: featureArray
      };
      LamDispatcher.dispatch({
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
      //let geometryOl = LamMap.convertGeometryToOl(feature.geometry, LamMap.getGeometryFormats().GeoJson);
      let featureOl = LamMap.convertGeoJsonFeatureToOl(feature);
      //featureOl = LamMap.transform3857(featureOl, featureOl.srid);
      addFeatureInfoToMap(featureOl);
    });
  };

  /**
   * Show the click info results in menu
   * @param {Object} featureInfoCollection GeoJson feature collection
   * @param {string} template handlebars template to user where feature's layerGid property is not defined
   */
  let showRequestInfoFeatures = function(featureInfoCollection, template) {
    var title = "Risultati";
    if (!featureInfoCollection) {
      return;
    }
    if (featureInfoCollection.features.length > 0) {
      title += " (" + featureInfoCollection.features.length + ")";
    }
    var body = LamTemplates.renderInfoFeatures(featureInfoCollection, template);
    var bodyMobile = LamTemplates.renderInfoFeaturesMobile(featureInfoCollection);
    LamMapInfo.showInfoWindow(title, body, bodyMobile, "info-results");
  };

  /**
   * Shows the feature tooltip in the map, centered on the feature geometry
   * @param {Object} feature
   */
  let showInfoFeatureTooltip = function(feature) {
    if (!feature.tooltip) return;
    lamDispatch({
      eventName: "show-map-tooltip",
      geometry: feature.getGeometry().getCoordinates(),
      tooltip: feature.tooltip
    });
  };

  /**
   * Shows the feature tooltip at a predefined position
   * @param {Object} feature
   * @param {Array} pixel
   */
  let showInfoFeatureTooltipAtPixel = function(feature, pixel) {
    let coordinate = LamMap.getCoordinateFromPixel(pixel[0], pixel[1]);
    let tooltip = "";
    //preload layers do not have tooltip property
    if (feature.tooltip) {
      tooltip = feature.tooltip;
    } else {
      let layer = LamStore.getLayer(feature.layerGid);
      tooltip = LamTemplates.getLabelFeature(feature.getProperties(), layer.labelField, layer.layerName);
    }
    lamDispatch({
      eventName: "show-map-tooltip",
      geometry: coordinate,
      tooltip: tooltip
    });
  };

  /**
   * Open the wiondw with the html results, based on the device type and configuration
   * @param {string} title
   * @param {string} body
   * @param {string} bodyMobile
   * @param {string} htmlElement Html element id destination, default is info-results
   */
  let showInfoWindow = function(title, body, bodyMobile, htmlElement) {
    if (LamStore.getOpenResultInInfoWindow()) {
      LamDom.showContent(LamEnums.showContentMode().InfoWindow, title, body, bodyMobile);
    } else {
      if (LamDom.isMobile()) {
        LamDom.showContent(LamEnums.showContentMode().BottomInfo, title, body, bodyMobile, null, htmlElement);
      } else {
        LamDom.showContent(LamEnums.showContentMode().LeftPanel, title, body, bodyMobile, null, htmlElement);
      }
    }
  };

  // /**
  //  * Adds a wkt geometry
  //  * @param {string} wkt
  //  */
  //   let addWktInfoToMap = function addWktInfoToMap(wkt) {
  //     /// <summary>
  //     /// Aggiunge una geometria in formato GeoJson nella mappa dopo una selezione
  //     /// </summary>
  //     /// <param name="wkt">Geometria da caricare</param>
  //     /// <returns type=""></returns>

  //     let feature = formatWKT.readFeature(wkt);
  //     /*let feature = formatWKT.readFeature(
  //     'POLYGON ((10.6112420275072 44.7089045353454, 10.6010851023631 44.6981632996669, 10.6116329324321 44.685907897919, 10.6322275666758 44.7050600304689, 10.6112420275072 44.7089045353454))');*/
  //     feature.getGeometry().transform("EPSG:4326", "EPSG:3857");

  //     //feature.getGeometry().transform(projection, 'EPSG:3857');
  //     vectorInfo.getSource().addFeature(feature);

  //     return feature;
  //   };

  /**
   * Add a geometry info to the map
   * @param {Ol/Geometry} geometry
   * @param {int} srid
   */
  let addGeometryInfoToMap = function(geometry, srid, layerGid) {
    return LamMap.addGeometryToMap(geometry, srid, vectorInfo, layerGid);
  };

  /**
   * Add a feature info to the map
   * @param {Ol/feature} feature
   * @param {int} srid
   */
  let addFeatureInfoToMap = function(feature) {
    if (feature.layerGid) {
      let layer = LamStore.getLayer(feature.layerGid);
      feature.tooltip = LamTemplates.getLabelFeature(feature.getProperties(), layer.labelField, layer.layerName);
    }
    return LamMap.addFeatureToMap(feature, feature.srid, vectorInfo);
  };

  /**
   * Add a feature flash to the map
   * @param {Ol/feature} feature
   * @param {int} srid
   */
  let addFeatureFlashToMap = function(feature) {
    return LamMap.addFeatureToMap(feature, feature.srid, vectorFlash);
  };

  /**
   * Rimuove tutte le geometrie dal layer feature info
   * @return {null} La funzione non restituisce un valore
   */
  let clearLayerInfo = function(layerGid) {
    LamMap.clearVectorLayer(vectorInfo, layerGid);
  };

  /**
   * Rimuove tutte le geometrie dal layer flash
   * @return {null} La funzione non restituisce un valore
   */
  let clearLayerFlash = function() {
    vectorFlash.getSource().clear(true);
  };

  //Private Classes
  let featureInfo = function() {
    this.layerGid = "";
    this.properties = {};
    this.geometry = {};
    this.geometryType = "";
    this.srid = "";
  };

  /**
   * Request that is sent on map click
   * @param {Array} coordinate X,Y of the request position
   */
  let RequestQueue = function(coordinate, visibleLayers) {
    this.id = LamStore.guid();
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
  let RequestLayer = function(url, zIndex, gid, srid, labelField, layerName) {
    this.url = url;
    this.zIndex = zIndex;
    this.sent = false;
    this.gid = gid;
    this.srid = srid;
    this.labelField = labelField;
    this.layerName = layerName;
  };

  function SortByZIndex(a, b) {
    let aName = a.zIndex;
    let bName = b.zIndex;
    return aName > bName ? -1 : aName < bName ? 1 : 0;
  }

  return {
    addGeometryInfoToMap: addGeometryInfoToMap,
    addFeatureFlashToMap: addFeatureFlashToMap,
    addFeatureInfoToMap: addFeatureInfoToMap,
    //addWktInfoToMap: addWktInfoToMap,
    clearLayerFlash: clearLayerFlash,
    clearLayerInfo: clearLayerInfo,
    getRequestInfo: getRequestInfo,
    init: init,
    //processRequestInfo: processRequestInfo,
    processRequestInfoAll: processRequestInfoAll,
    showInfoFeatureTooltip: showInfoFeatureTooltip,
    showInfoFeatureTooltipAtPixel: showInfoFeatureTooltipAtPixel,
    showRequestInfoFeatures: showRequestInfoFeatures,
    showRequestInfoFeaturesGeometries: showRequestInfoFeaturesGeometries,
    showInfoWindow: showInfoWindow
  };
})();
