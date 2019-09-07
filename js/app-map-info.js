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
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: AppMap.getCurrentColor(1, [255, 125, 0, 1])
      }),
      stroke: new ol.style.Stroke({
        color: AppMap.getCurrentColor(1, [255, 125, 0, 1]),
        width: 3
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: AppMap.getCurrentColor(1, [255, 125, 0, 1])
        })
      })
    })
  });

  vectorInfo.setMap(AppMap.getMap());

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
   * Object with the layer request to be executed. Ad the user can click multiple times
   * the RequestQueue has a pending state and an unique ID in order to keep track of the
   * requests and stop them if needed
   * The pipeline is
   * 1. getRequestInfo
   * 2. getFeatureInfoRequest
   * 3. processRequest/processRequestAll based on the variable visibleLayers
   * @param {Array} coordinate Coordinate of the point clicked
   * @param {Array} pixel pixel clicked on map
   * @param {boolean} visibleLayers Visibile Layers
   */
  let getRequestInfo = function getRequestInfo(coordinate, pixel, visibleLayers) {
    if (!AppStore.getInfoClickEnabled()) {
      return;
    }
    //checking if there is a vector feature
    let featuresClicked = [];
    if (pixel) {
      featuresClicked = AppMap.getMap().getFeaturesAtPixel(pixel);
      AppMap.getMap().forEachFeatureAtPixel(pixel, function(feature, layer) {
        feature.set("layer_gid", layer.get("gid"));
        featuresClicked.push(feature);
      });
    }
    if (featuresClicked.length) {
      return;
    }

    requestQueue = new RequestQueue(coordinate, visibleLayers);
    requestQueueData = [];
    let viewResolution = AppMap.getMap()
      .getView()
      .getResolution();

    //ricavo i livelli visibili e li ordino per livello di visualizzazione
    for (
      let i = 0;
      i <
      AppMap.getMap()
        .getLayers()
        .getLength();
      i++
    ) {
      //TODO refactor whe IE support will drop
      let layer = AppMap.getMap()
        .getLayers()
        .item(i);
      if (!layer.queryable) continue;
      if (!requestQueue.visibleLayers || layer.getVisible()) {
        let url = getGetFeatureInfoUrl(layer, coordinate, viewResolution, "text/javascript", 50);
        requestQueue.layers.push(new RequestLayer(url, layer.zIndex, layer.gid));
      }
    }
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
   * @param {boolean} visibleLayers The request will be executed only on the visibile layers
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
      //se la query è su tutti i layer mostro i risultati in quanto non vengono mostrati automatcamente
      if (!requestQueue.visibleLayers) {
        if (requestQueueData.length > 0) {
          dispatch({
            eventName: "show-reverse-geocoding-result",
            results: requestQueueData
          });
        }
      }
      return;
    }
    //adding the right callback on request
    if (requestQueue.visibleLayers) {
      url += "&format_options=callback:AppMapInfo.processRequest";
    } else {
      url += "&format_options=callback:AppMapInfo.processRequestAll";
    }
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

  /**
   * Visualize the first object found
   * @param {Object} data Request result
   */
  let processRequest = function processRequest(data) {
    clearLayerInfo();
    requestQueue.ajaxPending = false;
    dispatch("hide-loader");
    //se il dato è presente lo visualizzo
    if (data && data.features.length > 0) {
      if (data.features[0].geometry) {
        let srid = AppMap.getSRIDfromCRSName(data.crs.properties.name);
        addFeatureInfoToMap(data.features[0].geometry, srid);
      }
      for (let i = 0; i < data.features.length; i++) {
        data.features[i].layerGid = requestQueue.layers[requestQueue.currentLayerIndex].gid;
      }
      Dispatcher.dispatch({
        eventName: "show-info-item",
        data: data
      });
    }

    if (requestQueue.mustRestart) {
      requestQueue.mustRestart = false;
      getFeatureInfoRequest();
    }
    //se il dato a questo punto è nullo procedo al secondo step nella coda delle richieste
    if (!data || data.features.length == 0) {
      getFeatureInfoRequest();
    }
  };

  /**
   * Process the next step on a Request Queue
   * @param {Array} data
   */
  let processRequestAll = function processRequestAll(data) {
    clearLayerInfo();
    dispatch("hide-loader");
    //se il dato è presente lo aggiungo al contenitore global
    if (data && data.features.length > 0) {
      for (let i = 0; i < data.features.length; i++) {
        data.features[i].layerGid = requestQueue.layers[requestQueue.currentLayerIndex].gid;
        requestQueueData.push(data.features[i]);
      }
    }

    //se non è presente o una nuova richiesta è stata accodata procedo al passo successivo
    if (requestQueue.mustRestart) {
      requestQueue.mustRestart = false;
      getFeatureInfoRequest();
    }
    getFeatureInfoRequest(false);
  };

  let addInfoToMap = function addInfoToMap(wkt) {
    /// <summary>
    /// Aggiunge una geometria in formato GeoJson nella mappa dopo una selezione
    /// </summary>
    /// <param name="wkt">Geometria da caricare</param>
    /// <returns type=""></returns>

    let geometryOl = null;
    let feature = formatWKT.readFeature(wkt);
    /*let feature = formatWKT.readFeature(
    'POLYGON ((10.6112420275072 44.7089045353454, 10.6010851023631 44.6981632996669, 10.6116329324321 44.685907897919, 10.6322275666758 44.7050600304689, 10.6112420275072 44.7089045353454))');*/
    feature.getGeometry().transform("EPSG:4326", "EPSG:3857");

    //feature.getGeometry().transform(projection, 'EPSG:3857');
    vectorInfo.getSource().addFeature(feature);

    return feature;
  };

  let addFeatureInfoToMap = function addFeatureInfoToMap(geometry, srid) {
    return AppMap.addFeatureToMap(geometry, srid, vectorInfo);
  };

  /**
   * Aggiunge un infopoint alla mappa
   * @return {[type]} [description]
   */
  let addInfoPoint = function(lon, lat) {
    let geometryOl = null;
    let feature = null;
    geometryOl = new ol.geom.Point([lon, lat]);
    feature = new ol.Feature({
      geometry: geometryOl
    });
    feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
    //feature.getGeometry().transform(projection, 'EPSG:3857');
    vectorInfo.getSource().addFeature(feature);
    return feature;
  };

  /**
   * Aggiunge un poligono alla mappa
   * @param  {object} geometry geometria in formato geojson
   * @return {object} Feature appena creata
   */
  let addPolygonInfo = function(geometry) {
    let geometryOl = null;
    let feature = null;
    geometryOl = new ol.geom.Polygon(geometry.coordinates);
    feature = new ol.Feature({
      geometry: geometryOl
    });
    feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
    //feature.getGeometry().transform(projection, 'EPSG:3857');
    vectorInfo.getSource().addFeature(feature);

    return feature;
  };

  /**
   * Rimuove tutte le geometrie dal layer feature info
   * @return {null} La funzione non restituisce un valore
   */
  let clearLayerInfo = function() {
    vectorInfo.getSource().clear(true);
  };

  //Private Classes

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
  let RequestLayer = function(url, zIndex, gid) {
    this.url = url;
    this.zIndex = zIndex;
    this.sent = false;
    this.gid = gid;
  };

  function SortByZIndex(a, b) {
    let aName = a.zIndex;
    let bName = b.zIndex;
    return aName > bName ? -1 : aName < bName ? 1 : 0;
  }

  return {
    addFeatureInfoToMap: addFeatureInfoToMap,
    addInfoToMap: addInfoToMap,
    addInfoPoint: addInfoPoint,
    clearLayerInfo: clearLayerInfo,
    getRequestInfo: getRequestInfo,
    processRequest: processRequest,
    processRequestAll: processRequestAll
  };
})();
