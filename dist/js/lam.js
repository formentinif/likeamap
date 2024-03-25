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
 * Map Eumerations
 */
let LamEnums = (function() {
  "use strict";

  let showContentModeEnum = {
    LeftPanel: 1,
    BottomInfo: 2,
    InfoWindow: 3
  };

  let infoSelectBehaviourEnum = {
    SingleFeature: 1,
    MultipleFeature: 2
  };

  let geometryFormatsEnum = {
    GeoJson: 1,
    OL: 2
  };

  let geometryTypesEnum = {
    GeometryNull: 0,
    Point: 1,
    Polyline: 2,
    Polygon: 3,
    MultiPolyline: 4,
    MultyPolygon: 5
  };

  let geometryFormats = function() {
    return geometryFormatsEnum;
  };

  let geometryTypes = function() {
    return geometryTypesEnum;
  };

  let infoSelectBehaviours = function() {
    return infoSelectBehaviourEnum;
  };

  let showContentMode = function() {
    return showContentModeEnum;
  };

  return {
    showContentMode: showContentMode,
    geometryFormats: geometryFormats,
    geometryTypes: geometryTypes,
    infoSelectBehaviours: infoSelectBehaviours
  };
})();

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
let LamMapStyles = (function () {
  "use strict";

  /**
   * Returns the style for the preload features
   * @param {int} width Width of the line
   * @param {int} radius Radius of the circle
   */
  let getPreloadStyle = function (width, radius) {
    if (!width) width = 4;
    if (!radius) radius = 10;
    let style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 255, 255, 0.01],
      }),
      stroke: new ol.style.Stroke({
        color: [255, 255, 255, 0.01],
        width: width,
      }),
      image: new ol.style.Circle({
        radius: radius,
        fill: new ol.style.Fill({
          color: [255, 255, 255, 0.01],
        }),
      }),
      text: new ol.style.Text({
        text: "",
        scale: 1.7,
        textAlign: "Left",
        textBaseline: "Top",
        fill: new ol.style.Fill({
          color: "#000000",
        }),
        stroke: new ol.style.Stroke({
          color: "#FFFFFF",
          width: 3.5,
        }),
      }),
    });
    return style;
  };

  let getDrawStyle = function () {
    let style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [68, 138, 255, 0.2],
      }),
      stroke: new ol.style.Stroke({
        color: [68, 138, 255, 1],
        width: 2,
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: [68, 138, 255, 1],
        }),
      }),
      text: new ol.style.Text({
        text: "pippo",
        scale: 1.7,
        textAlign: "Left",
        textBaseline: "Top",
        fill: new ol.style.Fill({
          color: "#000000",
        }),
        stroke: new ol.style.Stroke({
          color: "#FFFFFF",
          width: 3.5,
        }),
      }),
    });
    return style;
  };

  let getSelectionStyle = function () {
    let styleSelection = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 216, 0, 0.2],
      }),
      stroke: new ol.style.Stroke({
        color: [255, 216, 0, 1],
        width: 2,
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: [255, 216, 0, 1],
        }),
      }),
    });
    return styleSelection;
  };

  let getSelectionMaskStyle = function () {
    let style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 216, 0, 0.1],
      }),
      stroke: new ol.style.Stroke({
        color: [255, 216, 0, 0.5],
        width: 2,
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: [255, 216, 0, 0.5],
        }),
      }),
      text: new ol.style.Text({
        text: "",
        scale: 1.7,
        textAlign: "Left",
        textBaseline: "Top",
        fill: new ol.style.Fill({
          color: "#000000",
        }),
        stroke: new ol.style.Stroke({
          color: "#FFFFFF",
          width: 3.5,
        }),
      }),
    });
    return style;
  };

  let getModifyStyle = function () {
    let style_modify = new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 2,
        color: [255, 0, 0, 1],
      }),
      fill: new ol.style.Stroke({
        color: [255, 0, 0, 0.2],
      }),
    });
    return style_modify;
  };

  /**
   * Returns the style for the info features
   * @param {int} width Width of the line
   * @param {int} radius Radius of the circle
   */
  let getInfoStyle = function (width, radius) {
    if (!width) width = 3;
    if (!radius) radius = 7;
    let style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 125, 0, 0.2],
      }),
      stroke: new ol.style.Stroke({
        color: [255, 125, 0, 1],
        width: width,
      }),
      image: new ol.style.Circle({
        radius: radius,
        fill: new ol.style.Fill({
          color: [255, 125, 0, 1],
        }),
      }),
    });
    return style;
  };

  /**
   * Returns the style for the flash features
   * @param {int} width Width of the line
   * @param {int} radius Radius of the circle
   */
  let getFlashStyle = function (width, radius) {
    if (!width) width = 3;
    if (!radius) radius = 7;
    let style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 0, 0, 1],
      }),
      stroke: new ol.style.Stroke({
        color: [255, 0, 0, 1],
        width: width,
      }),
      image: new ol.style.Circle({
        radius: radius,
        fill: new ol.style.Fill({
          color: [255, 0, 0, 1],
        }),
      }),
    });
    return style;
  };

  // (function() {
  //   let style = new ol.style.Style({
  //     fill: new ol.style.Fill({
  //       color: getCurrentColor(0.2, [0, 255, 255, 0.2])
  //     }),
  //     stroke: new ol.style.Stroke({
  //       color: getCurrentColor(1, [0, 255, 255, 1]),
  //       width: 2
  //     }),
  //     image: new ol.style.Circle({
  //       radius: 7,
  //       fill: new ol.style.Fill({
  //         color: getCurrentColor(1, [0, 255, 255, 1])
  //       })
  //     }),
  //     text: new ol.style.Text({
  //       text: "",
  //       scale: 1.7,
  //       textAlign: "Left",
  //       textBaseline: "Top",
  //       fill: new ol.style.Fill({
  //         color: "#000000"
  //       }),
  //       stroke: new ol.style.Stroke({
  //         color: "#FFFFFF",
  //         width: 3.5
  //       })
  //     })
  //   });
  //   let styles = [style];
  //   return function(feature, resolution) {
  //     style.getText().setText(feature.get("name"));
  //     return styles;
  //   };

  return {
    getFlashStyle: getFlashStyle,
    getInfoStyle: getInfoStyle,
    getModifyStyle: getModifyStyle,
    getPreloadStyle: getPreloadStyle,
    getSelectionStyle: getSelectionStyle,
    getSelectionMaskStyle: getSelectionMaskStyle,
    getDrawStyle: getDrawStyle,
  };
})();

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

let LamMapVector = (function() {
  /// <summary>
  /// Classe per la gestione delle funzionalità vector
  /// </summary>
  "use strict";

  return {};
})();

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
 * This Class manages the tooltip features
 */
let LamMapTooltip = (function() {
  "use strict";

  let mapTooltip;

  let init = function() {
    mapTooltip = new ol.Overlay({
      element: document.getElementById("map-tooltip"),
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    LamMap.getMap().addOverlay(mapTooltip);

    // LamDispatcher.bind("show-tooltip", function(payload) {
    //   LamMapInfo.showTooltip(payload.x, payload.y, payload.title);
    // });
    // LamDispatcher.bind("hide-tooltip", function(payload) {
    //   LamMapTooltip.hideTooltip();
    // });
    LamDispatcher.bind("show-map-tooltip", function(payload) {
      LamMapTooltip.showMapTooltip(payload.geometry, payload.tooltip);
    });
    LamDispatcher.bind("hide-map-tooltip", function(payload) {
      LamMapTooltip.hideMapTooltip();
    });
  };

  // /**
  //  * Shows an HTML tooltip on the map as an HTML positioned element
  //  * @param {Array} coordinates
  //  * @param {string} title
  //  */
  // let showMapHtmlTooltip = function(coordinates, title) {
  //   if (!title) {
  //     hideHtmlTooltip();
  //     return;
  //   }
  //   let labelPoint = LamMap.getLabelPoint(coordinates);
  //   let pixel = LamMap.getPixelFromCoordinate(labelPoint[0], labelPoint[1]);
  //   let tooltip = $("#map-tooltip");
  //   let tooltipTitle = $("#map-tooltip__title");
  //   tooltipTitle.html(title);
  //   tooltip.css({ top: pixel[0], left: pixel[1] });
  //   tooltip.show();
  // };

  // /**
  //  * Hides an HTML tooltip on the map as an HTML positioned element
  //  */
  // let hideMapHtmlTooltip = function() {
  //   let toolTip = $("#map-tooltip");
  //   let toolTipTitle = $("#map-tooltip__title");
  //   toolTip.hide();
  //   toolTipTitle.html("");
  //   toolTip.css({ top: 0, left: 0 });
  //   toolTip.hide();
  // };

  let showHtmlTooltip = function(coordinates, title) {};

  let hideHtmlTooltip = function() {};

  let showMapTooltip = function(coordinates, title) {
    if (!title) {
      hideMapTooltip();
      return;
    }
    let labelPoint = LamMap.getLabelPoint(coordinates);
    let toolTip = $("#map-tooltip");
    let tooltipTitle = $("#map-tooltip__title");
    toolTip.show();
    tooltipTitle.html(title);
    mapTooltip.setPosition(labelPoint);
  };

  let hideMapTooltip = function() {
    mapTooltip.setPosition(undefined);
    return false;
  };

  return {
    hideHtmlTooltip: hideHtmlTooltip,
    hideMapTooltip: hideMapTooltip,
    init: init,
    showHtmlTooltip: showHtmlTooltip,
    showMapTooltip: showMapTooltip
  };
})();

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
let LamMapInfo = (function () {
  "use strict";
  //Last coordinate clicked
  let lastCoordinateClicked = [0, 0];
  //Last coordinate clicked
  let lastPixelClicked = [0, 0];
  let featureInfoCount = 0;

  //Array with the requests to elaborate
  let requestQueue = {};
  //Array with the requests results. Data are features of different types.
  let requestQueueData = [];
  let lowestResolution = 0.0005831682455839253;
  let vectorInfo = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [],
    }),
    style: LamMapStyles.getInfoStyle(),
    zIndex: 104,
  });

  let vectorFlash = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [],
    }),
    style: LamMapStyles.getFlashStyle(),
    zIndex: 105,
  });

  let init = function () {
    vectorInfo.setMap(LamMap.getMap());
    vectorFlash.setMap(LamMap.getMap());

    LamDispatcher.bind("show-info-items", function (payload) {
      LamMapInfo.showRequestInfoFeatures(payload.features, payload.element);
    });

    LamDispatcher.bind("show-info-geometries", function (payload) {
      LamMapInfo.showRequestInfoFeaturesGeometries(payload.features);
    });

    LamDispatcher.bind("set-featureinfo-count", function (payload) {
      featureInfoCount = payload.featureInfoCount;
    });

    LamDispatcher.bind("flash-feature", function (payload) {
      let featureOl = LamMap.convertGeoJsonFeatureToOl(payload.feature);
      featureOl = LamMap.transform3857(featureOl, featureOl.srid);
      LamMapInfo.addFeatureFlashToMap(featureOl);
      setTimeout(function () {
        LamMapInfo.clearLayerFlash();
      }, 800);
    });

    LamDispatcher.bind("show-mobile-info-results", function (payload) {
      //LamToolbar.toggleToolbarItem("info-results", true);
      LamToolbar.showMenu();
      $("#bottom-info").hide();
    });

    LamDispatcher.bind("clear-layer-info", function (payload) {
      clearLayerInfo(payload.layerGid);
      LamMapTooltip.hideMapTooltip();
    });

    LamDispatcher.bind("zoom-info-feature", function (payload) {
      try {
        let feature = LamStore.getCurrentInfoItems().features[payload.index];
        if (feature.layerGid) {
          let layer = LamStore.getLayer(feature.layerGid);
          LamDispatcher.dispatch({
            eventName: "set-layer-visibility",
            gid: feature.layerGid,
            visibility: 1,
          });
        }
        let featureOl = LamMap.convertGeoJsonFeatureToOl(feature);
        featureOl = LamMap.transform3857(featureOl, feature.srid);
        LamMap.goToGeometry(featureOl.getGeometry());
        if (feature.tooltip) {
          setTimeout(function () {
            LamDispatcher.dispatch({ eventName: "show-map-tooltip", geometry: featureOl.getGeometry().getCoordinates(), tooltip: feature.tooltip });
          }, 400);
        }
        setTimeout(function () {
          LamDispatcher.dispatch({
            eventName: "flash-feature",
            feature: feature,
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

    LamDispatcher.bind("add-info-point", function (payload) {
      let geometryOl = new ol.geom.Point([payload.lon, payload.lat]);
      let featureOl = new ol.Feature({
        geometry: geometryOl,
      });
      featureOl.srid = 4326;
      LamMapInfo.addFeatureInfoToMap(featureOl);
    });

    LamDispatcher.bind("add-geometry-info-map", function (payload) {
      let geometryOl = LamMap.convertGeometryToOl(payload.geometry, LamEnums.geometryFormats().GeoJson);
      LamMapInfo.addGeometryInfoToMap(geometryOl, payload.srid);
    });

    LamDispatcher.bind("enable-map-info", function (payload) {
      LamStore.setInfoClickEnabled(true);
    });

    LamDispatcher.bind("disable-map-info", function (payload) {
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
  let getFeatureInfoUrl = function (layer, coordinate, viewResolution, infoFormat, featureCount, bbox) {
    let url = layer.getSource().getFeatureInfoUrl(coordinate, viewResolution, "EPSG:3857", {
      INFO_FORMAT: infoFormat,
      feature_count: featureCount,
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
    lastCoordinateClicked = coordinate;
    lastPixelClicked = pixel;
    if (!LamStore.getInfoClickEnabled()) {
      return;
    }
    lamDispatch("hide-map-tooltip");
    //checking if there is a vector feature
    let featuresClicked = [];
    let featuresInfoClicked = [];

    if (pixel) {
      LamMap.getMap().forEachFeatureAtPixel(pixel, function (feature, layer) {
        if (layer === null) {
          featuresInfoClicked.push(feature);
        } else {
          feature.layerGid = layer.gid.replace("_preload", "");
          featuresClicked.push(feature);
        }
      });
    }

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
    let viewResolution = LamMap.getMap().getView().getResolution();
    //ricavo i livelli visibili e li ordino per livello di visualizzazione
    LamMap.getMap()
      .getLayers()
      .forEach(function (layer) {
        var lamlayer = LamStore.getLayer(layer.gid);
        if (lamlayer && lamlayer.hasOwnProperty("showPointClickedAsGeometry") && lamlayer.showPointClickedAsGeometry) {
          viewResolution = lowestResolution;
        }
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
  let getFeatureInfoRequest = function () {
    let url = "";
    //ricavo l'url corrente dalla coda globale e setto il layer come completato
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
            features: requestQueueData,
          },
        });
        lamDispatch({
          eventName: "show-info-geometries",
          features: {
            features: requestQueueData,
          },
        });
      } else {
        showInfoWindow("Risultati", LamTemplates.getInfoResultEmpty());
      }
      return;
    }

    //adding the right callback on request
    url += "&format_options=callback:LamMapInfo.processRequestInfoAll";
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
      success: function (response) {},
      error: function (jqXHR, textStatus, errorThrown) {
        //requestQueue.ajaxPending = false;
        //procede to next step
        lamDispatch({
          eventName: "log",
          message: "Error in ajax request " + requestQueue.layers[requestQueue.currentLayerIndex].gid,
        });
        getFeatureInfoRequest();
      },
    });
  };

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
      features.forEach(function (feature) {
        addFeatureInfoToMap(feature);
        //transform OL feature in GeoJson
        featureArray.push({
          type: "Feature",
          layerGid: feature.layerGid,
          geometry: LamMap.getGeoJsonGeometryFromGeometry(feature.getGeometry()),
          properties: feature.getProperties(),
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
        features: featureArray,
      };
      LamDispatcher.dispatch({
        eventName: "show-info-items",
        features: featuresCollection,
      });
    }
  };

  /**
   * Show the click geometries on the map
   * @param {Object} featureInfoCollection GeoJson feature collection
   */
  let showRequestInfoFeaturesGeometries = function (featureInfoCollection) {
    featureInfoCollection.features.forEach(function (feature) {
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
  let showRequestInfoFeatures = function (featureInfoCollection, template) {
    var title = "Risultati";
    if (!featureInfoCollection) {
      return;
    }
    featureInfoCount = featureInfoCollection.features.length;
    featureInfoCollection = LamTemplates.groupFeatureByTemplate(featureInfoCollection, template);
    var body = LamTemplates.renderInfoFeatures(featureInfoCollection, template);
    var bodyMobile = LamTemplates.renderInfoFeaturesMobile(featureInfoCollection);
    if (featureInfoCount > 0) {
      title += " (" + featureInfoCount + ")";
    }
    LamMapInfo.showInfoWindow(title, body, bodyMobile, "info-results");
  };

  /**
   * Shows the feature tooltip in the map, centered on the feature geometry
   * @param {Object} feature
   */
  let showInfoFeatureTooltip = function (feature) {
    if (!feature.tooltip) return;
    lamDispatch({
      eventName: "show-map-tooltip",
      geometry: feature.getGeometry().getCoordinates(),
      tooltip: feature.tooltip,
    });
  };

  /**
   * Shows the feature tooltip at a predefined position
   * @param {Object} feature
   * @param {Array} pixel
   */
  let showInfoFeatureTooltipAtPixel = function (feature, pixel) {
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
      tooltip: tooltip,
    });
  };

  /**
   * Open the wiondw with the html results, based on the device type and configuration
   * @param {string} title
   * @param {string} body
   * @param {string} bodyMobile
   * @param {string} htmlElement Html element id destination, default is info-results
   */
  let showInfoWindow = function (title, body, bodyMobile, htmlElement) {
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
  let addGeometryInfoToMap = function (geometry, srid, layerGid) {
    return LamMap.addGeometryToMap(geometry, srid, vectorInfo, layerGid);
  };

  /**
   * Add a feature info to the map
   * @param {Ol/feature} feature
   * @param {int} srid
   */
  let addFeatureInfoToMap = function (feature) {
    let tooltip = null;
    let srid = feature.srid;
    if (feature.layerGid) {
      let layer = LamStore.getLayer(feature.layerGid);
      tooltip = LamTemplates.getLabelFeature(feature.getProperties(), layer.labelField, layer.layerName);
      if (layer && layer.hasOwnProperty("showPointClickedAsGeometry") && layer.showPointClickedAsGeometry) {
        feature = new ol.Feature({
          geometry: new ol.geom.Point(lastCoordinateClicked),
        });
        srid = LamStore.getAppState().srid;
      }
    }
    feature.tooltip = tooltip;
    return LamMap.addFeatureToMap(feature, srid, vectorInfo);
  };

  /**
   * Add a feature flash to the map
   * @param {Ol/feature} feature
   * @param {int} srid
   */
  let addFeatureFlashToMap = function (feature) {
    return LamMap.addFeatureToMap(feature, feature.srid, vectorFlash);
  };

  /**
   * Rimuove tutte le geometrie dal layer feature info
   * @return {null} La funzione non restituisce un valore
   */
  let clearLayerInfo = function (layerGid) {
    LamMap.clearVectorLayer(vectorInfo, layerGid);
  };

  /**
   * Rimuove tutte le geometrie dal layer flash
   * @return {null} La funzione non restituisce un valore
   */
  let clearLayerFlash = function () {
    vectorFlash.getSource().clear(true);
  };

  //Private Classes
  let featureInfo = function () {
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
  let RequestQueue = function (coordinate, visibleLayers) {
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
  let RequestLayer = function (url, zIndex, gid, srid, labelField, layerName) {
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
    showInfoWindow: showInfoWindow,
  };
})();

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

let LamMap = (function () {
  /// <summary>
  /// Classe per la gestione delle funzionalità di mapping
  /// </summary>
  "use strict";

  let defaultLayers = {
    OSM: {
      gid: 1000,
    },
    OCM: {
      gid: 1001,
    },
    OTM: {
      gid: 1002,
    },
    OSMG: {
      gid: 1003,
    },
  };

  let mainMap;
  let currentZoom = 10; //zoom value for zoom-end event, it will change right after initialization
  let isRendered = false;
  let formatWKT = new ol.format.WKT();
  let featuresWKT = new ol.Collection();
  let featuresSelection = new ol.Collection();
  let featuresSelectionMask = new ol.Collection();
  let vectorDraw;
  let vectorSelectionMask;
  let vectorSelection;
  let lastTimeoutRequest;
  let lastMousePixel;
  let moveEndPayloads = [];
  let zoomEndPayloads = [];

  let vectorPrint = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [],
    }),
    style: LamMapStyles.getSelectionStyle(),
  });

  let copyCoordinateEvent; //evento per la copia coordinate

  let getMap = function getMap() {
    /// <summary>
    /// Restituisce l'oggetto Mappa inizializzato da questa classe
    /// </summary>
    return mainMap;
  };

  let goToLonLat = function goToLonLat(lon, lat, zoom) {
    /// <summary>
    /// Posiziona la mappa per Longitudine, Latitudine, Zoom o X, Y con EPSG:3857 , Zoom
    /// </summary>
    /// <param name="lon">Longitune o X</param>
    /// <param name="lat">Latitudine o Y</param>
    /// <param name="zoom">Zoom 1-22</param>
    if (!zoom) {
      zoom = 16;
    }
    let point = new ol.geom.Point([lon, lat]);
    if (lon < 180) {
      point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    } else {
      point = [lon, lat];
    }
    mainMap.setView(
      new ol.View({
        center: point,
        zoom: zoom,
        minZoom: LamStore.getAppState().minZoom ? LamStore.getAppState().minZoom : 0,
        maxZoom: LamStore.getAppState().maxZoom ? LamStore.getAppState().maxZoom : 28
      })
    );
  };

  /**
   * Pan the map to the given geometry's position
   * @param {OL/Geometry} geometry
   * @param {int} srid
   */
  let goToGeometry = function (geometry, srid) {
    let feature = new ol.Feature({
      geometry: geometry,
    });
    if (srid) {
      feature = transform3857(feature, srid);
    }
    if (feature.getGeometry().getType() === "Point") {
      goToLonLat(feature.getGeometry().getCoordinates()[0], feature.getGeometry().getCoordinates()[1], 17);
      return;
    }
    let extent = feature.getGeometry().getExtent();
    let area = Math.abs(extent[2] - extent[0]) * Math.abs(extent[3] - extent[1]);
    if (area < 100000) {
      goToLonLat((extent[2] + extent[0]) / 2, (extent[3] + extent[1]) / 2, 17);
      return;
    }
    goToExtent(extent);
  };
  /**
   * Posiziona la mappa per bounding box in Longitudine, Latitudine o X,Y con EPSG:3857
   *
   * @param {array} extent  X minimo Y minimo X massimo Y massimo
   */
  let goToExtent = function goToExtent(extent) {
    // let point1 = new ol.geom.Point([lon1, lat1]);
    // if (lon1 < 180) {
    //   point1 = ol.proj.transform([lon1, lat1], "EPSG:4326", "EPSG:900913");
    // }
    // let point2 = new ol.geom.Point([lon2, lat2]);
    // if (lon2 < 180) {
    //   point2 = ol.proj.transform([lon2, lat2], "EPSG:4326", "EPSG:900913");
    // }
    //mainMap.getView().fit([x1, y1, x2, y2], mainMap.getSize());
    mainMap.getView().fit(extent, mainMap.getSize());
  };

  let goToExtentGeometry = function goToExtentGeometry(geometry) {
    mainMap.getView().fit(geometry);
  };

  let layerIsPresent = function layerIsPresent(gid) {
    /// <summary>
    /// Verifica se un layer è presente in base ad un identificativo numerico univoco
    /// </summary>
    /// <param name="gid">Codice numerico identificativo del layer</param>
    let result = false;
    for (let i = 0; i < mainMap.getLayers().getLength(); i++) {
      if (mainMap.getLayers().item(i).gid === gid) {
        result = true;
      }
    }
    return result;
  };

  let getLayer = function getLayer(gid) {
    /// <summary>
    /// Restituisce un layer in base al proprio identificativo numerico
    /// </summary>
    /// <param name="gid">Codice numerico identificativo del layer</param>
    let layer = null;
    for (let i = 0; i < mainMap.getLayers().getLength(); i++) {
      if (mainMap.getLayers().item(i).gid === gid) {
        layer = mainMap.getLayers().item(i);
        return layer;
      }
    }
    return layer;
  };

  /**
   * Add a layer to map
   *
   * @param {string} gid Unique layer identifier
   * @param {string} uri Remote service Url
   * @param {string} layerType Layer type  osm, wms, wmstiled, tms
   * @param {string} layer Layer name as in geoserver
   * @param {string} srid
   * @param {string} format
   * @param {string} params Additional parameters that will be appended to the url as querystring
   * @param {string} tileMode (Not implemented) Additional tile type id the layerType is TMS
   * @param {boolean} visible Layer initial visibility
   * @param {int} zIndex Layer index in map
   * @param {boolean} queryable Enables info (click) on the layer
   * @param {float} opacity Layer initial opacity min 0 max 1
   * @param {string} attribution Layer source attribuition
   * @param {boolean} secured
   * @param {string} apikey
   * @param {boolean} preload Preload all layer features in a vector layer
   * @param {int} mapSrid Srid della mappa
   */
  let addLayerToMap = function (
    gid,
    uri,
    layerType,
    layer,
    srid,
    format,
    params,
    tileMode,
    visible,
    zIndex,
    queryable,
    opacity,
    attribution,
    secured,
    apikey,
    hoverTooltip,
    mapSrid,
    preload,
    vectorWidth,
    vectorRadius,
    labelField,
    layerName
  ) {
    let thisLayer;
    if (!params) {
      params = "";
    }
    params += "LAYERS=" + layer;
    //params += "&QUERY_LAYERS=" + layer;
    //params += "&SRS=EPSG:" + srid;
    if (format) {
      if (format !== "none") {
        params += "&FORMAT=" + wmsImageFormat(format);
      }
    }
    switch (layerType.toLowerCase()) {
      case "group":
        return;
        break;
      case "osm":
        thisLayer = getLayerOSM();
        break;
      case "ocm":
        thisLayer = getLayerOCM(apikey);
        break;
      case "otm":
        thisLayer = getLayerOTM(apikey);
        break;
      case "osmg":
        thisLayer = getLayerOSMG();
        break;
      case "wms":
        thisLayer = getLayerWMS(gid, uri, params, attribution, secured);
        break;
      case "wmts":
        thisLayer = getLayerWMTS(gid, uri, params, attribution, secured);
        break;
      case "wmstiled":
        thisLayer = getLayerWMSTiled(gid, uri, params, attribution, secured);
        break;
      case "tms": //TO DO implementare
        switch (tileMode.toLowerCase()) {
          case "quadkey":
            break;
          case "xyz":
            thisLayer = getLayerTiled(gid, uri, params, attribution, secured);
            break;
        }
        break;
    }
    if (thisLayer) {
      thisLayer.gid = gid;
      thisLayer.srid = srid;
      thisLayer.labelField = labelField;
      thisLayer.layerName = layerName;
      thisLayer.queryable = queryable;
      thisLayer.setVisible(visible);
      thisLayer.zIndex = parseInt(zIndex);
      thisLayer.setZIndex(parseInt(zIndex));
      thisLayer.setOpacity(parseFloat(opacity));
      thisLayer.preload = preload;
      thisLayer.hoverTooltip = hoverTooltip;
      mainMap.addLayer(thisLayer);
    } else {
      log("Impossibile aggiungere il layer " + gid + ", " + uri + ", " + layerType + ", " + params + ", " + tileMode);
      return;
    }
    if (preload) {
      let preloadUrl = uri + "?" + params;
      if (mapSrid) {
        preloadUrl += "&srsName=EPSG:" + mapSrid;
      }
      //as the request will be sent in jsonp, the only key that can couple the async request with the layer
      //is geoserver's layer name. A better solution would be preferred but cors and withcredentials are not working
      //with geoserver secured layers
      LamRequests.addRequestData(layer.split(":").length ? layer.split(":")[1] : layer, thisLayer);
      //launch preload here
      LamRequests.sendPreloadRequest(getWFSfromWMS(preloadUrl));
    }
  };

  let getLayerOSM = function getLayerOSM() {
    /// <summary>
    /// Restituisce il layer standard di Open Street Map
    /// </summary>
    let osm = new ol.layer.Tile({
      source: new ol.source.OSM({
        crossOrigin: null,
      }),
    });
    osm.gid = defaultLayers.OSM.gid;
    return osm;
  };

  let getLayerOCM = function getLayerOCM(key) {
    /// <summary>
    /// Restituisce il layer standard di Open Cycle Map
    /// </summary>
    let ocm = new ol.layer.Tile({
      source: new ol.source.OSM({
        url: "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=" + key,
        crossOrigin: null,
      }),
    });
    ocm.gid = defaultLayers.OCM.gid;
    return ocm;
  };

  let getLayerOTM = function getLayerOTM(key) {
    /// <summary>
    /// Restituisce il layer standard di Open Cycle Map
    /// </summary>
    let otm = new ol.layer.Tile({
      source: new ol.source.OSM({
        url: "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=" + key,
        crossOrigin: null,
      }),
    });
    otm.gid = defaultLayers.OTM.gid;
    return otm;
  };

  let getLayerOSMG = function () {
    var grayOsmLayer = new ol.layer.Tile({
      source: new ol.source.OSM(),
    });

    grayOsmLayer.on("postrender", function (evt) {
      var background = 125;
      evt.context.globalCompositeOperation = "color";
      // check browser supports globalCompositeOperation
      if (evt.context.globalCompositeOperation == "color") {
        evt.context.fillStyle = "rgba(255,255,255," + 1 + ")";
        evt.context.fillRect(0, 0, evt.context.canvas.width, evt.context.canvas.height);
      }
      evt.context.globalCompositeOperation = "overlay";
      // check browser supports globalCompositeOperation
      if (evt.context.globalCompositeOperation == "overlay") {
        evt.context.fillStyle = "rgb(" + [background, background, background].toString() + ")";
        evt.context.fillRect(0, 0, evt.context.canvas.width, evt.context.canvas.height);
      }
      evt.context.globalCompositeOperation = "source-over";
    });
    return grayOsmLayer;
  };

  let getLayerWMS = function (gid, uri, params, attribution) {
    /// <summary>
    /// Restituisce un layer in formato WMS
    /// </summary>
    /// <param name="gid">Codice numerico identificativo del layer</param>
    /// <param name="uri">Url sorgente del layer</param>
    /// <param name="params">Parametri aggiuntivi da aggiungere alle chiamate (formato url querystring)</param>
    let paramsLocal = queryToDictionary(params);
    let serverType = "geoserver";
    if (paramsLocal.serverType) {
      serverType = paramsLocal.serverType;
    }
    let wms = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: uri,
        params: paramsLocal,
        serverType: serverType,
        //crossOrigin: "Anonymous"
        attributions: attribution,
      }),
    });
    return wms;
  };

  let getLayerWMSTiled = function (gid, uri, params, attribution, secured) {
    /// <summary>
    /// Restituisce un layer in formato WMS, con le chiamate tagliate a Tile
    /// </summary>
    /// <param name="gid">Codice numerico identificativo del layer</param>
    /// <param name="uri">Url sorgente del layer</param>
    /// <param name="params">Parametri aggiuntivi da aggiungere alle chiamate (formato url querystring)</param>
    let paramsLocal = queryToDictionary(params);
    let serverType = "geoserver";
    paramsLocal.tiled = "true";
    if (params.serverType) {
      serverType = paramsLocal.serverType;
    }
    let source = new ol.source.TileWMS(
      /** @type {olx.source.TileWMSOptions} */({
        url: uri,
        params: paramsLocal,
        serverType: serverType,
        //crossOrigin: "Anonymous",
        //tiled: true,
        attributions: attribution,
      })
    );
    if (secured) {
      source.setTileLoadFunction(function (tile, src) {
        let xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.addEventListener("loadend", function (evt) {
          let data = this.response;
          if (data !== undefined) {
            tile.getImage().src = URL.createObjectURL(data);
          } else {
            tile.setState(3);
          }
        });
        xhr.addEventListener("error", function () {
          tile.setState(3);
        });
        xhr.open("GET", src);
        xhr.setRequestHeader("Authorization", LamStore.getAuthorizationHeader());
        xhr.send();
      });
    }
    // return new ol.layer.Tile({
    //   extent: [1160414, 5574111, 1205283, 5590252],
    //   source: source
    // });
    if (LamStore.getAppState().mapExtent) {
      return new ol.layer.Tile({
        extent: LamStore.getAppState().mapExtent,
        source: source,
      });
    } else {
      return new ol.layer.Tile({
        source: source,
      });
    }
  };

  let getLayerWMTS = function (gid, uri, params, attribution, secured) {
    var projection = ol.proj.get("EPSG:3857");
    var projectionExtent = projection.getExtent();
    var size = ol.extent.getWidth(projectionExtent) / 256;
    var resolutions = new Array(14);
    var matrixIds = new Array(14);
    for (var z = 0; z < 14; ++z) {
      // generate resolutions and matrixIds arrays for this WMTS
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = z;
    }

    var layer = new ol.layer.Tile({
      opacity: 0.7,
      source: new ol.source.WMTS({
        attributions: attribution,
        url: uri,
        layer: "0",
        matrixSet: "EPSG:3857",
        format: "image/png",
        projection: projection,
        tileGrid: new ol.tilegrid.WMTS({
          origin: ol.extent.getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds,
        }),
        style: "default",
        wrapX: true,
      }),
    });
    return layer;
  };

  let getLayerTiled = function (gid, uri, params, attribution, secured) {
    let paramsLocal = queryToDictionary(params);
    let tms = new ol.layer.Tile({
      //extent: [-13884991, 2870341, -7455066, 6338219],
      source: new ol.source.TileWMS({
        url: uri,
        params: paramsLocal,
        serverType: "geoserver",
      }),
    });
    return tms;
  };

  /**
   * restituisce il formato wms di immagine standard
   * @param  {string} format formato immagine
   * @return {string}        formato immagine wms
   */
  let wmsImageFormat = function (format) {
    let result = format;
    switch (format.toLowerCase()) {
      case "png":
        result = "image/png";
        break;
      case "jpg":
      case "jpeg":
        result = "image/jpeg";
        break;
    }
    return result;
  };

  /**
   * Converts the WMS Geoserver url into his WFS equivalent
   * @param {string} wmsUrl WMS service url
   */
  let getWFSfromWMS = function (wmsUrl) {
    let wfsUrlArray = wmsUrl.split("?");
    let baseUrl = wfsUrlArray[0].replace("wms", "wfs");
    let paramsArray = wfsUrlArray[1].split("&");
    let url = baseUrl + "?service=WFS&version=1.0.0&request=GetFeature&outputFormat=text%2Fjavascript";
    paramsArray.forEach(function (param) {
      if (param.toLowerCase().split("=")[0] === "layers") {
        url += "&typeName=" + param.split("=")[1];
      }
      if (param.toLowerCase().split("=")[0].toLowerCase() === "srsname") {
        url += "&srsname=" + param.split("=")[1];
      }
    });
    return url;
  };

  /**
   * Gets the wms url from a layer object
   * @param {Object} layer
   * @param {string} format
   */
  let getWFSUrlfromLayer = function (layer, format, srid) {
    let wfsUrl = layer.mapUri.replace(/wms/gi, "wfs");
    wfsUrl += "?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layer.layer;
    if (!format) format = "SHAPE-ZIP";
    wfsUrl += "&outputFormat=" + format;
    if (srid) wfsUrl += "&srsName=EPSG:" + srid;
    return wfsUrl;
  };

  /**
   * [[Description]]
   * @param {int} gid [[Codice numerico del layer]]
   */
  let removeLayerFromMap = function FromMap(gid) {
    /// <summary>
    /// Rimuove un layer dalla mappa
    /// </summary>
    /// <param name="gid">Codice numerico identificativo del layer</param>
    for (let i = 0; i < mainMap.getLayers().getLength(); i++) {
      if (mainMap.getLayers().item(i).gid === gid) {
        mainMap.getLayers().removeAt(i);
        return;
      }
    }
  };

  /**
   * Rimuove tutti i livelli dalla mappa
   * @return {null}
   */
  let removeAllLayersFromMap = function () {
    try {
      mainMap.getLayers().clear();
    } catch (e) {
      log(e);
    } finally {
    }
  };

  let queryToDictionary = function queryToDictionary(params) {
    /// <summary>
    /// Trasforma una stringa in formato "url querystring" in un oggetto dictionary con le coppie chiave/valore
    /// </summary>
    /// <param name="params"></param>
    let dict = {};
    let arrKeys = params.split("&");
    for (let i = 0; i < arrKeys.length; i++) {
      try {
        let arrVal = arrKeys[i].split("=");
        dict[arrVal[0]] = arrVal[1];
      } catch (e) { }
    }
    return dict;
  };

  let zoomIn = function () {
    let currentView = mainMap.getView();
    currentView.setZoom(currentView.getZoom() + 1);
    mainMap.setView(currentView);
  };

  let zoomOut = function () {
    let currentView = mainMap.getView();
    currentView.setZoom(currentView.getZoom() - 1);
    mainMap.setView(currentView);
  };

  let init = function () {
    //events binding
    //if mobile go to user location
    if (LamStore.getAppState().enableBrowserLocationOnMobile) if (LamDom.isMobile()) goToBrowserLocation();
  };

  /**
   * Map initialization function
   * @param {*} divMap Html element for the map
   * @param {*} appState AppState Config
   */
  let render = function render(divMap, appState) {
    log("Creazione della mappa in corso");
    if (!isRendered) {
      init();
    }

    let layers = [
      //new ol.layer.Tile({
      //    source: new ol.source.OSM()
      //})
    ];

    // ol.control.defaults({
    //     attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
    //         collapsible: false
    //     })
    // }).

    let scaleControl = function () {
      let control = new ol.control.ScaleLine({
        units: "metric",
        bar: false,
        steps: 4,
        text: "",
        minWidth: 140,
      });
      return control;
    };

    let controls = new ol.Collection([]);
    controls.extend([
      new ol.control.Attribution({
        collapsible: false,
      }),
    ]);

    if (LamStore.getAppState().showMapScale) {
      let scaleControl = function () {
        let control = new ol.control.ScaleLine({
          units: "metric",
          bar: false,
          steps: 4,
          text: "",
          minWidth: 140,
        });
        return control;
      };
      controls.extend([scaleControl()]);
    }
    mainMap = new ol.Map({
      controls: controls,
      pixelRatio: 1,
      target: divMap,
      layers: layers,
      view: new ol.View({
        center: ol.proj.transform([10.41, 44.94], "EPSG:4326", "EPSG:3857"),
        zoom: 10,
        minZoom: LamStore.getAppState().minZoom ? LamStore.getAppState().minZoom : 0,
        maxZoom: LamStore.getAppState().maxZoom ? LamStore.getAppState().maxZoom : 28
      }),
    });

    loadConfig(appState);

    LamMapInfo.init(); //info initialization

    mainMap.on("singleclick", function (evt) {
      //Adding click info interaction
      LamMapInfo.getRequestInfo(evt.coordinate, evt.pixel, true);
    });

    mainMap.on("moveend", function () {
      lamDispatch("map-move-end");
      var newZoom = mainMap.getView().getZoom();
      if (currentZoom != newZoom) {
        currentZoom = newZoom;
        lamDispatch("map-zoom-end");
      }
    });

    proj4.defs("EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    proj4.defs(
      "EPSG:3003",
      "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +units=m +no_defs"
    );

    mainMap.on("pointermove", function (evt) {
      if (evt.dragging) return;

      LamMapTooltip.hideMapTooltip();
      if (typeof lastTimeoutRequest !== "undefined") {
        clearTimeout(lastTimeoutRequest);
      }
      lastMousePixel = evt.pixel;
      lastTimeoutRequest = setTimeout(mouseHoverMapTooltip, 500);
      // let pixel = mainMap.getEventPixel(evt.originalEvent);
      // let hit = mainMap.forEachLayerAtPixel(pixel, function(layer) {
      //   return true;
      // });
      // mainMap.getTargetElement().style.cursor = hit ? "pointer" : "";
    });

    mainMap.addInteraction(dragInteractionPrint);

    log("Creazione della mappa completata");
  };

  let mouseHoverMapTooltip = function () {
    if (!lastMousePixel) return;
    if (LamDom.isMobile()) return;
    let featureFound = null;
    mainMap.forEachFeatureAtPixel(lastMousePixel, function (feature, layer) {
      if (layer === null) {
        //se il layer non esiste verifico il campo tooltip
        if (feature.tooltip && !featureFound) {
          featureFound = feature.clone();
          featureFound.tooltip = feature.tooltip;
        }
      } else {
        if (layer.hoverTooltip && !featureFound) {
          //se il layer esiste è un preload
          featureFound = feature.clone();
          featureFound.layerGid = layer.gid.replace("_preload", "");
        }
      }
    });
    if (!featureFound) {
      LamMapTooltip.hideMapTooltip();
    } else {
      LamMapInfo.showInfoFeatureTooltipAtPixel(featureFound, lastMousePixel);
    }
  };

  /**
   * Carica l'oggetto di configurazione sulla mappa
   * @param {Object} config Oggetto con i parametri di configurazione
   */
  let loadConfig = function loadConfig(config) {
    //ricavo i parametri per il posizionamento custom da querystring
    let initLon = getUriParameter("lon");
    let initLat = getUriParameter("lat");
    let initZoom = getUriParameter("zoom");
    let initLayers = getUriParameter("layers");
    //let initTool = getUriParameter("tool");

    try {
      if (initLon) config.mapLon = parseFloat(initLon);
      if (initLat) config.mapLat = parseFloat(initLat);
      if (initZoom) config.mapZoom = parseInt(initZoom);
    } catch (e) {
      log("Main-Map: Impossibile caricare la posizione iniziale dall'url");
    }
    goToLonLat(config.mapLon, config.mapLat, config.mapZoom);
    mainMap.setLayerGroup(new ol.layer.Group());
    addLayersToMap(config.layers, config.srid);
    if (initLayers) {
      try {
        initLayers = initLayers.split(",");
        for (let i = 0; i < initLayers.length; i++) {
          if (initLayers[i]) {
            let initLayer = initLayers[i].split(":");
            let payload = {};
            payload.eventName = "set-layer-visibility";
            payload.gid = initLayer[0];
            payload.visibility = parseInt(initLayer[1]);
            lamDispatch(payload);
          }
        }
      } catch (e) {
        log("Main-Map: Impossibile caricare i layer iniziali dall'url");
      } finally {
      }
    }
    // if (initTool) {
    //   lamDispatch({
    //     eventName: "show-tool",
    //     tool: initTool
    //   });
    // }
    //aggiungo layer WKT alla mappa
    vectorDraw = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: featuresWKT,
      }),
      style: LamMapStyles.getDrawStyle(),
      zIndex: 100,
    });

    vectorSelectionMask = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: featuresSelectionMask,
      }),
      style: LamMapStyles.getSelectionMaskStyle(),
      zIndex: 101,
    });

    vectorSelection = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: featuresSelection,
      }),
      style: LamMapStyles.getSelectionStyle(),
      zIndex: 102,
    });

    vectorDraw.setMap(mainMap);
    vectorSelectionMask.setMap(mainMap);
    vectorSelection.setMap(mainMap);

    //aggiungo le feature KML alla mappa
    if (config.drawFeatures) {
      try {
        let formatKml = new ol.format.KML();
        let tempfeaturesWKT = formatKml.readFeatures(config.drawFeatures, {
          featureProjection: "EPSG:3857",
        });
        for (let i = 0; i < tempfeaturesWKT.length; i++) {
          let feat = tempfeaturesWKT[i].clone();
          feat.setStyle(vectorDraw.style);
          vectorDraw.getSource().addFeature(feat);
        }
      } catch (e) {
        log("Main-Map: Impossibile caricare le features KML");
      } finally {
      }
    }

    vectorPrint.setMap(mainMap);
    //mainMap.addLayer(vectorPrint);
  };

  let addLayersToMap = function (tempLayers, mapSrid) {
    for (let i = 0; i < tempLayers.length; i++) {
      let layer = tempLayers[i];
      addLayerToMap(
        layer.gid,
        layer.mapUri,
        layer.layerType,
        layer.layer,
        layer.srid,
        layer.format,
        layer.params,
        layer.tileMode,
        layer.visible,
        layer.zIndex,
        layer.queryable,
        layer.opacity,
        layer.attribution,
        layer.secured,
        layer.apikey,
        layer.hoverTooltip,
        mapSrid,
        layer.preload,
        layer.vectorWidth,
        layer.vectorRadius,
        layer.labelField,
        layer.layerName
      );
      if (layer.layers) {
        addLayersToMap(layer.layers, mapSrid);
      }
    }
  };

  /**
   * Return the resolution of the current map
   * @return {float} resolution in map units
   */
  let getMapResolution = function getMapResolution() {
    return mainMap.getView().getResolution();
  };

  /**
   * return the map scale based on  current resolution
   * @return {float} map scale (approx)
   */
  let getMapScale = function getMapScale() {
    return getScaleFromResolution(mainMap.getView().getResolution(), "m");
  };

  /**
   * TEST
   * @param  {[type]} resolution [description]
   * @param  {[type]} units      [description]
   * @return {[type]}            [description]
   */
  let getScaleFromResolution = function (resolution, units) {
    let dpi = 25.4 / 0.28; //inch in mm / dpi in mm
    let mpu = ol.proj.Units.METERS_PER_UNIT[units]; //'degrees', 'ft', 'm' or 'pixels'.
    let inchesPerMeter = 39.3701;
    return parseFloat(resolution) * (mpu * inchesPerMeter * dpi);
  };

  /**
   * TEST do not use
   * @param  {[type]} scale [description]
   * @param  {[type]} units [description]
   * @return {[type]}       [description]
   */
  let getResolutionForScale = function (scale, units) {
    let dpi = 25.4 / 0.28; //inch in mm / dpi in mm
    let mpu = ol.proj.Units.METERS_PER_UNIT[units]; //'degrees', 'ft', 'm' or 'pixels'.
    let inchesPerMeter = 39.37;
    return parseFloat(scale) / (mpu * inchesPerMeter * dpi);
  };

  let getMapCenter = function getMapCenter() {
    return mainMap.getView().getCenter();
  };

  let getMapCenterLonLat = function getMapCenterLonLat() {
    let center = mainMap.getView().getCenter();
    return ol.proj.transform(center, "EPSG:3857", "EPSG:4326");
  };

  let getMapZoom = function getMapZoom() {
    return mainMap.getView().getZoom();
  };

  let getLegendUrl = function getLegendUrl(gid, scaled) {
    let layer = getLayer(gid);
    let layerStore = LamStore.getLayer(gid);
    let url = "";
    try {
      if (layer) {
        try {
          url = layer.getSource().getUrls()[0];
        } catch (err) {
          log(err);
          url = layer.getSource().getUrl();
        }
        url +=
          "?REQUEST=GetLegendGraphic&sld_version=1.0.0&layer=" +
          layer.getSource().getParams().LAYERS.trim() +
          "&TRANSPARENT=true&format=image/png&legend_options=fontAntiAliasing:true;dpi:120;forceLabels:on";
        if (layerStore.params) {
          let arrParams = layerStore.params.split("&");
          for (let index = 0; index < arrParams.length; index++) {
            let element = arrParams[index];
            if (element) {
              let arrEle = element.split("=");
              if (arrEle[0].toLowerCase() == "styles") {
                url += "&STYLE=" + arrEle[1];
              }
            }
          }
        }
      }
    } catch (e) {
      log(e);
    }
    if (scaled) {
      url += "&SCALE=" + LamMap.getMapScale();
    }
    return url;
  };

  /**
   * Cambia lo stato di visibilità (acceso/spento) di un layer
   * @param {string} gid Codice numerico identificativo del layer
   */
  let toggleLayer = function (gid) {
    let layer = getLayer(gid);
    if (layer) {
      layer.setVisible(!layer.getVisible());
      if (!layer.getVisible()) LamDispatcher.dispatch({ eventName: "clear-layer-info", layerGid: gid });
      if (layer.preload) {
        let layer_preload = getLayer(gid + "_preload");
        if (layer_preload) {
          layer_preload.setVisible(layer.getVisible());
        }
      }
    }
  };

  let setLayerVisibility = function setLayerVisibility(gid, visibility) {
    let layer = getLayer(gid);
    if (layer) {
      layer.setVisible(visibility);
      if (!visibility) {
        LamDispatcher.dispatch({ eventName: "clear-layer-info", layerGid: gid });
      }
      if (layer.preload) {
        let layer_preload = getLayer(gid + "_preload");
        if (layer_preload) {
          layer_preload.setVisible(visibility);
        }
      }
    }
  };

  let log = function log(str) {
    /// <summary>
    /// Scrive un messaggio nella console del browser se attivata
    /// </summary>
    /// <param name="str">Messaggio da scrivere</param>
    /// <returns type=""></returns>
    if (console) {
      LamDispatcher.dispatch({
        eventName: "log",
        message: str,
      });
    }
  };

  let addWKTToMap = function addWKTToMap(wkt) {
    /// <summary>
    /// Aggiunge una geometria in formato WKT nella mappa
    /// </summary>
    /// <param name="wkt">Geometria da caricare</param>
    /// <returns type=""></returns>
    let feature = formatWKT.readFeature(wkt);
    /*let feature = formatWKT.readFeature(
    'POLYGON ((10.6112420275072 44.7089045353454, 10.6010851023631 44.6981632996669, 10.6116329324321 44.685907897919, 10.6322275666758 44.7050600304689, 10.6112420275072 44.7089045353454))');*/
    feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
    vectorDraw.getSource().addFeature(feature);
  };

  /**
   * Add a geometry to the map
   * @param {OL/geometry} geometry Feature's geometry object. The geometry type must be in OL format
   * @param {int} srid srid of the object
   * @param {Ol/Vector} vector Vector layer destination
   */
  let addGeometryToMap = function addGeometryToMap(geometry, srid, vector, layerGid) {
    let feature = new ol.Feature({
      geometry: geometry,
    });
    try {
      feature = transform3857(feature, srid);
      if (layerGid) {
        feature.layerGid = layerGid;
      }
      //feature.getGeometry().transform(projection, 'EPSG:3857');
      vector.getSource().addFeature(feature);
    } catch (error) {
      log(error);
    }
    return feature;
  };

  /**
   * Add a feature to the map
   * @param {OL/Feature} feature Feature. The geometry type must be in OL format
   * @param {int} srid srid of the object
   * @param {Ol/Vector} vector Vector layer destination
   */
  let addFeatureToMap = function (feature, srid, vector) {
    try {
      feature = transform3857(feature, srid);
      //feature.getGeometry().transform(projection, 'EPSG:3857');
      vector.getSource().addFeature(feature);
    } catch (error) {
      log(error);
    }
    return feature;
  };

  /**
   * Converts a geometry into Ol format
   * @param {Object} geometry Geometry to be converted
   * @param {geometryFormat} geometryFormat Source geometry format as in geometryFormats enum
   */
  let convertGeometryToOl = function (geometry, geometryFormat) {
    let geometryOl = geometry;
    switch (geometryFormat) {
      case LamEnums.geometryFormats().GeoJson:
        geometryOl = getGeometryFromGeoJsonGeometry(geometry);
        break;
    }
    return geometryOl;
  };

  /**
   * Converts a feature into Ol format from GeoJson
   * @param {Object} feature GeoJson feature to be converted
   */
  let convertGeoJsonFeatureToOl = function (feature) {
    let reader = new ol.format.GeoJSON();
    let featureOl = reader.readFeature(feature);
    featureOl.layerGid = feature.layerGid;
    featureOl.srid = feature.srid;
    featureOl.tooltip = feature.tooltip;
    return featureOl;
  };

  let startCopyCoordinate = function () {
    copyCoordinateEvent = mainMap.on("singleclick", function (evt) {
      let pp = new ol.geom.Point([evt.coordinate[0], evt.coordinate[1]]);
      if (evt.coordinate[0] > 180) {
        pp = ol.proj.transform([evt.coordinate[0], evt.coordinate[1]], "EPSG:900913", "EPSG:4326");
      }
      lamDispatch({
        eventName: "map-click",
        //"lon": evt,
        lon: pp[0],
        lat: pp[1],
      });
      //let feature = map.forEachFeatureAtPixel(evt.pixel,
      // function(feature, layer) {
      // do stuff here with feature
      // return [feature, layer];
      //});
    });
  };

  let stopCopyCoordinate = function () {
    mainMap.un(copyCoordinateEvent);
  };

  /**
   * Aggiunge un rettangolo alla mappa per la stampa
   * @param  {float} x      x del centro in sistema di riferimento EPSG:3857
   * @param  {float} y      y del centro in sistema di riferimento EPSG:3857
   * @param  {float} width  larghezza in pixel
   * @param  {float} height altezza in pixels
   * @return {object}        feature generata dalla funzione
   */
  let setPrintBox = function (x, y, width, height) {
    //elimino la geometria attuale
    clearLayerPrint();
    let geometryOl = null;
    let feature = null;
    // geometryOl = new ol.geom.Point([lon, lat]);
    // feature = new ol.Feature({
    //     geometry: geometryOl
    // });
    // feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
    // lon = feature.coordinates[0][0];
    // lat = feature.coordinates[0][1];

    let x1 = x - width / 2;
    let x2 = x + width / 2;
    let y1 = y - height / 2;
    let y2 = y + height / 2;
    let vertices = [
      [
        [x1, y1],
        [x1, y2],
        [x2, y2],
        [x2, y1],
        [x1, y1],
      ],
    ];
    //vertices  = [[10.60009,44.703497], [10.650215,44.703131], [10.628929,44.682508],[10.60009,44.703497]];
    geometryOl = new ol.geom.Polygon(vertices);
    feature = new ol.Feature({
      geometry: geometryOl,
    });
    feature.gid = "print-box";
    //feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
    vectorPrint.getSource().addFeature(feature);

    return feature;
  };

  //oggetti helper per il drag della stampa
  let dragFeaturePrint = null;
  let dragCoordinatePrint = null;
  let dragCursorPrint = "pointer";
  let dragPrevCursorPrint = null;
  /**
   * Aggiunge l'interazione di drag anc drop per la stampa
   */
  let dragInteractionPrint = new ol.interaction.Pointer({
    handleDownEvent: function (event) {
      let feature = mainMap.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
        return feature;
      });

      if (feature && feature.gid === "print-box") {
        //
        dragCoordinatePrint = event.coordinate;
        dragFeaturePrint = feature;
        return true;
      }

      return false;
    },
    handleDragEvent: function (event) {
      let deltaX = event.coordinate[0] - dragCoordinatePrint[0];
      let deltaY = event.coordinate[1] - dragCoordinatePrint[1];

      let geometry = dragFeaturePrint.getGeometry();
      geometry.translate(deltaX, deltaY);

      dragCoordinatePrint[0] = event.coordinate[0];
      dragCoordinatePrint[1] = event.coordinate[1];
    },
    handleMoveEvent: function (event) {
      if (dragCursorPrint) {
        let mainMap = event.map;

        let feature = mainMap.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
          return feature;
        });

        let element = event.map.getTargetElement();

        if (feature) {
          if (element.style.cursor != dragCursorPrint) {
            dragPrevCursorPrint = element.style.cursor;
            element.style.cursor = dragCursorPrint;
          }
        } else if (dragPrevCursorPrint !== undefined) {
          element.style.cursor = dragPrevCursorPrint;
          dragPrevCursorPrint = undefined;
        }
      }
    },
    handleUpEvent: function (event) {
      dragCoordinatePrint = null;
      dragFeaturePrint = null;
      return false;
    },
  });

  let getPrintCenter = function () {
    let feature = null;
    let features = vectorPrint.getSource().getFeatures();
    for (let i = 0; i < features.length; i++) {
      if (features[i].gid === "print-box") {
        let geomOl = features[i].getGeometry().getCoordinates();
        let x = (geomOl[0][0][0] + geomOl[0][2][0]) / 2;
        let y = (geomOl[0][0][1] + geomOl[0][1][1]) / 2;
        feature = [x, y];
        break;
      }
    }
    return feature;
  };

  let getPrintCenterLonLat = function () {
    let center = getPrintCenter();
    return ol.proj.transform(center, "EPSG:3857", "EPSG:4326");
  };

  /*SEZIONE SELECTION    *************************************/
  let selectInteraction;

  let removeSelectInteraction = function () {
    try {
      mainMap.removeInteraction(selectInteraction);
    } catch (e) {
      log(e);
    }
  };

  let addSelectInteraction = function () {
    let geomType = "Polygon";
    //Se ci sono freature inserite
    try {
      mainMap.removeInteraction(selectInteraction);
    } catch (e) {
      log(e);
    }
    selectInteraction = new ol.interaction.Draw({
      features: featuresSelectionMask,
      type: geomType,
      style: LamMapStyles.getSelectionStyle(),
    });
    selectInteraction.on("drawend", function (evt) {
      let feature = evt.feature.clone();
      lamDispatch({
        eventName: "start-selection-search",
        coords: feature.getGeometry().transform("EPSG:3857", "EPSG:4326").getCoordinates(),
      });
    });
    selectInteraction.on("drawstart", function (evt) {
      clearLayerSelectionMask();
    });
    mainMap.addInteraction(selectInteraction);
  };

  /**
   * Rimuove tutte le geometrie dal layer selection
   * @return {null} La funzione non restituisce un valore
   */
  let clearLayerSelection = function () {
    vectorSelection.getSource().clear(true);
  };

  /**
   * Rimuove tutte le geometrie dal layer selection mask
   * @return {null} La funzione non restituisce un valore
   */
  let clearLayerSelectionMask = function () {
    vectorSelectionMask.getSource().clear(true);
  };

  let clearVectorLayer = function (vectorLayer, layerGid) {
    if (!layerGid) {
      vectorLayer.getSource().clear(true);
      return;
    }
    vectorLayer.getSource().forEachFeature(function (feature) {
      if (feature.layerGid === layerGid) vectorLayer.getSource().removeFeature(feature);
    });
    return;
  };

  let getSelectionMask = function () {
    let result = null;
    vectorSelectionMask
      .getSource()
      .getFeatures()
      .forEach(function (feature) {
        let featureClone = feature.clone();
        result = featureClone.getGeometry().transform("EPSG:3857", "EPSG:4326").getCoordinates();
      });
    return result;
  };

  let addFeatureSelectionToMap = function (feature, srid, layerGid) {
    let featureOl = LamMap.convertGeoJsonFeatureToOl(feature);
    return addFeatureToMap(featureOl, srid, vectorSelection, layerGid);
  };

  /* SEZIONE DRAWING    *************************************/

  //Tipo di interazione per la modifica
  //oggetti globali per poterlo rimuovere in un momento successivo
  let modifyInteraction;
  let drawInteraction;
  let deleteInteraction;

  /**
   * Elimina l'interazione per il disegno
   * @return {null}
   */
  let removeDrawInteraction = function () {
    try {
      mainMap.removeInteraction(modifyInteraction);
    } catch (e) {
      log(e);
    }
    try {
      mainMap.removeInteraction(drawInteraction);
    } catch (e) {
      log(e);
    }
  };

  /**
   * Rimuove l'interazione per l'eliminazione delle features
   * @return {null}
   */
  let removeDrawDeleteInteraction = function () {
    try {
      mainMap.removeInteraction(deleteInteraction);
    } catch (e) {
      log(e);
    }
  };

  let addDrawInteraction = function (geomType) {
    //Se ci sono freature inserite
    try {
      mainMap.removeInteraction(modifyInteraction);
    } catch (e) {
      log(e);
    }
    modifyInteraction = new ol.interaction.Modify({
      features: featuresWKT,
      // the SHIFT key must be pressed to delete vertices, so
      // that new vertices can be drawn at the same position
      // of existing vertices
      deleteCondition: function (event) {
        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
      },
    });
    modifyInteraction.on("modifyend", function (event) { });
    mainMap.addInteraction(modifyInteraction);

    try {
      mainMap.removeInteraction(drawInteraction);
    } catch (e) {
      log(e);
    }
    drawInteraction = new ol.interaction.Draw({
      features: featuresWKT, //definizione delle features
      type: geomType,
    });
    drawInteraction.on("drawend", function (evt) {
      //evt.feature.NAME = "pippo";
      //evt.feature.set("name", $("#draw-tools__textarea").val());
    });
    mainMap.addInteraction(drawInteraction);
  };

  let addDrawDeleteInteraction = function (geomType) {
    deleteInteraction = new ol.interaction.Select({
      // make sure only the desired layer can be selected
      layers: [vectorDraw],
    });

    deleteInteraction.on("select", function (evt) {
      let selected = evt.selected;
      let deselected = evt.deselected;

      if (selected.length) {
        selected.forEach(function (feature) {
          feature.setStyle(LamMapStyles.getModifyStyle());
          //abilita eliminazione single click
          //vectorDraw.getSource().removeFeature(feature);
          //
          deleteDrawFeatures();
        });
      } else {
        deselected.forEach(function (feature) {
          feature.setStyle(null);
        });
      }
    });
    mainMap.addInteraction(deleteInteraction);
  };

  let deleteDrawFeatures = function () {
    for (let i = 0; i < deleteInteraction.getFeatures().getArray().length; i++) {
      vectorDraw.getSource().removeFeature(deleteInteraction.getFeatures().getArray()[i]);
    }
    deleteInteraction.getFeatures().clear();
  };

  /**
   * Restituisce tutte le feature disegnate in formato KML
   * @return {string} Elenco delle feature in formato KML
   */
  let getDrawFeature = function () {
    let features = vectorDraw.getSource().getFeatures();
    let kmlFormat = new ol.format.KML();
    let kml = kmlFormat.writeFeatures(features, {
      featureProjection: "EPSG:3857",
    });
    return kml;
  };

  let getGeometryFromGeoJsonGeometry = function (geometry) {
    let geometryOl = null;
    switch (geometry.type.toLowerCase()) {
      case "polygon":
        geometryOl = new ol.geom.Polygon(geometry.coordinates);
        break;
      case "multipolygon":
        geometryOl = new ol.geom.MultiPolygon(geometry.coordinates);
        break;
      case "linestring":
        geometryOl = new ol.geom.LineString(geometry.coordinates);
        break;
      case "multilinestring":
        geometryOl = new ol.geom.MultiLineString(geometry.coordinates);
        break;
      case "point":
        geometryOl = new ol.geom.Point(geometry.coordinates);
        break;
      case "multipoint":
        geometryOl = new ol.geom.MultiPoint(geometry.coordinates);
        break;
    }
    return geometryOl;
  };

  let getGeoJsonGeometryFromGeometry = function (geometry) {
    var writer = new ol.format.GeoJSON();
    return JSON.parse(writer.writeGeometry(geometry));
  };

  let getSRIDfromCRSName = function (name) {
    let srid;
    try {
      if (name) {
        if (name.indexOf("4326") > -1) {
          srid = 4326;
        }
        if (name.indexOf("25832") > -1) {
          srid = 25832;
        }
        if (name.indexOf("3857") > -1) {
          srid = 3857;
        }
        if (name.indexOf("3003") > -1) {
          srid = 3003;
        }
      }
    } catch (e) {
      log(e);
      return null;
    }
    return srid;
  };

  /**
   * Transform feature geometry in EPSG:3857
   * @param {*} feature Feature to transform
   * @param {*} srid Original Feature Srid.
   */
  let transform3857 = function (feature, srid) {
    //verifico che lo srid sia un oggetto crs
    return transformFeatureGeometrySrid(feature, srid, 3857);
  };

  /**
   * Transform feature geometry in the given SRID
   * @param {Transform } feature Feature to transform
   * @param {*} sridSource  Original Feature Srid.
   * @param {*} sridDest  Destination Feature Srid.
   */
  let transformFeatureGeometrySrid = function (feature, sridSource, sridDest) {
    //verifico che lo srid sia un oggetto crs
    if (sridSource) {
      if (sridSource.properties) {
        sridSource = getSRIDfromCRSName(sridSource.properties.name);
      }
      feature.getGeometry().transform("EPSG:" + parseInt(sridSource), "EPSG:" + parseInt(sridDest));
      feature.srid = sridDest;
    }
    return feature;
  };

  let transformGeometrySrid = function (geometryOl, sridSource, sridDest) {
    return geometryOl.transform("EPSG:" + sridSource, "EPSG:" + sridDest);
  };

  let goToBrowserLocation = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(LamMap.showBrowserLocation);
    }
  };
  let showBrowserLocation = function (position) {
    goToLonLat(position.coords.longitude, position.coords.latitude, 18);
  };

  let getUriParameter = function (parameter) {
    return (
      decodeURIComponent((new RegExp("[?|&]" + parameter + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [null, ""])[1].replace(/\+/g, "%20")) || null
    );
  };

  let degreesToRadians = function (degrees) {
    return (degrees / 180) * Math.PI;
  };

  let mercatorLatitudeToY = function (latitude) {
    return Math.log(Math.tan(Math.PI / 4 + degreesToRadians(latitude) / 2));
  };

  /**
   * Calcola l'aspect ratio da applicare alla stampa da ESPG:3857
   * @param  {float} topLatitude    latitude top dell'area da stampare
   * @param  {float} bottomLatitude latitude bottom dell'area da stampare
   * @return {float}                Aspect Ratio
   */
  let aspectRatio = function (topLat, bottomLat) {
    return (mercatorLatitudeToY(topLat) - mercatorLatitudeToY(bottomLat)) / (degreesToRadians(topLat) - degreesToRadians(bottomLat));
  };

  // let addContextMenu = function(items) {
  //   //Aggiunta del menu contestuale
  //   let contextmenu = new ContextMenu({
  //     width: 170,
  //     defaultItems: false, // defaultItems are (for now) Zoom In/Zoom Out
  //     items: items
  //   });
  //   mainMap.addControl(contextmenu);
  // };

  let getCentroid = function (lonlats) {
    var latXTotal = 0;
    var latYTotal = 0;
    var lonDegreesTotal = 0;

    var currentLatLong;
    for (var i = 0; (currentLatLong = lonlats[i]); i++) {
      var latDegrees = currentLatLong[1];
      var lonDegrees = currentLatLong[0];

      var latRadians = (Math.PI * latDegrees) / 180;
      latXTotal += Math.cos(latRadians);
      latYTotal += Math.sin(latRadians);

      lonDegreesTotal += lonDegrees;
    }
    var finalLatRadians = Math.atan2(latYTotal, latXTotal);
    var finalLatDegrees = (finalLatRadians * 180) / Math.PI;
    var finalLonDegrees = lonDegreesTotal / lonlats.length;
    return [finalLonDegrees, finalLatDegrees];
  };

  let getCentroid2d = function (coords) {
    var minX, maxX, minY, maxY;
    for (var i = 0; i < coords.length; i++) {
      minX = coords[i][0] < minX || minX == null ? coords[i][0] : minX;
      maxX = coords[i][0] > maxX || maxX == null ? coords[i][0] : maxX;
      minY = coords[i][1] < minY || minY == null ? coords[i][1] : minY;
      maxY = coords[i][1] > maxY || maxY == null ? coords[i][1] : maxY;
    }
    return [(minX + maxX) / 2, (minY + maxY) / 2];
  };

  /**
   * Rimuove tutte le geometrie dal layer feature info
   * @return {null} La funzione non restituisce un valore
   */
  let clearLayerPrint = function () {
    vectorPrint.getSource().clear(true);
  };

  /**
   * Get the geometry type from a coordinate array. Returns a getGeometryTypesEnum
   * @param {Array} coordinates
   */
  let getGeometryType = function (coordinates) {
    if (!Array.isArray(coordinates)) {
      return LamEnums.geometryTypes().GeometryNull;
    }
    let firstElement = coordinates[0];
    if (!Array.isArray(firstElement)) {
      //single array geometry
      if (coordinates.length > 2) {
        if (coordinates[0] === coordinates[coordinates.length - 2] && coordinates[1] === coordinates[coordinates.length - 1]) {
          return LamEnums.geometryTypes().Polygon;
        } else {
          return LamEnums.geometryTypes().Polyline;
        }
      } else {
        return LamEnums.geometryTypes().Point;
      }
    }
    if (!Array.isArray(firstElement[0])) {
      //if first and last point are the same is polygon, otherwise polyline
      let lastElement = coordinates[coordinates.length - 1];
      if (firstElement[0] === lastElement[0] && firstElement[1] === lastElement[1]) {
        return LamEnums.geometryTypes().Polygon;
      } else {
        return LamEnums.geometryTypes().Polyline;
      }
    }
    //multis
    switch (getGeometryType(firstElement)) {
      case LamEnums.geometryTypes().Polygon:
      case LamEnums.geometryTypes().MultiPolygon:
        return LamEnums.geometryTypes().MultiPolygon;
      case LamEnums.geometryTypes().Polyline:
      case LamEnums.geometryTypes().MultiPolyline:
        return LamEnums.geometryTypes().MultiPolyline;
    }
    return LamEnums.geometryTypes().GeometryNull;
  };

  let getLabelPoint = function (coordinates) {
    if (coordinates.length === 1) coordinates = coordinates[0];
    switch (getGeometryType(coordinates)) {
      case LamEnums.geometryTypes().Point:
        return coordinates;
      case LamEnums.geometryTypes().Polyline:
        return coordinates[Math.floor(coordinates.length / 2)];
      case LamEnums.geometryTypes().Polygon:
        let polygon = new ol.geom.Polygon(coordinates);
        let ppoint = polygon.getInteriorPoint().getCoordinates();
        if (isNaN(ppoint[0])) {
          polygon = new ol.geom.Polygon([coordinates]);
          ppoint = polygon.getInteriorPoint().getCoordinates();
        }
        return ppoint;
      case LamEnums.geometryTypes().MultiPolyline:
        coordinates = coordinates[0];
        return coordinates[Math.floor(coordinates.length / 2)];
      case LamEnums.geometryTypes().MultiPolygon:
        let mpolygon = new ol.geom.Polygon(coordinates);
        return mpolygon.getInteriorPoint().getCoordinates();
    }
  };

  let getPixelFromCoordinate = function (x, y) {
    return mainMap.getPixelFromCoordinate([x, y]);
  };

  let getCoordinateFromPixel = function (x, y) {
    return mainMap.getCoordinateFromPixel([x, y]);
  };

  /**
   * Returns all the event payloads that must be executed after a map move-end event
   */
  let getMoveEndEvents = function () {
    return moveEndPayloads;
  };

  /**
   * Adds an event to be executed after a map move-end event
   * The payload format is lam standard
   * {eventName:"%event-name%",  data1: %data1-value%, data2: %data2-value% ...}
   */
  let addMoveEndEvent = function (payload) {
    moveEndPayloads.push(payload);
  };

  /**
   * Returns all the event payloads that must be executed after a map zoom-end event
   */
  let getZoomEndEvents = function () {
    return zoomEndPayloads;
  };

  /**
   * Adds an event to be executed after a map zoom-end event
   * The payload format is lam standard
   * {eventName:"%event-name%",  data1: %data1-value%, data2: %data2-value% ...}
   */
  let addZoomEndEvent = function (payload) {
    zoomEndPayloads.push(payload);
  };

  let setLayerOpacity = function setLayerOpacity(gid, opacity) {
    var layer = getLayer(gid);
    if (layer != null) {
      layer.setOpacity(opacity);
    }
  };

  return {
    //addContextMenu: addContextMenu,
    addDrawInteraction: addDrawInteraction,
    addDrawDeleteInteraction: addDrawDeleteInteraction,
    addFeatureSelectionToMap: addFeatureSelectionToMap,
    addFeatureToMap: addFeatureToMap,
    addGeometryToMap: addGeometryToMap,
    addLayerToMap: addLayerToMap,
    addMoveEndEvent: addMoveEndEvent,
    addZoomEndEvent: addZoomEndEvent,
    addSelectInteraction: addSelectInteraction,
    setPrintBox: setPrintBox,
    addWKTToMap: addWKTToMap,
    aspectRatio: aspectRatio,
    clearVectorLayer: clearVectorLayer,
    clearLayerPrint: clearLayerPrint,
    clearLayerSelection: clearLayerSelection,
    clearLayerSelectionMask: clearLayerSelectionMask,
    convertGeometryToOl: convertGeometryToOl,
    convertGeoJsonFeatureToOl: convertGeoJsonFeatureToOl,
    deleteDrawFeatures: deleteDrawFeatures,
    render: render,
    getCentroid: getCentroid,
    getCentroid2d: getCentroid2d,
    getDrawFeature: getDrawFeature,
    getGeometryType: getGeometryType,
    getGeoJsonGeometryFromGeometry: getGeoJsonGeometryFromGeometry,
    getCoordinateFromPixel: getCoordinateFromPixel,
    getLabelPoint: getLabelPoint,
    getLegendUrl: getLegendUrl,
    getMap: getMap,
    getMapResolution: getMapResolution,
    getMapCenter: getMapCenter,
    getMapCenterLonLat: getMapCenterLonLat,
    getMapScale: getMapScale,
    getMapZoom: getMapZoom,
    getMoveEndEvents: getMoveEndEvents,
    getZoomEndEvents: getZoomEndEvents,
    getPixelFromCoordinate: getPixelFromCoordinate,
    getPrintCenter: getPrintCenter,
    getPrintCenterLonLat: getPrintCenterLonLat,
    getSelectionMask: getSelectionMask,
    getSRIDfromCRSName: getSRIDfromCRSName,
    goToBrowserLocation: goToBrowserLocation,
    goToLonLat: goToLonLat,
    goToExtent: goToExtent,
    goToGeometry: goToGeometry,
    getResolutionForScale: getResolutionForScale,
    getWFSUrlfromLayer: getWFSUrlfromLayer,
    layerIsPresent: layerIsPresent,
    loadConfig: loadConfig,
    log: log,
    removeAllLayersFromMap: removeAllLayersFromMap,
    removeLayerFromMap: removeLayerFromMap,
    removeDrawInteraction: removeDrawInteraction,
    removeDrawDeleteInteraction: removeDrawDeleteInteraction,
    removeSelectInteraction: removeSelectInteraction,
    setLayerVisibility: setLayerVisibility,
    setLayerOpacity: setLayerOpacity,
    showBrowserLocation: showBrowserLocation,
    startCopyCoordinate: startCopyCoordinate,
    stopCopyCoordinate: stopCopyCoordinate,
    toggleLayer: toggleLayer,
    transform3857: transform3857,
    transformGeometrySrid: transformGeometrySrid,
    zoomIn: zoomIn,
    zoomOut: zoomOut,
  };
})();

let LamHandlebars = (function () {
  let init = function init() {
    registerHandlebarsHelpers();
  };

  let registerHandlebarsHelpers = function () {
    Handlebars.registerHelper("ifequals", function (a, b, options) {
      if (a == b) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    Handlebars.registerHelper("ifnotequals", function (a, b, options) {
      if (a != b) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    Handlebars.registerHelper("get_point_x", function (options) {
      try {
        return options.data.root.lamCoordinates[0];
      } catch (error) {
        return "";
      }
    });

    Handlebars.registerHelper("get_point_y", function (options) {
      try {
        return options.data.root.lamCoordinates[1];
      } catch (error) {
        return "";
      }
    });

    Handlebars.registerHelper("get_coordinate_x", function (index, options) {
      try {
        if (index === "undefined") return options.data.lamCoordinates[0];
        return options.data.root.lamCoordinates[index][0];
      } catch (error) {
        return "";
      }
    });

    Handlebars.registerHelper("get_coordinate_y", function (index, options) {
      try {
        if (index === "undefined") return options.data.lamCoordinates[1];
        return options.data.root.lamCoordinates[index][1];
      } catch (error) {
        return "";
      }
    });

    Handlebars.registerHelper("format_url", function (url, label) {
      try {
        if (!url) return "";
        if (url.indexOf("http") !== 0) url = "https://" + url;
        return "<a class='lam-link-url' href='" + url + "' target='_blank'>" + label + "</a>";
      } catch (error) {
        return "";
      }
    });

    Handlebars.registerHelper("phone_link", function (phone) {
      try {
        if (!phone) return "";
        return (
          "<i class='lam-icon-primary lam-icon-info lam-mr-1'>" +
          LamResources.svgPhone16 +
          "</i>" +
          "<a class='lam-link-url' href='tel:" +
          phone +
          "'>" +
          phone +
          "</a>"
        );
      } catch (error) {
        return "";
      }
    });

    Handlebars.registerHelper("email_link", function (email) {
      try {
        if (!email) return "";
        return (
          "<i class='lam-icon-primary lam-icon-info lam-mr-1'>" +
          LamResources.svgMail16 +
          "</i>" +
          "<a class='lam-link-url' href='mailto:" +
          email +
          "'>" +
          email +
          "</a>"
        );
      } catch (error) {
        return "";
      }
    });

    Handlebars.registerHelper("format_date_string_geoserver", function (dateStr) {
      if (!dateStr) return "";
      try {
        let dateArr = dateStr.split(",");
        return dateArr[0];
      } catch (error) {}
      return "";
    });

    Handlebars.registerHelper("format_date_time_string", function (dateStr) {
      if (!dateStr) return "";
      try {
        //TODO LOCALIZE
        if (dateStr.endsWith("Z")) dateStr = dateStr.replace("Z", "");
        let date = new Date(Date.parse(dateStr));
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let yyyy = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        return dd + "/" + mm + "/" + yyyy + " " + hours + ":" + minutes + ":" + seconds;
      } catch (error) {}
      return "";
    });

    Handlebars.registerHelper("format_date_string", function (dateStr) {
      if (!dateStr) return "";
      try {
        //TODO LOCALIZE
        if (dateStr.endsWith("Z")) dateStr = dateStr.replace("Z", "");
        let date = new Date(Date.parse(dateStr));
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let yyyy = date.getFullYear();
        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;
        return dd + "/" + mm + "/" + yyyy;
      } catch (error) {}
      return "";
    });
  };

  return {
    init: init,
    registerHandlebarsHelpers: registerHandlebarsHelpers,
  };
})();

var LamAlerts = (function () {
  let autoincrement = 0;
  let containerId = "lam-alerts-container";
  let init = function () {
    var container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
  };

  let showMessage = function (title, text, level, options) {
    let container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);

    var lamAlert = document.createElement("div");
    lamAlert.id = ++autoincrement;
    lamAlert.id = "lam-alert-" + lamAlert.id;
    lamAlert.className = "lam-alert";

    if (title) {
      var h4 = document.createElement("h4");
      h4.className = "lam-alert-title";
      h4.innerHTML = title;
      lamAlert.appendChild(h4);
    }

    if (text) {
      var p = document.createElement("p");
      p.className = "lam-alert-text";
      p.innerHTML = text;
      lamAlert.appendChild(p);
    }

    lamAlert.hide = function () {
      lamAlert.className += " lam-alert-fade-out";
      lamAlert.addEventListener("animationend", remove, false);
    };

    function remove() {
      document.getElementById(containerId).removeChild(lamAlert);
    }

    if (level) {
      lamAlert.className += " lam-alert-" + level;
    }

    if (options) {
      if (options.icon) {
        var img = document.createElement("img");
        img.src = options.icon;
        img.className = "lam-alert-icon";
        lamAlert.appendChild(img);
      }
      if (typeof options.callback === "function") {
        lamAlert.addEventListener("click", options.callback);
      }
      if (options.timeout) {
        setTimeout(lamAlert.hide, options.timeout);
      }
    }

    lamAlert.addEventListener("click", remove);
    document.getElementById(containerId).appendChild(lamAlert);
    return lamAlert;
  };

  function hideMessage(alertId) {
    document.getElementById(containerId).removeChild(document.getElementById(alertId));
  }

  return {
    init: init,
    showMessage: showMessage,
    hideMessage: hideMessage,
  };
})();

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

var LamDrawTools = (function () {
  var isRendered = false;

  var init = function init() {
    $("#draw-tools__point").click(function () {
      $("#draw-tools__draw-settings").show();
      $("#draw-tools__delete-settings").hide();
      lamDispatch({
        eventName: "set-draw",
        type: "Point",
      });
    });
    $("#draw-tools__polyline").click(function () {
      $("#draw-tools__draw-settings").show();
      $("#draw-tools__delete-settings").hide();
      lamDispatch({
        eventName: "set-draw",
        type: "LineString",
      });
    });
    $("#draw-tools__polygon").click(function () {
      $("#draw-tools__draw-settings").show();
      $("#draw-tools__delete-settings").hide();
      lamDispatch({
        eventName: "set-draw",
        type: "Polygon",
      });
    });
    $("#draw-tools__delete").click(function () {
      $("#draw-tools__draw-settings").hide();
      $("#draw-tools__delete-settings").show();
      lamDispatch({
        eventName: "set-draw-delete",
        type: "Delete",
      });
    });

    //adding tool reset
    LamToolbar.addResetToolsEvent({ eventName: "unset-draw" });

    //Events binding
    LamDispatcher.bind("show-draw-tools", function (payload) {
      LamToolbar.toggleToolbarItem("draw-tools");
      if (LamToolbar.getCurrentToolbarItem() === "draw-tools") {
        LamStore.setInfoClickEnabled(false);
      }
      lamDispatch("clear-layer-info");
    });

    LamDispatcher.bind("set-draw", function (payload) {
      LamMap.removeDrawInteraction();
      LamMap.removeDrawDeleteInteraction();
      LamMap.addDrawInteraction(payload.type);
    });

    LamDispatcher.bind("unset-draw", function (payload) {
      LamMap.removeDrawInteraction();
      LamMap.removeDrawDeleteInteraction();
    });

    LamDispatcher.bind("set-draw-delete", function (payload) {
      LamMap.removeDrawInteraction();
      LamMap.removeDrawDeleteInteraction();
      LamMap.addDrawDeleteInteraction(payload.type);
    });

    LamDispatcher.bind("delete-draw", function (payload) {
      LamMap.deleteDrawFeatures(payload.type);
    });
  };

  var render = function (div) {
    if (!LamStore.getAppState().modules["draw-tools"]) return;
    var templateTemp = templateDraw();
    var output = templateTemp();
    jQuery("#" + div).html(output);
    if (!isRendered) {
      init();
    }
    //forzo che il contenuto non sia visualizzato
    $("#draw-tools__content").hide();
    isRendered = true;
  };

  var templateDraw = function () {
    template = "";
    //pannello ricerca via
    template += '<h4 class="lam-title">Disegna</h4>';
    template += '<div class="lam-card lam-depth-2">';

    template += "<div>";
    template += '  <button id="draw-tools__point" class="lam-btn lam-btn-floating ">';
    template += '    <svg width="24px" height="24px">';
    template += '      <circle cx="12" cy="12" r="6" stroke="green" stroke-width="0" fill="white" />';
    template += "    </svg>";
    template += "  </button>";

    template += '  <button id="draw-tools__polyline" class="lam-btn lam-btn-floating">';
    template += '    <svg width="24px" height="24px">';
    template += '      <polyline points="4,4 20,20" style="fill:white;stroke:white;stroke-width:3" />';
    template += '      <circle cx="4" cy="4" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += '      <circle cx="20" cy="20" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += "    </svg>";
    template += "  </button>";

    template += '  <button id="draw-tools__polygon" class="lam-btn lam-btn-floating ">';
    template += '    <svg width="24px" height="24px">';
    template += '    <rect x="3" y="3" rx="0" ry="0" width="18" height="18"  stroke="white" stroke-width="3" fill="transparent" />';
    template += '      <circle cx="4" cy="4" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += '      <circle cx="4" cy="20" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += '      <circle cx="20" cy="4" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += '      <circle cx="20" cy="20" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += "    </svg>";
    template += "  </button>";

    //template += '  <button id="draw-tools__text" class="lam-btn lam-btn-floating lam-btn-large" >';
    //template += '    <i class="lam-icon" style="font-size:35px !important; top:45%;  ">T</i>';
    //template += '  </button>';

    template += '  <button id="draw-tools__delete" class="lam-btn lam-btn-floating" >';
    template += '<i class="lam-icon">';
    template +=
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /><path d="M0 0h24v24H0z" fill="none" /></svg>';
    template += "</i>";
    template += "  </button>";

    //template += '  <div class="div-20" ></div>';
    //template += '  <div id="draw-tools__draw-settings" style="width:100%" >';
    //template += '  <div> <input id="draw-tools__color" type="text" name="draw-tools__color" value="#448AFF" /></div>';

    template += '  <div class="div-20" ></div>';
    template += '  <textarea  id="draw-tools__textarea" rows="6" style="width:95%" placeholder="Aggiungi label..."></textarea>';
    //template += '  <button id="draw-tools__delete-button" onclick="LamDrawTools.deleteFeatures(); return false;" class="" >Elimina</button>';
    template += "  </div>";

    template += '  <div id="draw-tools__delete-settings" class="lam-hidden" >';
    template += '  <div class="div-20" ></div>';
    template += "  Tocca una geometria per eliminarla ";
    //template += '  <button id="draw-tools__delete-button" onclick="LamDrawTools.deleteFeatures(); return false;" class="" >Elimina</button>';
    template += "  </div>";

    template += "</div>";

    template += '<div class="div-10"></div>';

    template += "</div>";

    return Handlebars.compile(template);
  };

  var setDraw = function (type) {
    lamDispatch({
      eventName: "set-draw",
      type: type,
    });
  };

  var deleteFeatures = function () {
    lamDispatch({
      eventName: "delete-draw",
    });
  };

  return {
    setDraw: setDraw,
    deleteFeatures: deleteFeatures,
    init: init,
    render: render,
    templateDraw: templateDraw,
  };
})();

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

var LamMapTools = (function () {
  var isRendered = false;

  var init = function init() {
    //Events binding
    LamDispatcher.bind("show-map-tools", function (payload) {
      LamToolbar.toggleToolbarItem("map-tools");
      if (LamToolbar.getCurrentToolbarItem() === "map-tools") {
        LamStore.setInfoClickEnabled(false);
      }
    });

    if (LamStore.getAppState().modules["map-tools-copyCoordinate"]) {
      $("#map-tools__copyCoordinate").removeClass("lam-hidden");
      this.bind("start-copy-coordinate", function (payload) {
        LamMap.startCopyCoordinate();
      });

      LamDispatcher.bind("stop-copy-coordinate", function (payload) {
        LamMapTools.stopCopyCoordinate();
      });
    }

    if (LamStore.getAppState().modules["map-tools-goLonLat"]) {
      $("#map-tools__goToLonLat").removeClass("lam-hidden");
    }
    if (LamStore.getAppState().modules["map-tools-measure"]) {
      $("#map-tools__measure").removeClass("lam-hidden");
      LamMeasureTools.render();
      LamToolbar.addResetToolsEvent({ eventName: "stop-measure-tool" });
    }

    isRendered = true;
  };

  var render = function (div) {
    var templateTemp = templateMapTools();
    var output = templateTemp();
    jQuery("#" + div).html(output);
    if (!isRendered) {
      init();
    }
    //forzo che il contenuto non sia visualizzato
    //
    //aggiungo la copia nel bottone

    var clipboard = new ClipboardJS("#search-tools__copy-url", {
      text: function (trigger) {
        return $("#map-tools__coordinate-textarea").val();
      },
    });

    isRendered = true;
  };

  var templateMapTools = function () {
    let template = "";
    template += '<h4 class="lam-title">Strumenti</h4>';
    template += '<div class="lam-card lam-depth-2">';
    template += goToLonLatTemplate();
    template += copyCoordinateTemplate();
    template += measureTemplate();
    template += '<div class="div-10"></div>';
    //template += 'Crea link da condividere con i tuoi colleghi';
    template += "</div>";

    return Handlebars.compile(template);
  };

  let goToLonLatTemplate = function () {
    let template = "<div id='map-tools__goToLonLat' class='lam-hidden'>";
    template += '<h5 class="lam-title-h4">Vai a..</h5>';
    template += '<div id="map-tools__lon-field" class="lam-mb-2" >';
    template += '<label class="lam-label" for="map-tools__lon">Longitune</label>';
    template += '<input id="map-tools__lon" class="lam-input" type="number" step="any">';
    template += "</div>";
    template += '<div id="map-tools__lat-field" class="lam-mb-2" >';
    template += '<label class="lam-label" for="map-tools__lat">Latitudine</label>';
    template += '<input id="map-tools__lat" class="lam-input" type="number" step="any">';
    template += "</div>";
    template += '<div class="lam-grid ">';
    template += '<div class="lam-col"></div>';
    template += '<div class="lam-col"></div>';
    template += '<div class="lam-col"></div>';
    template += '<div class="lam-col">';
    template += '<button id="search-tools__gotolonlat"  class="lam-btn" onclick="LamMapTools.goToLonLat()">Vai</button>';
    template += "</div>";
    template += "</div>";
    template += "</div>";
    return template;
  };

  let copyCoordinateTemplate = function () {
    let template = "<div id='map-tools__copyCoordinate' class='lam-hidden'>";
    template += '<h5 class="lam-title-h4">Copia coordinate</h5>';
    template += '<textarea  id="map-tools__coordinate-textarea" rows="6" style="width:95%"></textarea>';
    template += '<div class="lam-grid">';
    template += '<div class="lam-col"></div>';
    template += '<div class="lam-col"></div>';
    template += '<div class="lam-col">';
    template += '<button id="search-tools__start-copy-url" class="lam-btn" onclick="LamMapTools.startCopyCoordinate()">Inizia</button>';
    template += '<button id="search-tools__stop-copy-url" class="lam-btn lam-hidden" onclick="LamMapTools.stopCopyCoordinate()">Fine</button>';
    template += "</div>";
    template += '<div class="lam-col">';
    template += '<button id="search-tools__copy-url"  class="lam-btn " >Copia</button>';
    template += "</div>";
    template += "</div>";
    template += "</div>";
    return template;
  };

  let measureTemplate = function () {
    let template = "<div id='map-tools__measure' class='lam-hidden'>";
    template += '<h5 class="lam-title-h4">Misura</h5>';
    template += '<div class="lam-grid lam-no-bg">';
    template += '<div class="lam-col">';
    template += '<button id="map-tools__measures-start-length" class="lam-btn" onclick="LamMeasureTools.startMeasureLength()">Lunghezza</button>';
    template += "</div>";
    template += '<div class="lam-col">';
    template += '<button id="map-tools__measures-start-area" class="lam-btn" onclick="LamMeasureTools.startMeasureArea()">Area</button>';
    template += "</div>";
    template += "</div>";
    template += '<div class="lam-grid lam-no-bg lam-mt-1">';
    template += '<div class="lam-col">';
    template += '<button id="map-tools__measures-clear" class="lam-btn" onclick="LamMeasureTools.clearMeasures()">Pulisci</button>';
    template += "</div>";
    template += "</div>";
    template += "</div>";
    return template;
  };

  /**
   * Chiama il disptcher per creare l'url di condivisione
   * @return {null} la funzione non restituisce valori
   */
  var goToLonLat = function () {
    var payload = {};
    try {
      payload.eventName = "zoom-lon-lat";
      payload.lon = parseFloat($("#map-tools__lon").val());
      payload.lat = parseFloat($("#map-tools__lat").val());
      lamDispatch(payload);
    } catch (e) {
      lamDispatch({
        eventName: "log",
        message: "LamStore: map-tools " + e,
      });
    }

    try {
      payload = {};
      payload.eventName = "clear-layer-info";
      lamDispatch(payload);
      payload = {};
      payload.eventName = "add-info-point";
      payload.lon = parseFloat($("#map-tools__lon").val());
      payload.lat = parseFloat($("#map-tools__lat").val());
      lamDispatch(payload);
    } catch (e) {
      lamDispatch({
        eventName: "log",
        message: "LamStore: map-tools " + e,
      });
    }
  };

  var startCopyCoordinate = function () {
    $("#search-tools__start-copy-url").hide();
    $("#search-tools__stop-copy-url").show();
    lamDispatch("start-copy-coordinate");
  };

  var stopCopyCoordinate = function () {
    $("#search-tools__start-copy-url").show();
    $("#search-tools__stop-copy-url").hide();
    LamMap.stopCopyCoordinate();
  };

  var addCoordinate = function (lon, lat) {
    lamDispatch({ eventName: "add-info-point", lon: lon, lat: lat }), (lon = Math.round(lon * 1000000) / 1000000);
    lat = Math.round(lat * 1000000) / 1000000;
    $("#map-tools__coordinate-textarea").val($("#map-tools__coordinate-textarea").val() + lon + " " + lat + ";\n");
  };

  return {
    addCoordinate: addCoordinate,
    startCopyCoordinate: startCopyCoordinate,
    stopCopyCoordinate: stopCopyCoordinate,
    goToLonLat: goToLonLat,
    init: init,
    render: render,
    templateMapTools: templateMapTools,
  };
})();

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

var LamMeasureTools = (function () {
  let isRendered = false;

  let init = function init() {
    LamDispatcher.bind("stop-measure-tool", function (payload) {
      LamMeasureTools.removeInteraction();
    });

    createMeasureTooltip();
    createHelpTooltip();
    vector.setMap(LamMap.getMap());
    isRendered = true;
  };

  let render = function (div) {
    if (!isRendered) {
      init();
    }
  };

  let source = new ol.source.Vector();

  let vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgba(255, 255, 255, 0.2)",
      }),
      stroke: new ol.style.Stroke({
        color: "#0AFF57",
        width: 2,
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: "#0AFF57",
        }),
      }),
    }),
  });

  /**
   * Currently drawn feature.
   * @type {import("../src/ol/Feature.js").default}
   */
  let sketch;

  /**
   * The help tooltip element.
   * @type {HTMLElement}
   */
  let helpTooltipElement;

  /**
   * Overlay to show the help messages.
   * @type {ol.Overlay}
   */
  let helpTooltip;

  /**
   * The measure tooltip element.
   * @type {HTMLElement}
   */
  let measureTooltipElement;

  /**
   * Overlay to show the measurement.
   * @type {ol.Overlay}
   */
  let measureTooltip;

  /**
   * Message to show when the user is drawing a polygon.
   * @type {string}
   */
  let continuePolygonMsg = "Clicca per continuare a disegnare il poligono";

  /**
   * Message to show when the user is drawing a line.
   * @type {string}
   */
  let continueLineMsg = "Clicca per continuare a disegnare la linea";

  let pointerMoveHandlerKey;
  /**
   * Handle pointer move.
   * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
   */
  let pointerMoveHandler = function (evt) {
    if (evt.dragging) {
      return;
    }
    /** @type {string} */
    let helpMsg = "Clicca per iniziare a misurare, doppio click per terminare";

    if (sketch) {
      let geom = sketch.getGeometry();
      if (geom instanceof ol.geom.Polygon) {
        helpMsg = continuePolygonMsg;
      } else if (geom instanceof ol.geom.LineString) {
        helpMsg = continueLineMsg;
      }
    }

    helpTooltipElement.innerHTML = helpMsg;
    helpTooltip.setPosition(evt.coordinate);

    helpTooltipElement.classList.remove("hidden");
  };

  let draw; // global so we can remove it later

  /**
   * Format length output.
   * @param {LineString} line The line.
   * @return {string} The formatted length.
   */
  let formatLength = function (line) {
    let length = ol.sphere.getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + " " + "km";
    } else {
      output = Math.round(length * 100) / 100 + " " + "m";
    }
    return output;
  };

  /**
   * Format area output.
   * @param {Polygon} polygon The polygon.
   * @return {string} Formatted area.
   */
  let formatArea = function (polygon) {
    let area = ol.sphere.getArea(polygon);
    let output;
    if (area > 10000) {
      output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
    } else {
      output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
    }
    return output;
  };

  let startMeasureLength = function () {
    try {
      removeInteraction();
    } catch (error) {}
    addInteraction("LineString");
  };
  let startMeasureArea = function () {
    try {
      removeInteraction();
    } catch (error) {}
    addInteraction("Polygon");
  };

  let removeInteraction = function () {
    LamMap.getMap().removeInteraction(draw);
    $(".ol-tooltip-help").remove();
    ol.Observable.unByKey(pointerMoveHandlerKey);
  };

  function addInteraction(type) {
    pointerMoveHandlerKey = LamMap.getMap().on("pointermove", pointerMoveHandler);

    LamMap.getMap()
      .getViewport()
      .addEventListener("mouseout", function () {
        helpTooltipElement.classList.add("hidden");
      });

    draw = new ol.interaction.Draw({
      source: source,
      type: type,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new ol.style.Stroke({
          color: "rgba(0, 255, 0, 0.5)",
          lineDash: [10, 10],
          width: 2,
        }),
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: "rgba(0, 255, 0, 0.7)",
          }),
          fill: new ol.style.Fill({
            color: "rgba(255, 255, 255, 0.2)",
          }),
        }),
      }),
    });
    LamMap.getMap().addInteraction(draw);

    createMeasureTooltip();
    createHelpTooltip();

    let listener;
    draw.on("drawstart", function (evt) {
      // set sketch
      sketch = evt.feature;

      /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
      let tooltipCoord = evt.coordinate;

      listener = sketch.getGeometry().on("change", function (evt) {
        let geom = evt.target;
        let output;
        if (geom instanceof ol.geom.Polygon) {
          output = formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof ol.geom.LineString) {
          output = formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        measureTooltipElement.innerHTML = output;
        measureTooltip.setPosition(tooltipCoord);
      });
    });

    draw.on("drawend", function () {
      measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
      measureTooltip.setOffset([0, -7]);
      // unset sketch
      sketch = null;
      // unset tooltip so that a new one can be created
      measureTooltipElement = null;
      createMeasureTooltip();
      ol.Observable.unByKey(listener);
    });
  }

  /**
   * Creates a new help tooltip
   */
  let createHelpTooltip = function () {
    try {
      if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
      }
    } catch (error) {}

    helpTooltipElement = document.createElement("div");
    helpTooltipElement.className = "ol-tooltip ol-tooltip-help hidden";
    helpTooltip = new ol.Overlay({
      element: helpTooltipElement,
      offset: [15, 0],
      positioning: "center-left",
    });
    LamMap.getMap().addOverlay(helpTooltip);
  };

  /**
   * Creates a new measure tooltip
   */
  let createMeasureTooltip = function () {
    try {
      if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
      }
    } catch (error) {}

    measureTooltipElement = document.createElement("div");
    measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
    measureTooltip = new ol.Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: "bottom-center",
    });
    LamMap.getMap().addOverlay(measureTooltip);
  };

  let clearMeasures = function () {
    $(".ol-tooltip-static").remove();
    //if (helpTooltipElement) helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    vector.getSource().clear(true);
  };

  return {
    clearMeasures: clearMeasures,
    render: render,
    removeInteraction: removeInteraction,
    startMeasureLength: startMeasureLength,
    startMeasureArea: startMeasureArea,
  };
})();

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

var LamPrintTools = (function () {
  var isRendered = false;

  var papersMM = {
    a4: {
      width: 210,
      height: 297,
    },
    a3: {
      width: 210,
      height: 420,
    },
  };

  var papersPX = {
    a4: {
      width: 794,
      height: 1123,
    },
    a3: {
      width: 1123,
      height: 1587,
    },
  };

  var init = function init() {
    //Upgrade grafici
    //adding tool reset
    LamToolbar.addResetToolsEvent({ eventName: "clear-layer-print" });

    //events binding
    LamDispatcher.bind("show-print-tools", function (payload) {
      LamToolbar.toggleToolbarItem("print-tools");
      lamDispatch("print-map-size-update");
      if (LamToolbar.getCurrentToolbarItem() === "print-tools") {
        //LamStore.setInfoClickEnabled(false);
      }
      //lamDispatch("clear-layer-info");
    });

    LamDispatcher.bind("print-map", function (payload) {
      LamPrintTools.printMap(payload.paper, payload.orientation);
    });

    LamDispatcher.bind("clear-layer-print", function (payload) {
      LamMap.clearLayerPrint();
    });

    LamDispatcher.bind("print-map-size-update", function (payload) {
      var paper = $("#print-tools__paper").val();
      var orientation = $("#print-tools__orientation").val();
      updatePrintMapSize(paper, orientation);
    });

    LamDispatcher.bind("print-map-size-reset", function (payload) {
      resetPrintMapSize();
    });

    //bind elements
    $("#print-tools__paper").change(function () {
      lamDispatch("print-map-size-update");
    });
    $("#print-tools__orientation").change(function () {
      lamDispatch("print-map-size-update");
    });

    //add reset tools
    LamToolbar.addResetToolsEvent({ eventName: "print-map-size-reset" });
  };

  var render = function (div) {
    if (!LamStore.getAppState().modules["print-tools"]) return;
    var templateTemp = templatePrint();
    var output = templateTemp();
    jQuery("#" + div).html(output);
    if (!isRendered) {
      init();
    }

    //aggiungo a4 al centro della mappa
    isRendered = true;
  };

  var templatePrint = function () {
    template = "";

    template += '<h4 class="lam-title">Stampa</h4>';
    template += '<div class="lam-card lam-depth-2">';

    if (LamStore.getAppState().printDisclaimer) {
      template += '<div class="lam-mb-2 lam-app-bg lam-p-1">';
      if (LamStore.getAppState().printDisclaimerTitle) {
        template += '<div class="lam-title-h4 lam-mb-0 lam-mt-0">';
        template += LamStore.getAppState().printDisclaimerTitle;
        template += "</div>";
      }
      template += '<div class="lam-italic ">';
      template += LamStore.getAppState().printDisclaimer;
      template += "</div>";
      template += "</div>";
    }

    template += '<div class="lam-mb-2">';
    template += "La modalità di stampa è attiva. Seleziona la dimensione e orientamento preferito e clicca su <i>Stampa mappa</i>.";
    template += "<br/>Per creare un pdf, cliccare su <i>Stampa mappa</i> e poi selezionare <i>Salva come pdf</i>.";
    template += "</div>";

    template += '<div class="lam-mb-2">';
    template += '<label class="lam-label" for="print-tools__paper" class="lam-label">Dimensione</label>';
    template += '<select id="print-tools__paper" class="lam-select">';
    template += '<option value="a4">A4</option>';
    template += '<option value="a3">A3</option>';
    template += "</select>";
    template += "</div>";

    template += '<div class="lam-mb-2">';
    template += '<label class="lam-label" for="print-tools__orientation" class="lam-label">Orientamento</label>';
    template += '<select id="print-tools__orientation" class="lam-select">';
    template += '<option value="portrait">Verticale</option>';
    template += '<option value="landscape">Orizzontale</option>';
    template += "</select>";
    template += "</div>";

    template += '<button id="print-tools__print-button" onclick="LamPrintTools.printClick(); return false;" class="lam-btn" >Stampa mappa</button>';
    template +=
      '<button id="print-tools__print-button" onclick="LamPrintTools.closePrintMap(); return false;" class="lam-btn" >Chiudi modalità stampa</button>';

    template += '<div class="div-10"></div>';

    template += "</div>";

    return Handlebars.compile(template);
  };

  /**
   * Stampa la mappa under contruction
   * @param  {[type]} paper       [description]
   * @param  {[type]} orientation [description]
   * @return {[type]}             [description]
   */
  let updatePrintMapSize = function (paper, orientation) {
    removePrintClass("#lam-app");
    removePrintClass("#lam-map");
    let classId = "lam-app-print-" + paper + "-" + orientation;
    $("#lam-app").addClass(classId);
    $("#lam-map").addClass(classId);
    LamMap.getMap().updateSize();
  };

  let resetPrintMapSize = function (paper, orientation) {
    removePrintClass("#lam-app");
    removePrintClass("#lam-map");
    LamMap.getMap().updateSize();
  };

  let removePrintClass = function (elementId) {
    $(elementId).removeClass(function (index, css) {
      return (css.match(/(^|\s)lam-app-print-\S+/g) || []).join(" ");
    });
  };

  let closePrintMap = function () {
    LamToolbar.toggleToolbarItem("print-tools");
    lamDispatch("print-map-size-reset");
  };

  let printClick = function () {
    window.print();
  };

  return {
    closePrintMap: closePrintMap,
    init: init,
    printClick: printClick,
    updatePrintMapSize: updatePrintMapSize,
    resetPrintMapSize: resetPrintMapSize,
    render: render,
    templatePrint: templatePrint,
  };
})();

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

var LamSearchTools = (function () {
  var isRendered = false;

  var searchResults = [];
  var searchAddressProviderUrl = "";
  var searchAddressProviderField = "";
  var searchHouseNumberProviderUrl = "";
  var searchHouseNumberProviderField = "";
  var searchLayers = [];
  var timeout = 500;
  var timer;
  var searchResultsDiv = "search-tools__search-results";
  var invalidAdrressTerms = [
    "aut",
    "rione",
    "corso",
    "piazzale",
    "piazzetta",
    "passeggiata",
    "strada",
    "largo",
    "galleria",
    "stradello",
    "rtd",
    "via",
    "stradone",
    "parco",
    "piazza",
    "vicolo",
    "viale",
  ];

  var init = function init() {
    Handlebars.registerHelper("hasLayers", function (options) {
      //return searchLayers.length > 0;
      return true;
    });

    //events binding
    /**
     * Shows the search tool, resetting info-results
     */
    LamDispatcher.bind("show-search", function (payload) {
      LamToolbar.toggleToolbarItem("search-tools");
      lamDispatch("clear-layer-info");
      lamDispatch("reset-search");
      setTimeout(function () {
        updateScrollHeight();
      }, 500);
    });

    /**
     * Resets the search info-results
     */
    LamDispatcher.bind("reset-search", function (payload) {
      LamSearchTools.resetSearch();
    });

    LamDispatcher.bind("show-search-items", function (payload) {
      LamSearchTools.showSearchInfoFeatures(payload.features, payload.template);
    });

    LamDispatcher.bind("search-address", function (payload) {
      LamStore.searchAddress(payload.data, "LamStore.processAddress");
    });

    LamDispatcher.bind("show-search-results", function (payload) {
      LamSearchTools.showSearchResults(payload.results);
    });

    //Carico i template di base
    if (LamStore.getAppState().searchProviderAddressTemplateUrl)
      LamTemplates.loadTemplateAjax(
        LamTemplates.getTemplateUrl(null, LamStore.getAppState().searchProviderAddressTemplateUrl, LamStore.getAppState().templatesRepositoryUrl)
      );
    if (LamStore.getAppState().searchProviderHouseNumberTemplateUrl)
      LamTemplates.loadTemplateAjax(
        LamTemplates.getTemplateUrl(null, LamStore.getAppState().searchProviderHouseNumberTemplateUrl, LamStore.getAppState().templatesRepositoryUrl)
      );

    try {
    } catch (e) {
    } finally {
    }
  };

  var render = function (div, provider, providerAddressUrl, providerAddressField, providerHouseNumberUrl, providerHouseNumberField, layers) {
    if (!LamStore.getAppState().modules["search-tools"]) return;
    searchLayers = layers;
    switch (provider) {
      case "wms_geoserver":
        searchAddressProviderUrl = providerAddressUrl;
        searchAddressProviderField = providerAddressField;
        searchHouseNumberProviderUrl = providerHouseNumberUrl;
        searchHouseNumberProviderField = providerHouseNumberField;
        var templateTemp = templateSearchWFSGeoserver(searchLayers);
        var output = templateTemp(searchLayers);
        jQuery("#" + div).html(output);
        $("#search-tools__select-layers").on("change", function () {
          LamDispatcher.dispatch("clear-layer-info");
          const optionSelected = $("#search-tools__select-layers option:selected");
          const layerSelected = optionSelected.val();
          let layer = searchLayers.filter(function (element) {
            return element.gid == layerSelected;
          });
          if (layer.length) {
            layer = layer[0];
            $("#search-tools__search-layers__label").text(layer.searchFieldLabel || layer.searchField);
            //controllo del form custom
            if (layer.searchCustomEvent) {
              //esecuzione della funzione custom
              LamDispatcher.dispatch(layer.searchCustomEvent);
            } else {
              $("#search-tools__search-layers-custom").hide();
              $("#search-tools__search-layers-standard").show();
            }
          } else {
            //se il layer non esiste verifico se esiste un evento sulla option
            if (optionSelected.attr("searchCustomEvent")) {
              LamDispatcher.dispatch(optionSelected.attr("searchCustomEvent"));
            }
          }
          resetSearch();
        });
        $("#search-tools__select-layers").trigger("change");
        break;
    }

    updateScrollHeight();
    $(window).resize(function () {
      updateScrollHeight();
    });

    if (!isRendered) {
      init();
    }

    isRendered = true;
  };

  let resetSearch = function () {
    $("#search-tools__search-layers").val("");
    $("#search-tools__search-address").val("");
    showSearchResults("<p>Inserisci un testo per iniziare la ricerca.</p>");
  };

  /**
   * Helper function to show html results
   * @param {string} html
   */
  let showSearchResults = function (html, htmlMobile) {
    if (!htmlMobile) htmlMobile = html;
    $("#" + searchResultsDiv).html(html);
    //$("#bottom-info__title-text").html(title);
    $("#bottom-info__title-text").html("Risultati di ricerca");
    $("#bottom-info__content").html(htmlMobile);
    //LamDom.showContent(LamEnums.showContentMode().LeftPanel, "", html, html, "search-tools", searchResultsDiv);
  };

  /**
   * Aggiorna la dimensione dello scroll dei contenuti
   * @return {null} La funzione non restituisce un valore
   */
  var updateScrollHeight = function () {
    var positionMenu = $("#menu-toolbar").offset();
    var positionSearch = $("#" + searchResultsDiv).offset();
    $("#" + searchResultsDiv).height(positionMenu.top - positionSearch.top - 20);
  };

  /**
   * General html code that will be injected in the panel as the main tools
   */
  var templateTopTools = function (layersNum) {
    let template = '<div class="lam-bar">';
    template +=
      '<div id="lam-bar__item-address" class="lam-bar__item lam-is-half lam-bar__item-selected" onclick="LamSearchTools.showSearchAddress(); return false;">';
    template += '<a id="search-tools__button-address" class="" autofocus>Indirizzi</a>';
    template += "</div>";
    let divSearchItemsVisible = layersNum ? "" : "lam-hidden";
    template += '<div id="lam-bar__item-layers" class="lam-bar__item lam-is-half ' + divSearchItemsVisible + '" onclick="LamSearchTools.showSearchLayers(); return false;">';
    var title = LamStore.getAppState().searchObjectsPanelTitle || "Oggetti";
    template += '<a id="search-tools__button-layers" class="" >' + title + '</a>';
    template += "</div>";
    template += "</div>";
    return template;
  };

  /**
   * General html code that will be injected in order to display the layer tools
   */
  var templateLayersTools = function (searchLayers) {
    let template = '<div id="search-tools__layers" class="lam-card lam-depth-2 lam-hidden" >';
    template += '<select id="search-tools__select-layers" class="lam-select lam-mb-2">';
    //template += '<option class="lam-option" value=""></option>';
    for (var i = 0; i < searchLayers.length; i++) {
      template += '<option class="lam-option" value="' + searchLayers[i].gid + '">' + searchLayers[i].layerName + "</option>";
    }
    template += "</select>";
    template += '<div id="search-tools__search-layers-field" class="" >';
    template += '<label class="lam-label" id="search-tools__search-layers__label" for="search-tools__search-layers">';
    if (searchLayers.length > 0) {
      template += searchLayers[0].searchFieldLabel || searchLayers[0].searchField;
    } else {
      template += "Seleziona un tema...";
    }
    template += "</label>";
    //autocomplete standard for the layer
    template +=
      '<div id="search-tools__search-layers-standard"><input id="search-tools__search-layers" class="lam-input" type="search" onkeyup="LamSearchTools.searchLayersKeyup(event)" placeholder="Ricerca..."></div>';
    //custom form placeholder for thhe layer
    template += '<div id="search-tools__search-layers-custom"></div>';
    template += "</div>";
    template += "</div>";
    return template;
  };

  /**
   * Initialize the panel if Geoserver is selected as default address provider
   */
  var templateSearchWFSGeoserver = function () {
    let template = "";
    //pannello ricerca via
    template += '<h4 class="lam-title">Ricerca</h4>';
    template += templateTopTools(searchLayers.length);
    template += '<div id="search-tools__address" class="lam-card lam-depth-2">';
    template += '<div id="search-tools__search-address-field" class="" >';
    template += '<label class="lam-label" id="search-tools__search-address__label" for="search-tools__search-address">Indirizzo</label>';
    template +=
      '<input id="search-tools__search-address" class="lam-input" type="search" onkeyup="LamSearchTools.searchAddressKeyup(event)" placeholder="Via o civico">';
    template += "</div>";
    template += "</div>";
    //if (searchLayers.length > 0) {
    template += templateLayersTools(searchLayers);
    //}
    template += '<div class="div-10"></div>';
    template += '<div id="' + searchResultsDiv + '" class="lam-card lam-depth-2 lam-scrollable">';
    template += "</div>";
    return Handlebars.compile(template);
  };

  /**
   * Switch the address/layers top tools
   */
  var showSearchAddress = function () {
    $("#search-tools__label").text("Indirizzo");
    $("#search-tools__address").show();
    $("#search-tools__layers").hide();
    lamDispatch("clear-layer-info");
    lamDispatch("reset-search");
    $("#lam-bar__item-address").addClass("lam-bar__item-selected");
    $("#lam-bar__item-layers").removeClass("lam-bar__item-selected");
    updateScrollHeight();
  };

  /**
   * Switch the address/layers tools
   */
  var showSearchLayers = function () {
    $("#search-tools__button-address").removeClass("lam-background-darken");
    $("#search-tools__label").text("Layers");
    $("#search-tools__address").hide();
    $("#search-tools__layers").show();
    $("#lam-bar__item-address").removeClass("lam-bar__item-selected");
    $("#lam-bar__item-layers").addClass("lam-bar__item-selected");
    lamDispatch("clear-layer-info");
    lamDispatch("reset-search");
    updateScrollHeight();
  };

  var searchAddressKeyup = function (ev) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      if ($("#search-tools__search-address").val().length > 2 && searchTermValid($("#search-tools__search-address").val())) {
        LamDispatcher.dispatch("show-loader");
        doSearchAddress(ev);
      }
    }, timeout);
  };

  var searchLayersKeyup = function (ev) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      if ($("#search-tools__search-layers").val().length > 2) {
        LamDispatcher.dispatch("show-loader");
        doSearchLayers(ev);
      }
    }, timeout);
  };

  /**
   * Start the search in the WFS Geoserver Provider
   * @param {Object} ev key click event result
   */
  let doSearchAddress = function (ev) {
    if (ev.keyCode == 13) {
      $("#search-tools__search-address").blur();
    }
    let via = $("#search-tools__search-address").val();
    via = via.trim().replace("'", " ");
    let street = "";
    let civico = "";
    if (via.indexOf(",") > -1) {
      let viaArr = via.split(",");
      street = viaArr[0];
      civico = viaArr[1];
    } else {
      let arrTerms = via.split(" ");
      for (let i = 0; i < arrTerms.length; i++) {
        //verifica dei civici e dei barrati
        if (isNaN(arrTerms[i])) {
          if (arrTerms[i].indexOf("/") > -1) {
            civico += arrTerms[i];
          } else {
            street += arrTerms[i] + " ";
          }
        } else {
          civico += arrTerms[i] + " ";
        }
      }
    }

    let arrStreet = street.trim().split(" ");
    //rimozione degli elementi invalidi
    arrStreet = arrStreet.filter(function (item) {
      return invalidAdrressTerms.indexOf(item.toLowerCase()) === -1;
    });

    let url = searchAddressProviderUrl;
    let streetCqlFilter = "";
    for (let i = 0; i < arrStreet.length; i++) {
      if (!streetCqlFilter) {
        streetCqlFilter = "[" + searchAddressProviderField + "]ilike%27%25" + arrStreet[i].trim() + "%25%27";
      } else {
        streetCqlFilter += "%20AND%20[" + searchAddressProviderField + "]ilike%27%25" + arrStreet[i].trim() + "%25%27";
      }
    }
    let civicoCqlFilter = "%20AND%20" + searchHouseNumberProviderField + "%20ILIKE%20%27" + civico.trim() + "%25%27";

    if (!civico) {
      //solo ricerca via
      url += "&cql_filter=" + streetCqlFilter;
    } else {
      //ricerca via e civico
      url = searchHouseNumberProviderUrl + "&cql_filter=" + streetCqlFilter + civicoCqlFilter;
    }
    if (url.toLowerCase().indexOf("srsname") < 0 && LamStore.getAppState().srid) {
      url += "&srsName=EPSG:" + LamStore.getAppState().srid;
    }
    $.ajax({
      dataType: "jsonp",
      url: url + "&format_options=callback:LamSearchTools.parseResponseAddress",
      //jsonpCallback: "LamStore.parseResponse",
      error: function (jqXHR, textStatus, errorThrown) {
        LamDispatcher.dispatch("hide-loader");
        lamDispatch({
          eventName: "log",
          message: "LamSearchTools: unable to complete response",
        });
      },
    });
  };

  let parseResponseAddress = function (data) {

    LamDispatcher.dispatch("hide-loader");
    lamDispatch("clear-layer-info");
    if (!data.features.length) {
      showSearchResults(LamTemplates.getResultEmpty());
      return;
    }
    console.log("parse");
    let isPoint = data.features[0].geometry.type.toLowerCase().indexOf("point") >= 0;
    let searchProviderAddressField = LamStore.getAppState().searchProviderAddressField;
    let searchProviderHouseNumberField = LamStore.getAppState().searchProviderHouseNumberField;
    var index = 0;
    data.features.forEach(function (feature) {
      feature.srid = LamMap.getSRIDfromCRSName(data.crs.properties.name);
      feature.tooltip = isPoint ? feature.properties[searchProviderHouseNumberField] : feature.properties[searchProviderAddressField];
      feature.index = index++;
    });
    //defining the right template based on geometry result type
    var template = isPoint
      ? LamTemplates.getTemplate(null, LamStore.getAppState().searchProviderHouseNumberTemplateUrl, LamStore.getAppState().templatesRepositoryUrl)
      : LamTemplates.getTemplate(null, LamStore.getAppState().searchProviderAddressTemplateUrl, LamStore.getAppState().templatesRepositoryUrl);
    let layerGid = isPoint ? LamStore.getAppState().searchProviderHouseNumberLayerGid : LamStore.getAppState().searchProviderAddressLayerGid;
    data.features.forEach(function (feature) {
      feature.layerGid = layerGid;
      feature.featureTemplate = template;
      if (feature.geometry.coordinates) feature.properties.lamCoordinates = feature.geometry.coordinates;
    });
    LamStore.getAppState().currentInfoItems = data;
    lamDispatch({
      eventName: "show-search-items",
      features: data,
      //template: template,
    });
    lamDispatch({
      eventName: "show-info-geometries",
      features: data,
    });
    return;
  };

  /**
   * Start the search in the WFS Geoserver Provider
   * @param {Object} ev key click event result
   */
  var doSearchLayers = function (ev) {
    if (ev.keyCode == 13) {
      $("#search-tools__search-layers").blur();
    }
    var itemStr = $("#search-tools__search-layers").val();
    //ricavo l'elenco dei layer da interrogare
    var currentLayer = $("#search-tools__select-layers option:selected").val();
    if (itemStr.length > 2) {
      showSearchResults("");
      let layer = searchLayers.filter(function (element) {
        return element.gid == currentLayer;
      })[0];
      var url = layer.mapUri;
      url =
        url.replace("/wms", "/") +
        "ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
        layer.layer +
        "&maxFeatures=50&outputFormat=text%2Fjavascript&cql_filter=[" +
        layer.searchField +
        "]ilike%27%25" +
        itemStr.trim() +
        "%25%27";
      let srid = layer.srid || LamStore.getAppState().srid;
      if (url.toLowerCase().indexOf("srsname") < 0 && srid) {
        url += "&srsName=EPSG:" + srid;
      }
      itemStr = itemStr.replace("'", " ");

      $.ajax({
        dataType: "jsonp",
        url: url + "&format_options=callback:LamSearchTools.parseResponseLayers",
        cache: false,
        error: function (jqXHR, textStatus, errorThrown) {
          LamDispatcher.dispatch("hide-loader");
          lamDispatch({
            eventName: "log",
            message: "LamSearchTools: unable to complete response",
          });
        },
      });
    }
  };

  let parseResponseLayers = function (data) {
    LamDispatcher.dispatch("hide-loader");
    var currentLayer = $("#search-tools__select-layers option:selected").val();
    let layer = searchLayers.filter(function (element) {
      return element.gid == currentLayer;
    })[0];
    console.log("parse");
    var index = 0;
    let template = LamTemplates.getTemplate(layer.gid, layer.templateUrl, LamStore.getAppState().templatesRepositoryUrl);
    data.features.forEach(function (feature) {
      feature.layerGid = layer.gid;
      feature.srid = LamMap.getSRIDfromCRSName(data.crs.properties.name);
      feature.tooltip = LamTemplates.getLabelFeature(feature.properties, layer.labelField, layer.layerName);
      feature.index = index++;
      feature.featureTemplate = template;
    });
    LamStore.getAppState().currentInfoItems = data;
    if (data.features.length > 0) {
      lamDispatch({
        eventName: "show-search-items",
        features: data,
      });
      lamDispatch({
        eventName: "show-info-geometries",
        features: data,
      });
    } else {
      var templateTemp = LamTemplates.getResultEmpty();
      var output = templateTemp();
      showSearchResults(output);
    }
    return;
  };

  /**
   * Show the search results in menu
   * @param {Object} featureInfoCollection GeoJson feature collection
   */
  let showSearchInfoFeatures = function (featureInfoCollection, template) {
    if (!featureInfoCollection) {
      showSearchResults(AppTemplates.getResultEmpty);
      return;
    }
    showSearchResults(LamTemplates.renderInfoFeatures(featureInfoCollection, template), LamTemplates.renderInfoFeaturesMobile(featureInfoCollection));
  };

  var selectLayer = function (layer) {
    $("#search-tools__select-layers").val(layer);
  };

  // var searchTermValid = function (search) {
  //   var invalidTerms = ["via", "viale", "vicolo", "piazza"];
  //   var addressTerms = search.split(" ");
  //   addressTerms = addressTerms.filter(function (element) {
  //     return addressTerms.includes(element.toLowerCase());
  //   });
  //   return addressTerms;
  // };

  var searchTermValid = function (search) {
    var invalidTerms = ["via", "viale", "vicolo", "piazza"];
    return !invalidTerms.includes(search.trim().toLowerCase());
  };

  return {
    render: render,
    init: init,
    doSearchAddress: doSearchAddress,
    doSearchLayers: doSearchLayers,
    parseResponseAddress: parseResponseAddress,
    parseResponseLayers: parseResponseLayers,
    resetSearch: resetSearch,
    searchAddressKeyup: searchAddressKeyup,
    searchLayersKeyup: searchLayersKeyup,
    selectLayer: selectLayer,
    showSearchInfoFeatures: showSearchInfoFeatures,
    showSearchAddress: showSearchAddress,
    showSearchLayers: showSearchLayers,
    showSearchResults: showSearchResults,
    //zoomToItemWFSGeoserver: zoomToItemWFSGeoserver,
    //zoomToItemLayer: zoomToItemLayer
  };
})();

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

let LamSelectTools = (function () {
  let isRendered = false;
  let selectLayers = [];
  let selectionResult = [];
  let currentSearchDate = new Date().getTime();
  let currentSelectCoordinates;
  let sortAttribute = null;
  let init = function init(layers) {
    selectLayers = layers;

    let divSelect = $("<div />", { id: "select-tools", class: "lam-panel-content-item" });
    $("#panel__content").append(divSelect);

    LamDispatcher.bind("show-select-tools", function (payload) {
      selectLayers = LamStore.getQueryLayers().filter(function (layer) {
        return layer.visible;
      });
      var $select = $("#select-tools__layers");
      $select.find("option").remove().end().append('<option value="">Seleziona layer...</option>');

      for (let index = 0; index < selectLayers.length; index++) {
        var o = $("<option/>", { value: selectLayers[index].gid }).text(selectLayers[index].layerName);
        o.appendTo($select);
      }

      LamToolbar.toggleToolbarItem("select-tools");

      if (LamToolbar.getCurrentToolbarItem() === "select-tools") {
        LamStore.setInfoClickEnabled(false);
        lamDispatch("set-select");
      } else {
        lamDispatch("unset-select");
        LamStore.setInfoClickEnabled(true);
      }
      lamDispatch("clear-layer-info");
    });

    LamDispatcher.bind("set-select", function (payload) {
      LamMap.removeSelectInteraction();
      LamMap.addSelectInteraction(payload.type);
    });

    LamDispatcher.bind("unset-select", function (payload) {
      LamMap.removeSelectInteraction();
      LamMap.clearLayerSelection();
      LamMap.clearLayerSelectionMask();
    });

    LamDispatcher.bind("start-selection-search", function (payload) {
      LamMap.clearLayerSelection();
      let coords = payload.coords;
      if (!coords) {
        coords = LamMap.getSelectionMask();
      }
      currentSelectCoordinates = coords;
      let layerName = payload.layerName;
      if (!layerName) {
        layerName = $("#select-tools__layers option:selected").val();
      }
      if (!layerName) {
        lamDispatch({
          eventName: "show-message",
          message: "Selezionare un layer tra quelli disponibili",
          type: "warning",
        });
        return;
      }
      LamSelectTools.doSelectionLayers(coords);
    });

    LamToolbar.addResetToolsEvent({
      eventName: "unset-select",
    });
  };

  let render = function () {
    let layers = LamStore.getQueryLayers().filter(function (layer) {
      return layer.visible;
    });

    if (!isRendered) {
      init(layers);
    }
    let templateTemp = templateSelect();
    let output = templateTemp();
    jQuery("#select-tools").html(output);
    //forzo che il contenuto non sia visualizzato
    $("#select-tools__content").hide();

    $("#select-tools__layers").on("change", function () {
      lamDispatch({
        eventName: "start-selection-search",
      });
    });

    try {
    } catch (e) {
    } finally {
    }

    isRendered = true;
  };

  let templateSelect = function () {
    let template = "";
    //pannello ricerca via
    template += '<h4 class="lam-title">Seleziona</h4>';
    template += '<div class="lam-card lam-depth-2 lam-full-height">';
    template += "<div class='mb-2'>";
    template += templateLayersInput(selectLayers);
    template += "</div>";
    return Handlebars.compile(template);
  };

  /**
   * General html code that will be injected in order to display the layer tools
   */
  let templateLayersInput = function (selectLayers) {
    let template = "";
    template += '<select id="select-tools__layers" class="lam-input">';
    template += '<option value="">Seleziona layer</option>';
    selectLayers.forEach(function (layer) {
      template += '<option value="' + layer.gid + '">' + layer.layerName + "</option>";
    });
    template += "</select>";
    template +=
      "<p>Seleziona uno tra i layer visibili e disegna un poligono sulla mappa. Esegui un doppio click per completare poligono e avviare la selezione.</p>";
    template += "<div><button class='lam-btn' onclick='LamSelectTools.reloadSelection();'>Ricarica</button></div>";
    template += "<div id='select-tools__results'></div>";

    return template;
  };

  /**
   * Display the list of the WFS Layers results in the left panel
   * @param {Object} results
   */
  // let templateSelectionResults = function (results) {
  //   template = '<div class="lam-grid lam-grid-1">';
  //   template += "{{#each this}}";
  //   template += '<div class="lam-col">';
  //   template += '<i class="lam-icon md-icon">&#xE55F;</i><a href="#" onclick="LamSelectTools.zoomToItem({{{lon}}}, {{{lat}}}, {{@index}}, true);return false">';
  //   template += "{{{display_name}}}";
  //   template += "</a>";
  //   template += "</div>";
  //   template += "{{/each}}";
  //   template += "</div>";

  //   template += "<button onclick='LamSelectTools.exportCSVFile();'>Esporta risultati</button>";

  //   return Handlebars.compile(template);
  // };

  let deleteFeatures = function () {
    lamDispatch({
      eventName: "delete-selection",
    });
  };

  /**
   * Start the selection on the specified layer
   * @param {Array} coords coordinate of the selected polygon
   */
  let doSelectionLayers = function (coords) {
    if (!coords) return;
    let layer = getCurrentSelectLayer();
    if (Array.isArray(coords)) coords = coords[0];
    let coordsString = coords
      .map(function (coord) {
        return coord[0] + " " + coord[1];
      })
      .join(",");
    let cql = "INTERSECTS(" + LamStore.getLayerGeometryFieldName(layer.gid) + ", SRID=4326;Polygon((" + coordsString + ")))";

    jQuery("#select-tools__results").html("");
    let url = layer.mapUri;
    url =
      url.replace("/wms", "/") +
      "ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
      layer.layer +
      "&maxFeatures=9999999&outputFormat=text%2Fjavascript&cql_filter=" +
      cql;

    $.ajax({
      dataType: "jsonp",
      url: url + "&format_options=callback:LamSelectTools.parseResponseSelect&srsName=EPSG:4326",
      cache: false,
      jsonp: true,
      error: function (jqXHR, textStatus, errorThrown) {
        // lamDispatch({
        //   eventName: "log",
        //   message: "LamSelectTools: unable to complete response",
        // });
      },
    });
  };

  let parseResponseSelect = function (data) {
    lamDispatch("hide-loader");
    //verifica che la ricerca sia ancora valida
    let searchDate = new Date().getTime();
    if (currentSearchDate > searchDate) {
      return;
    }
    let layer = getCurrentSelectLayer();
    if (!data.features.length) {
      jQuery("#select-tools__results").html(LamTemplates.getResultEmpty());
      return;
    }
    if (data.features.length > 0) {
      parseSelectTable(data);
      for (let i = 0; i < data.features.length; i++) {
        data.features[i].layerGid = layer.gid;
        data.features[i].srid = 4326;
      }

      for (let i = 0; i < data.features.length; i++) {
        //aggiungo la feature alla mappa
        LamStore.getAppState().currentInfoItems = data;
        selectionResult = data;
        LamMap.addFeatureSelectionToMap(data.features[i], data.crs, layer.gid);
      }
    }
  };

  let parseSelectTable = function (data) {
    let layer = getCurrentSelectLayer();
    currentFeatureCount = data.totalFeatures;
    if (data.features) {
      data = data.features;
    }
    if (!Array.isArray(data)) data = [data];
    let propsList = [];
    for (let i = 0; i < data.length; i++) {
      let props = data[i].properties ? data[i].properties : data[i];
      propsList.push(props);
    }
    let template = LamTemplates.getTemplate(layer.gid, layer.templateUrl, LamStore.getAppState().templatesRepositoryUrl);
    let tableTemplate = template ? LamSelectTools.getSelectTemplate(template, layer) : LamTemplates.standardTableTemplate(propsList[0], layer);
    let title = layer.layerName;
    let body = "";
    let compiledTemplate = Handlebars.compile(tableTemplate);
    body += compiledTemplate(propsList);
    LamDom.showContent(LamEnums.showContentMode().InfoWindow, title, body);
  };

  let getCurrentSelectLayerGid = function () {
    return $("#select-tools__layers option:selected").val();
  };
  let getCurrentSelectLayer = function () {
    let layers = selectLayers.filter(function (layer) {
      return layer.gid == getCurrentSelectLayerGid();
    });
    if (layers.length == 0) {
      lamDispatch({ eventName: "log", message: "Layer " + getCurrentSelectLayerGid() + "non valido" });
      return;
    }
    return layers[0];
  };

  let getSelectTemplate = function (template, layer) {
    //sezione relations
    let layerRelations = LamTemplates.getLayerRelations(layer.gid);
    //sezione charts
    let layerCharts = LamTemplates.getLayerCharts(layer.gid);

    let attribute = LamTables.getNormalizedSortAttribute();
    let str = "<table class='lam-table'>";
    str += "<tr>";
    str += "<th></th>";

    if (layerRelations.length) {
      str += "<th>Relazioni</th>";
    }
    if (layerCharts.length) {
      str += "<th>Grafici</th>";
    }

    for (let i = 0; i < template.fields.length; i++) {
      str += "<th class='" + (template.fields[i].field === attribute ? " lam-sorted " : "") + "' >";
      str +=
        "<i class='lam-link-blue lam-pointer ' onclick=\"lamDispatch({ eventName: 'render-relation-table', sortBy: '" +
        (template.fields[i].field === sortAttribute ? template.fields[i].field + " DESC" : template.fields[i].field) +
        "'  }); return false;\">";
      str += template.fields[i].field === attribute && !sortAttributeIsDescending(sortAttribute) ? LamResources.svgExpandLess16 : LamResources.svgExpandMore16;
      str += "</i></a>";
      str += (!template.fields[i].header ? template.fields[i].label : template.fields[i].header) + "</th>";
    }

    str += "</tr>";
    //feature
    str += "{{#each this}}<tr>";
    str += "<td>";
    str +=
      "<div class='lam-feature__icons'>" +
      '<i title="Centra sulla mappa" class="lam-feature__icon" onclick="LamDispatcher.dispatch({ eventName: \'zoom-info-feature\', index: \'' +
      "{{@index}}" +
      "' })\">" +
      LamResources.svgMarker +
      "</i></div>";
    str += "</td>";
    if (layerRelations.length) {
      str += "<td><a class='lam-link-blue lam-pointer' onclick='LamSelectTools.toggle(this)'>Relazioni</a><div class='lam-hidden'>";
      if (layerRelations.length) str += LamTemplates.relationsTemplate(layerRelations, null, null);
      str += "</div></td>";
    }
    if (layerCharts.length) {
      str += "<td><a class='lam-link-blue lam-pointer' onclick='LamSelectTools.toggle(this)'>Grafici</a><div class='lam-hidden'>";
      if (layerCharts.length) str += LamTemplates.chartsTemplate(layerCharts, null);
      str += "</div></td>";
    }

    for (let i = 0; i < template.fields.length; i++) {
      str += LamTemplates.getFieldTemplate(template.fields[i]);
    }

    str += "</tr>{{/each}}";
    str += "</table>";
    str +=
      "<div class='lam-mt-1'><button class='lam-btn lam-right lam-depth-1' onclick='LamSelectTools.exportCSVFile();'><i class='lam-icon'>" +
      LamResources.svgDownload16 +
      "</i> Esporta risultati</button></div>";
    return str;
  };

  /**
   * Zoom the map to the lon-lat given and show the infobox of the given item index
   * @param {float} lon
   * @param {float} lat
   * @param {int} index Item's index in the result array
   * @param {boolean} showInfo
   */
  // var zoomToItem = function (lon, lat, index, showInfo) {
  //   if (selectionResult[index]) {
  //     lamDispatch({
  //       eventName: "zoom-geometry",
  //       geometry: selectionResult[index].item.geometry,
  //     });
  //     if (showInfo) {
  //       lamDispatch({
  //         eventName: "show-info-items",
  //         features: selectionResult[index].item,
  //       });
  //     }
  //     let payload = {
  //       eventName: "add-geometry-info-map",
  //       geometry: selectionResult[index].item.geometry,
  //     };
  //     try {
  //       payload.srid = selectionResult[index].item.crs;
  //     } catch (e) {
  //       payload.srid = null;
  //     }
  //     lamDispatch(payload);
  //     lamDispatch("hide-menu-mobile");
  //   } else {
  //     lamDispatch({
  //       eventName: "zoom-lon-lat",
  //       zoom: 18,
  //       lon: parseFloat(lon),
  //       lat: parseFloat(lat),
  //       eventName: "add-wkt-info-map",
  //       wkt: "POINT(" + lon + " " + lat + ")",
  //     });
  //     lamDispatch("hide-menu-mobile");
  //   }
  // };

  // function sortByDisplayName(a, b) {
  //   var aName = a.display_name.toLowerCase();
  //   var bName = b.display_name.toLowerCase();
  //   return aName < bName ? -1 : aName > bName ? 1 : 0;
  // }

  let exportCSVFile = function () {
    let layer = getCurrentSelectLayer();
    let template = LamTemplates.getTemplate(layer.gid, layer.templateUrl, LamStore.getAppState().templatesRepositoryUrl);
    let fileName = "esportazione.csv";
    var jsonObject = JSON.stringify(
      selectionResult.features.map(function (element) {
        return element.properties;
      })
    );
    LamDownloadTools.downloadCSVFile(fileName, jsonObject, template);
  };

  let toggle = function (e) {
    $(e).next().toggle();
  };

  let reloadSelection = function () {
    lamDispatch({
      eventName: "start-selection-search",
      coords: currentSelectCoordinates,
    });
  };

  return {
    deleteFeatures: deleteFeatures,
    doSelectionLayers: doSelectionLayers,
    exportCSVFile: exportCSVFile,
    getCurrentSelectLayerGid: getCurrentSelectLayerGid,
    getCurrentSelectLayer: getCurrentSelectLayer,
    getSelectTemplate: getSelectTemplate,
    init: init,
    parseResponseSelect: parseResponseSelect,
    render: render,
    reloadSelection: reloadSelection,
    templateSelect: templateSelect,
    //zoomToItem: zoomToItem,
    toggle: toggle,
  };
})();

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

let LamLinksTools = (function () {
  let isRendered = false;

  let init = function init() {
    //loading remote relations
    LamStore.loadRemoteLinks();
    //events binding
    LamDispatcher.bind("show-links-toggle", function (payload) {
      //if legend is visible toggle
      if ($("#lam-links-container").is(":visible")) {
        LamToolbar.toggleToolbarItem("links", false);
        return;
      }
      payload.eventName = "show-links";
      LamDispatcher.dispatch(payload);
    });

    LamDispatcher.bind("show-links", function (payload) {
      let templateTemp = templateLink();
      let output = "<div id='lam-links-container'>";
      output += "<ul class='lam-group-list lam-no-padding'>";
      LamStore.getLinks().forEach(function (link) {
        output += "<li>";
        if (link.links && link.links.length) {
          //is grouped
          output += renderGroupLink(link);
        } else {
          output += templateTemp(link);
        }
        output += "</li>";
      });
      output += "</ul>";
      output += "</div>";
      if (LamStore.getAppState().openLinksInInfoWindow) {
        LamDom.showContent(LamEnums.showContentMode().InfoWindow, "Links", output, "", "links");
      } else {
        LamDom.showContent(LamEnums.showContentMode().LeftPanel, "Links", output, "", "links");
      }
    });

    //terms links load
    let templateTerms = templateTermsLinks();
    output = templateTerms(LamStore.getTermsLinks());
    $("#app-terms-links").html(output);
  };

  let render = function (div) {
    if (!isRendered) {
      init();
    }
    isRendered = true;
  };

  let renderGroupLink = function (link) {
    let templateTemp = templateLink();
    let output = "";
    if (link.title) {
      output += "<h5 class='lam-group-list__sub-title'>";
      if (link.url) {
        output += "<a class='lam-link' href='" + link.url + "'>" + link.title + "</a>";
      } else {
        output += link.title;
      }
      output += "</h5>";
    }
    output += "<ul class='lam-group-list'>";
    link.links.forEach(function (subLink) {
      output += "<li>";
      if (subLink.links && subLink.links.length) {
        //is grouped
        output += renderGroupLink(subLink);
      } else {
        output += templateTemp(subLink);
      }
      output += "</li>";
    });
    output += "</ul>";
    return output;
  };

  let templateLink = function () {
    let template = "<a class='lam-link' href='{{url}}' target='_blank'>{{title}} <i class='lam-feature__icon'>" + LamResources.svgOpen16 + "</i></a>";
    return Handlebars.compile(template);
  };

  let templateTermsLinks = function () {
    //pannello ricerca via
    let template = "{{#each this}}";
    template += "<a class='lam-link' href='{{url}}' target='_blank'>{{title}}</a>";
    template += "{{/each}}";

    return Handlebars.compile(template);
  };

  return {
    init: init,
    render: render,
    templateLink: templateLink,
    templateTermsLinks: templateTermsLinks,
  };
})();

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

var LamLegendTools = (function () {
  var isRendered = false;
  var currentLegendPayload = false;

  var init = function init() {
    //events binding
    LamDispatcher.bind("show-legend", function (payload) {
      currentLegendPayload = payload;
      LamLegendTools.showLegend(payload.gid, payload.scaled, payload.showInfoWindow || LamStore.getAppState().openLegendInInfoWindow);
    });

    /**
     * Helper event to open legend for all layers at the current scale
     */
    LamDispatcher.bind("show-legend-visible-layers", function (payload) {
      currentLegendPayload = payload;
      let layers = LamStore.getVisibleLayers();
      LamLegendTools.showLegendLayers(layers, true, payload.showInfoWindow || LamStore.getAppState().openLegendInInfoWindow);
    });

    /**
     * Helper event to open legend for all layers at the current scale that toggles the main menu
     *
     */
    LamDispatcher.bind("show-legend-visible-layers-toggle", function (payload) {
      //if legend is visible toggle
      if ($("#lam-legend-container").is(":visible")) {
        LamToolbar.toggleToolbarItem("legend", false);
        return;
      }
      //else show legend
      payload.eventName = "show-legend-visible-layers"; //toggle once
      currentLegendPayload = payload;
      let layers = LamStore.getVisibleLayers();
      LamLegendTools.showLegendLayers(layers, true, payload.showInfoWindow || LamStore.getAppState().openLegendInInfoWindow);
    });

    /**
     * Helper event to open legend for all layers with scale parameter
     */
    LamDispatcher.bind("show-full-legend-visible-layers", function (payload) {
      currentLegendPayload = payload;
      let layers = LamStore.getVisibleLayers();
      LamLegendTools.showLegendLayers(layers, payload.scaled, payload.showInfoWindow || LamStore.getAppState().openLegendInInfoWindow);
    });

    LamDispatcher.bind("update-legend", function () {
      LamLegendTools.updateLegend();
    });

    //laoding legend on map init based on appstate
    if (LamStore.getAppState().showLegendOnLoad) {
      LamDispatcher.dispatch({
        eventName: "show-full-legend-visible-layers",
        showInfoWindow: LamStore.getAppState().openLegendInInfoWindow,
        scaled: true,
      });
    }

    //adding zoom-end event for automatic legend updates
    LamMap.addZoomEndEvent({
      eventName: "update-legend",
    });
  };

  var render = function (div) {
    if (!isRendered) {
      init();
    }
    isRendered = true;
  };

  var showLegend = function (gid, scaled, showInfoWindow) {
    var thisLayer = LamStore.getLayer(gid);
    let isGropuLayerGeoserver = false;
    if (thisLayer.groupTemplateUrls) isGropuLayerGeoserver = thisLayer.groupTemplateUrls.length > 0;
    $("#lam-legend-container").remove();
    var html = "<div id='lam-legend-container'>";
    if (thisLayer) html += "<h4 class='lam-title-legend'>" + thisLayer.layerName + "</h4>";
    var urlImg = "";
    //checking custom url
    if (!thisLayer.hideLegend && !thisLayer.hideLegendImage) {
      if (thisLayer.legendUrl) {
        urlImg = thisLayer.legendUrl;
      } else {
        urlImg = LamMap.getLegendUrl(gid, scaled);
      }
      if (urlImg) {
        html += "<img class='lam-legend' src='" + urlImg + "' />";
      }
    }
    if (thisLayer.layerDescription) {
      html += "<div class='lam-layer-description'>" + thisLayer.layerDescription + "</div>";
    }
    html += "<div class='lam-layer-metadata'></div>";
    showLayerMetadata(thisLayer);
    if (thisLayer.attribution) {
      html += "<p>Dati forniti da " + thisLayer.attribution + "</p>";
    }
    if (!thisLayer.hideLegend && !thisLayer.hideLegendImage && !thisLayer.legendUrl) {
      if (scaled) {
        html +=
          "<div class='lam-mt-2' style='display:flow-root;'><a href='#' class='lam-btn lam-depth-1' onclick=\"LamDispatcher.dispatch({ eventName: 'show-legend', gid: '" +
          gid +
          "', scaled: false })\">Visualizza legenda completa</a></div>";
      }
    }

    if (thisLayer.legendUrl) {
      html +=
        "<div class='lam-mt-2' style='display:flow-root;'><a href='" + thisLayer.legendUrl + "' target='_blank' class='lam-btn lam-depth-1'>Visualizza legenda</a></div>";
    }

    if (thisLayer.queryable && !isGropuLayerGeoserver) {
      html += "<div class='lam-mt-2' style='display:flow-root;'>";
      //open attribute table
      html += "<a href='#' target='_blank' class='lam-btn lam-btn-small lam-depth-1' ";
      html +=
        "onclick=\"lamDispatch({ eventName: 'show-attribute-table', sortBy: 'OGR_FID', gid: '" +
        thisLayer.gid +
        "'  }); return false;\"><i class='lam-icon'>" +
        LamResources.svgTable16 +
        "</i> Apri tabella</a>";
      //open xslx
      var layerUrl = LamMap.getWFSUrlfromLayer(thisLayer, "excel2007");
      html +=
        "<a href='" +
        layerUrl +
        "' target='_blank' class='lam-btn lam-btn-small lam-depth-1'><i class='lam-icon'>" +
        LamResources.svgDownload16 +
        "</i> XSLX</a>";
      //open shp
      layerUrl = LamMap.getWFSUrlfromLayer(thisLayer);
      html +=
        " <a href='" +
        layerUrl +
        "' target='_blank' class='lam-btn lam-btn-small lam-depth-1'><i class='lam-icon'>" +
        LamResources.svgDownload16 +
        "</i> SHP</a></div>";
    }

    html += "<div class='lam-mt-2 lam-mb-2' style='display:flow-root;'>";
    html += "<div class='lam-slidecontainer'>";
    html += "Trasparenza del layer <br />";
    var layerOpacity = thisLayer.opacity * 100;
    html += "<input type='range' id='lam-layer-opacity' min='0' max='100' value='" + layerOpacity + "' class='lam-slider'>";
    html += "</div>";
    html += "</div>";

    html += "<div>";
    let layerCharts = LamCharts.getCharts().filter(function (chart) {
      return $.inArray(gid, chart.layerGids) >= 0 && chart.target == 1;
    });
    if (layerCharts.length) html += LamTemplates.chartsTemplateButton(layerCharts);

    if (showInfoWindow) {
      LamDom.showContent(LamEnums.showContentMode().InfoWindow, "Informazioni", html, "", "legend");
    } else {
      LamDom.showContent(LamEnums.showContentMode().LeftPanel, "Informazioni", html, "", "legend");
    }

    //bind degli oggetti
    $("#lam-layer-opacity").change(function (e) {
      thisLayer.opacity = parseFloat($("#lam-layer-opacity").val() / 100);
      LamMap.setLayerOpacity(gid, thisLayer.opacity);
    });
    return true;
  };

  var showLegendLayers = function (layers, scaled, showInfoWindow) {
    let html = $("<div />", {
      id: "lam-legend-container",
    });
    layers.forEach(function (layer) {
      if (!layer.hideLegend && layer.layerType != "group") {
        if (layer.legendUrl) {
          urlImg = layer.legendUrl;
        } else {
          urlImg = LamMap.getLegendUrl(layer.gid, scaled);
        }
        if (urlImg) {
          let img = $("<img />")
            .addClass("lam-legend")
            .attr("src", urlImg)
            .on("error", function () {
              $("#legend_" + layer.gid).addClass("lam-hidden");
            });
          let container = $("<div id='legend_" + layer.gid + "' />").addClass("lam-legend-container");
          container.append($("<h4>" + layer.layerName + "</h4>").addClass("lam-title-legend"));
          container.append(img);
          if (layer.layerDescription) {
            let divDescription = $("<div />").addClass("lam-layer-description").text(layer.layerDescription);
            container.append(divDescription);
          }
          html.append(container);
        }
      }
    });
    let title = "Legenda dei layer attivi";
    if (html.html() === "") html.append("Per visualizzare la legenda rendi visibile uno o più layer.");
    if (showInfoWindow) {
      LamDom.showContent(LamEnums.showContentMode().InfoWindow, title, $("<div>").append(html.clone()).html(), "", "legend");
    } else {
      LamDom.showContent(LamEnums.showContentMode().LeftPanel, title, $("<div>").append(html.clone()).html(), "", "legend");
    }
  };

  let loadImage = function (imageSrc, success, error) {
    var img = new Image();
    img.onload = success;
    img.onerror = error;
    img.src = imageSrc;
  };

  var showLayerMetadata = function (layer) {
    if (!LamStore.getAppState().metaDataServiceUrlTemplate) return;
    var templateUrl = Handlebars.compile(LamStore.getAppState().metaDataServiceUrlTemplate);
    var urlService = templateUrl(layer);
    $.ajax({
      dataType: "jsonp",
      url: urlService + "&format_options=callback:LamLegendTools.parseResponseMetadata",
      jsonp: true,
      cache: false,
      error: function (jqXHR, textStatus, errorThrown) {
        lamDispatch({
          eventName: "log",
          message: "LamLegend: unable to complete response",
        });
        lamDispatch("hide-loader");
      },
    });
  };

  let parseResponseMetadata = function (data) {
    if (!data.features.length) return;
    var template = !LamStore.getAppState().metaDataTemplate ? LamTemplates.getTemplateMetadata() : Handlebars.compile(LamStore.getAppState().metaDataTemplate);
    var html = template(data.features[0].properties);
    html = formatMetadata(html);
    $(".lam-layer-metadata").html(html);
  };

  let formatMetadata = function (html) {
    //newline to br
    html = html.replace(/(?:\r\n|\r|\n)/g, "<br>");
    //sostituzione dei link
    html = replaceLinks(html);
    //replace delle stringhe
    if (LamStore.getAppState().metaDataReplacementStrings) {
      let strings = LamStore.getAppState().metaDataReplacementStrings;
      strings.forEach(function (element) {
        html = html.replace(new RegExp(element[0], "gi"), element[1]);
      });
    }
    return html;
  };

  let updateLegend = function () {
    if ($("#lam-legend-container").is(":visible")) {
      LamDispatcher.dispatch(currentLegendPayload);
    }
  };

  let replaceLinks = function (text) {
    return (text || "").replace(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi, function (match, space, url) {
      var hyperlink = url;
      if (!hyperlink.match("^https?://")) {
        hyperlink = "http://" + hyperlink;
      }
      return space + '<a href="' + hyperlink + '">' + url + "</a>";
    });
  };

  return {
    formatMetadata: formatMetadata,
    init: init,
    parseResponseMetadata: parseResponseMetadata,
    render: render,
    showLegend: showLegend,
    showLegendLayers: showLegendLayers,
    updateLegend: updateLegend,
  };
})();

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

var LamDownloadTools = (function () {
  var isRendered = false;

  var init = function init() {
    //events binding
    LamDispatcher.bind("download-relation-results", function (payload) {
      LamDownloadTools.downloadRelationResults();
    });
  };

  var render = function (div) {
    if (!isRendered) {
      init();
    }
    isRendered = true;
  };

  let downloadRelationResults = function () {
    var results = LamRelations.getRelationResults();
    if (!results.data || !results.template) return;
    let propsList = [];
    var csv = "";
    for (let i = 0; i < results.data.length; i++) {
      propsList.push(results.data[i].properties ? results.data[i].properties : results.data[i]);
    }
    results.template.fields.forEach(function (field) {
      csv += '"' + field.label + '";';
    });
    csv += "\n";
    propsList.forEach(function (row) {
      results.template.fields.forEach(function (field) {
        csv += '"' + row[field.field] + '";';
      });
      csv += "\n";
    });

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = results.template.title + ".csv";
    hiddenElement.click();
  };

  let convertToCSV = function (objArray, template) {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "";

    template.fields.forEach(function (field) {
      str += '"' + field.label + '";';
    });
    str += "\n";

    array.forEach(function (row) {
      template.fields.forEach(function (field) {
        str += '"' + row[field.field] + '";';
      });
      str += "\r\n";
    });
    return str;
  };

  let downloadCSVFile = function (fileName, jsonObject, template) {
    var csv = LamDownloadTools.convertToCSV(jsonObject, template);
    var exportedFilenmae = fileName + ".csv";
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, exportedFilenmae); // IE 10+
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilenmae);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return {
    init: init,
    convertToCSV: convertToCSV,
    downloadCSVFile: downloadCSVFile,
    render: render,
    downloadRelationResults: downloadRelationResults,
  };
})();

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

var LamShareTools = (function () {
  var isRendered = false;

  var init = function init() {
    //events binding
    LamDispatcher.bind("create-share-url", function (payload) {
      LamShareTools.createShareUrl();
    });

    LamDispatcher.bind("show-share-url-query", function (payload) {
      LamShareTools.createShareUrl();
      LamShareTools.setShareUrlQuery(LamShareTools.writeUrlShare());
    });

    LamDispatcher.bind("show-share", function (payload) {
      LamToolbar.toggleToolbarItem("share-tools");
      lamDispatch("clear-layer-info");
    });

    LamDispatcher.bind("update-share", function () {
      LamShareTools.hideUrl();
      LamShareTools.setShareUrlQuery(LamShareTools.writeUrlShare());
    });

    //Adding event to map move-end
    LamMap.addMoveEndEvent({
      eventName: "update-share",
    });
  };

  var render = function (div) {
    if (!LamStore.getAppState().modules["share-tools"]) return;
    var templateTemp = templateShare();
    var output = templateTemp();
    jQuery("#" + div).html(output);
    if (!isRendered) {
      init();
    }
    //forzo che il contenuto non sia visualizzato
    $("#share-tools__content").hide();
    isRendered = true;
    lamDispatch("show-share-url-query");
  };

  var templateShare = function () {
    template = "";
    //pannello ricerca via
    template += '<h4 class="lam-title">Condividi</h4>';
    template += '<div class="lam-card lam-depth-2">';

    //template += 'Crea link da condividere con i tuoi colleghi';
    template += '<h5 class="lam-title-h4">Link breve</h5>';
    template += "<p class='lam-mt-2 lam-mb-2'>Il link breve condivide la posizione e i layer attivi.</p>";

    template += '<input type="text" class="lam-input" id="share-tools__input-query"/>';
    template += '<div class="div-20"></div>';

    template += '<div class="lam-grid">';
    template += '<div class="lam-col"></div>';
    template += '<div class="lam-col"></div>';
    template += '<div class="lam-col "><a id="share-tools__url-query" target="_blank" class="lam-btn lam-btn-small">Apri</a></div>';
    template += '<div class="lam-col"><a id="share-tools__copy-url-query" class="lam-btn lam-btn-small fake-link" target="_blank" >Copia</a></div>';
    template += "</div>";

    template += '<div class="div-20"></div>';
    template += "<div id='share-tools__create_tool' class='";
    if (!LamStore.getAppState().modules["share-tools-create-url"]) {
      template += " lam-hidden ";
    }
    template += "'>";
    template += '<h4 class="lam-title-h4">Mappa</h4>';
    template += "<p class='lam-mt-2 lam-mb-2'>La mappa condivide la posizione, i layer attivi e i tuoi disegni.</p>";
    //template += 'Crea link da condividere con i tuoi colleghi';
    template += '<button id="share-tools__create-url" onclick="LamShareTools.createUrl(); return false;" class="lam-btn">Crea mappa</button>';

    template += '<div id="share-tools__content" class="lam-hidden">';
    template += '<input type="text" class="lam-input" id="share-tools__input-url"/>';
    template += '<div class="div-20"></div>';

    template += '<div class="lam-grid">';
    template += '<div class="lam-col"></div>';
    template += '<div class="lam-col"></div>';
    template += '<div class="lam-col"><a id="share-tools__url" target="_blank" >Apri</a></div>';
    template += '<div class="lam-col"><a id="share-tools__copy-url" class="fake-link" target="_blank" >Copia</a></div>';
    template += "</div>";
    template += "</div>";

    template += '<div class="div-10"></div>';

    template += "</div>";

    return Handlebars.compile(template);
  };

  /**
   * Chiama il disptcher per creare l'url di condivisione
   * @return {null} la funzione non restituisce valori
   */
  var createUrl = function () {
    LamDispatcher.dispatch("create-share-url");
  };

  /**
   * Visualizza l'url da condividere
   * @param  {string} appStateId Link da visualizzare per copia o condivisione
   * @param  {url} appStateId url opzionale dell'appstate
   * @return {null}  la funzione non restituisce valori
   */
  var displayUrl = function (appStateId, url) {
    ////ricavo lurl di base
    var urlArray = location.href.split("?");
    var baseUrl = urlArray[0].replace("#", "");
    var shareLink = baseUrl + "?appstate=" + appStateId;

    //$("#share-tools__url").text(shareLink);
    $("#share-tools__url").attr("href", shareLink);
    $("#share-tools__input-url").val(shareLink);

    var clipboard = new ClipboardJS("#share-tools__copy-url", {
      text: function (trigger) {
        return shareLink;
      },
    });

    //$("#share-tools__email-url").click(function() {
    //  window.location.href = "mailto:user@example.com?subject=Condivisione mappa&body=" + shareLink;
    //});

    $("#share-tools__content").show();
  };

  /**
   * Nasconde i link
   * @return {null} la funzione non restituisce valori
   */
  var hideUrl = function () {
    $("#share-tools__content").hide();
  };

  var setShareUrlQuery = function (shareLink) {
    $("#share-tools__input-query").val(shareLink);
    $("#share-tools__url-query").attr("href", shareLink);

    var clipboard = new ClipboardJS("#share-tools__copy-url-query", {
      text: function (trigger) {
        return shareLink;
      },
    });
  };

  var createShareUrl = function () {
    let appState = LamStore.getAppState();

    //invio una copia dell'appstate con gli attuali valori che sarà saòvato per la condivisione
    var centerMap = LamMap.getMapCenter();
    centerMap = ol.proj.transform([centerMap[0], centerMap[1]], "EPSG:3857", "EPSG:4326");

    appState.mapLon = centerMap[0];
    appState.mapLat = centerMap[1];
    appState.mapZoom = LamMap.getMapZoom();
    appState.drawFeatures = LamMap.getDrawFeature();

    //invio la richiesta
    $.post(appState.restAPIUrl + "/api/share/", {
      appstate: JSON.stringify(appState),
    })
      .done(function (data) {
        var url = data.Url;
        var appStateId = data.AppStateId;
        LamShareTools.displayUrl(appStateId, url);
      })
      .fail(function (err) {
        lamDispatch({
          eventName: "log",
          message: "LamStore: create-share-url " + err,
        });
      });
  };

  /**
   * Genera l'url da copiare per visualizzare lo stato dell'applicazione solo tramite querystring
   * @return {null} Nessun valore restituito
   */
  var writeUrlShare = function () {
    let appState = LamStore.getAppState();
    //posizione
    var qPos = "";
    var center = LamMap.getMapCenterLonLat();
    qPos += "lon=" + center[0] + "&lat=" + center[1];
    qPos += "&zoom=" + LamMap.getMapZoom();
    //layers
    var qLayers = "";
    for (var i = 0; i < appState.layers.length; i++) {
      qLayers += appState.layers[i].gid + ":" + parseInt(appState.layers[i].visible) + ",";
      if (appState.layers[i].layers) {
        for (var ki = 0; ki < appState.layers[i].layers.length; ki++) {
          qLayers += appState.layers[i].layers[ki].gid + ":" + parseInt(appState.layers[i].layers[ki].visible) + ",";
        }
      }
    }
    var url = window.location.href;
    var arrUrl = url.split("?");
    return arrUrl[0] + "?" + qPos + "&layers=" + qLayers;
  };

  return {
    createShareUrl: createShareUrl,
    createUrl: createUrl,
    displayUrl: displayUrl,
    hideUrl: hideUrl,
    init: init,
    render: render,
    setShareUrlQuery: setShareUrlQuery,
    templateShare: templateShare,
    writeUrlShare: writeUrlShare,
  };
})();

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

//definizione e inizializzazione del LamDispatcher
var LamDispatcher = (function () {
  var init = function functionName() {
    this.bind("log", function (payload) {
      console.log("log", payload);
    });

    this.bind("show-menu", function (payload) {
      LamToolbar.showMenu();
    });

    this.bind("hide-menu", function (payload) {
      LamToolbar.hideMenu();
    });

    this.bind("reset-tools", function (payload) {
      LamToolbar.resetTools();
    });

    this.bind("hide-menu-mobile", function (payload) {
      if (LamDom.isMobile()) {
        LamStore.hideMenu();
      }
    });

    this.bind("live-reload", function (payload) {
      LamStore.liveReload(payload.appState);
    });

    this.bind("zoom-lon-lat", function (payload) {
      LamMap.goToLonLat(payload.lon, payload.lat, payload.zoom);
    });

    this.bind("zoom-geometry", function (payload) {
      let geometryOl = LamMap.convertGeometryToOl(payload.geometry, LamEnums.geometryFormats().GeoJson);
      LamMap.goToGeometry(geometryOl, payload.srid);
    });

    // this.bind("add-wkt-info-map", function(payload) {
    //   LamMapInfo.addWktInfoToMap(payload.wkt);
    // });

    /**
     * {string} paylod.gid Layer Gid
     */
    this.bind("toggle-layer", function (payload) {
      LamMap.toggleLayer(payload.gid);
      LamStore.toggleLayer(payload.gid);
      LamLayerTree.updateCheckBoxesStates(LamStore.getAppState().layers);
    });

    this.bind("toggle-layer-group", function (payload) {
      LamStore.toggleLayersInGroup(payload.gid);
      LamLayerTree.updateCheckBoxesStates(LamStore.getAppState().layers);
    });

    this.bind("set-layer-visibility", function (payload) {
      LamMap.setLayerVisibility(payload.gid, payload.visibility);
      LamStore.setLayerVisibility(payload.gid, payload.visibility);
    });

    this.bind("reset-layers", function (payload) {
      LamStore.resetInitialLayers();
    });

    this.bind("map-click", function (payload) {
      LamMapTools.addCoordinate(payload.lon, payload.lat);
    });

    this.bind("init-map-app", function (payload) {
      LamInit(payload.mapDiv, payload.appStateUrl, payload.mapTemplateUrl);
    });

    this.bind("map-move-end", function (payload) {
      LamMap.getMoveEndEvents().forEach((element) => {
        LamDispatcher.dispatch(element);
      });
    });

    this.bind("map-zoom-end", function (payload) {
      LamMap.getZoomEndEvents().forEach((element) => {
        LamDispatcher.dispatch(element);
      });
    });

    this.bind("map-zoom-in", function (payload) {
      LamMap.zoomIn();
    });

    this.bind("map-zoom-out", function (payload) {
      LamMap.zoomOut();
    });

    this.bind("map-browser-location", function (payload) {
      LamMap.goToBrowserLocation();
    });

    this.bind("do-login", function (payload) {
      LamStore.doLogin(payload.username, payload.password);
    });

    this.bind("open-url-location", function (payload) {
      LamStore.openUrlTemplate(payload.urlTemplate);
    });

    this.bind("log", function (payload) {
      if (console) {
        console.log(payload.str);
      }
      if (payload.showAlert) {
        alert(payload.str);
      }
    });

    this.bind("show-message", function (payload) {
      LamAlerts.showMessage(payload.title, payload.message, payload.type, { timeout: 3000 });
    });
  };

  var dispatch = function lamDispatch(payload) {
    if (typeof payload == "string") {
      payload = {
        eventName: payload,
      };
    }
    LamDispatcher.trigger(payload.eventName, payload);
  };

  return {
    dispatch: dispatch,
    init: init,
  };
})();

MicroEvent.mixin(LamDispatcher);
LamDispatcher.init();

var LamResources = {
  risultati_non_trovati: "Non sono stati trovati risultati",
  //TODO esportare in una librria o template esterno
  svgMarker:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
  svgGoogle:
    '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"></path></svg>',
  svgStreetView:
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  width="24" height="24"  viewBox="0 0 28 28"> <g><path d="m 23.077,21.154 c 0,2.642 -5.450542,4.287023 -10.544542,4.287023 C 7.4384577,25.441023 1.923,23.796 1.923,21.154 c 0,-2.033 3.025,-2.992 5.562,-3.439 0.7237272,0.475051 0.3390671,1.823506 0.334,1.895 -3.06,0.537 -3.924,1.379 -3.974,1.559 0.147,0.504 3.032,1.908 8.655,1.908 5.623,0 8.508,-1.404 8.656,-1.938 -0.051,-0.15 -0.92,-0.997 -4.002,-1.533 -0.523,-0.091 -0.091,0.523 0,0 -0.330951,-0.889519 -0.201,-1.984 0.331,-1.895 2.551,0.445 5.592,1.402 5.592,3.443 z M 8.654,15.385 h 0.961 v 5.769 c 0,0.53 0.496935,1.249908 1.026915,1.255015 l 3.813543,0.03675 C 14.985439,22.450875 15.385,21.683 15.385,21.154 v -5.769 h 0.961 c 0.53,0 0.962,-0.432 0.962,-0.962 V 8.654 C 17.308,8.162 16.536,7.082 15.196,6.926 14.646,6.821 13.585,6.746 12.515,6.746 11.435,6.745 10.359,6.821 9.803,6.926 8.464,7.083 7.692,8.163 7.692,8.654 v 5.769 c 0,0.53 0.432,0.962 0.962,0.962 z M 12.5,5.769 c 1.593,0 2.885,-1.292 2.885,-2.885 C 15.385,1.292 14.093,0 12.5,0 10.907,0 9.615,1.292 9.615,2.885 c 0,1.593 1.292,2.884 2.885,2.884 z"/></g></svg>',
  svgInfo:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
  svgCheckbox:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
  svgCheckboxOutline:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
  svgAddBox:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
  svgRemoveBox:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="28" height="28"><defs><path id="a" d="M0 0h24v24H0z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><path clip-path="url(#b)" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/></svg>',
  svgRefreshMap:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19.81 14.99l1.19-.92-1.43-1.43-1.19.92 1.43 1.43zm-.45-4.72L21 9l-9-7-2.91 2.27 7.87 7.88 2.4-1.88zM3.27 1L2 2.27l4.22 4.22L3 9l1.63 1.27L12 16l2.1-1.63 1.43 1.43L12 18.54l-7.37-5.73L3 14.07l9 7 4.95-3.85L20.73 21 22 19.73 3.27 1z"/></svg>',
  svgExpandLess:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
  svgExpandMore:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
  svgExpandLess16:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
  svgExpandMore16:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
  svgOpen:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>',
  svgTable:
    '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/><path d="M19,7H9C7.9,7,7,7.9,7,9v10c0,1.1,0.9,2,2,2h10c1.1,0,2-0.9,2-2V9C21,7.9,20.1,7,19,7z M19,9v2H9V9H19z M13,15v-2h2v2H13z M15,17v2h-2v-2H15z M11,15H9v-2h2V15z M17,13h2v2h-2V13z M9,17h2v2H9V17z M17,19v-2h2v2H17z M6,17H5c-1.1,0-2-0.9-2-2V5 c0-1.1,0.9-2,2-2h10c1.1,0,2,0.9,2,2v1h-2V5H5v10h1V17z"/></g></svg>',
  svgTable16:
    '<svg xmlns="http://www.w3.org/2000/svg"  height="16" width="16" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/><path d="M19,7H9C7.9,7,7,7.9,7,9v10c0,1.1,0.9,2,2,2h10c1.1,0,2-0.9,2-2V9C21,7.9,20.1,7,19,7z M19,9v2H9V9H19z M13,15v-2h2v2H13z M15,17v2h-2v-2H15z M11,15H9v-2h2V15z M17,13h2v2h-2V13z M9,17h2v2H9V17z M17,19v-2h2v2H17z M6,17H5c-1.1,0-2-0.9-2-2V5 c0-1.1,0.9-2,2-2h10c1.1,0,2,0.9,2,2v1h-2V5H5v10h1V17z"/></g></svg>',
  svgOpen16:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>',
  svgDownload16:
    '<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16"><path d="M0 0h24v24H0z" fill="none"/><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>',
  svgAddCircleOutline:
    '<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" ><path d="M0 0h24v24H0z" fill="none"/><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>',
  svgRemoveCircleOutline:
    '<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" ><path d="M0 0h24v24H0z" fill="none"/><path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>',
  svgAdd:
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" ><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
  svgRemove:
    '<svg xmlns="http://www.w3.org/2000/svg" height="24 " width="24" viewBox="0 0 24 24" ><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg>',
  svgArrowLeft:
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M14 7l-5 5 5 5V7z"/><path d="M24 0v24H0V0h24z" fill="none"/></svg>',
  svgArrowRight:
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M10 17l5-5-5-5v10z"/><path d="M0 24V0h24v24H0z" fill="none"/></svg>',
  svgChevronLeft:
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>',
  svgChevronLeft16:
    '<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>',
  svgChevronRight:
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>',
  svgMail:
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
  svgPhone:
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>',
  svgMail16:
    '<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
  svgPhone16:
    '<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16"><path d="M0 0h24v24H0z" fill="none"/><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>',
  svgChart16:
    '<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.1h-15V5h15v14.1zm0-16.1h-15c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>',
  svgChart24:
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.1h-15V5h15v14.1zm0-16.1h-15c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>',
  svgSelect24:
    '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path id="svg_1" fill="none" d="m0,0l24,0l0,24l-24,0l0,-24z"/><path id="svg_2" d="m3,17.25l0,3.75l3.75,0l11.06,-11.06l-3.75,-3.75l-11.06,11.06zm17.71,-10.21c0.39,-0.39 0.39,-1.02 0,-1.41l-2.34,-2.34c-0.39,-0.39 -1.02,-0.39 -1.41,0l-1.83,1.83l3.75,3.75l1.83,-1.83z"/><line stroke="#000" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_7" y2="17.83942" x2="20.32117" y1="17.9854" x1="14.78813" fill="none"/><line stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_8" y2="36.67154" x2="22.94891" y1="36.52555" x1="22.94891" stroke="#000" fill="none"/><line stroke="#000" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_9" y2="20.55263" x2="17.65789" y1="14.76316" x1="17.65789" fill="none"/></svg>',
};

var LamCookieConsent = (function () {
  function lamCookieFadeIn(elem, display) {
    var el = document.getElementById(elem);
    var ease = 1; //0.02 for fading
    el.style.opacity = 0;
    el.style.display = display || "block";

    (function fade() {
      var val = parseFloat(el.style.opacity);
      if (!((val += ease) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }
  function lamCookieFadeOut(elem) {
    var el = document.getElementById(elem);
    el.style.opacity = 1;

    (function fade() {
      if ((el.style.opacity -= 0.02) < 0) {
        el.style.display = "none";
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }

  function setCookieConsent(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function getCookieConsent(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  function eraseCookieConsent(name) {
    setCookieDescription(cookieName, "0", 7);
  }

  function cookieConsent() {
    if (!LamStore.getAppState().cookieConsent) return;
    if (!getCookieConsent("lamCookieDismiss")) {
      document.body.innerHTML +=
        '<div class="lamConsentContainer" id="lamConsentContainer"><div class="cookieTitle"><a>' +
        LamStore.getAppState().cookieConsent.cookieTitle +
        '</a></div><div class="cookieDesc"><p>' +
        LamStore.getAppState().cookieConsent.cookieDesc +
        " " +
        LamStore.getAppState().cookieConsent.cookieLink +
        '</p></div><div class="cookieButton"><a onClick="LamCookieConsent.lamCookieDismiss();">' +
        LamStore.getAppState().cookieConsent.cookieButton +
        "</a></div></div>";
      lamCookieFadeIn("lamConsentContainer");
    }
  }

  function lamCookieDismiss() {
    setCookieConsent("lamCookieDismiss", "1", 7);
    lamCookieFadeOut("lamConsentContainer");
  }

  // window.onload = function () {
  //   cookieConsent();
  // };

  return {
    lamCookieDismiss: lamCookieDismiss,
    cookieConsent: cookieConsent,
  };
})();

var LamCookieDescription = (function () {
  let cookieName = "lamCookieDescriptionDismiss";

  var init = function init() {
    //events binding
    LamDispatcher.bind("show-lam-description", function (payload) {
      if (LamStore.getAppState().description) {
        LamCookieDescription.eraseCookieDescription();
        LamCookieDescription.cookieDescription();
      }
    });
  };

  function lamCookieFadeIn(elem, display) {
    var el = document.getElementById(elem);
    var ease = 1; //0.02 for fading
    el.style.opacity = 0;
    el.style.display = display || "block";

    (function fade() {
      var val = parseFloat(el.style.opacity);
      if (!((val += ease) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }
  function lamCookieFadeOut(elem) {
    var el = document.getElementById(elem);
    el.style.opacity = 1;

    (function fade() {
      if ((el.style.opacity -= 0.02) < 0) {
        el.style.display = "none";
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }

  function setCookieDescription(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function getCookieDescription(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  function eraseCookieDescription() {
    setCookieDescription(cookieName, "0", 7);
  }

  function cookieDescription() {
    if (getCookieDescription(cookieName) && getCookieDescription(cookieName) != "1") {
      $("<div>", {
        id: "lamDescriptionContainer",
        class: "lamDescriptionContainer",
      }).appendTo("body");

      $("#lamDescriptionContainer").html(
        '<div class="cookieTitle"><a>' +
          LamStore.getAppState().title +
          '</a></div><div class="cookieDesc"><p>' +
          LamStore.getAppState().description +
          " " +
          '<div class="cookieButton"><a onClick="LamCookieDescription.lamCookieDescriptionDismiss();">' +
          "Chiudi" +
          "</a></div>"
      );
      lamCookieFadeIn("lamDescriptionContainer");
    }
  }

  function lamCookieDescriptionDismiss() {
    setCookieDescription(cookieName, "1", 7);
    lamCookieFadeOut("lamDescriptionContainer");
  }

  // window.onload = function () {
  //   cookieDescription();
  // };

  return {
    init: init,
    lamCookieDescriptionDismiss: lamCookieDescriptionDismiss,
    cookieDescription: cookieDescription,
    setCookieDescription: setCookieDescription,
    eraseCookieDescription: eraseCookieDescription,
  };
})();

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

//Object that expose temporary functions. These function should be moved to other objects
var AppCustom = (function() {
  //thanks to David Walsh https://davidwalsh.name/convert-xml-json
  function xmlToJson(xml) {
    var obj = {};

    if (xml.nodeType == 1) {
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) {
      obj = xml.nodeValue;
    }

    if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof obj[nodeName] == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof obj[nodeName].push == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  }
  return {
    xmlToJson: xmlToJson
  };
})();

var LamRelations = (function () {
  let currentRelation; //relation currently evaluating
  let currentRelationItem; //item on which the relation is evaluated
  let currentPageIndex = 0;
  let currentPageSize = 25;
  let sortAttribute = null;
  let currentTemplate = null;
  let currentRelationTableTemplate = null;
  let currentResults = null;
  let relationHistory = [];

  var init = function init() {
    //events binding
    LamDispatcher.bind("render-relation-table", function (payload) {
      LamRelations.renderRelationTable(payload.pageSize, payload.pageIndex, payload.sortBy);
    });

    LamDispatcher.bind("render-previous-relation", function (payload) {
      LamRelations.showPrevRelation();
    });

    //loading remote relations
    LamStore.loadRemoteRelations();
  };

  var getRelations = function () {
    return LamStore.getAppState().relations;
  };

  var getRelation = function (gid) {
    let relationResult = LamStore.getAppState().relations.filter(function (el) {
      return el.gid == gid;
    });

    return relationResult[0];
  };

  /**
   * Return an object  with properties
   * data
   * template
   */
  var getRelationResults = function () {
    return {
      data: currentResults,
      template: currentTemplate,
    };
  };

  /**
   * Shows the relation from an infobox item
   */
  var showPrevRelation = function () {
    relationHistory.pop();
    showRelationByItem(relationHistory[relationHistory.length - 1].relationGid, relationHistory[relationHistory.length - 1].resultItem);
  };

  /**
   * Shows the relation from an infobox item
   * @param {string} relationGid Gid of the relation
   * @param {int} resultIndex Index of the result in the info items
   */
  var showRelation = function (relationGid, resultIndex) {
    relationHistory.push({
      relationGid: relationGid,
      resultItem: LamStore.getCurrentInfoItems().features[resultIndex],
    });
    showRelationByItem(relationGid, LamStore.getCurrentInfoItems().features[resultIndex]);
  };

  /**
   * Shows the relation from a relation's table results
   * @param {string} relationGid Gid of the relation
   * @param {int} resultIndex Index of the result in the info items
   */
  var showConcatenatedRelation = function (relationGid, resultIndex) {
    relationHistory.push({
      relationGid: relationGid,
      resultItem: currentResults[resultIndex],
    });
    showRelationByItem(relationGid, currentResults[resultIndex]);
  };

  var showRelationByItem = function (relationGid, resultItem) {
    lamDispatch("show-loader");
    currentRelationItem = resultItem;
    currentRelation = LamRelations.getRelation(relationGid);
    var templateUrl = Handlebars.compile(currentRelation.serviceUrlTemplate);
    var urlService = templateUrl(currentRelationItem.properties);
    $.ajax({
      dataType: "jsonp",
      url: urlService + "&format_options=callback:LamRelations.parseResponseRelation",
      jsonp: true,
      cache: false,
      error: function (jqXHR, textStatus, errorThrown) {
        lamDispatch({
          eventName: "log",
          message: "LamRelations: unable to complete response",
        });
        lamDispatch("hide-loader");
      },
    });
  };

  let parseResponseRelation = function (data) {
    if (data.features) {
      data = data.features;
    }
    if (!Array.isArray(data)) {
      data = [data];
    }
    var template = LamTemplates.getTemplate(currentRelation.gid, currentRelation.templateUrl, LamStore.getAppState().templatesRepositoryUrl);
    currentTemplate = template;
    currentResults = data;
    currentPageIndex = 0;
    currentPageSize = 25;
    sortAttribute = null;

    renderRelationTable();
    lamDispatch("hide-loader");
  };

  let renderRelationTable = function (pageSize, pageIndex, sortBy) {
    //let title = currentRelationItem.toolTip ? currentRelationItem.toolTip + " - " : "" + currentRelation.title;
    var titleCompiled = Handlebars.compile(currentRelation.title);
    let title = titleCompiled(currentRelationItem.properties);

    let body = "";

    if (relationHistory.length > 1) {
      body += "";
      body +=
        "<button type='button' class='lam-btn lam-depth-1 lam-mb-2' onclick=\"lamDispatch({ eventName: 'render-previous-relation'});\" ><i class='lam-icon'>" +
        LamResources.svgChevronLeft16 +
        "</i> Indietro</button>";
    }

    if (pageIndex != null) currentPageIndex = pageIndex;
    if (pageSize) {
      currentPageSize = pageSize;
      if (currentPageSize * currentPageIndex > currentResults.length) currentPageIndex = 0;
    }
    if (sortBy) {
      sortAttribute = sortBy;
      if (sortAttributeIsDescending(sortAttribute)) {
        //Descending
        currentResults.sort(function compare(a, b) {
          let attributeName = LamTables.getNormalizedSortAttribute();
          if (a.properties[attributeName] < b.properties[attributeName]) {
            return 1;
          }
          if (a.properties[attributeName] > b.properties[attributeName]) {
            return -1;
          }
          return 0;
        });
      } else {
        //Ascending
        currentResults.sort(function compare(a, b) {
          if (a.properties[sortAttribute] < b.properties[sortAttribute]) {
            return -1;
          }
          if (a.properties[sortAttribute] > b.properties[sortAttribute]) {
            return 1;
          }
          return 0;
        });
      }
    }
    currentRelationTableTemplate = getRelationTemplate(currentTemplate);
    let propsList = [];
    let currentFeatureCount = currentResults.length;
    let maxIndex = (currentPageIndex + 1) * currentPageSize > currentFeatureCount ? currentFeatureCount : (currentPageIndex + 1) * currentPageSize;
    for (let i = currentPageIndex * currentPageSize; i < maxIndex; i++) {
      var props = currentResults[i].properties ? currentResults[i].properties : currentResults[i];
      props.relationIndex = i;
      propsList.push(props);
    }
    let compiledTemplate = Handlebars.compile(currentRelationTableTemplate);
    body += compiledTemplate(propsList);
    //pulsanti paginazione
    let startIndex = currentPageIndex * currentPageSize + 1;
    body += "<div class='lam-grid lam-no-bg lam-mt-1'>";
    body += "<div class='lam-col'> N° ";
    body += "" + startIndex + "-" + maxIndex + " su " + currentFeatureCount;
    body += "</div>";
    body += "<div class='lam-col'> Mostra ";
    body += "<select class='lam-select-small ' onchange='LamRelations.updatePageSize(this)'>";
    for (let index = 25; index <= 100; index += 25) {
      body += "<option value='" + index + "' " + (index === currentPageSize ? "selected" : "") + ">" + index + "</option>\n";
    }
    body += " </select>";
    body += "</div>";
    body += "<div class='lam-col'>";
    body += " Pag. <select class='lam-select-small ' onchange='LamRelations.updatePageIndex(this)'>";
    for (let index = 1; index <= Math.floor(currentFeatureCount / currentPageSize) + 1; index++) {
      body += "<option value='" + index + "' " + (index === currentPageIndex + 1 ? "selected" : "") + ">" + index + "</option>";
    }
    body += " </select>";

    body += "/" + (Math.floor(currentFeatureCount / currentPageSize) + 1);
    body += "</div>";
    body += "<div class='lam-col'>";
    if (currentPageIndex > 0) {
      body +=
        "<button class='lam-btn lam-btn-small' onclick=\"lamDispatch({ eventName: 'render-relation-table', pageIndex: " +
        (currentPageIndex - 1) +
        ' });"><i class="lam-icon">' +
        LamResources.svgArrowLeft +
        "</i></button>";
    }
    if (propsList.length == currentPageSize) {
      body +=
        "<button class='lam-btn lam-btn-small' onclick=\"lamDispatch({ eventName: 'render-relation-table', pageIndex:" +
        (currentPageIndex + 1) +
        ' });"><i class="lam-icon">' +
        LamResources.svgArrowRight +
        "</i></button>";
    }
    body += "</div>";
    body += "</div>";

    //download
    if (currentResults.length === 0) {
      body += '<div class="lam-warning lam-mb-2 lam-p-2">' + LamResources.risultati_non_trovati + "</div>";
    }
    body +=
      "<div class=' lam-mt-1'><button class='lam-btn lam-right lam-depth-1' onclick='lamDispatch(\"download-relation-results\")'><i class='lam-icon'>" +
      LamResources.svgDownload16 +
      "</i> Scarica CSV</button></div>";
    LamDom.showContent(LamEnums.showContentMode().InfoWindow, title, body);
  };

  let getRelationTemplate = function (template) {
    let attribute = LamTables.getNormalizedSortAttribute();
    let str = "<table class='lam-table'>";
    str += "<tr>";
    for (let i = 0; i < template.fields.length; i++) {
      str += "<th class='" + (template.fields[i].field === attribute ? " lam-sorted " : "") + "' >";
      str +=
        "<i class='lam-pointer ' onclick=\"lamDispatch({ eventName: 'render-relation-table', sortBy: '" +
        (template.fields[i].field === sortAttribute ? template.fields[i].field + " DESC" : template.fields[i].field) +
        "'  }); return false;\">";
      str += template.fields[i].field === attribute && !sortAttributeIsDescending(sortAttribute) ? LamResources.svgExpandLess16 : LamResources.svgExpandMore16;
      str += "</i></a>";
      str += (!template.fields[i].header ? template.fields[i].label : template.fields[i].header) + "</th>";
    }
    str += "</tr>";
    str += "{{#each this}}<tr>";
    for (let i = 0; i < template.fields.length; i++) {
      str += LamTemplates.getFieldTemplate(template.fields[i]);
    }
    str += "</tr>{{/each}}";
    str += "</table>";
    return str;
  };

  let updatePageSize = function (sender) {
    if ($(sender).val()) {
      LamRelations.renderRelationTable(parseInt($(sender).val()), currentPageIndex);
    }
  };
  let updatePageIndex = function (sender) {
    if ($(sender).val()) {
      LamRelations.renderRelationTable(currentPageSize, parseInt($(sender).val()) - 1);
    }
  };

  let sortAttributeIsDescending = function (attribute) {
    return attribute.indexOf(" DESC", attribute.length - " DESC".length) !== -1;
  };

  /**
   * Filters the relations by keeping only the relations given, checking relation gid or autorization
   * This method is only called outside the app
   */
  let allowRelations = function (relationsToKeep) {
    if (LamStore.getAppState()) {
      // let relationsFiltered = LamStore.getAppState().relations.filter(function (relation) {
      //   return relationsToKeep.includes(relation.gid);
      // });
      let relationsFilteredAuth = LamStore.getAppState().relations.filter(function (relation) {
        if (!relation.authorization) return false;
        var arrAuthorization = relation.authorization.split(",");
        return relationsToKeep.some((r) => arrAuthorization.includes(r));
      });
      //LamStore.getAppState().relations = [...new Set([...relationsFiltered, ...relationsFilteredAuth])];
      LamStore.getAppState().relations = relationsFilteredAuth;
    } else {
      setTimeout(function () {
        LamRelations.allowRelations(relationsToKeep);
      }, 3000);
    }
  };

  return {
    allowRelations: allowRelations,
    init: init,
    getRelations: getRelations,
    getRelation: getRelation,
    getRelationResults: getRelationResults,
    getRelationTemplate: getRelationTemplate,
    parseResponseRelation: parseResponseRelation,
    renderRelationTable: renderRelationTable,
    showConcatenatedRelation: showConcatenatedRelation,
    showRelation: showRelation,
    showPrevRelation: showPrevRelation,
    updatePageSize: updatePageSize,
    updatePageIndex: updatePageIndex,
  };
})();

var LamCharts = (function () {
  let currentChart; //relation currently evaluating
  let currentChartItem; //item on which the chart is evaluated
  let currentResults = null;
  var init = function init() {
    //loading remote charts
    LamStore.loadRemoteCharts();
  };

  var getCharts = function () {
    return LamStore.getAppState().charts;
  };

  var getChart = function (gid) {
    let chartResult = LamStore.getAppState().charts.filter(function (el) {
      return el.gid == gid;
    });
    return chartResult[0];
  };

  var showChart = function (chartGid, resultIndex) {
    lamDispatch("show-loader");
    if (typeof resultIndex === "undefined" || resultIndex < 0) {
      currentChartItem = {};
      currentChartItem.properties = {};
    } else {
      currentChartItem = LamStore.getCurrentInfoItems().features[resultIndex];
    }
    currentChart = LamCharts.getChart(chartGid);
    var templateUrl = Handlebars.compile(currentChart.serviceUrlTemplate);
    var urlService = templateUrl(currentChartItem.properties);
    $.ajax({
      dataType: "jsonp",
      url: urlService + "&format_options=callback:LamCharts.parseResponseChart",
      jsonp: true,
      cache: false,
      error: function (jqXHR, textStatus, errorThrown) {
        lamDispatch({
          eventName: "log",
          message: "LamCharts: unable to complete response",
        });
        lamDispatch("hide-loader");
      },
    });
  };

  let parseResponseChart = function (data) {
    if (data.features) {
      data = data.features;
    }
    if (!Array.isArray(data)) {
      data = [data];
    }
    currentResults = data;
    var titleCompiled = Handlebars.compile(currentChart.title);
    let title = titleCompiled(currentChartItem.properties);
    let body = "<canvas id='lam-chart-canvas'></canvas>";
    //mostro il contenuto per avere renderizzato prima il canvas da riempire
    LamDom.showContent(LamEnums.showContentMode().InfoWindow, title, body);
    //renderizzo il grafico
    renderChart(getChartData());
    lamDispatch("hide-loader");
  };

  let renderChart = function (chartData, options) {
    if (!options) {
      options = {
        responsive: true,
        legend: {
          position: "top",
        },
        title: {
          display: false,
          text: "",
        },
      };
      switch (currentChart.chartType) {
        case "bubble":
        case "pie":
          break;
        case "horizontalBar":
          options.scales = {
            xAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          };
          break;
        default:
          options.scales = {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          };
          break;
      }
    }
    var ctx = document.getElementById("lam-chart-canvas").getContext("2d");
    window.myBar = new Chart(ctx, {
      type: currentChart.chartType ? currentChart.chartType : "bar",
      data: chartData,
      options: options,
    });
  };

  let getChartData = function () {
    let chartConfig = {};
    chartConfig.datasets = [];
    //sorting values
    currentResults.sort((a, b) =>
      a.properties[currentChart.sortField] > b.properties[currentChart.sortField]
        ? 1
        : b.properties[currentChart.sortField] > a.properties[currentChart.sortField]
        ? -1
        : 0
    );
    if (!Array.isArray(currentChart.labelField)) {
      let labelCompiled = Handlebars.compile(currentChart.labelField);
      chartConfig.labels = currentResults.map(function (element) {
        return labelCompiled(element.properties);
      });
    } else {
      chartConfig.labels = [];
      currentChart.labelField.forEach(function (label) {
        let labelCompiled = Handlebars.compile(label);
        chartConfig.labels.push(labelCompiled(currentResults[0].properties));
      });
    }

    currentChart.datasets.forEach(function (element) {
      if (!Array.isArray(element.valueField)) {
        let dataSet = datasetFactoryCreate(element);
        dataSet.data = currentResults.map(function (item) {
          return getDatasetValue(element.valueField, item);
        });
        chartConfig.datasets.push(dataSet);
      } else {
        currentResults.forEach(function (item) {
          let dataSet = datasetFactoryCreate(element, item);
          dataSet.data = [];
          element.valueField.forEach(function (itemSerieValue) {
            dataSet.data.push(getDatasetValue(itemSerieValue, item));
          });
          chartConfig.datasets.push(dataSet);
        });
      }
    });
    return chartConfig;
  };

  let datasetFactoryCreate = function (datasetConfig) {
    let dataSet = {};
    if (datasetConfig.title) dataSet.label = datasetConfig.title;
    if (datasetConfig.backgroundColor) {
      dataSet.backgroundColor = [];
      if (!Array.isArray(datasetConfig.backgroundColor)) {
        dataSet.backgroundColor = "rgba(" + datasetConfig.backgroundColor + ")";
      } else {
        datasetConfig.backgroundColor.forEach(function (background) {
          dataSet.backgroundColor.push("rgba(" + background + ")");
        });
      }
    }
    if (datasetConfig.borderColor) dataSet.borderColor = "rgba(" + datasetConfig.borderColor + ")";
    if (datasetConfig.borderWidth) dataSet.borderWidth = datasetConfig.borderWidth;
    return dataSet;
  };

  let getDatasetValue = function (field, item) {
    if (field.indexOf("=") === 0) {
      var functionTemplate = field.replace("=", "");
      var functionCompiled = Handlebars.compile(functionTemplate);
      let itemFunction = functionCompiled(item.properties);
      try {
        let val = eval(itemFunction);
        return val;
      } catch (e) {
        lamDispatch({
          eventName: "log",
          message: "LamCharts: non è stato possibile calcolare il dato per " + itemFunction,
        });
        return 0;
      }
    }
    return item.properties[field];
  };

  return {
    getChart: getChart,
    getCharts: getCharts,
    showChart: showChart,
    init: init,
    parseResponseChart: parseResponseChart,
    renderChart: renderChart,
  };
})();

var LamDom = (function () {
  var init = function init() {
    //events binding
    LamDispatcher.bind("hide-info-window", function (payload) {
      LamDom.hideInfoWindow();
    });

    LamDispatcher.bind("hide-loader", function (payload) {
      LamDom.toggleLoader(false);
    });

    LamDispatcher.bind("show-loader", function (payload) {
      LamDom.toggleLoader(true);
    });

    LamDispatcher.bind("show-bottom-info", function (payload) {
      $("#bottom-info").show();
    });

    LamDispatcher.bind("hide-bottom-info", function (payload) {
      $("#bottom-info").hide();
    });
  };

  let hideInfoWindow = function () {
    $("#info-window").hide();
  };

  /**
   * Sets the loader visibility
   * @param {boolean} visibility
   */
  let toggleLoader = function (visibility) {
    if (visibility) {
      $("#app-loader").removeClass("lam-hidden");
    } else {
      $("#app-loader").addClass("lam-hidden");
    }
  };

  /**
   * Updates html and CSS classes based on the appstate configuration
   */
  let domUpdatesFromState = function () {
    $("#" + LamStore.getMapDiv()).removeClass("lam-hidden");
    if (LamStore.getAppState().logoUrl) {
      $("#lam-logo__img").attr("src", LamStore.getAppState().logoUrl);
    }
    if (LamStore.getAppState().hideLogo) {
      $("#lam-logo").addClass("lam-hidden");
    }
    if (LamStore.getAppState().logoPanelUrl || LamStore.getAppState().title) {
      if (LamStore.getAppState().logoPanelUrl) {
        $("#panel__logo-img").attr("src", LamStore.getAppState().logoPanelUrl);
        $("#panel__logo-img").removeClass("lam-hidden");
      }
      if (LamStore.getAppState().title) {
        $("#panel__map-title").text(LamStore.getAppState().title);
        $("#panel__map-title").removeClass("lam-hidden");
      }
      $("#panel__logo").removeClass("lam-hidden");
    }
  };

  var showAppTools = function () {
    var modules = LamStore.getAppState().modules;
    if (modules) {
      setvisibility("#menu-toolbar__layer-tree", modules["layer-tree"]);
      setvisibility("#menu-toolbar__search-tools", modules["search-tools"]);
      setvisibility("#menu-toolbar__print-tools", modules["print-tools"]);
      setvisibility("#menu-toolbar__share-tools", modules["share-tools"]);
      setvisibility("#menu-toolbar__map-tools", modules["map-tools-measure"] || modules["map-tools-copyCoordinate"] || modules["map-tools-goLonLat"]);
      setvisibility("#menu-toolbar__draw-tools", modules["draw-tools"]);
      setvisibility("#menu-toolbar__select-tools", modules["select-tools"]);
      setvisibility("#menu-toolbar__gps-tools", modules["gps-tools"]);
      if (modules["links-tools"]) setvisibility("#menu-toolbar__links-tools", modules["links-tools"]);
      if (modules["legend-tools"]) setvisibility("#menu-toolbar__legend-tools", modules["legend-tools"]);
      if (modules["open-full"]) {
        let url = window.location.href.replace("prop-embed=", "");
        $("#menu-toolbar__open-full").attr("href", url);
        setvisibility("#menu-toolbar__open-full", modules["open-full"]);
      }
    }
  };

  var isMobile = function () {
    return /Mobi/.test(navigator.userAgent);
  };

  /**
   * Dragging helper
   * @param {Object} elmnt
   */
  var dragElement = function (elmnt) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(elmnt.id + "__resize")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "__resize").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      if (e.srcElement.tagName.toLowerCase() === "select") {
        return;
      }
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  };

  /**
   * Shows the html content that is a rult of an info click, legend, tool etc.
   * @param {LamEnums.showContentMode} contentMode Set the display mode of the content (Left Panel, Bottom Panel or InfoWindow)
   * @param {*} title Title of the content
   * @param {*} htmlMain Main content
   * @param {*} htmlBottomInfo Content that will be displayed in the bottom panel for mobile readability. If null, the htmlMain will be used instead.
   * @param {*} toolBarItem Toolbar name that has generated the content. If not visibile it will be displayed
   * @param {*} elementId Html element id where the content will be displayed. Default will be InfoWindow
   */
  let showContent = function (contentMode, title, htmlMain, htmlBottomInfo, toolBarItem, elementId) {
    if (!elementId) elementId = "info-results";
    if (!htmlBottomInfo) htmlBottomInfo = htmlMain;
    if (!toolBarItem) toolBarItem = "info-results";
    let htmlTitle = $("<h4 id='" + elementId + "__title'></h4>")
      .addClass("lam-title")
      .html(title);
    let htmlContent = $("<div id='" + elementId + "__content'></div>")
      .addClass("lam-scroll-padding")
      .html(htmlMain);
    switch (contentMode) {
      case 1: //LeftPanel
        $("#" + elementId + "")
          .html("")
          .append(htmlTitle)
          .append(htmlContent)
          .show();
        LamToolbar.toggleToolbarItem(toolBarItem, true);
        LamDispatcher.dispatch("hide-info-window");
        $("#" + elementId + "").show();
        //LamDispatcher.dispatch("show-menu");
        $("#bottom-info").hide();
        break;
      case 2: //BottomInfo
        if (!elementId) elementId = "info-results";
        $("#" + elementId + "")
          .html("")
          .append(htmlTitle)
          .append(htmlContent)
          .show();
        $("#bottom-info__title-text").html(title);
        $("#bottom-info__content").html(htmlBottomInfo);
        LamToolbar.toggleToolbarItem(toolBarItem, false);
        LamDispatcher.dispatch("hide-info-window");
        LamDispatcher.dispatch("hide-menu");
        $("#bottom-info").show();
        break;
      case 3: //InfoWindow
        //if (!elementId)
        elementId = "info-window";
        if (LamDom.isMobile()) LamDispatcher.dispatch("hide-menu");
        $("#bottom-info").hide();
        $("#" + elementId + "__content").html(htmlMain);
        $("#" + elementId + "__title").html(title);
        $("#" + elementId + "").show();
        break;
    }
  };

  /**
   * Wrapper for hide/show jquery
   */
  let setvisibility = function (element, status) {
    if (status) {
      //$(element).show();
      $(element).css("display", "inline-block");
    } else {
      $(element).hide();
    }
  };

  return {
    domUpdatesFromState: domUpdatesFromState,
    dragElement: dragElement,
    init: init,
    isMobile: isMobile,
    hideInfoWindow: hideInfoWindow,
    setvisibility: setvisibility,
    showAppTools: showAppTools,
    showContent: showContent,
    toggleLoader: toggleLoader,
  };
})();

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
 * Global Istance that manages application loading
 */
let LamLoader = (function () {
  let layerUriCount = 0; //stores the total remote layers number
  let countRequest = 0; //stores the cuont of call made to retrieve remote layers

  /**
   * Init map function
   * @param {string} mapDiv Target Id of the div where the map will be rendered in.  Default is lam-app
   * @param {*} appStateInline Url of the appstate, inline json string or custom value for print (experimental).
   *                            If the appstate or appstatejson parameter is given in the url it will have priority over this.
   *                            Otherwise standard url states/app-state.json will be used
   * @param {*} mapTemplateUrl Url of the map template to load.
   */
  let lamInit = function (mapDiv, appStateInline, mapTemplateUrl) {
    LamStore.setMapDiv(!mapDiv ? "lam-app" : mapDiv);
    LamStore.setMapTemplateUrl(mapTemplateUrl);
    //appstate loader
    //appstate given in url with filename
    var appStateId =
      decodeURIComponent((new RegExp("[?|&]" + "appstate" + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [null, ""])[1].replace(/\+/g, "%20")) || null;
    //appstate given in url with full json
    var appStateJson =
      decodeURIComponent((new RegExp("[?|&]" + "appstatejson" + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [null, ""])[1].replace(/\+/g, "%20")) ||
      null;
    let appStateUrl = null;

    //decoding appstate inline
    if (appStateInline) {
      if (appStateIniline === "print") {
        //setting appstateprint from sessionstorage
        appStateJson = sessionStorage.getItem("appStatePrint");
        if (!appStateJson) {
          lamDispatch("Unable to get the appStatePrint object for printing");
          return;
        }
      } else {
        //setting url
        appStateUrl = appStateIniline;
      }
    }

    if (appStateId) {
      //call with ajax
      $.ajax({
        dataType: "json",
        url: "states/" + appStateId,
        cache: false,
      })
        .done(function (appState) {
          loadLamState(appState);
        })
        .fail(function () {
          lamDispatch({
            eventName: "log",
            message: "Share: Impossibile caricare la mappa condivisa",
          });
        });
    } else if (appStateJson) {
      $.ajax({
        dataType: "json",
        url: appStateJson,
        cache: false,
      })
        .done(function (appstate) {
          loadLamState(appstate);
        })
        .fail(function () {
          lamDispatch({
            eventName: "log",
            message: "Share: Impossibile caricare la mappa condivisa",
          });
        });
    } else if (appStateUrl) {
      $.ajax({
        dataType: "json",
        url: appStateUrl,
        cache: false,
      })
        .done(function (appstate) {
          loadLamState(appstate);
        })
        .fail(function () {
          lamDispatch({
            eventName: "log",
            message: "Share: Impossibile caricare la mappa condivisa",
          });
        });
    } else {
      $.ajax({
        dataType: "json",
        url: "states/app-state.json",
        cache: false,
      })
        .done(function (appstate) {
          loadLamState(appstate);
        })
        .fail(function () {
          lamDispatch({
            eventName: "log",
            message: "Share: Impossibile caricare la mappa",
          });
        });
    }

    function loadLamState(appstate) {
      LamStore.setAppState(appstate);
      if (LamStore.getAppState().authentication.requireAuthentication) {
        LamAuthTools.render("login-container");
      }
      //cookie consent
      if (LamStore.getAppState().cookieConsent) {
        if (LamStore.getAppState().cookieConsent.showConsentOnLoad) {
          LamCookieConsent.cookieConsent();
        }
      }
      //cookie description
      if (LamStore.getAppState().description) {
        LamCookieDescription.cookieDescription();
      }
      lamTemplateMapHtml();
    }
  };

  /**
   * This functions load the html map using ajax into the given id element and then start the function
   * that loads the layers recusively. After that calls the appInit function given as a callback
   */
  let lamTemplateMapHtml = function () {
    $.ajax({
      dataType: "text",
      url: LamStore.getMapTemplateUrl(),
      cache: false,
    })
      .done(function (data) {
        $("#" + LamStore.getMapDiv()).html(data);
        //loading all remote layers
        loadRemoteLayers(LamLoader.appInit);
      })
      .fail(function (data) {
        lamDispatch({
          eventName: "log",
          message: "Init Map: Unable to load map template",
        });
      });
  };

  /**
   * Initialize application
   * @param {function} callback Function to be called after the map is loaded
   */
  var appInit = function (callback) {
    LamHandlebars.registerHandlebarsHelpers();
    LamDom.domUpdatesFromState();

    //inizializzazione globale
    LamHandlebars.init();
    LamDom.init();
    LamRelations.init();
    LamCharts.init();
    LamTables.init();
    LamDom.showAppTools();
    LamAlerts.init();
    //map init
    LamMap.render("lam-map", LamStore.getAppState());
    LamMapTooltip.init();
    //carico i layers
    LamLayerTree.render(null, LamStore.getAppState().layers);

    //carico gli strumenti di ricerca
    LamSearchTools.render(
      "search-tools",
      LamStore.getAppState().searchProvider,
      LamStore.getAppState().searchProviderAddressUrl,
      LamStore.getAppState().searchProviderAddressField,
      LamStore.getAppState().searchProviderHouseNumberUrl,
      LamStore.getAppState().searchProviderHouseNumberField,
      LamStore.getSearchLayers()
    );
    //carico gli strumenti di share
    LamShareTools.render("share-tools", null);
    //carico gli strumenti di Stampa
    LamPrintTools.render("print-tools");
    //carico gli strumenti di mappa
    LamMapTools.render("map-tools");
    //carico gli strumenti di disegno
    LamDrawTools.render("draw-tools");
    if (LamStore.getAppState().modules["select-tools"]) {
      LamSelectTools.render();
    }
    LamLinksTools.init();
    LamLegendTools.init();
    LamCookieDescription.init();

    //loading templates
    LamTemplates.init();
    LamDownloadTools.init();
    LamToolbar.init();
    //eseguo il callback
    if (callback) callback();
    LamDom.toggleLoader(false);
  };

  /**
   * Load the remote layers nested in the appstate
   */
  let loadRemoteLayers = function (callback) {
    LamDom.toggleLoader(true);
    LamStore.getAppState().layers.forEach(function (layer) {
      loadLayersUri(layer, callback);
    });
    if (layerUriCount === 0) {
      //no ajax request sent, loading all json immediately
      if (callback) callback();
    }
  };

  /**
   * Loads the remote layers recursively
   * @param {Object} layer layer to load
   * @param {string} callback function to call at the end
   */
  var loadLayersUri = function (layer, callback) {
    if (layer.layersUri) {
      countRequest++;
      layerUriCount++;
      $.ajax({
        dataType: "json",
        url: layer.layersUri,
        cache: false,
      })
        .done(function (data) {
          layer.layers = data;
          layer.layers.forEach(function (e) {
            loadLayersUri(e, callback);
          });
        })
        .fail(function (data) {
          lamDispatch({
            eventName: "log",
            message: "Layer Tree: Unable to load layers " + layer.layersUri,
          });
        })
        .always(function (data) {
          countRequest--;
          if (countRequest === 0) {
            LamStore.setInitialAppState(LamStore.getAppState());
            if (callback) callback();
          }
        });
    } else if (layer.layers) {
      layer.layers.forEach(function (e) {
        loadLayersUri(e, callback);
      });
    }
  };

  return {
    lamInit: lamInit,
    loadLayersUri: loadLayersUri,
    loadRemoteLayers: loadRemoteLayers,
    appInit: appInit,
  };
})();

//exports.LamLoader = LamLoader;

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

var LamRequests = (function () {
  let requestsData = [];

  let addRequestData = function (key, data) {
    requestsData.push({
      key: key,
      data: data,
    });
  };

  let removeRequestData = function (key) {
    requestsData = requestsData.filter(function (element) {
      return element.key != key;
    });
  };

  let getRequestData = function (key) {
    return requestsData.filter(function (element) {
      return element.key == key;
    });
  };

  let getRequestsData = function () {
    return requestsData;
  };

  /**
   * Sends a preload request using JSONP protocol. Even if JSONP has been replaced by CORS, geoserver sens a 404 response if not
   * authenticated and the Allow-Control-Allow-Origin is not always predictable
   */
  let sendPreloadRequest = function (url) {
    $.ajax({
      dataType: "jsonp",
      url: url + "&format_options=callback:LamRequests.parseResponsePreload",
      error: function (jqXHR, textStatus, errorThrown) {
        lamDispatch({
          eventName: "log",
          message: "LamSearchTools: unable to complete response preload",
        });
      },
    });
  };

  let parseResponsePreload = function (data) {
    if (!data.features.length) return;
    let layerId = data.features[0].id.split(".")[0];
    var layer = getRequestData(layerId);
    if (!layer.length) return;
    layer = layer[0].data;
    let vectorSource = new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      features: new ol.format.GeoJSON().readFeatures(data),
      strategy: ol.loadingstrategy.all,
    });
    let vector = new ol.layer.Vector({
      //zIndex: parseInt(zIndex),
      source: vectorSource,
      visible: layer.getVisible(),
      style: LamMapStyles.getPreloadStyle(layer.vectorWidth, layer.vectorRadius),
    });
    try {
      vector.gid = layer.gid + "_preload";
      vector.hoverTooltip = layer.hoverTooltip;
      vector.srid = layer.srid;
      //LamMap. mainMap.addLayer(vector);
    } catch (error) {}
    LamMap.getMap().addLayer(vector);
    vector.setZIndex(parseInt(layer.zIndex));
    //vector.setMap(LamMap.getMap());
  };

  // let xhr = new XMLHttpRequest();
  // xhr.withCredentials = false;
  // xhr.open("GET", getWFSfromWMS(preloadUrl));
  // xhr.setRequestHeader("Accept", "*/*");
  // xhr.setRequestHeader("Sec-Fetch-Mode", "no-cors");
  // xhr.setRequestHeader("Sec-Fetch-Site", "cross-sited");
  // xhr.setRequestHeader("Host", "geoserver.comune.re.it");
  // let onError = function() {
  //   //vectorSource.removeLoadedExtent(extent);
  // };
  // xhr.onerror = onError;
  // xhr.onload = function() {
  //   if (xhr.status == 200) {
  //     vectorSource.addFeatures(vectorSource.getFormat().readFeatures(xhr.responseText));
  //   } else {
  //     onError();
  //   }
  // };
  // xhr.send();

  return {
    getRequestsData: getRequestsData,
    getRequestData: getRequestData,
    addRequestData: addRequestData,
    removeRequestData: removeRequestData,
    sendPreloadRequest: sendPreloadRequest,
    parseResponsePreload: parseResponsePreload,
  };
})();

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

let LamTables = (function () {
  let currentLayerGid = 0;
  let currentPageIndex = 0;
  let currentPageSize = 25;
  let sortAttribute = "OGR_FID";
  let currentFeatureCount = -1;

  let init = function () {
    LamDispatcher.bind("show-attribute-table", function (payload) {
      LamTables.renderLayerAttributeTable(payload.gid, payload.maxFeatures, payload.pageIndex, payload.sortBy);
    });
  };

  let renderLayerAttributeTable = function (layerGid, maxFeatures, pageIndex, sortBy) {
    if (currentLayerGid != layerGid) {
      currentLayerGid = layerGid;
      currentFeatureCount = -1;
    }
    if (maxFeatures) currentPageSize = maxFeatures;
    if (sortBy) sortAttribute = sortBy;
    currentPageIndex = pageIndex ? pageIndex : 0;
    //page index should be reset when overflows the feature count
    if (currentFeatureCount === -1) {
      currentPageIndex = 0;
    } else {
      if (currentFeatureCount < currentPageIndex * currentPageSize) currentPageIndex = 0;
    }

    let startIndex = pageIndex ? currentPageIndex * currentPageSize : 0;
    lamDispatch("show-loader");
    let layer = LamStore.getLayer(layerGid);
    if (!layer) return;
    let wfsUrl = LamMap.getWFSUrlfromLayer(layer, "text/javascript");
    //WFS version 2
    wfsUrl = wfsUrl.replace("version=1.0.0", "version=2.0.0");
    wfsUrl += "&sortBy=" + sortAttribute;
    wfsUrl += "&format_options=callback:LamTables.parseResponseTable";
    if (currentPageSize) wfsUrl += "&count=" + currentPageSize;
    if (startIndex) wfsUrl += "&startIndex=" + startIndex;
    $.ajax({
      dataType: "jsonp",
      url: wfsUrl,
      jsonp: true,
      cache: false,
      error: function (jqXHR, textStatus, errorThrown) {
        lamDispatch({
          eventName: "log",
          message: "LamTables: unable to complete response",
        });
        lamDispatch("hide-loader");
      },
    });
  };

  let parseResponseTable = function (data) {
    lamDispatch("hide-loader");
    let layer = LamStore.getLayer(currentLayerGid);
    currentFeatureCount = data.totalFeatures;
    if (data.features) {
      data = data.features;
    }
    if (!Array.isArray(data)) data = [data];
    let propsList = [];
    for (let i = 0; i < data.length; i++) {
      let props = data[i].properties ? data[i].properties : data[i];
      propsList.push(props);
    }
    let template = LamTemplates.getTemplate(currentLayerGid, layer.templateUrl, LamStore.getAppState().templatesRepositoryUrl);
    let tableTemplate = template ? LamTables.getTableTemplate(template, layer) : LamTemplates.standardTableTemplate(propsList[0], layer);
    let title = layer.layerName;
    let body = "";
    let compiledTemplate = Handlebars.compile(tableTemplate);
    body += compiledTemplate(propsList);
    //pulsanti paginazione
    body += "<div class='lam-grid lam-no-bg lam-mt-1'>";
    let startIndex = currentPageIndex * currentPageSize + 1;
    body += "<div class='lam-col'> N° ";
    body +=
      "" +
      startIndex +
      "-" +
      ((currentPageIndex + 1) * currentPageSize > currentFeatureCount ? currentFeatureCount : startIndex + currentPageSize - 1) +
      " su " +
      currentFeatureCount;
    body += "</div>";
    body += "<div class='lam-col'> Mostra ";
    body += "<select class='lam-select-small ' onchange='LamTables.updatePageSize(this)'>";
    for (let index = 25; index <= 100; index += 25) {
      body += "<option value='" + index + "' " + (index === currentPageSize ? "selected" : "") + ">" + index + "</option>\n";
    }
    body += " </select>";
    body += "</div>";
    body += "<div class='lam-col'>";
    body += " Pag. <select class='lam-select-small ' onchange='LamTables.updatePageIndex(this)'>";
    for (let index = 1; index <= Math.floor(currentFeatureCount / currentPageSize) + 1; index++) {
      body += "<option value='" + index + "' " + (index === currentPageIndex + 1 ? "selected" : "") + ">" + index + "</option>";
    }
    body += " </select>";

    body += "/" + (Math.floor(currentFeatureCount / currentPageSize) + 1);
    body += "</div>";
    body += "<div class='lam-col'>";
    if (currentPageIndex > 0) {
      body +=
        "<button class='lam-btn lam-btn-small' onclick=\"lamDispatch({ eventName: 'show-attribute-table', gid: '" +
        currentLayerGid +
        "', pageIndex: " +
        (currentPageIndex - 1) +
        ' });"><i class="lam-icon">' +
        LamResources.svgArrowLeft +
        "</i></button>";
    }
    if (propsList.length == currentPageSize) {
      body +=
        "<button class='lam-btn lam-btn-small' onclick=\"lamDispatch({ eventName: 'show-attribute-table', gid: '" +
        currentLayerGid +
        "', pageIndex:" +
        (currentPageIndex + 1) +
        ' });"><i class="lam-icon">' +
        LamResources.svgArrowRight +
        "</i></button>";
    }
    body += "</div>";
    body += "</div>";
    LamDom.showContent(LamEnums.showContentMode().InfoWindow, title, body);
  };

  let getTableTemplate = function (template, layer) {
    let attribute = getNormalizedSortAttribute();

    let str = "<table class='lam-table'>";
    str += "<tr>";
    for (let i = 0; i < template.fields.length; i++) {
      str += "<th class='" + (template.fields[i].field === attribute ? " lam-sorted " : "") + "' >";
      str +=
        "<i class='lam-pointer ' onclick=\"lamDispatch({ eventName: 'show-attribute-table', sortBy: '" +
        (template.fields[i].field === sortAttribute ? template.fields[i].field + " DESC" : template.fields[i].field) +
        "', gid: '" +
        layer.gid +
        "'  }); return false;\">";
      str += template.fields[i].field === attribute && !sortAttributeIsDescending(sortAttribute) ? LamResources.svgExpandLess16 : LamResources.svgExpandMore16;
      str += "</i></a>";
      str += template.fields[i].label + "</th>";
    }
    str += "</tr>";
    str += "{{#each this}}<tr>";
    for (let i = 0; i < template.fields.length; i++) {
      str += "<td>{{" + template.fields[i].field + "}}</td>";
    }
    str += "</tr>{{/each}}";
    str += "</table>";
    return str;
  };

  let updatePageSize = function (sender) {
    if ($(sender).val()) {
      LamTables.renderLayerAttributeTable(currentLayerGid, parseInt($(sender).val()), currentPageIndex, sortAttribute);
    }
  };
  let updatePageIndex = function (sender) {
    if ($(sender).val()) {
      LamTables.renderLayerAttributeTable(currentLayerGid, currentPageSize, parseInt($(sender).val()) - 1, sortAttribute);
    }
  };

  let getNormalizedSortAttribute = function () {
    let attributeName = sortAttribute || "";
    if (sortAttributeIsDescending(attributeName)) {
      attributeName = sortAttribute.slice(0, -5); //Descending
    }
    return attributeName;
  };

  let sortAttributeIsDescending = function (attribute) {
    return attribute.indexOf(" DESC", attribute.length - " DESC".length) !== -1;
  };

  return {
    init: init,
    renderLayerAttributeTable: renderLayerAttributeTable,
    getTableTemplate: getTableTemplate,
    getNormalizedSortAttribute: getNormalizedSortAttribute,
    parseResponseTable: parseResponseTable,
    updatePageSize: updatePageSize,
    updatePageIndex: updatePageIndex,
  };
})();

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

var LamStore = (function () {
  var mapDiv = null;
  var mapTemplateUrl = null;
  var appState = null;
  var initialAppState = null;
  var authToken = null;
  let infoClickEnabled = true;

  var setMapDiv = function (div) {
    mapDiv = div;
  };

  var getMapDiv = function () {
    return mapDiv;
  };

  var getAppId = function () {
    return LamStore.getAppState().appId;
  };

  var setMapTemplateUrl = function (url) {
    mapTemplateUrl = url;
  };

  var getMapTemplateUrl = function () {
    let tempTemplateUrl = "map.html";
    if (LamStore.getAppState().urlMapTemplate != null) {
      tempTemplateUrl = LamStore.getAppState().urlMapTemplate;
    }
    return mapTemplateUrl ? mapTemplateUrl : tempTemplateUrl;
  };

  /**
   * Restituisce l'appstate corrente
   * @return {object} AppState corrente
   */
  var getAppState = function () {
    return appState;
  };

  /**
   * Restituisce l'appstate iniziale
   * @return {object} AppState iniziale
   */
  var getInitialAppState = function () {
    return initialAppState;
  };

  /**
   * Imposta l'appstate corrente
   */
  var setAppState = function (currentAppState) {
    appState = normalizeAppState(currentAppState);
    if (LamDom.isMobile() && appState.improveMobileBehaviour) {
      appState = normalizeMobile(appState);
    }
  };

  /**
   * Imposta l'appstate iniziale
   */
  var setInitialAppState = function (appState) {
    initialAppState = JSON.parse(JSON.stringify(appState));
    initialAppState = normalizeAppState(initialAppState);
    if (LamDom.isMobile() && initialAppState.improveMobileBehaviour) {
      initialAppState = normalizeMobile(initialAppState);
    }
  };

  /**
   * Set the default parameters for appstate
   * @param {Object} normalize the given appstate
   */
  let normalizeAppState = function (appstate) {
    if (!appstate.srid) appstate.srid = 3857;
    if (!appstate.currentInfoItems) appstate.currentInfoItems = [];
    if (!appstate.infoSelectBehaviour) appstate.infoSelectBehaviour = 2;
    if (!appstate.relations) appstate.relations = [];
    if (!appstate.charts) appstate.charts = [];

    //if some parameters are defined in the querystring they will be inherited in the appstate
    let searchArray = location.search.replace("?", "").split("&");
    searchArray.forEach(function (parameter) {
      if (parameter.indexOf("prop-") == 0) {
        let parameterArray = parameter.split("=");
        if (parameterArray.length == 2) {
          appstate[parameterArray[0].replace("prop-", "")] = getNormalizedParameter(parameterArray[1]);
        }
      }
    });

    if (appstate.embed) {
      //embed the map
      appstate.termsLinks = null;
      appstate.hideLogo = true;
      appstate.showLegendOnLoad = false;
      appstate.showLayerTreeOnLoad = false;
      appstate.cookieConsent = null;
      for (var prop in appstate.modules) {
        //disable all modules
        if (Object.prototype.hasOwnProperty.call(appstate.modules, prop)) {
          appstate.modules[prop] = false;
        }
        //enable only layer tree and open full
        appstate.modules["layer-tree"] = true;
        appstate.modules["open-full"] = true;
      }
    } else {
      appstate.modules["open-full"] = false;
    }
    return appstate;
  };

  /**
   * Improve the appstate for mobile
   * @param {Object} normalize the given appstate
   */
  let normalizeMobile = function (appstate) {
    let normalizeMobileArray = function (layers) {
      for (let index = 0; index < layers.length; index++) {
        if (layers[index].preload) {
          layers[index].preload = 0;
          layers[index].queryable = 1;
        }
        if (layers[index].layers) {
          normalizeMobileArray(layers[index].layers);
        }
      }
    };
    normalizeMobileArray(appstate.layers);
    appState.disableAjaxRequestInfo = 0;
    return appstate;
  };

  /**
   * Trasform
   * @param {string} parameter  Url parameter
   */
  let getNormalizedParameter = function (parameter) {
    if (!isNaN(parameter)) {
      return parseFloat(parameter) % 1 === 0 ? parseInt(parameter) : parseFloat(parameter);
    }
    if (parameter.toLowerCase === "true") return true;
    if (parameter.toLowerCase === "false") return false;
    return parameter;
  };

  /**
   * Inverte la visualizzazione del layer
   * @param  {string} gid Identificativo del layer
   * @return {null}     Nessun valore restituito
   */
  var toggleLayer = function (gid) {
    let layer = getLayer(gid);
    let groupLayer = getGroupLayerByLayerGid(gid);
    if (layer) {
      layer.visible = 1 - layer.visible;
    }
    LamLayerTree.setCheckVisibility(gid, layer.visible);
    //hide all other layer based on the groupLayerProperty
    if (groupLayer != null && groupLayer.childLayersSelectionMode == 1 && layer.visible) {
      groupLayer.layers
        .filter(function (item) {
          return item.gid != gid;
        })
        .forEach(function (item) {
          if (item.layerType != "group") {
            LamMap.setLayerVisibility(item.gid, false);
            LamStore.setLayerVisibility(item.gid, false);
          } else {
            setLayersVisibilityInGroup(item.gid, false);
          }
        });
    }
  };

  /**
   * Toggle all layers within a group
   * @param {string} gid Layer global id
   */
  let toggleLayersInGroup = function (gid) {
    let icon = $("#" + gid + "_c"); //TODO convention better to gain name from parameter
    let visibility = !icon.hasClass("lam-checked");
    setLayersVisibilityInGroup(gid, visibility);
  };

  /**
   * Set visibility of all layers within a group
   * @param {string} gid Layer global id
   */
  let setLayersVisibilityInGroup = function (gid, visibility) {
    let groupLayer = getLayer(gid);
    if (groupLayer && groupLayer.layers) {
      groupLayer.layers.forEach(function (layer) {
        if (layer.layerType != "group") {
          LamMap.setLayerVisibility(layer.gid, visibility);
          LamStore.setLayerVisibility(layer.gid, visibility);
        } else {
          setLayersVisibilityInGroup(layer.gid, visibility);
        }
      });
    }
    LamLayerTree.setCheckVisibility(gid, visibility);
  };

  /**
   * Imposta la visibilità del layer
   * @param  {string} gid  Identificativo del layer
   * @param  {boolean} visibility Visibilità del layer da impostare
   * @return {null}  Nessun valore restituito
   */
  var setLayerVisibility = function (gid, visibility) {
    let layer = getLayer(gid);
    if (layer) {
      layer.visible = visibility;
    }
    LamLayerTree.setCheckVisibility(gid, layer.visible);
  };

  /**
   * Internal function for recursion
   * @param {Array} layers
   * @param {string} gid
   */
  var getLayerArray = function (layers, gid) {
    var layerFound = null;
    layers.forEach(function (layer) {
      if (layer.gid === gid) {
        layerFound = layer;
      }
      if (!layerFound && layer.layers) {
        layerFound = LamStore.getLayerArray(layer.layers, gid);
      }
    });
    return layerFound;
  };

  /**
   * Internal function for recursion
   * @param {Array} layers
   * @param {string} layerName
   */
  var getLayerArrayByName = function (layers, layerName) {
    var layerFound = null;
    layers.forEach(function (layer) {
      if (layer.layer && $.inArray(layerName, layer.layer.split(":")) >= 0) {
        layerFound = layer;
      }
      if (!layerFound && layer.layers) {
        layerFound = LamStore.getLayerArrayByName(layer.layers, layerName);
      }
    });
    return layerFound;
  };

  /**
   * Funzione che restituisce il nome del campo geometria del layer
   * Al momento non è implementato
   * @param {string} gid
   * @returns string
   */
  var getLayerGeometryFieldName = function (gid) {
    let layer = getLayer(gid);
    if (layer.geometryFieldName) return layer.geometryFieldName;
    if (LamStore.getAppState().geometryFieldName) return LamStore.getAppState().geometryFieldName;
    return "ORA_GEOMETRY";
  };

  /**
   * Restituisce il layer dall'identificativo
   * @param  {string} gid identificativo del layer
   * @return {object}     Layer
   */
  var getLayer = function (gid) {
    return LamStore.getLayerArray(appState.layers, gid);
  };

  /**
   * Restituisce il layer dal nome
   * @param  {string} layerName nome del layer
   * @return {object}     Layer
   */
  var getLayerByName = function (layerName) {
    return LamStore.getLayerArrayByName(appState.layers, layerName);
  };

  /**
   * Sorting functionby layer name
   * @param {object} a
   * @param {object} b
   */
  function SortByLayerName(a, b) {
    var aName = a.layerName.toLowerCase();
    var bName = b.layerName.toLowerCase();
    return aName < bName ? -1 : aName > bName ? 1 : 0;
  }

  /**
   * Restituisce tutti i layer abilitati all'interrogazione
   * @return {array} Array dei layer interrogabili
   */
  var getQueryLayers = function () {
    let layers = getQueryLayersArray(appState.layers);
    layers.sort(SortByLayerName);
    return layers;
  };

  /**
   * Function needed for getting query layers recursively
   * @param {Object} layers
   */
  var getQueryLayersArray = function (layers) {
    var layersFound = [];
    layers.forEach(function (layer) {
      if (layer.queryable) {
        layersFound.push(layer);
      }
      if (layer.layers) {
        layersFound = layersFound.concat(getQueryLayersArray(layer.layers));
      }
    });
    return layersFound;
  };

  /**
   * Restituisce tutti i layer abilitati alla ricerca
   * @return {array} Array dei layer ricercarbili
   */
  var getSearchLayers = function () {
    let layers = getSearchLayersArray(appState.layers);
    layers.sort(SortByLayerName);
    return layers;
  };

  /**
   * Function needed for getting search layers recursively
   * @param {Object} layers
   */
  var getSearchLayersArray = function (layers) {
    var layersFound = [];
    layers.forEach(function (layer) {
      if (layer.searchable && layer.searchField) {
        layersFound.push(layer);
      }
      if (layer.layers) {
        layersFound = layersFound.concat(getSearchLayersArray(layer.layers));
      }
    });
    return layersFound;
  };

  /**
   * Restituisce tutti i layer visibili
   * @return {array} Array dei layer ricercarbili
   */
  var getVisibleLayers = function () {
    let layers = getVisibleLayersArray(appState.layers);
    layers.sort(SortByLayerName);
    return layers;
  };

  /**
   * Function needed for getting search layers recursively
   * @param {Object} layers
   */
  var getVisibleLayersArray = function (layers) {
    var layersFound = [];
    layers.forEach(function (layer) {
      if (layer.visible) {
        layersFound.push(layer);
      }
      if (layer.layers) {
        layersFound = layersFound.concat(getVisibleLayersArray(layer.layers));
      }
    });
    return layersFound;
  };

  /**
   * Get Group Layer bu Layer Gid
   * @param {string} gid Layer gid
   */
  var getGroupLayerByLayerGid = function (gid) {
    var layerGroupsFound = [];
    appState.layers.forEach(function (layer) {
      var layerGroup = getGroupLayerByLayerGidArray(layer, gid);
      if (layerGroup) {
        layerGroupsFound.push(layerGroup);
      }
    });
    return layerGroupsFound.length ? layerGroupsFound[0] : null;
  };

  /**
   * Function needed for getting group layer recursively
   * @param {Object} layerGroup
   * @param {string} gid
   */
  var getGroupLayerByLayerGidArray = function (layerGroup, gid) {
    var layerFound = null;
    layerGroup.layers.forEach(function (layer) {
      if (layer.gid === gid) {
        layerFound = layer;
      }
      if (!layerFound && layer.layers) {
        layerFound = getGroupLayerByLayerGidArray(layer, gid);
      }
    });
    if (layerFound && layerFound.layerType === "group") return layerFound;
    return layerFound ? layerGroup : null;
  };

  /**
   * Ricarica i livelli della mappa
   * @return {null}
   */
  var liveReload = function (newAppState) {
    LamStore.setAppState(newAppState);
    LamDom.showAppTools();
    LamLayerTree.render(null, newAppState.layers);
    LamMap.removeAllLayersFromMap();
    LamMap.loadConfig(newAppState);
  };

  var mapReload = function () {
    LamLayerTree.render(null, appState.layers);
    LamMap.removeAllLayersFromMap();
    LamMap.loadConfig(appState);
  };

  /**
   * Resetta i layer alla situazione iniziale
   * @return {null} Nessun valore restituito
   */
  var resetInitialLayers = function () {
    if (initialAppState.layers) {
      resetLayersArray(initialAppState.layers);
    }
    //resetting checkboxes
    LamLayerTree.updateCheckBoxesStates(LamStore.getAppState().layers);
  };

  var resetLayersArray = function (layers) {
    layers.forEach(function (layer) {
      if (layer.layerType != "group") {
        lamDispatch({
          eventName: "set-layer-visibility",
          gid: layer.gid,
          visibility: parseInt(layer.visible),
        });
      }
      if (layer.layers) {
        resetLayersArray(layer.layers);
      }
    });
  };

  var getInfoClickEnabled = function () {
    return infoClickEnabled;
  };

  var setInfoClickEnabled = function (status) {
    infoClickEnabled = status;
  };

  var doLogin = function (username, password) {
    switch (appState.authentication.authType) {
      case "anonymous":
        LamAuthTools.hideLogin();
        break;
      case "basic":
        //adding the base64 token
        appState.authentication.authToken = window.btoa(username + ":" + password);
        LamAuthTools.hideLogin();
        break;
      case "form":
        var username = "";
        var password = "";
        $.ajax({
          type: "POST",
          url: "",
          dataType: "html",
          async: false,
          cache: false,
          data: '{"username": "' + username + '", "password" : "' + password + '"}',
          success: function () {
            alert("Thanks for your comment!");
          },
        });
        LamAuthTools.hideLogin();
        break;
      case "custom":
        //TODO implement custom auth url ancd object
        var url = getAppState().restAPIUrl + "/api/auth?username=" + username + "&password=" + password;
        $.ajax({
          dataType: "json",
          url: url,
          cache: false,
        })
          .done(function (data) {
            authToken = data;
            LamAuthTools.hideLogin();
          })
          .fail(function (data) {
            LamAuthTools.showError();
            lamDispatch({
              eventName: "log",
              message: "LamStore: Unable to autheticate user",
            });
          });
        break;
      default:
        break;
    }
    mapReload();
  };

  var openUrlTemplate = function (urlTemplate) {
    //credo delle proprietà standard
    var props = {};
    props.token = authToken.token;
    var ll = LamMap.getMapCenterLonLat();
    props.lon = ll[0];
    props.lat = ll[1];
    var template = Handlebars.compile(urlTemplate);
    var url = template(props);

    var win = window.open(url, "_blank");
    win.focus();
  };

  var getAuthorizationHeader = function () {
    switch (appState.authentication.authType) {
      case "basic":
        return "Basic " + appState.authentication.authToken;
      default:
        return appState.authentication.authToken;
    }
  };

  let getCurrentInfoItems = function () {
    return LamStore.getAppState().currentInfoItems;
  };

  let getCurrentInfoItem = function (index) {
    return LamStore.getAppState().currentInfoItems.features[index];
  };

  /**
   * Genera un GUID
   * @return {string} guid
   */
  let guid = function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
  };

  let getOpenResultInInfoWindow = function () {
    return LamStore.getAppState().openResultInInfoWindow;
  };

  let getLinks = function () {
    if (!LamStore.getAppState().links) {
      LamStore.getAppState().links = [];
    }
    return LamStore.getAppState().links;
  };

  let getTermsLinks = function () {
    if (!LamStore.getAppState().termsLinks) {
      LamStore.getAppState().termsLinks = [];
    }
    return LamStore.getAppState().termsLinks;
  };

  let parseResponse = function (e) { };

  let getLayers = function () {
    let arrDest = [];
    getLayersRecursive(appState.layers, null, arrDest);
    return arrDest;
  };

  let getLayersRecursive = function (layers, groupLayer, arrDest) {
    layers.forEach((layer) => {
      //adding group layer data
      if (groupLayer) {
        layer.groupName = groupLayer.layerName;
        layer.groupGid = groupLayer.gid;
      }
      arrDest.push(layer);
      if (layer.layers) {
        getLayersRecursive(layer.layers, layer, arrDest);
      }
    });
  };

  let loadRemoteCharts = function () {
    if (!appState.chartsUrl) return;
    if (!Array.isArray(appState.chartsUrl)) {
      appState.chartsUrl = [appState.chartsUrl];
    }
    if (!appState.charts) appState.charts = [];
    let chartsUrl = [...appState.chartsUrl]; //cloning...
    function loadChartsRecursively(url) {
      $.ajax({
        dataType: "json",
        url: url,
        cache: false,
      })
        .done(function (data) {
          appState.charts = appState.charts.concat(data);
          if (chartsUrl.length) {
            loadChartsRecursively(chartsUrl.shift());
          }
        })
        .fail(function (data) {
          lamDispatch({
            eventName: "log",
            message: "LamStore: Unable to load chartsUrl " + url,
          });
        });
    }
    loadChartsRecursively(chartsUrl.shift());
  };

  let loadRemoteLinks = function () {
    if (!appState.linksUrl) return;
    if (!Array.isArray(appState.linksUrl)) {
      appState.linksUrl = [appState.linksUrl];
    }
    if (!appState.links) appState.links = [];
    let linksUrl = [...appState.linksUrl]; //cloning...
    function loadLinkRecursively(url) {
      $.ajax({
        dataType: "json",
        url: url,
        cache: false,
      })
        .done(function (data) {
          appState.links = appState.links.concat(data);
          if (linksUrl.length) {
            loadLinkRecursively(linksUrl.shift());
          }
        })
        .fail(function (data) {
          lamDispatch({
            eventName: "log",
            message: "LamStore: Unable to load linksUrl " + url,
          });
        });
    }
    loadLinkRecursively(linksUrl.shift());
  };

  let loadRemoteRelations = function () {
    if (!appState.relationsUrl) return;
    if (!Array.isArray(appState.relationsUrl)) {
      appState.relationsUrl = [appState.relationsUrl];
    }
    if (!appState.relations) appState.relations = [];
    let relationsUrl = [...appState.relationsUrl]; //cloning...
    function loadRelationRecursively(url) {
      $.ajax({
        dataType: "json",
        url: url,
        cache: false,
      })
        .done(function (data) {
          //loading templates
          LamTemplates.loadRelationsTemplates(data, appState.templatesRepositoryUrl);
          appState.relations = appState.relations.concat(data);
          if (relationsUrl.length) {
            loadRelationRecursively(relationsUrl.shift());
          }
        })
        .fail(function (data) {
          lamDispatch({
            eventName: "log",
            message: "LamStore: Unable to load relationsUrl " + url,
          });
        });
    }
    loadRelationRecursively(relationsUrl.shift());
  };

  return {
    doLogin: doLogin,
    getAppState: getAppState,
    getAuthorizationHeader: getAuthorizationHeader,
    getCurrentInfoItem: getCurrentInfoItem,
    getCurrentInfoItems: getCurrentInfoItems,
    getGroupLayerByLayerGid: getGroupLayerByLayerGid,
    getInfoClickEnabled: getInfoClickEnabled,
    getInitialAppState: getInitialAppState,
    getLayerGeometryFieldName: getLayerGeometryFieldName,
    getLayer: getLayer,
    getLayerArray: getLayerArray,
    getLayerArrayByName: getLayerArrayByName,
    getLayerByName: getLayerByName,
    getLayers: getLayers,
    getLinks: getLinks,
    getMapDiv: getMapDiv,
    getAppId: getAppId,
    getQueryLayers: getQueryLayers,
    getMapTemplateUrl: getMapTemplateUrl,
    getSearchLayers: getSearchLayers,
    getTermsLinks: getTermsLinks,
    getVisibleLayers: getVisibleLayers,
    guid: guid,
    setInfoClickEnabled: setInfoClickEnabled,
    mapReload: mapReload,
    liveReload: liveReload,
    loadRemoteCharts: loadRemoteCharts,
    loadRemoteLinks: loadRemoteLinks,
    loadRemoteRelations: loadRemoteRelations,
    openUrlTemplate: openUrlTemplate,
    getOpenResultInInfoWindow: getOpenResultInInfoWindow,
    parseResponse: parseResponse,
    resetInitialLayers: resetInitialLayers,
    setAppState: setAppState,
    setInitialAppState: setInitialAppState,
    setLayersVisibilityInGroup: setLayersVisibilityInGroup,
    setMapDiv: setMapDiv,
    setMapTemplateUrl: setMapTemplateUrl,
    setLayerVisibility: setLayerVisibility,
    toggleLayer: toggleLayer,
    toggleLayersInGroup: toggleLayersInGroup,
  };
})();

//exports.LamStore = LamStore;

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

let LamLayerTree = (function () {
  let treeDiv = "layer-tree";
  let isRendered = false;
  let layerGroupPrefix = "lt";

  let init = function () {
    //events binding
    LamDispatcher.bind("show-layers", function (payload) {
      LamToolbar.toggleToolbarItem(treeDiv);
    });
  };

  let render = function (div, layers) {
    if (div) treeDiv = div;
    if (!isRendered) {
      init();
    }
    let output = "";
    output += '<h4 class="lam-title">Oggetti</h4>';
    output += '<div class="layertree">'; //generale
    let index = 0;
    layers.forEach(function (element) {
      output += renderGroup(element, layerGroupPrefix + "_" + index);
      index++;
    });
    //sezione funzioni generali
    output += '<div class="layertree-item-bottom">';
    output +=
      '<button class="lam-btn lam-btn-small lam-btn-floating lam-right lam-depth-1 ripple" alt="Reset dei layer" title="Reset dei layer" onClick="LamDispatcher.dispatch({eventName:\'reset-layers\'})"><i class="lam-icon">' +
      LamResources.svgRefreshMap +
      "</i></button>";
    output += "</div>";
    output += '<div class="layertree-item-bottom lam-scroll-padding"></div>'; //spaziatore
    output += "</div>"; //generale

    jQuery("#" + treeDiv).html(output);

    updateCheckBoxesStates(LamStore.getAppState().layers);
    if (LamStore.getAppState().showLayerTreeOnLoad && !isRendered) {
      LamDispatcher.dispatch({
        eventName: "show-layers",
      });
    }
    isRendered = true;
  };

  let renderLayer = function (layer, layerId) {
    let output = "";
    output += formatString('<div id="{0}" class="layertree-layer layertree-layer-border {1}">', layerId, layer.cssClass ? layer.cssClass : "");
    let layerNameIcon = "";
    if (layer.iconSvg) {
      layerNameIcon = '<svg width="16" height="16" class="lam-mr-1 lam-layer-icon">' + layer.iconSvg + "</svg>";
    }
    if (layer.iconUrl) {
      layerNameIcon = '<img width="16" height="16" class="lam-mr-1 lam-layer-icon" alt="Layer icon" src="' + layer.iconUrl + '" />';
    }
    if (layer.showDescriptionInLayerTree && layer.layerDescription) {
      output += formatString('<div class="layertree-layer__title-text">{2}{0} - {1}</div>', layer.layerName, layer.layerDescription, layerNameIcon);
    } else {
      output += formatString('<div class="layertree-layer__title-text">{1}{0}</div>', layer.layerName, layerNameIcon);
    }
    output += '<div class="layertree-layer__layers-icons">';
    output += formatString(
      '<i title="Mostra/Nascondi layer" id="{2}_c" class="layertree-layer__icon lam-right" onclick="LamDispatcher.dispatch({eventName:\'toggle-layer\',gid:\'{2}\'})">{1}</i>',
      layerId,
      layer.visible ? LamResources.svgCheckbox : LamResources.svgCheckboxOutline,
      layer.gid
    );
    if (!layer.hideLegend) {
      output += formatString(
        '<i title="Informazioni sul layer" class="layertree-layer__icon lam-right" onclick="LamDispatcher.dispatch({ eventName: \'show-legend\', gid: \'{0}\', scaled: true })">{1}</i>',
        layer.gid,
        LamResources.svgInfo
      );
    }

    output += "</div>";
    output += "</div>";
    return output;
  };

  let renderLayerTools = function (groupLayer, groupId) {
    let output = "";
    //--------------
    output += formatString('<div id="" class="layertree-layer">');
    output += formatString('<div class="layertree-layer__title-text"></div>');
    output += '<div class="layertree-layer__layers-icons">';
    //placeholder
    //output += '<i class="layertree-layer__icon lam-right layertree-layer__icon-empty"></i>';
    output += "</div>";
    output += "</div>";
    return output;
  };

  let renderGroup = function (groupLayer, groupId) {
    let output = "";
    output += '<div class="layertree-item" >';
    output += "<div class='layertree-group lam-background'>";
    output += formatString(
      '<div class="layertree-group__title {1} {2}">',
      groupId,
      groupLayer.cssClass ? groupLayer.cssClass : "",
      groupLayer.nestingStyle ? "layertree-group__title--" + groupLayer.nestingStyle : ""
    );
    output += formatString(
      '<i id="{0}_i" class="layertree-group__icon {2}" onclick="LamLayerTree.toggleGroup(\'{0}\');">{1}</i>',
      groupId,
      groupLayer.visible ? LamResources.svgExpandMore : LamResources.svgChevronRight,
      groupLayer.visible ? "lam-plus" : "lam-minus"
    );
    output += "<span class='layertree-group__title-text'>" + groupLayer.layerName + "</span>";
    output += '<div class="layertree-group__layers-icons">';
    if (groupLayer.childLayersSelectionMode != 1) {
      //single selection layer
      output += formatString(
        '<i title="Mostra/Nascondi tutti i layer" id="{0}_c" class="layertree-group__icon lam-right" onclick="LamDispatcher.dispatch({eventName:\'toggle-layer-group\',gid:\'{0}\'})">{1}</i>',
        groupLayer.gid,
        LamResources.svgCheckboxOutline //groupLayer.visible ? LamResources.svgCheckbox : LamResources.svgCheckboxOutline
      );
    }
    output += "</div>";
    output += "</div>";
    output += "</div>";

    output += formatString('<div id="{0}_u" class="layertree-item__layers layertree--{1}">', groupId, groupLayer.visible ? "visible" : "hidden");
    if (groupLayer.layers) {
      let index = 0;
      groupLayer.layers.forEach(function (element) {
        switch (element.layerType) {
          case "group":
            output += renderGroup(element, groupId + "_" + index);
            break;
          default:
            output += renderLayer(element, groupId + "_" + index);
            break;
        }
        index++;
      });
    }

    //tools section
    if (groupLayer.layers) {
      let geoLayers = groupLayer.layers.filter(function (el) {
        return el.layerType !== "group";
      });
      if (geoLayers.length) {
        output += renderLayerTools(groupLayer, groupId);
      }
    }
    output += "</div>";
    output += "</div>";
    return output;
  };

  let setCheckVisibility = function (layerGid, visibility) {
    const item = "#" + layerGid + "_c";
    if (visibility) {
      $(item).html(LamResources.svgCheckbox);
      $(item).addClass("lam-checked");
      $(item).removeClass("lam-unchecked");
    } else {
      $(item).html(LamResources.svgCheckboxOutline);
      $(item).removeClass("lam-checked");
      $(item).addClass("lam-unchecked");
    }
  };

  let toggleGroup = function (groupName) {
    const item = "#" + groupName + "_u";
    if ($(item).hasClass("layertree--hidden")) {
      $(item).removeClass("layertree--hidden");
      $(item).addClass("layertree--visible");
    } else {
      $(item).removeClass("layertree--visible");
      $(item).addClass("layertree--hidden");
    }
    const icon = "#" + groupName + "_i";
    if ($(icon).hasClass("lam-plus")) {
      $(icon).removeClass("lam-plus");
      $(icon).addClass("lam-minus");
      $(icon).html(LamResources.svgChevronRight);
      return;
    } else {
      $(icon).removeClass("lam-minus");
      $(icon).addClass("lam-plus");
      $(icon).html(LamResources.svgExpandMore);
      return;
    }
  };

  let formatString = function () {
    let str = arguments[0];
    for (k = 0; k < arguments.length - 1; k++) {
      str = str.replace(new RegExp("\\{" + k + "\\}", "g"), arguments[k + 1]);
    }
    return str;
  };

  /**
   * Sets the initial grouplayer check, based on the children visibility
   */
  let updateCheckBoxesStates = function (layers) {
    layers.forEach(function (groupLayer) {
      if (groupLayer.layerType != "group") return;
      countLayerGroupFatherVisibility(groupLayer);
      if (groupLayer.layers) {
        updateCheckBoxesStates(groupLayer.layers);
      }
    });

    function countLayerGroupFatherVisibility(groupLayer) {
      let layerCount = 0;
      let layerVisibile = 0;
      if (!groupLayer.layers) return;
      groupLayer.layers.forEach(function (layer) {
        if (layer.layerType != "group") {
          layerCount++;
          if (layer.visible) layerVisibile++;
        } else {
          countLayerGroupChildrenVisibility(layer);
        }
      });
      setCheckVisibility(groupLayer.gid, layerVisibile === layerCount);

      function countLayerGroupChildrenVisibility(groupLayer) {
        if (!groupLayer.layers) return;
        groupLayer.layers.forEach(function (layer) {
          if (layer.layerType != "group") {
            layerCount++;
            if (layer.visible) layerVisibile++;
          } else {
            countLayerGroupChildrenVisibility(layer);
          }
        });
      }
    }
  };

  return {
    formatString: formatString,
    render: render,
    init: init,
    setCheckVisibility: setCheckVisibility,
    toggleGroup: toggleGroup,
    updateCheckBoxesStates: updateCheckBoxesStates,
  };
})();

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
 *
 */
let LamTemplates = (function () {
  let templates = [];

  let init = function init() {
    //Ciclo i livelli che non hanno un template
    let tempLayers = LamStore.getAppState().layers;
    const repoTemplatesUrl = LamStore.getAppState().templatesRepositoryUrl;
    const tempRelations = LamStore.getAppState().relations;
    loadLayersTemplates(tempLayers, repoTemplatesUrl);
    loadRelationsTemplates(tempRelations, repoTemplatesUrl);
  };

  /**
   * Load all the layer templates in memory, retrieving by ajax
   * @param {Array} layers Layers array
   * @param {string} repoTemplatesUrl base url of the template repository
   */
  let loadLayersTemplates = function (layers, repoTemplatesUrl) {
    layers.forEach(function (layer) {
      if (layer.queryable || layer.preload || layer.searchable) {
        loadLayerTemplates(layer, repoTemplatesUrl);
      }
      if (layer.layers) loadLayersTemplates(layer.layers, repoTemplatesUrl);
    });
  };

  let loadRelationsTemplates = function (tempRelations, repoTemplatesUrl) {
    for (let i = 0; i < tempRelations.length; i++) {
      const relation = tempRelations[i];
      let templateUrl = getTemplateUrl(relation.gid, relation.templateUrl, repoTemplatesUrl);
      let template = templates.filter(function (el) {
        return el.templateUrl === templateUrl;
      });
      if (!template.length) {
        //aggiungo il layer vi ajax
        loadTemplateAjax(templateUrl);
      }
    }
  };

  /**
   * Load the templates defined for a layer
   * @param {Object} layer
   * @param {string} repoTemplatesUrl base url of the template repository
   */
  let loadLayerTemplates = function (layer, repoTemplatesUrl) {
    //transforming the templateUrl property into an array
    let templateUrlList = [];
    if (layer.templateUrl) templateUrlList.push(layer.templateUrl);
    if (layer.groupTemplateUrls) templateUrlList = templateUrlList.concat(layer.groupTemplateUrls);
    templateUrlList.forEach(function (templateUrl) {
      let templateUrlParsed = getTemplateUrl(layer.gid, templateUrl, repoTemplatesUrl);
      layer.templateUrlParsed = templateUrlParsed;
      let template = templates.filter(function (el) {
        return el.templateUrl === templateUrlParsed;
      });
      if (template.length === 0) {
        //aggiungo il layer via ajax
        loadTemplateAjax(templateUrlParsed);
      }
    });
  };

  /**
   * Add the template json object into the template collection. The template il loaded using ajax.
   * @param {string} templateUrl Absolute url of the template
   */
  let loadTemplateAjax = function (templateUrl) {
    $.ajax({
      dataType: "json",
      url: templateUrl,
      cache: false,
    })
      .done(function (data) {
        if (data) {
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
              let thisTemplate = data[i];
              thisTemplate.templateUrl = templateUrl;
              templates.push(normalizeTemplate(thisTemplate));
            }
          } else {
            data.templateUrl = templateUrl;
            templates.push(normalizeTemplate(data));
          }
        }
      })
      .fail(function (data) {
        lamDispatch({
          eventName: "log",
          message: "LamStore: Unable to load template",
        });
      });
  };

  /**
   * Gets the uri of the template to be loaded by ajax
   * @param {object} layer Oggetto del layer/relation
   * @param {templateUrl} templateUrl Url completo del template. Senza https aggiunge il @repoUrl come prefisso
   * @param {string} repoUrl Url del repository dove sono contenuti i templates
   */
  let getTemplateUrl = function (gid, templateUrl, repoUrl) {
    if (templateUrl) {
      if (templateUrl.toLowerCase().includes("http://") || templateUrl.toLowerCase().includes("https://")) {
        return templateUrl;
      } else {
        return repoUrl + "/" + templateUrl;
      }
    }
    return repoUrl + "/" + gid + ".json";
  };

  let getTemplates = function () {
    return templates;
  };

  let normalizeTemplate = function (template) {
    //multipleitems is default
    if (template.templateType == "table") template.multipleItems = true;
    return template;
  };

  /**
   *
   * @param {string} gid
   * @param {string} templateUrl
   * @param {string} repoUrl
   */
  let getTemplate = function (gid, templateUrl, repoUrl) {
    let templatesFilter = templates.filter(function (el) {
      return el.templateUrl === getTemplateUrl(gid, templateUrl, repoUrl);
    });
    if (templatesFilter.length > 0) {
      return templatesFilter[0];
    }
    return null;
  };

  /**
   * @param {string} featureId FeatureID di goserver. Viene utilizzato nel caso di layer group
   *                                  di geoserver, in quanto non ci sono alternative per identificare 
   *                                  il layer della feature. Generalmente è composta dal nome del layer
   *                                  e da un identificativo univoco
       
   */
  let getTemplateByGeoserverFeatureId = function (featureId) {
    if (!featureId) return null;
    let layerId = featureId.split(".").shift();
    //get the template from
    let template = LamTemplates.getTemplates().find(function (element) {
      return element.layer === layerId;
    });
    return template;
  };

  let processTemplate = function (template, props, layer) {
    let result = "";
    if (template) {
      try {
        let hsTemplate = this.generateTemplate(template, layer);
        let compiledTemplate = Handlebars.compile(hsTemplate);
        if (!template.multipleItems && Array.isArray(props)) {
          result = compiledTemplate(props[0]);
        } else {
          result = compiledTemplate(props);
        }
      } catch (e) {
        lamDispatch({
          eventName: "log",
          message: e,
        });
      }
    }
    return result;
  };

  let standardTemplate = function (props, layer) {
    let body = "";
    if (layer) {
      body += "<div class='lam-grid lam-feature-heading' ><div class='lam-col'>" + (layer.layerName || "");
      if (layer.labelField) {
        body += " - " + getLabelFeature(props, layer.labelField);
      }
      body += "</div></div>";
    }
    for (let propertyName in props) {
      if (propertyName === "lamCoordinates") continue;
      body +=
        "<div class='lam-grid lam-mb-1'>" +
        "<div class='lam-feature-title lam-col'>" +
        propertyName +
        "</div>" +
        "<div class='lam-feature-content lam-col'>" +
        (props[propertyName] == null ? "" : props[propertyName]) +
        "</div>" +
        "</div>";
    }
    body += "";
    return body;
  };

  let standardTableTemplate = function (props, layer) {
    if (!props) return "";
    let body = "<table class='lam-table' >";
    body += "<tr>";
    for (let propertyName in props) {
      if (propertyName === "lamCoordinates") continue;
      body += "<th>" + propertyName + "</th>";
    }
    body += "</tr>";
    body += "{{#each this}}";
    body += "<tr>";
    for (let propertyName in props) {
      if (propertyName === "lamCoordinates") continue;
      body += "<td>{{" + propertyName + "}}</td>";
    }
    body += "</tr>";
    body += "{{/each}}";
    body += "</table>";
    return body;
  };

  let featureIconsTemplate = function (index) {
    //icons
    let icons =
      "<div class='lam-feature__icons'>" +
      '<i title="Centra sulla mappa" class="lam-feature__icon" onclick="LamDispatcher.dispatch({ eventName: \'zoom-info-feature\', index: \'' +
      index +
      "' })\">" +
      LamResources.svgMarker +
      "</i>";
    let feature = LamMap.convertGeoJsonFeatureToOl(LamStore.getCurrentInfoItem(index));
    feature = LamMap.transform3857(feature, feature.srid);
    let centroid = LamMap.getLabelPoint(LamMap.getGeoJsonGeometryFromGeometry(feature.getGeometry()).coordinates);
    let geometryOl = LamMap.convertGeometryToOl(
      {
        coordinates: centroid,
        type: "Point",
        srid: feature.srid,
      },
      LamEnums.geometryFormats().GeoJson
    );
    centroid = LamMap.transformGeometrySrid(geometryOl, 3857, 4326);
    icons +=
      //"<a target='_blank' href='https://www.google.com/maps/@?api=1&map_action=map&center=" +
      "<a target='_blank' href='https://www.google.com/maps/search/?api=1&query=" +
      centroid.flatCoordinates[1] +
      "," +
      centroid.flatCoordinates[0] +
      "&'><i title='Apri in Google' class='lam-feature__icon'>" +
      LamResources.svgGoogle +
      "</i></a>";
    //https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=48.857832,2.295226&heading=-45&pitch=38&fov=80
    icons +=
      //"<a target='_blank' href='https://www.google.com/maps/@?api=1&map_action=map&center=" +
      "<a target='_blank' href='https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" +
      centroid.flatCoordinates[1] +
      "," +
      centroid.flatCoordinates[0] +
      "&'><i title='Apri in Google Street View' class='lam-feature__icon'>" +
      LamResources.svgStreetView +
      "</i></a>";
    icons += "</div>";
    return icons;
  };

  let relationsTemplate = function (relations, props, index) {
    if (index === null) index = "{{@index}}";
    let result = "";
    if (!relations.length) return "";
    result += '<div class="lam-feature__relations">';
    relations.map(function (relation) {
      result += '<div class="lam-mb-2 col s12">';
      result +=
        '<a href="#" class="lam-link" onclick="LamRelations.showRelation(\'' +
        relation.gid +
        "', " +
        index +
        ')">' +
        '<i class="lam-feature__icon">' +
        LamResources.svgOpen16 +
        "</i>" +
        relation.labelTemplate +
        "</a>";
      result += "</div>";
    });
    result += "</div>";
    return result;
  };

  let chartsTemplate = function (charts, index) {
    if (index === null) index = "{{@index}}";
    let result = "";
    if (!charts.length) return "";
    result += '<div class="lam-feature__charts">';
    charts.map(function (chart) {
      result += '<div class="lam-mb-2 col s12">';
      result +=
        '<a href="#" class="lam-link" onclick="LamCharts.showChart(\'' +
        chart.gid +
        "', " +
        index +
        ')">' +
        '<i class="lam-feature__icon">' +
        LamResources.svgChart16 +
        "</i>" +
        chart.labelTemplate +
        "</a>";
      result += "</div>";
    });
    result += "</div>";
    return result;
  };

  let chartsTemplateButton = function (charts, index) {
    if (index === null) index = "{{@index}}";
    let result = "";
    if (!charts.length) return "";
    charts.map(function (chart) {
      result += '<div class="lam-mb-2 col s12">';
      result +=
        '<a href="#" class="lam-btn lam-btn-small lam-depth-1" onclick="LamCharts.showChart(\'' +
        chart.gid +
        "', " +
        index +
        ')">' +
        '<i class="lam-icon">' +
        LamResources.svgChart16 +
        "</i>" +
        chart.labelTemplate +
        "</a>";
      result += "</div>";
    });

    return result;
  };

  /**
   * Generates the template handlebars code
   * @param {Object} template
   * @param {Object} layer
   */
  let generateTemplate = function (template, layer) {
    //joins the strings if the template is an array
    if (template.templateType === "string") {
      return Array.isArray(template.templateString) ? template.templateString.join("") : template.templateString;
    }
    let str = "";
    switch (template.templateType) {
      case "simple":
        str = getSimpleTemplate(template, layer);
        break;
      case "table":
        str = getTableTemplate(template, layer);
        break;
    }
    return str;
  };

  /**
   * Returns the item's label.
   * @param {Array} props
   * @param {string} labelName Can be a property name or handlebars template
   * @param {string} layerTitle Layer title string
   */
  let getLabelFeature = function (props, labelName, layerTitle) {
    try {
      let label = "";
      if (props[labelName]) {
        label = props[labelName];
        if (layerTitle) {
          label = label === "" ? layerTitle : layerTitle + " - " + label;
        }
      } else {
        //custom template
        let fieldTemplate = Handlebars.compile(labelName);
        label = fieldTemplate(props);
      }
      return label;
    } catch (error) {
      lamDispatch({ eventName: "log", data: "Unable to compute label field " + labelName });
      return "";
    }
  };

  /**
   * Generates the handlebars template for a single feature
   * @param {Object} template
   * @param {Object} layer
   */
  let getSimpleTemplate = function (template, layer) {
    let str = "";
    if (template && template.hasOwnProperty("title") && template.title) {
      str += "<div class='lam-grid lam-feature-heading' ><div class='lam-col'>" + template.title + "</div></div>";
    }
    for (let i = 0; i < template.fields.length; i++) {
      str += "<div class='lam-grid lam-mb-1'>";
      let field = template.fields[i];
      var strLabel = "";
      if ((field && !field.hasOwnProperty("hideLabel")) || !field.hideLabel) {
        strLabel = "<div class='lam-feature-title lam-col'>" + (field.label ? field.label + " " : "") + "</div>";
      }
      switch (field.type) {
        case "int":
          str += "<div class='lam-feature-content lam-col'>{{{" + field.field + "}}}</div>";
          break;
        case "string":
          str += strLabel + "<div class='lam-feature-content lam-col'>{{{" + field.field + "}}}</div>";
          break;
        case "yesno":
          str += strLabel + "<div class='lam-feature-content lam-col'>{{#if " + field.field + "}}Sì{{else}}No{{/if}}</div>";
          break;
        case "date":
          str += strLabel + "<div class='lam-feature-content lam-col'>{{{format_date_string " + field.field + "}}}</div>";
          break;
        case "datetime":
          str += strLabel + "<div class='lam-feature-content lam-col'>{{{format_date_time_string " + field.field + "}}}</div>";
          break;
        case "date_geoserver":
          str += strLabel + "<div class='lam-feature-content lam-col'>{{{format_date_string_geoserver " + field.field + "}}}</div>";
          break;
        case "file":
          str +=
            "<div class='lam-feature-content lam-col'><a class='lam-link' href='{{{" +
            field.field +
            "}}}' target='_blank'><i class='lam-feature__icon'>" +
            LamResources.svgDownload16 +
            "</i>" +
            field.label +
            "</a></div>";
          break;
        case "file_preview":
          str += "<div class='lam-feature-content lam-col lam-center'>";
          field.field.split(",").forEach(function (element) {
            str += "<a class='lam-link' href='{{{" + element + "}}}' target='_blank'><img class='lam-thumb' src='{{{" + element + "}}}'/></a>";
          });
          str += "</div>";
          break;
        /*  case "moreinfo":
            str +=
              '<tr><td colspan="2"><a href="#" onclick="lamDispatch({ eventName: \'more-info\', gid: \'{{' +
              field.field +
              "}}' , layerGid: '" +
              field.layerGid +
              "', url: '" +
              field.url +
              "' })\">" +
              field.label +
              "</a></td>";
            break;
          */
        case "array":
          str += field.header;
          str += "{{#each " + field.field + "}}";
          str += field.item;
          str += "{{/each}}";
          str += field.footer;
          break;
        case "link":
          if ((field && !field.hasOwnProperty("hideLabel")) || !field.hideLabel) {
            strLabel = "<div class='lam-feature-title lam-col'></div>";
          }
          str += strLabel + '<div class="lam-feature-content lam-col">{{{format_url ' + field.field + " '" + field.label + "'}}}</div>";
          break;
        case "phone":
          if ((field && !field.hasOwnProperty("hideLabel")) || !field.hideLabel) {
            strLabel = "<div class='lam-feature-title lam-col'></div>";
          }
          str += strLabel + '<div class="lam-feature-content lam-col">{{{phone_link ' + field.field + " }}}</div>";
          break;
        case "email":
          if ((field && !field.hasOwnProperty("hideLabel")) || !field.hideLabel) {
            strLabel = "<div class='lam-feature-title lam-col'></div>";
          }
          str += strLabel + '<div class="lam-feature-content lam-col">{{{email_link ' + field.field + " }}}</div>";
          break;
      }
      str += "</div>";
    }
    return str;
  };

  /**
   * Generates the handlebars template for a table
   * @param {Object} template
   * @param {Object} layer
   */
  let getTableTemplate = function (template, layer) {
    let str = "<table class='lam-table'>";
    str += "<tr>";
    for (let i = 0; i < template.fields.length; i++) {
      str += "<th>" + template.fields[i].label + "</th>";
    }
    str += "</tr>";
    str += "{{#each this}}<tr>";
    for (let i = 0; i < template.fields.length; i++) {
      str += "<td>{{" + template.fields[i].field + "}}</td>";
    }
    str += "</tr>{{/each}}";
    str += "</table>";
  };

  /**
   * Prepare the features grouping by templates
   * @param {Array} featureInfoCollection list of features
   * @param {Object} template default template
   */
  let groupFeatureByTemplate = function (featureInfoCollection, template) {
    //single feature sent
    if (!featureInfoCollection.features) {
      featureInfoCollection = {
        features: featureInfoCollection,
      };
    }
    LamStore.getAppState().currentInfoItems = featureInfoCollection;
    let index = 0;
    //For every feature we add the geometry and template as properties
    featureInfoCollection.features.forEach(function (feature) {
      let featureTemplate = template;
      let props = feature.properties ? feature.properties : feature;
      //adding the coords as properties
      if (feature.geometry.coordinates) props.lamCoordinates = feature.geometry.coordinates;
      let layer = {};
      if (feature.layerGid) {
        layer = LamStore.getLayer(feature.layerGid);
        if (!featureTemplate) featureTemplate = LamTemplates.getTemplate(feature.layerGid, layer.templateUrl, LamStore.getAppState().templatesRepositoryUrl);
        if (!featureTemplate) {
          featureTemplate = LamTemplates.getTemplateByGeoserverFeatureId(feature.id);
        }
      }
      feature.featureTemplate = featureTemplate;
      feature.lamLayer = layer;
      feature.index = index;
      index++;
    });

    //defining sub features
    featureInfoCollection.features.forEach(function (feature) {
      //section feature with layer group that are related to this feature
      let featureGroupCollection = [];
      featureInfoCollection.features.forEach(function (featureGroup) {
        let layerId = "";
        if (feature.id) {
          layerId = feature.id.split(".").shift();
        }
        if (featureGroup.featureTemplate) {
          if (layerId && layerId === featureGroup.featureTemplate.layerGroup) {
            featureGroupCollection.push(featureGroup);
          }
          if (feature.layerGid === featureGroup.featureTemplate.layerGroup) {
            featureGroupCollection.push(featureGroup);
          }
        }
      });
      feature.featureGroupCollection = featureGroupCollection;
      //ordino le features in base all'ordine definito nel template
      if (feature.lamLayer && feature.lamLayer.groupTemplateUrls) {
        feature.featureGroupCollection.sort(function (a, b) {
          //confronto gli indici delle feature in modo da ordinare le feature in base all'ordine definito nel grouplayer
          return feature.lamLayer.groupTemplateUrls.indexOf(a.featureTemplate.templateUrl) - feature.lamLayer.groupTemplateUrls.indexOf(b.featureTemplate.templateUrl);
        });
      }
    });

    var featureCount = 0;
    //TODO semplificare non è necessario un loop
    featureInfoCollection.features.forEach(function (feature) {
      if (feature.featureTemplate && feature.featureTemplate.layerGroup) return;
      featureCount++;
    });
    LamDispatcher.dispatch({
      eventName: "set-featureinfo-count",
      featureInfoCount: featureCount,
    });
    return featureInfoCollection;
  };

  /**
   * Render te given collection into HTML format
   * @param {Object} featureInfoCollection GeoJson Collection
   */
  let renderInfoFeatures = function (featureInfoCollection) {
    let body = "";
    //renders the feature html
    featureInfoCollection.features.forEach(function (feature) {
      //check: if the layergroup template property is defined the feature shoul not be processed
      if (feature.featureTemplate && feature.featureTemplate.layerGroup) return;
      body += "<div class='lam-feature lam-depth-1 lam-mb-3'>" + renderBodyFeature(feature) + "</div>";
    });

    return body;
  };

  /**
   * Renders the html body of a feature. The feature needs to have the following custom properties:
   * featureTemplate
   * featureGroupCollection
   * lamLayer
   *
   * @param {Object} feature
   */
  let renderBodyFeature = function (feature) {
    let props = feature.properties ? feature.properties : feature;
    let tempBody = LamTemplates.processTemplate(feature.featureTemplate, props, feature.lamLayer);
    if (!tempBody) {
      tempBody += LamTemplates.standardTemplate(props, feature.lamLayer);
    }
    //rendering the related features
    if (feature.featureGroupCollection && feature.featureGroupCollection.length) {
      let tempBodySub = "";
      if (feature.featureTemplate && feature.featureTemplate.hasOwnProperty("groupTitle")) {
        tempBodySub += "<div class='lam-feature__group-features__title'>" + feature.featureTemplate.groupTitle + "</div>";
      }
      feature.featureGroupCollection.forEach(function (featureGroup) {

        tempBodySub += "<div class='lam-feature__group-features__item'>" + renderBodyGroupFeature(featureGroup) + "</div>";
      });
      tempBody += "<div class='lam-feature__group-features'>" + tempBodySub + "</div>";
    }

    //sezione relations
    let layerRelations = getLayerRelations(feature.layerGid);
    if (layerRelations.length) tempBody += LamTemplates.relationsTemplate(layerRelations, props, feature.index);
    //sezione charts
    let layerCharts = getLayerCharts(feature.layerGid);
    if (layerCharts.length) tempBody += LamTemplates.chartsTemplate(layerCharts, feature.index);
    tempBody += LamTemplates.featureIconsTemplate(feature.index);

    return tempBody;
  };

  /**
   * Renders the html body of a group feature. The feature needs to have the following custom properties:
   * featureTemplate
   * featureGroupCollection
   * lamLayer
   *
   * @param {Object} feature
   */
  let renderBodyGroupFeature = function (feature) {
    let props = feature.properties ? feature.properties : feature;
    let tempBody = LamTemplates.processTemplate(feature.featureTemplate, props, feature.lamLayer);
    if (!tempBody) {
      tempBody += LamTemplates.standardTemplate(props, feature.lamLayer);
    }
    //sezione relations
    let layerRelations = getLayerRelations(feature.layerGid);
    if (layerRelations.length) tempBody += LamTemplates.relationsTemplate(layerRelations, props, feature.index);
    //sezione charts
    let layerCharts = getLayerCharts(feature.layerGid);
    if (layerCharts.length) tempBody += LamTemplates.chartsTemplate(layerCharts, feature.index);

    //rendering the related features
    if (feature.featureGroupCollection && feature.featureGroupCollection.length) {
      let tempBodySub = "";
      feature.featureGroupCollection.forEach(function (featureGroup) {
        tempBodySub += renderBodyFeature(featureGroup);
      });
      tempBody += "<div class='lam-feature__group-features'>" + tempBodySub + "</div>";
    }
    return tempBody;
  };

  let renderInfoFeaturesMobile = function (featureInfoCollection) {
    let body = "";
    //single feature sent
    if (!featureInfoCollection.features) {
      featureInfoCollection = {
        features: featureInfoCollection,
      };
    }
    featureInfoCollection.features.forEach(function (feature) {
      if (feature.featureTemplate && feature.featureTemplate.layerGroup) return;
      //let props = feature.properties ? feature.properties : feature;
      //let layer = LamStore.getLayer(feature.layerGid);
      let tempBody = "";
      //let tooltip = LamTemplates.getLabelFeature(feature.properties, layer.labelField, layer.layerName);
      tempBody += "<div class=' lam-bottom-info__content-item'>";
      tempBody += feature.tooltip;
      tempBody += LamTemplates.featureIconsTemplate(feature.index);
      tempBody += "</div>";
      body += tempBody;
    });
    return body;
  };

  let getTemplateMetadata = function () {
    return Handlebars.compile("{{ABSTRACT}}");
  };

  var getTemplateEmpty = function (results) {
    var template = "<p></p>";
    return Handlebars.compile(template);
  };

  var getResultEmpty = function (results) {
    var template = "<p>Nessun risultato disponibile</p>";
    return Handlebars.compile(template);
  };

  var getInfoResultEmpty = function (results) {
    var template = "<p>Nessun risultato disponibile nella posizione selezionata</p>";
    return Handlebars.compile(template);
  };

  let getFieldTemplate = function (templateField) {
    let str = "";
    switch (templateField.type) {
      case "relation":
        str +=
          "<td><a href='#' onclick='LamRelations.showConcatenatedRelation(\"" +
          templateField.relationGid +
          "\", {{relationIndex}});return false;'>" +
          templateField.label +
          "</td>";
        break;
      case "int":
        str += "<td>{{{" + templateField.field + "}}}</td>";
        break;
      case "yesno":
        str += "<td>{{#if " + templateField.field + "}}Sì{{else}}No{{/if}}</td>";
        break;
      case "date":
        str += "<td>{{{format_date_string " + templateField.field + "}}}</td>";
        break;
      case "datetime":
        str += "<td>{{{format_date_time_string " + templateField.field + "}}}</td>";
        break;
      case "date_geoserver":
        str += "<td>{{{format_date_string_geoserver " + templateField.field + "}}}</td>";
        break;
      case "file":
        str +=
          "<td><a class='lam-link' href='{{{" +
          templateField.field +
          "}}}' target='_blank'><i class='lam-feature__icon'>" +
          LamResources.svgDownload16 +
          "</i>" +
          templateField.label +
          "</a></td>";
        break;
      case "file_preview":
        str += "<td>";
        templateField.field.split(",").forEach(function (element) {
          str += "<a class='lam-link' href='{{{" + element + "}}}' target='_blank'><img class='lam-thumb' src='{{{" + element + "}}}'/></a>";
        });
        str += "</td>";
        break;
      case "link":
        str += "<td>{{{format_url " + templateField.field + " '" + templateField.label + "'}}}</td>";
        break;
      case "phone":
        str += "<td>{{{phone_link " + templateField.field + " }}}</td>";
        break;
      case "email":
        str += "<td>{{{email_link " + templateField.field + " }}}</td>";
        break;
      default:
        str += "<td>{{" + templateField.field + "}}</td>";
        break;
    }
    return str;
  };

  let getLayerRelations = function (layerGid) {
    let layerRelations = LamRelations.getRelations().filter(function (relation) {
      return $.inArray(layerGid, relation.layerGids) >= 0;
    });
    return layerRelations;
  };

  let getLayerCharts = function (layerGid) {
    let layerCharts = LamCharts.getCharts().filter(function (chart) {
      return $.inArray(layerGid, chart.layerGids) >= 0 && !chart.target;
    });
    return layerCharts;
  };

  return {
    init: init,
    generateTemplate: generateTemplate,
    getLabelFeature: getLabelFeature,
    getLayerRelations: getLayerRelations,
    getLayerCharts: getLayerCharts,
    getInfoResultEmpty: getInfoResultEmpty,
    getResultEmpty: getResultEmpty,
    getFieldTemplate: getFieldTemplate,
    getTemplate: getTemplate,
    getTemplateByGeoserverFeatureId: getTemplateByGeoserverFeatureId,
    getTableTemplate: getTableTemplate,
    getTemplates: getTemplates,
    getTemplateMetadata: getTemplateMetadata,
    getTemplateUrl: getTemplateUrl,
    getTemplateEmpty: getTemplateEmpty,
    featureIconsTemplate: featureIconsTemplate,
    loadTemplateAjax: loadTemplateAjax,
    loadRelationsTemplates: loadRelationsTemplates,
    processTemplate: processTemplate,
    relationsTemplate: relationsTemplate,
    chartsTemplate: chartsTemplate,
    chartsTemplateButton: chartsTemplateButton,
    groupFeatureByTemplate: groupFeatureByTemplate,
    renderInfoFeatures: renderInfoFeatures,
    renderInfoFeaturesMobile: renderInfoFeaturesMobile,
    standardTemplate: standardTemplate,
    standardTableTemplate: standardTableTemplate,
  };
})();

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
 * Classe per la gestione della toolbar
 */
let LamToolbar = (function () {
  "use strict";

  var easingTime = 300;
  var currentToolbarItem = "";

  let resetToolsPayloads = [{ eventName: "stop-copy-coordinate" }];

  let init = function () {
    //eseguo degli aggiustamente in caso di browser mobile
    if (LamDom.isMobile()) {
      $("#menu-toolbar").css("padding-left", "10px");
      $(".lam-toolbar button").css("margin-right", "0px");
      easingTime = 0;
    } else {
      //definizione degli eventi jquery
      LamDom.dragElement(document.getElementById("info-window"));
    }

    //nascondo il draw per dimensioni piccole
    if ($(window).width() < 640) {
      $("#menu-toolbar__draw-tools").hide();
    }
  };

  /**
   * Resetta tutti i controlli mappa al cambio di menu
   * @return {null} La funzione non restituisce un valore
   */
  let resetTools = function () {
    resetToolsPayloads.forEach(function (payload) {
      lamDispatch(payload);
    });
  };

  let addResetToolsEvent = function (event) {
    resetToolsPayloads.push(event);
  };

  let showMenu = function (toolId) {
    $(".lam-toolbar-btn").removeClass("lam-btn-selected");
    $("#menu-toolbar__" + toolId).addClass("lam-btn-selected");
    $("#bottom-info").hide();
    $("#panel").animate(
      {
        width: "show",
      },
      {
        duration: easingTime,
        complete: function () {
          if (toolId) {
            $("#" + toolId).show();
          }
          $("#panel__open").hide();
        },
      }
    );
  };

  /**
   * Nasconde il pannello del menu
   */
  var hideMenu = function () {
    $("#panel").animate(
      {
        width: "hide",
      },
      easingTime,
      function () {
        $("#panel__open").show();
      }
    );
  };

  var toggleToolbarItem = function (toolId, keepOpen) {
    LamStore.setInfoClickEnabled(true);
    //verifico se il pannello non è già selezionato
    if (currentToolbarItem != toolId) {
      //new tool selected
      currentToolbarItem = toolId;
      resetTools();
      $(".lam-panel-content-item").hide();
      $(".lam-panel-content-item").removeClass("lam-visible");
      showMenu(toolId);
    } else {
      if ($("#panel").css("display") == "none" || keepOpen) {
        //actual tool selected but hidden
        showMenu(toolId);
      } else {
        //actual tool selected so it has to be hidden
        currentToolbarItem = null;
        resetTools();
        hideMenu();
        $("#" + toolId).hide();
      }
    }
  };

  let getCurrentToolbarItem = function () {
    return currentToolbarItem;
  };

  return {
    addResetToolsEvent: addResetToolsEvent,
    getCurrentToolbarItem: getCurrentToolbarItem,
    hideMenu: hideMenu,
    init: init,
    showMenu: showMenu,
    toggleToolbarItem: toggleToolbarItem,
  };
})();

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

//Backgroung rotation
var numBg = Math.floor(Math.random() * 6) + 1;
var tempBg = "url(img/logins/login" + numBg + ".jpg)";
$("#login-container").css("background-image", tempBg);

//Global dispatch helper
function lamDispatch(payload) {
  LamDispatcher.dispatch(payload);
}

/**
 * Init map function
 * @param {string} mapDiv Target Id of the div where the map will be rendered in. Default is lam-app
 * @param {*} appStateUrl Url of the appstate. Appstate given in the url will have priority over this. Otherwise states/app-state.json will be used
 * @param {*} mapTemplateUrl Url of the map template to load.
 */
function LamInit(mapDiv, appStateUrl, mapTemplateUrl) {
  LamLoader.lamInit(mapDiv, appStateUrl, mapTemplateUrl);
}

function reverseGeocoding(obj) {
  lamDispatch({
    eventName: "reverse-geocoding",
    coordinate: obj.coordinate
  });
}
