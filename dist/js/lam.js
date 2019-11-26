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
let LamMapEnums = (function() {
  "use strict";

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

  return {
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
let LamMapStyles = (function() {
  "use strict";

  /**
   * Returns the style for the preload features
   * @param {int} width Width of the line
   * @param {int} radius Radius of the circle
   */
  let getPreloadStyle = function(width, radius) {
    if (!width) width = 4;
    if (!radius) radius = 10;
    let style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 255, 255, 0.01]
      }),
      stroke: new ol.style.Stroke({
        color: [255, 255, 255, 0.01],
        width: width
      }),
      image: new ol.style.Circle({
        radius: radius,
        fill: new ol.style.Fill({
          color: [255, 255, 255, 0.01]
        })
      }),
      text: new ol.style.Text({
        text: "",
        scale: 1.7,
        textAlign: "Left",
        textBaseline: "Top",
        fill: new ol.style.Fill({
          color: "#000000"
        }),
        stroke: new ol.style.Stroke({
          color: "#FFFFFF",
          width: 3.5
        })
      })
    });
    return style;
  };

  let getDrawStyle = function() {
    let style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [68, 138, 255, 0.2]
      }),
      stroke: new ol.style.Stroke({
        color: [68, 138, 255, 1],
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: [68, 138, 255, 1]
        })
      }),
      text: new ol.style.Text({
        text: "pippo",
        scale: 1.7,
        textAlign: "Left",
        textBaseline: "Top",
        fill: new ol.style.Fill({
          color: "#000000"
        }),
        stroke: new ol.style.Stroke({
          color: "#FFFFFF",
          width: 3.5
        })
      })
    });
    return style;
  };

  let getSelectionStyle = function() {
    let styleSelection = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 216, 0, 0.2]
      }),
      stroke: new ol.style.Stroke({
        color: [255, 216, 0, 1],
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: [255, 216, 0, 1]
        })
      })
    });
    return styleSelection;
  };

  let getSelectionMaskStyle = function() {
    let style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 216, 0, 0.1]
      }),
      stroke: new ol.style.Stroke({
        color: [255, 216, 0, 0.5],
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: [255, 216, 0, 0.5]
        })
      }),
      text: new ol.style.Text({
        text: "",
        scale: 1.7,
        textAlign: "Left",
        textBaseline: "Top",
        fill: new ol.style.Fill({
          color: "#000000"
        }),
        stroke: new ol.style.Stroke({
          color: "#FFFFFF",
          width: 3.5
        })
      })
    });
    return style;
  };

  let getModifyStyle = function() {
    let style_modify = new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 2,
        color: getCurrentColor(1, [255, 0, 0, 1])
      }),
      fill: new ol.style.Stroke({
        color: getCurrentColor(1, [255, 0, 0, 0.2])
      })
    });
    return style_modify;
  };

  /**
   * Returns the style for the info features
   * @param {int} width Width of the line
   * @param {int} radius Radius of the circle
   */
  let getInfoStyle = function(width, radius) {
    if (!width) width = 3;
    if (!radius) radius = 7;
    let style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [0, 255, 255, 0.2]
      }),
      stroke: new ol.style.Stroke({
        color: [0, 255, 255, 1],
        width: width
      }),
      image: new ol.style.Circle({
        radius: radius,
        fill: new ol.style.Fill({
          color: [0, 255, 255, 1]
        })
      })
    });
    return style;
  };

  /**
   * Returns the style for the flash features
   * @param {int} width Width of the line
   * @param {int} radius Radius of the circle
   */
  let getFlashStyle = function(width, radius) {
    if (!width) width = 3;
    if (!radius) radius = 7;
    let style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 125, 0, 1]
      }),
      stroke: new ol.style.Stroke({
        color: [255, 125, 0, 1],
        width: width
      }),
      image: new ol.style.Circle({
        radius: radius,
        fill: new ol.style.Fill({
          color: [255, 125, 0, 1]
        })
      })
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
    getDrawStyle: getDrawStyle
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

    LamDispatcher.bind("show-tooltip", function(payload) {
      LamMapInfo.showTooltip(payload.x, payload.y, payload.title);
    });
    LamDispatcher.bind("hide-tooltip", function(payload) {
      LamMapTooltip.hideTooltip();
    });
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
      LamToolbar.toggleToolbarItem("info-results", true);
      $("#info-tooltip").hide();
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
   * 3. processRequestInfo/processRequestInfoAll based on the variable visibleLayers
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
      if (LamStore.getAppState().infoSelectBehaviour == LamMapEnums.infoSelectBehaviours().SingleFeature) {
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
            requestQueue.layers.push(new RequestLayer(url, layer.zIndex, layer.gid, layer.srid));
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
        featureCollection.features[i].layerGid = requestQueue.layers[requestQueue.currentLayerIndex].gid;
        featureCollection.features[i].srid = requestQueue.layers[requestQueue.currentLayerIndex].srid;
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
   */
  let showRequestInfoFeatures = function(featureInfoCollection) {
    var title = "Risultati";
    if (!featureInfoCollection) {
      return;
    }
    if (featureInfoCollection.features.length > 0) {
      title += " (" + featureInfoCollection.features.length + ")";
    }
    var body = LamTemplates.renderInfoFeatures(featureInfoCollection);
    var bodyMobile = LamTemplates.renderInfoFeaturesMobile(featureInfoCollection);
    LamMapInfo.showInfoWindow(title, body, bodyMobile, "info-results");
  };

  let showInfoFeatureTooltip = function(feature) {
    let layer = LamStore.getLayer(feature.layerGid);
    let tooltip = LamTemplates.getLabelFeature(feature.getProperties(), layer.labelField, layer.layerName);
    lamDispatch({
      eventName: "show-map-tooltip",
      geometry: feature.getGeometry().getCoordinates(),
      tooltip: tooltip
    });
  };

  let showInfoFeatureTooltipAtPixel = function(feature, pixel) {
    let coordinate = LamMap.getCoordinateFromPixel(pixel[0], pixel[1]);
    let layer = LamStore.getLayer(feature.layerGid);
    let tooltip = LamTemplates.getLabelFeature(feature.getProperties(), layer.labelField, layer.layerName);
    lamDispatch({
      eventName: "show-map-tooltip",
      geometry: coordinate,
      tooltip: tooltip
    });
  };

  let showInfoWindow = function(title, body, bodyMobile, htmlElement) {
    LamStore.showContent(title, body, bodyMobile, htmlElement);
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
    return LamMap.addGeometryToMap(geometry, srid, vectorInfo);
  };

  /**
   * Add a feature info to the map
   * @param {Ol/feature} feature
   * @param {int} srid
   */
  let addFeatureInfoToMap = function(feature) {
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
  let clearLayerInfo = function() {
    vectorInfo.getSource().clear(true);
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
  let RequestLayer = function(url, zIndex, gid, srid) {
    this.url = url;
    this.zIndex = zIndex;
    this.sent = false;
    this.gid = gid;
    this.srid = srid;
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
    addWktInfoToMap: addWktInfoToMap,
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

let LamMap = (function() {
  /// <summary>
  /// Classe per la gestione delle funzionalità di mapping
  /// </summary>
  "use strict";

  let defaultLayers = {
    OSM: {
      gid: 1000
    },
    OCM: {
      gid: 1001
    },
    OTM: {
      gid: 1002
    }
  };

  let mainMap;
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

  //TODO eliminare questa funzione
  let getCurrentColor = function(opacity, color) {
    if (!opacity) opacity = 1;
    let resultColor = {
      r: 68,
      g: 138,
      b: 255,
      opacity: opacity
    };
    if (color) {
      return color;
    }
    try {
      if ($("#draw-tools__color").val()) {
        resultColor = $("#draw-tools__color").val();
        let rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(resultColor);
        resultColor = rgb
          ? {
              r: parseInt(rgb[1], 16),
              g: parseInt(rgb[2], 16),
              b: parseInt(rgb[3], 16)
            }
          : null;
      }
    } catch (e) {
      log(e);
    }
    return [resultColor.r, resultColor.g, resultColor.b, opacity];
  };

  let vectorPrint = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: []
    }),
    style: LamMapStyles.getSelectionStyle()
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
        zoom: zoom
      })
    );
  };

  /**
   * Pan the map to the given geometry's position
   * @param {OL/Geometry} geometry
   * @param {int} srid
   */
  let goToGeometry = function(geometry, srid) {
    let feature = new ol.Feature({
      geometry: geometry
    });
    if (srid) {
      feature = transform3857(feature, srid);
    }
    if (feature.getGeometry().getType() === "Point") {
      goToLonLat(feature.getGeometry().getCoordinates()[0], feature.getGeometry().getCoordinates()[1], 17);
    } else {
      let extent = feature.getGeometry().getExtent();
      goToExtent(extent[0], extent[1], extent[2], extent[3]);
    }
  };
  /**
   * Posiziona la mappa per bounding box in Longitudine, Latitudine o X,Y con EPSG:3857
   *
   * @param {float} x1  X minimo
   * @param {float} y1  Y minimo
   * @param {float} x2  X massimo
   * @param {float} y2  Y massimo
   */
  let goToExtent = function goToExtent(x1, y1, x2, y2) {
    // let point1 = new ol.geom.Point([lon1, lat1]);
    // if (lon1 < 180) {
    //   point1 = ol.proj.transform([lon1, lat1], "EPSG:4326", "EPSG:900913");
    // }
    // let point2 = new ol.geom.Point([lon2, lat2]);
    // if (lon2 < 180) {
    //   point2 = ol.proj.transform([lon2, lat2], "EPSG:4326", "EPSG:900913");
    // }
    mainMap.getView().fit([x1, y1, x2, y2], mainMap.getSize());
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
  let addLayerToMap = function(
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
    vectorRadius
  ) {
    let thisLayer;
    if (!params) {
      params = "";
    }
    params += "LAYERS=" + layer;
    //params += "&QUERY_LAYERS=" + layer;
    params += "&SRS=EPSG:" + srid;
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
      case "wms":
        thisLayer = getLayerWMS(gid, uri, params, attribution, secured);
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
      var vectorSource = new ol.source.Vector({
        url: getWFSfromWMS(preloadUrl),
        format: new ol.format.GeoJSON(),
        strategy: ol.loadingstrategy.all
      });
      var vector = new ol.layer.Vector({
        zIndex: parseInt(zIndex),
        source: vectorSource,
        visible: visible,
        style: LamMapStyles.getPreloadStyle(vectorWidth, vectorRadius)
      });
      vector.gid = gid + "_preload";
      vector.hoverTooltip = hoverTooltip;
      vector.srid = srid;
      mainMap.addLayer(vector);
      vector.setZIndex(parseInt(zIndex));
    }
  };

  let getLayerOSM = function getLayerOSM() {
    /// <summary>
    /// Restituisce il layer standard di Open Street Map
    /// </summary>
    let osm = new ol.layer.Tile({
      source: new ol.source.OSM({
        crossOrigin: null
      })
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
        crossOrigin: null
      })
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
        crossOrigin: null
      })
    });
    otm.gid = defaultLayers.OTM.gid;
    return otm;
  };

  let getLayerWMS = function(gid, uri, params, attribution) {
    /// <summary>
    /// Restituisce un layer in formato WMS
    /// </summary>
    /// <param name="gid">Codice numerico identificativo del layer</param>
    /// <param name="uri">Url sorgente del layer</param>
    /// <param name="params">Parametri aggiuntivi da aggiungere alle chiamate (formato url querystring)</param>
    let paramsLocal = queryToDictionary(params);
    let serverType = "geoserver";
    // if (!params.format) {
    //     params.format = "PNG";
    // }
    // if (params.format === 'none') {
    //     params.format = null;
    // } else {
    //     params.format = wmsImageFormat(params.format);
    //
    // }
    if (paramsLocal.serverType) {
      serverType = paramsLocal.serverType;
    }
    let wms = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: uri,
        params: paramsLocal,
        serverType: serverType,
        //crossOrigin: "Anonymous"
        attributions: attribution
      })
    });
    return wms;
  };

  let getLayerWMSTiled = function(gid, uri, params, attribution, secured) {
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
      /** @type {olx.source.TileWMSOptions} */ ({
        url: uri,
        params: paramsLocal,
        serverType: serverType,
        //crossOrigin: "Anonymous",
        attributions: attribution
      })
    );
    if (secured) {
      source.setTileLoadFunction(function(tile, src) {
        let xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.addEventListener("loadend", function(evt) {
          let data = this.response;
          if (data !== undefined) {
            tile.getImage().src = URL.createObjectURL(data);
          } else {
            tile.setState(3);
          }
        });
        xhr.addEventListener("error", function() {
          tile.setState(3);
        });
        xhr.open("GET", src);
        xhr.setRequestHeader("Authorization", LamStore.getAuthorizationHeader());
        xhr.send();
      });
    }
    let wms = new ol.layer.Tile({
      //extent: [-13884991, 2870341, -7455066, 6338219],
      source: source
    });
    return wms;
  };

  let getLayerTiled = function(gid, uri, params, attribution, secured) {
    let paramsLocal = queryToDictionary(params);
    let tms = new ol.layer.Tile({
      //extent: [-13884991, 2870341, -7455066, 6338219],
      source: new ol.source.TileWMS({
        url: uri,
        params: paramsLocal,
        serverType: "geoserver"
      })
    });
    return tms;
  };

  /**
   * restituisce il formato wms di immagine standard
   * @param  {string} format formato immagine
   * @return {string}        formato immagine wms
   */
  let wmsImageFormat = function(format) {
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
  let getWFSfromWMS = function(wmsUrl) {
    let wfsUrlArray = wmsUrl.split("?");
    let baseUrl = wfsUrlArray[0].replace("wms", "wfs");
    let paramsArray = wfsUrlArray[1].split("&");
    let url = baseUrl + "?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application%2Fjson";
    paramsArray.forEach(function(param) {
      if (param.toLowerCase().split("=")[0] === "layers") {
        url += "&typeName=" + param.split("=")[1];
      }
      if (
        param
          .toLowerCase()
          .split("=")[0]
          .toLowerCase() === "srsname"
      ) {
        url += "&srsname=" + param.split("=")[1];
      }
    });
    return url;
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
  let removeAllLayersFromMap = function() {
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
      } catch (e) {}
    }
    return dict;
  };

  let zoomIn = function() {
    let currentView = mainMap.getView();
    currentView.setZoom(currentView.getZoom() + 1);
    mainMap.setView(currentView);
  };

  let zoomOut = function() {
    let currentView = mainMap.getView();
    currentView.setZoom(currentView.getZoom() - 1);
    mainMap.setView(currentView);
  };

  let init = function() {
    //events binding
    //if mobile go to user location
    if (LamStore.isMobile()) goToBrowserLocation();
  };

  /**
   * Map initialization function
   * @param {*} divMap Html element for the map
   * @param {*} mapConfig AppState Config
   */
  let render = function render(divMap, mapConfig) {
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
    let controls = new ol.Collection([]);
    mainMap = new ol.Map({
      controls: controls.extend([
        new ol.control.Attribution({
          collapsible: false
        })
      ]),

      target: divMap,
      layers: layers,
      view: new ol.View({
        center: ol.proj.transform([10.41, 44.94], "EPSG:4326", "EPSG:3857"),
        zoom: 10
      })
    });

    loadConfig(mapConfig);

    LamMapInfo.init(); //info initialization

    mainMap.on("singleclick", function(evt) {
      //Adding click info interaction
      LamMapInfo.getRequestInfo(evt.coordinate, evt.pixel, true);
    });

    mainMap.on("moveend", function() {
      lamDispatch("map-move-end");
    });

    proj4.defs("EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    proj4.defs(
      "EPSG:3003",
      "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +units=m +no_defs"
    );

    // mainMap.on("zoomend", map, function() {
    //     lamDispatch("map-zoom-end");
    // });

    mainMap.on("pointermove", function(evt) {
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

  let mouseHoverMapTooltip = function() {
    if (!lastMousePixel) return;
    if (LamStore.isMobile()) return;
    let featureFound = null;
    mainMap.forEachFeatureAtPixel(lastMousePixel, function(feature, layer) {
      if (layer === null) {
      } else {
        if (layer.hoverTooltip && !featureFound) {
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

  let loadConfig = function loadConfig(config) {
    /// <summary>
    /// Carica l'oggetto di configurazione sulla mappa
    /// </summary>
    /// <param name="config">Oggetto con i parametri di configurazione</param>
    /// <returns type=""></returns>

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
        features: featuresWKT
      }),
      style: LamMapStyles.getDrawStyle()
    });

    vectorSelectionMask = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: featuresSelectionMask
      }),
      style: LamMapStyles.getSelectionMaskStyle()
    });

    vectorSelection = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: featuresSelection
      }),
      style: LamMapStyles.getSelectionStyle()
    });

    vectorDraw.setMap(mainMap);
    vectorSelectionMask.setMap(mainMap);
    vectorSelection.setMap(mainMap);

    //aggiungo le feature KML alla mappa
    if (config.drawFeatures) {
      try {
        let formatKml = new ol.format.KML();
        let tempfeaturesWKT = formatKml.readFeatures(config.drawFeatures, {
          featureProjection: "EPSG:3857"
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

  let addLayersToMap = function(tempLayers, mapSrid) {
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
        layer.vectorRadius
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
  let getScaleFromResolution = function(resolution, units) {
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
  let getResolutionForScale = function(scale, units) {
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
          layer
            .getSource()
            .getParams()
            .LAYERS.trim() +
          "&format=image/jpeg&legend_options=fontAntiAliasing:true;dpi:180";
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

  let toggleLayer = function toggleLayer(gid) {
    /// <summary>
    /// Cambia lo stato di visibilità (acceso/spento) di un layer
    /// </summary>
    /// <param name="gid">Codice numerico identificativo del layer</param>
    /// <returns type=""></returns>
    let layer = getLayer(gid);
    if (layer) {
      layer.setVisible(!layer.getVisible());
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
        message: str
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
  let addGeometryToMap = function addGeometryToMap(geometry, srid, vector) {
    let feature = new ol.Feature({
      geometry: geometry
    });
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
   * Add a feature to the map
   * @param {OL/Feature} feature Feature. The geometry type must be in OL format
   * @param {int} srid srid of the object
   * @param {Ol/Vector} vector Vector layer destination
   */
  let addFeatureToMap = function(feature, srid, vector) {
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
  let convertGeometryToOl = function(geometry, geometryFormat) {
    let geometryOl = geometry;
    switch (geometryFormat) {
      case LamMapEnums.geometryFormats().GeoJson:
        geometryOl = getGeometryFromGeoJsonGeometry(geometry);
        break;
    }
    return geometryOl;
  };

  /**
   * Converts a feature into Ol format from GeoJson
   * @param {Object} feature GeoJson feature to be converted
   */
  let convertGeoJsonFeatureToOl = function(feature) {
    let reader = new ol.format.GeoJSON();
    let featureOl = reader.readFeature(feature);
    featureOl.layerGid = feature.layerGid;
    featureOl.srid = feature.srid;
    return featureOl;
  };

  let startCopyCoordinate = function() {
    copyCoordinateEvent = mainMap.on("singleclick", function(evt) {
      let pp = new ol.geom.Point([evt.coordinate[0], evt.coordinate[1]]);
      if (evt.coordinate[0] > 180) {
        pp = ol.proj.transform([evt.coordinate[0], evt.coordinate[1]], "EPSG:900913", "EPSG:4326");
      }
      lamDispatch({
        eventName: "map-click",
        //"lon": evt,
        lon: pp[0],
        lat: pp[1]
      });
      //let feature = map.forEachFeatureAtPixel(evt.pixel,
      // function(feature, layer) {
      // do stuff here with feature
      // return [feature, layer];
      //});
    });
  };

  let stopCopyCoordinate = function() {
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
  let setPrintBox = function(x, y, width, height) {
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
        [x1, y1]
      ]
    ];
    //vertices  = [[10.60009,44.703497], [10.650215,44.703131], [10.628929,44.682508],[10.60009,44.703497]];
    geometryOl = new ol.geom.Polygon(vertices);
    feature = new ol.Feature({
      geometry: geometryOl
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
    handleDownEvent: function(event) {
      let feature = mainMap.forEachFeatureAtPixel(event.pixel, function(feature, layer) {
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
    handleDragEvent: function(event) {
      let deltaX = event.coordinate[0] - dragCoordinatePrint[0];
      let deltaY = event.coordinate[1] - dragCoordinatePrint[1];

      let geometry = dragFeaturePrint.getGeometry();
      geometry.translate(deltaX, deltaY);

      dragCoordinatePrint[0] = event.coordinate[0];
      dragCoordinatePrint[1] = event.coordinate[1];
    },
    handleMoveEvent: function(event) {
      if (dragCursorPrint) {
        let mainMap = event.map;

        let feature = mainMap.forEachFeatureAtPixel(event.pixel, function(feature, layer) {
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
    handleUpEvent: function(event) {
      dragCoordinatePrint = null;
      dragFeaturePrint = null;
      return false;
    }
  });

  let getPrintCenter = function() {
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

  let getPrintCenterLonLat = function() {
    let center = getPrintCenter();
    return ol.proj.transform(center, "EPSG:3857", "EPSG:4326");
  };

  /*SEZIONE SELECTION    *************************************/
  let selectInteraction;

  let removeSelectInteraction = function() {
    try {
      mainMap.removeInteraction(selectInteraction);
    } catch (e) {
      log(e);
    }
  };

  let addSelectInteraction = function() {
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
      style: LamMapStyles.getSelectionStyle()
    });
    selectInteraction.on("drawend", function(evt) {
      let feature = evt.feature.clone();
      lamDispatch({
        eventName: "start-selection-search",
        coords: feature
          .getGeometry()
          .transform("EPSG:3857", "EPSG:4326")
          .getCoordinates()
      });
    });
    selectInteraction.on("drawstart", function(evt) {
      clearLayerSelectionMask();
    });
    mainMap.addInteraction(selectInteraction);
  };

  /**
   * Rimuove tutte le geometrie dal layer selection
   * @return {null} La funzione non restituisce un valore
   */
  let clearLayerSelection = function() {
    vectorSelection.getSource().clear(true);
  };

  /**
   * Rimuove tutte le geometrie dal layer selection mask
   * @return {null} La funzione non restituisce un valore
   */
  let clearLayerSelectionMask = function() {
    vectorSelectionMask.getSource().clear(true);
  };

  let getSelectionMask = function() {
    let result = null;
    vectorSelectionMask
      .getSource()
      .getFeatures()
      .forEach(function(feature) {
        let featureClone = feature.clone();
        result = featureClone
          .getGeometry()
          .transform("EPSG:3857", "EPSG:4326")
          .getCoordinates();
      });
    return result;
  };

  let addFeatureSelectionToMap = function(geometry, srid) {
    return addGeometryToMap(geometry, srid, vectorSelection);
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
  let removeDrawInteraction = function() {
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
  let removeDrawDeleteInteraction = function() {
    try {
      mainMap.removeInteraction(deleteInteraction);
    } catch (e) {
      log(e);
    }
  };

  let addDrawInteraction = function(geomType) {
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
      deleteCondition: function(event) {
        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
      }
    });
    modifyInteraction.on("modifyend", function(event) {});
    mainMap.addInteraction(modifyInteraction);

    try {
      mainMap.removeInteraction(drawInteraction);
    } catch (e) {
      log(e);
    }
    drawInteraction = new ol.interaction.Draw({
      features: featuresWKT, //definizione delle features
      type: geomType
    });
    drawInteraction.on("drawend", function(evt) {
      //evt.feature.NAME = "pippo";
      //evt.feature.set("name", $("#draw-tools__textarea").val());
    });
    mainMap.addInteraction(drawInteraction);
  };

  let addDrawDeleteInteraction = function(geomType) {
    deleteInteraction = new ol.interaction.Select({
      // make sure only the desired layer can be selected
      layers: [vectorDraw]
    });

    deleteInteraction.on("select", function(evt) {
      let selected = evt.selected;
      let deselected = evt.deselected;

      if (selected.length) {
        selected.forEach(function(feature) {
          feature.setStyle(LamMapStyles.getModifyStyle());
          //abilita eliminazione single click
          //vectorDraw.getSource().removeFeature(feature);
          //
          deleteDrawFeatures();
        });
      } else {
        deselected.forEach(function(feature) {
          feature.setStyle(null);
        });
      }
    });
    mainMap.addInteraction(deleteInteraction);
  };

  let deleteDrawFeatures = function() {
    for (let i = 0; i < deleteInteraction.getFeatures().getArray().length; i++) {
      vectorDraw.getSource().removeFeature(deleteInteraction.getFeatures().getArray()[i]);
    }
    deleteInteraction.getFeatures().clear();
  };

  /**
   * Restituisce tutte le feature disegnate in formato KML
   * @return {string} Elenco delle feature in formato KML
   */
  let getDrawFeature = function() {
    let features = vectorDraw.getSource().getFeatures();
    let kmlFormat = new ol.format.KML();
    let kml = kmlFormat.writeFeatures(features, {
      featureProjection: "EPSG:3857"
    });
    return kml;
  };

  let getGeometryFromGeoJsonGeometry = function(geometry) {
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

  let getGeoJsonGeometryFromGeometry = function(geometry) {
    var writer = new ol.format.GeoJSON();
    return JSON.parse(writer.writeGeometry(geometry));
  };

  let getSRIDfromCRSName = function(name) {
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

  let transform3857 = function(feature, srid) {
    //verifico che lo srid sia un oggetto crs
    if (srid) {
      if (srid.properties) {
        srid = getSRIDfromCRSName(srid.properties.name);
      }
      switch (parseInt(srid)) {
        case 3003:
          feature.getGeometry().transform("EPSG:3003", "EPSG:3857");
          break;
        case 25832:
          feature.getGeometry().transform("EPSG:25832", "EPSG:3857");
          break;
        case 4326:
          feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
          break;
      }
    }
    return feature;
  };

  let transformGeometrySrid = function(geometryOl, sridSource, sridDest) {
    return geometryOl.transform("EPSG:" + sridSource, "EPSG:" + sridDest);
  };

  let goToBrowserLocation = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(LamMap.showBrowserLocation);
    }
  };
  let showBrowserLocation = function(position) {
    goToLonLat(position.coords.longitude, position.coords.latitude, 18);
  };

  let getUriParameter = function(parameter) {
    return (
      decodeURIComponent((new RegExp("[?|&]" + parameter + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [null, ""])[1].replace(/\+/g, "%20")) || null
    );
  };

  let degreesToRadians = function(degrees) {
    return (degrees / 180) * Math.PI;
  };

  let mercatorLatitudeToY = function(latitude) {
    return Math.log(Math.tan(Math.PI / 4 + degreesToRadians(latitude) / 2));
  };

  /**
   * Calcola l'aspect ratio da applicare alla stampa da ESPG:3857
   * @param  {float} topLatitude    latitude top dell'area da stampare
   * @param  {float} bottomLatitude latitude bottom dell'area da stampare
   * @return {float}                Aspect Ratio
   */
  let aspectRatio = function(topLat, bottomLat) {
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

  let getCentroid = function(lonlats) {
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

  let getCentroid2d = function(coords) {
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
  let clearLayerPrint = function() {
    vectorPrint.getSource().clear(true);
  };

  /**
   * Get the geometry type from a coordinate array. Returns a getGeometryTypesEnum
   * @param {Array} coordinates
   */
  let getGeometryType = function(coordinates) {
    if (!Array.isArray(coordinates)) {
      return LamMapEnums.geometryTypes().GeometryNull;
    }
    let firstElement = coordinates[0];
    if (!Array.isArray(firstElement)) {
      //single array geometry
      if (coordinates.length > 2) {
        if (coordinates[0] === coordinates[coordinates.length - 2] && coordinates[1] === coordinates[coordinates.length - 1]) {
          return LamMapEnums.geometryTypes().Polygon;
        } else {
          LamMapEnums.geometryTypes().Polyline;
        }
      } else {
        return LamMapEnums.geometryTypes().Point;
      }
    }
    if (!Array.isArray(firstElement[0])) {
      //if first and last point are the same is polygon, otherwise polyline
      let lastElement = coordinates[coordinates.length - 1];
      if (firstElement[0] === lastElement[0] && firstElement[1] === lastElement[1]) {
        return LamMapEnums.geometryTypes().Polygon;
      } else {
        return LamMapEnums.geometryTypes().Polyline;
      }
    }
    //multis
    switch (getGeometryType(firstElement)) {
      case LamMapEnums.geometryTypes().Polygon:
      case LamMapEnums.geometryTypes().MultiPolygon:
        return LamMapEnums.geometryTypes().MultiPolygon;
      case LamMapEnums.geometryTypes().Polyline:
      case LamMapEnums.geometryTypes().MultiPolyline:
        return LamMapEnums.geometryTypes().MultiPolyline;
    }
    return LamMapEnums.geometryTypes().GeometryNull;
  };

  let getLabelPoint = function(coordinates) {
    if (coordinates.length === 1) coordinates = coordinates[0];
    switch (getGeometryType(coordinates)) {
      case LamMapEnums.geometryTypes().Point:
        return coordinates;
      case LamMapEnums.geometryTypes().Polyline:
        return coordinates[Math.floor(coordinates.length / 2)];
      case LamMapEnums.geometryTypes().Polygon:
        let polygon = new ol.geom.Polygon(coordinates);
        return polygon.getInteriorPoint().getCoordinates();
      case LamMapEnums.geometryTypes().MultiPolyline:
        coordinates = coordinates[0];
        return coordinates[Math.floor(coordinates.length / 2)];
      case LamMapEnums.geometryTypes().MultiPolygon:
        let mpolygon = new ol.geom.Polygon(coordinates);
        return mpolygon.getInteriorPoint().getCoordinates();
    }
  };

  let getPixelFromCoordinate = function(x, y) {
    return mainMap.getPixelFromCoordinate([x, y]);
  };

  let getCoordinateFromPixel = function(x, y) {
    return mainMap.getCoordinateFromPixel([x, y]);
  };

  return {
    //addContextMenu: addContextMenu,
    addDrawInteraction: addDrawInteraction,
    addDrawDeleteInteraction: addDrawDeleteInteraction,
    addFeatureSelectionToMap: addFeatureSelectionToMap,
    addFeatureToMap: addFeatureToMap,
    addGeometryToMap: addGeometryToMap,
    addLayerToMap: addLayerToMap,
    addSelectInteraction: addSelectInteraction,
    setPrintBox: setPrintBox,
    addWKTToMap: addWKTToMap,
    aspectRatio: aspectRatio,
    clearLayerPrint: clearLayerPrint,
    clearLayerSelection: clearLayerSelection,
    clearLayerSelectionMask: clearLayerSelectionMask,
    convertGeometryToOl: convertGeometryToOl,
    convertGeoJsonFeatureToOl: convertGeoJsonFeatureToOl,
    deleteDrawFeatures: deleteDrawFeatures,
    render: render,
    getCentroid: getCentroid,
    getCentroid2d: getCentroid2d,
    getCurrentColor: getCurrentColor,
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
    layerIsPresent: layerIsPresent,
    loadConfig: loadConfig,
    log: log,
    removeAllLayersFromMap: removeAllLayersFromMap,
    removeLayerFromMap: removeLayerFromMap,
    removeDrawInteraction: removeDrawInteraction,
    removeDrawDeleteInteraction: removeDrawDeleteInteraction,
    removeSelectInteraction: removeSelectInteraction,
    setLayerVisibility: setLayerVisibility,
    showBrowserLocation: showBrowserLocation,
    startCopyCoordinate: startCopyCoordinate,
    stopCopyCoordinate: stopCopyCoordinate,
    toggleLayer: toggleLayer,
    transform3857: transform3857,
    transformGeometrySrid: transformGeometrySrid,
    zoomIn: zoomIn,
    zoomOut: zoomOut
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

var LamDrawTools = (function() {
  var isRendered = false;

  var init = function init() {
    $("#draw-tools__point").click(function() {
      $("#draw-tools__draw-settings").show();
      $("#draw-tools__delete-settings").hide();
      lamDispatch({
        eventName: "set-draw",
        type: "Point"
      });
    });
    $("#draw-tools__polyline").click(function() {
      $("#draw-tools__draw-settings").show();
      $("#draw-tools__delete-settings").hide();
      lamDispatch({
        eventName: "set-draw",
        type: "LineString"
      });
    });
    $("#draw-tools__polygon").click(function() {
      $("#draw-tools__draw-settings").show();
      $("#draw-tools__delete-settings").hide();
      lamDispatch({
        eventName: "set-draw",
        type: "Polygon"
      });
    });
    $("#draw-tools__delete").click(function() {
      $("#draw-tools__draw-settings").hide();
      $("#draw-tools__delete-settings").show();
      lamDispatch({
        eventName: "set-draw-delete",
        type: "Delete"
      });
    });

    //adding tool reset
    LamToolbar.addResetToolsEvent({ eventName: "unset-draw" });

    //Events binding
    LamDispatcher.bind("show-draw-tools", function(payload) {
      LamToolbar.toggleToolbarItem("draw-tools");
      if (LamToolbar.getCurrentToolbarItem() === "draw-tools") {
        LamStore.setInfoClickEnabled(false);
      }
      lamDispatch("clear-layer-info");
    });

    LamDispatcher.bind("set-draw", function(payload) {
      LamMap.removeDrawInteraction();
      LamMap.removeDrawDeleteInteraction();
      LamMap.addDrawInteraction(payload.type);
    });

    LamDispatcher.bind("unset-draw", function(payload) {
      LamMap.removeDrawInteraction();
      LamMap.removeDrawDeleteInteraction();
    });

    LamDispatcher.bind("set-draw-delete", function(payload) {
      LamMap.removeDrawInteraction();
      LamMap.removeDrawDeleteInteraction();
      LamMap.addDrawDeleteInteraction(payload.type);
    });

    LamDispatcher.bind("delete-draw", function(payload) {
      LamMap.deleteDrawFeatures(payload.type);
    });
  };

  var render = function(div) {
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

  var templateDraw = function() {
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

  var templateEmpty = function(results) {
    var template = "<p></p>";
    return Handlebars.compile(template);
  };

  var setDraw = function(type) {
    lamDispatch({
      eventName: "set-draw",
      type: type
    });
  };

  var deleteFeatures = function() {
    lamDispatch({
      eventName: "delete-draw"
    });
  };

  return {
    setDraw: setDraw,
    deleteFeatures: deleteFeatures,
    init: init,
    render: render,
    templateDraw: templateDraw
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

var LamMapTools = (function() {
  var isRendered = false;

  var init = function init() {
    //Events binding
    LamDispatcher.bind("show-map-tools", function(payload) {
      LamToolbar.toggleToolbarItem("map-tools");
      if (LamToolbar.getCurrentToolbarItem() === "map-tools") {
        LamStore.setInfoClickEnabled(false);
      }
      lamDispatch("clear-layer-info");
    });
  };

  var render = function(div) {
    var templateTemp = templateTools();
    var output = templateTemp();
    jQuery("#" + div).html(output);
    if (!isRendered) {
      init();
    }
    //forzo che il contenuto non sia visualizzato
    //
    //aggiungo la copia nel bottone

    var clipboard = new ClipboardJS("#search-tools__copy-url", {
      text: function(trigger) {
        return $("#map-tools__coordinate-textarea").val();
      }
    });

    isRendered = true;
  };

  var templateTools = function() {
    template = "";
    //pannello ricerca via
    if (!LamStore.getAppState().logoPanelUrl) {
      template += '<h4 class="lam-title">Strumenti</h4>';
    }
    template += '<div class="lam-card lam-depth-2">';
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
    template += '<div class="div-20"></div>';

    template += "<div>";
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

    template += '<div class="div-10"></div>';
    //template += 'Crea link da condividere con i tuoi colleghi';
    template += "</div>";

    return Handlebars.compile(template);
  };

  var templateEmpty = function(results) {
    var template = "<p></p>";
    return Handlebars.compile(template);
  };

  /**
   * Chiama il disptcher per creare l'url di condivisione
   * @return {null} la funzione non restituisce valori
   */
  var goToLonLat = function() {
    var payload = {};
    try {
      payload.eventName = "zoom-lon-lat";
      payload.lon = parseFloat($("#map-tools__lon").val());
      payload.lat = parseFloat($("#map-tools__lat").val());
      lamDispatch(payload);
    } catch (e) {
      lamDispatch({
        eventName: "log",
        message: "LamStore: map-tools " + e
      });
    }

    try {
      payload = {};
      payload.eventName = "remove-info";
      lamDispatch(payload);
      payload = {};
      payload.eventName = "add-info-point";
      payload.lon = parseFloat($("#map-tools__lon").val());
      payload.lat = parseFloat($("#map-tools__lat").val());
      lamDispatch(payload);
    } catch (e) {
      lamDispatch({
        eventName: "log",
        message: "LamStore: map-tools " + e
      });
    }
  };

  var startCopyCoordinate = function() {
    $("#search-tools__start-copy-url").hide();
    $("#search-tools__stop-copy-url").show();
    lamDispatch("start-copy-coordinate");
  };

  var stopCopyCoordinate = function() {
    $("#search-tools__start-copy-url").show();
    $("#search-tools__stop-copy-url").hide();
    LamMap.stopCopyCoordinate();
  };

  var addCoordinate = function(lon, lat) {
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
    templateTools: templateTools
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

var LamPrintTools = (function() {
  var isRendered = false;

  var papersMM = {
    A4: {
      width: 210,
      height: 297
    },
    A3: {
      width: 210,
      height: 420
    }
  };

  var papersPX = {
    A4: {
      width: 794,
      height: 1123
    },
    A3: {
      width: 1123,
      height: 1587
    }
  };

  var init = function init() {
    //Upgrade grafici

    //bindo la scala con solo numeri
    $("#print-tools__scale").keyup(function(event) {
      //console.log(event.which);
      if (event.which != 8 && isNaN(String.fromCharCode(event.which))) {
        event.preventDefault();
      }
      showPrintArea();
    });

    //bindo i controlli per formato e orientamento
    $("#print-tools__orientation").change(function() {
      showPrintArea();
    });

    $("#print-tools__paper").change(function() {
      showPrintArea();
    });

    //adding tool reset
    LamToolbar.addResetToolsEvent({ eventName: "clear-layer-print" });

    //events binding
    LamDispatcher.bind("show-print-tools", function(payload) {
      LamToolbar.toggleToolbarItem("print-tools");
      if (LamToolbar.getCurrentToolbarItem() === "print-tools") {
        LamPrintTools.showPrintArea();
        LamStore.setInfoClickEnabled(false);
      }
      lamDispatch("clear-layer-info");
    });

    LamDispatcher.bind("print-map", function(payload) {
      LamPrintTools.printMap(payload.paper, payload.orientation, payload.format, payload.template);
    });

    LamDispatcher.bind("clear-layer-print", function(payload) {
      LamMap.clearLayerPrint();
    });

    LamDispatcher.bind("show-print-area", function(payload) {
      //ricavo posizione e risoluzione
      //Cerco il centro del rettangolo attuale di stampa o lo metto al centro della mappa
      var printCenter = LamMap.getPrintCenter();
      if (!printCenter) {
        printCenter = LamMap.getMapCenter();
      }
      //setto la risoluzione base a quella della mappa
      var scale = payload.scale;
      var resolution = LamMap.getMapResolution() / 2;
      //se la scala non è nulla setto la risoluzione in base alla Scala
      if (scale) {
        resolution = LamMap.getResolutionForScale(scale, "m");
      } else {
        //setto la scala per la stampa in ui
        LamPrintTools.setScale(LamMap.getMapScale() / 2);
      }
      var paper = payload.paper;
      var orientation = payload.orientation;
      var printSize = LamPrintTools.getPrintMapSize(paper, orientation, resolution);

      LamMap.setPrintBox(printCenter[0], printCenter[1], printSize.width, printSize.height);
    });
  };

  var render = function(div) {
    var templateTemp = templatePrint();
    var output = templateTemp();
    jQuery("#" + div).html(output);
    if (!isRendered) {
      init();
    }
    //aggiungo a4 al centro della mappa
    isRendered = true;
  };

  var templatePrint = function() {
    template = "";
    //pannello ricerca via
    if (!LamStore.getAppState().logoPanelUrl) {
      template += '<h4 class="lam-title">Stampa</h4>';
    }
    template += '<div class="lam-card lam-depth-2">';

    template += '<div class="lam-mb-2">';
    template += '<label class="lam-label" for="print-tools__paper" class="lam-label">Dimensione</label>';
    template += '<select id="print-tools__paper" class="lam-select">';
    template += '<option value="A4">A4</option>';
    template += '<option value="A3">A3</option>';
    template += "</select>";
    template += "</div>";

    template += '<div class="lam-mb-2">';
    template += '<label class="lam-label" for="print-tools__orientation" class="lam-label">Orientamento</label>';
    template += '<select id="print-tools__orientation" class="lam-select">';
    template += '<option value="portrait">Verticale</option>';
    template += '<option value="landscape">Orizzontale</option>';
    template += "</select>";
    template += "</div>";

    template += '<div class="lam-mb-2">';
    template += '<label class="lam-label" id="print-tools__scale-label" for="print-tools__scale">Scala</label>';
    template += '<input class="lam-input" type="text" id="print-tools__scale">';
    template += "</div>";

    template += '<div class="lam-mb-2">';
    template += '<label class="lam-label" id="print-tools__scale-label" for="print-tools__scale">Template</label>';
    template += '<select id="print-tools__template" class="lam-select">';
    template += '<option value="standard">Standard</option>';
    //template += '<option value="personalizzato">Personalizzato</option>';
    template += "</select>";
    template += "</div>";

    template += '<button id="print-tools__print-button" onclick="LamPrintTools.printClick(); return false;" class="lam-btn" >Stampa</button>';

    template += '<div class="div-10"></div>';

    template += "</div>";

    return Handlebars.compile(template);
  };

  var templateEmpty = function(results) {
    var template = "<p>Nessun risultato disponibile</p>";
    return Handlebars.compile(template);
  };

  /**
   * Send the map print request to the LamDispatcher
   * @return {void}
   */
  var printClick = function() {
    var paper = $("#print-tools__paper").val();
    var orientation = $("#print-tools__orientation").val();
    var format = "PDF";
    var template = $("#print-tools__template").val();
    var payload = {
      eventName: "print-map",
      paper: paper,
      format: format,
      orientation: orientation,
      template: template
    };
    LamDispatcher.dispatch(payload);
  };

  /**
   * Stampa la mappa under contruction
   * @param  {[type]} paper       [description]
   * @param  {[type]} orientation [description]
   * @param  {[type]} format      [description]
   * @param  {[type]} template    [description]
   * @return {[type]}             [description]
   */
  var printMap = function(paper, orientation, format, template) {
    let appState = LamStore.getAppState();
    //ricavo le dimensioni di Stampa
    appState.printPaper = paper;
    appState.printOrientation = orientation;
    appState.printFormat = format;
    appState.printTemplate = template;
    var paperDimension = LamPrintTools.getPaperSize(paper, orientation);
    appState.printWidth = paperDimension.width;
    appState.printHeight = paperDimension.height;

    //ricavo i dati della mappa per la stampa
    var resolution = LamMap.getResolutionForScale(scale);
    var center = LamMap.getPrintCenter();
    var centerLL = LamMap.getPrintCenterLonLat();
    //La scala viene ricalcolata in base ad un parametero di conversione locale
    //Questa parte è tutta rivedere
    var scale = LamPrintTools.getScale() * LamMap.aspectRatio(centerLL[1] * 1.12, centerLL[1] * 0.88);

    //
    appState.printCenterX = center[0];
    appState.printCenterY = center[1];
    appState.printScale = scale;
    appState.printDpi = 96;

    appState.printParams = {};
    appState.printParams.dummy = "null";

    //invio la richiesta al servizio di print

    $.post(appState.restAPIUrl + "/api/print", {
      appstate: JSON.stringify(appState)
    })
      .done(function(pdf) {
        window.location = appState.restAPIUrl + "/api/print/" + pdf.pdfName;
      })
      .fail(function(err) {
        //TODO completare fail
      });
  };

  /**
   * Return paper dimensions in map units
   * @param  {string} paper       paper size (A4 | A3
   * @param  {string} orientation paper orientation (portrait | landscape)
   * @param  {float} resolution  map pixel resolution
   * @return {object}             object with width and height properties
   */
  var getPrintMapSize = function(paper, orientation, resolution) {
    var width = 0;
    var height = 0;
    var size = getPaperSize(paper, orientation);
    size.width = size.width * resolution;
    size.height = size.height * resolution;
    return size;
  };

  /**
   * Aggiorna il rettangolo di stampa nella mappa
   * @param  {Int} scale       scala di stampa
   * @param  {String} paper       formato carta
   * @param  {String} orientation orientamento carta
   * @return {null}
   */
  var showPrintArea = function(scale, paper, orientation) {
    if (!scale) {
      scale = parseInt($("#print-tools__scale").val());
    }
    if (!paper) {
      paper = $("#print-tools__paper").val();
    }
    if (!orientation) {
      orientation = $("#print-tools__orientation").val();
    }
    lamDispatch({
      eventName: "show-print-area",
      scale: scale,
      paper: paper,
      orientation: orientation
    });
  };

  var setScale = function(scale) {
    $("#print-tools__scale").val(Math.round(scale));
    $("#print-tools__scale-label").addClass("active");
    //$("#print-tools__scale").parent().addClass("active");
  };

  var getScale = function() {
    return Math.round(parseInt($("#print-tools__scale").val()));
  };

  var getPaperSize = function(paper, orientation) {
    var width = 0;
    var height = 0;
    switch (paper) {
      case "A4":
        width = papersPX.A4.width;
        height = papersPX.A4.height;
        break;
      case "A3":
        width = papersPX.A3.width;
        height = papersPX.A3.height;
        break;
      default:
    }
    //inverto le dimensioni in caso di landscape
    switch (orientation) {
      case "portrait":
        break;
      case "landscape":
        var tmp = width;
        width = height;
        height = tmp;
        break;
    }

    var size = {};

    size.width = width;
    size.height = height;

    return size;
  };

  /**
   * Return the map envelope to be printed
   * @param  {float} x      [description]
   * @param  {float} y      [description]
   * @param  {float} width  [description]
   * @param  {float} height [description]
   * @return {object}        [description]
   */
  var getPrintEnvelopeCenter = function(x, y, width, height) {
    var xMin = x - width / 2;
    var xMax = x + width / 2;
    var yMin = y - height / 2;
    var yMax = y + height / 2;
    return {
      xMin: xMin,
      xMax: xMax,
      yMin: yMin,
      yMax: yMax
    };
  };

  return {
    getPaperSize: getPaperSize,
    getPrintMapSize: getPrintMapSize,
    getPrintEnvelopeCenter: getPrintEnvelopeCenter,
    getScale: getScale,
    init: init,
    printClick: printClick,
    printMap: printMap,
    render: render,
    setScale: setScale,
    showPrintArea: showPrintArea,
    templatePrint: templatePrint
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

var LamSearchTools = (function() {
  var isRendered = false;

  var comuni = [];
  var searchResults = [];
  var searchAddressProviderUrl = "";
  var searchAddressProviderField = "";
  var searchHouseNumberProviderUrl = "";
  var searchHouseNumberProviderField = "";
  var currentSearchDate = "";
  var searchLayers = [];

  var init = function init() {
    Handlebars.registerHelper("hasLayers", function(options) {
      //return searchLayers.length > 0;
      return true;
    });

    //events binding
    LamDispatcher.bind("show-search", function(payload) {
      LamToolbar.toggleToolbarItem("search-tools");
      lamDispatch("clear-layer-info");
    });

    LamDispatcher.bind("show-search-items", function(payload) {
      LamSearchTools.showSearchInfoFeatures(payload.features);
    });

    try {
      $(".dropdown-trigger").dropdown();
    } catch (e) {
    } finally {
    }
  };

  var render = function(div, provider, providerAddressUrl, providerAddressField, providerHouseNumberUrl, providerHouseNumberField, layers) {
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
        $("#search-tools__select-layers").on("change", function() {
          var currentLayer = $("#search-tools__select-layers option:selected").val();
          for (li = 0; li < searchLayers.length; li++) {
            if (searchLayers[li].layer == currentLayer) {
              $("#search-tools__search-layers__label").text(searchLayers[li].searchField);
            }
          }
        });
        break;
      case "nominatim":
      default:
        var templateTemp = templateSearchNominatim(searchLayers);
        var output = templateTemp(searchLayers);
        jQuery("#" + div).html(output);
    }

    updateScroll(220);
    $(window).resize(function() {
      updateScroll(20);
    });

    if (!isRendered) {
      init();
    }

    isRendered = true;
  };

  /**
   * Aggiorna la dimensione dello scroll dei contenuti
   * @return {null} La funzione non restituisce un valore
   */
  var updateScroll = function(offset) {
    var positionMenu = $("#menu-toolbar").offset();
    var positionSearch = $("#search-tools__search-results").offset();
    $("#search-tools__search-results").height(positionMenu.top - positionSearch.top - offset);
  };

  var updateComuniNominatim = function(comuni) {
    $.each(comuni, function(i, comune) {
      var nomeComune = comune.nomeComune;
      if (nomeComune) {
        nomeComune = nomeComune.replace(/_/g, " ");
        if (nomeComune.indexOf("Reggio") >= 0) {
          nomeComune = nomeComune.replace("nell Emilia", "nell'Emilia");
        }
      }
      $("#search-tools__comune").append(
        $("<option>", {
          value: comune.istat,
          text: nomeComune
        })
      );
    });
  };

  /**
   * General html code that will be injected in the panel as the main tools
   */
  var templateTopTools = function() {
    let template = '<div class="lam-bar lam-background">';
    template += '<div class="lam-grid lam-no-margin">';
    template +=
      '<div class="lam-col"><button class="lam-btn lam-btn-small lam-ripple" onclick="LamSearchTools.showSearchAddress(); return false;" autofocus>Indirizzi</button>';
    template += '<button class="lam-btn lam-btn-small lam-ripple" onclick="LamSearchTools.showSearchLayers(); return false;" >Layers</button></div>';
    template += "</div>";
    template += "</div>";
    return template;
  };
  // var templateTopTools = function() {
  //   let template = '<div class="lam-bar lam-background">';
  //   template += '<button id="search-tools__menu" class="dropdown-trigger btn" value="Indirizzo" data-target="search-tools__menu-items">';
  //   template += '<i class="lam-icon">more_vert</i>';
  //   template += '</button> <span id="search-tools__label">Indirizzo</span>';
  //   template += "</div>";
  //   template += '<ul id="search-tools__menu-items" class="dropdown-content" >';
  //   template += '<li onclick="LamSearchTools.showSearchAddress(); return false;"><span >Indirizzo</span></li>';
  //   template += "{{#if this.length}}";
  //   template += '<li onclick="LamSearchTools.showSearchLayers(); return false;"><span >Layer</span></li>';
  //   template += "{{/if}}";
  //   template += "</ul>";
  //   return template;
  // };

  /**
   * General html code that will be injected in order to display the layer tools
   */
  var templateLayersTools = function(searchLayers) {
    let template = '<div id="search-tools__layers" class="lam-card lam-depth-2 lam-hidden" >';
    template += '<select id="search-tools__select-layers" class="lam-select lam-mb-2">';
    for (var i = 0; i < searchLayers.length; i++) {
      template += '<option class="lam-option" value="' + searchLayers[i].layer + '">' + searchLayers[i].layerName + "</option>";
    }
    template += "</select>";

    template += '<div id="search-tools__search-layers-field" class="lam-grid" >';
    template += '<label class="lam-label" id="search-tools__search-layers__label" for="search-tools__search-layers">';
    if (searchLayers.length > 0) {
      template += searchLayers[0].searchField;
    } else {
      template += "Layers...";
    }
    template += "</label>";
    template += '<input id="search-tools__search-layers" class="lam-input" type="search" onkeyup="LamSearchTools.doSearchLayers(event)">';

    template += "</div>";

    template += "</div>";
    return template;
  };

  /**
   * Initialize the panel if Nominatim is selected as default address provider
   */
  var templateSearchNominatim = function(searchLayers) {
    let template = "";
    //pannello ricerca via
    if (!LamStore.getAppState().logoPanelUrl) {
      template += '<h4 class="lam-title">Ricerca</h4>';
    }
    template += templateTopTools();
    template += '<div id="search-tools__address" class="lam-card lam-depth-2">';
    template += '<select id="search-tools__comune" class="lam-input">';
    template += "</select>";
    template += '<div class="div-5"></div>';
    template += '<div id="search-tools__search-via-field" class="" >';
    template += '<label class="lam-label" id="search-tools__search-via__label" for="search-tools__search-via">Indirizzo</label>';
    template +=
      '<input id="search-tools__search-via" class="lam-input" type="search" onkeyup="LamSearchTools.doSearchAddressNominatim(event)" placeholder="Via o civico">';
    template += "</div>";
    template += "</div>";
    template += templateLayersTools(searchLayers);
    template += '<div class="div-10"></div>';
    template += '<div id="search-tools__search-results" class="lam-card lam-depth-2 lam-scrollable">';
    template += "</div>";
    return Handlebars.compile(template);
  };

  /**
   * Initialize the panel if Geoserver is selected as default address provider
   */
  var templateSearchWFSGeoserver = function() {
    let template = "";
    //pannello ricerca via
    if (!LamStore.getAppState().logoPanelUrl) {
      template += '<h4 class="lam-title">Ricerca</h4>';
    }
    template += templateTopTools();
    template += '<div id="search-tools__address" class="lam-card lam-depth-2">';
    template += '<div id="search-tools__search-via-field" class="" >';
    template += '<label class="lam-label" id="search-tools__search-via__label" for="search-tools__search-via">Indirizzo</label>';
    template +=
      '<input id="search-tools__search-via" class="lam-input" type="search" onkeyup="LamSearchTools.doSearchAddressWMSG(event)" placeholder="Via o civico">';
    template += "</div>";
    template += "</div>";
    template += templateLayersTools(searchLayers);
    template += '<div class="div-10"></div>';
    template += '<div id="search-tools__search-results" class="lam-card lam-depth-2 lam-scrollable">';
    template += "</div>";
    return Handlebars.compile(template);
  };

  /**
   * Display the list of the nominatim results in the left panel
   * @param {Object} results
   */
  var templateResultsNominatim = function(results) {
    template = '<h5 class="lam-title-h4">Risultati della ricerca</h5>';
    template = '<ul class="lam-grid">';
    template += "{{#each this}}";
    template += '<div class="lam-col">';
    template +=
      '<i class="lam-icon-primary">' +
      LamResources.svgMarker +
      '</i><a href="#" class="lam-link" onclick="LamSearchTools.zoomToItemNominatim({{{@index}}});return false">';
    template += "{{{display_name}}}";
    template += "</a>";
    template += "</div>";
    template += "{{/each}}";
    template += "</ul>";
    return Handlebars.compile(template);
  };

  /**
   * Display the list of the WFS Address results in the left panel
   * @param {Object} results
   */
  var templateSearchResultsWFSGeoserver = function(results) {
    template = '<h5 class="lam-title-h4>Risultati della ricerca</h5>';
    template = '<div class="lam-grid lam-grid-1">';
    template += "{{#each this}}";
    template += '<div class="lam-col">';
    template +=
      '<i class="lam-icon-primary">' +
      LamResources.svgMarker +
      '</i><a href="#" class="lam-link" onclick="LamSearchTools.zoomToItemLayer({{{lon}}}, {{{lat}}}, {{@index}}, false);return false">';
    template += "{{{display_name}}} ";
    template += "{{{display_name2}}} ";
    template += "</a>";
    template += "</div>";
    template += "{{/each}}";
    template += "</div>";
    return Handlebars.compile(template);
  };

  /**
   * Display the list of the WFS Layers results in the left panel
   * @param {Object} results
   */
  var templateSearchResultsLayers = function(results) {
    template = '<div class="lam-grid">';
    template += "{{#each this}}";
    template += '<div class="lam-col">';
    template +=
      '<i class="lam-icon-primary">' +
      LamResources.svgMarker +
      '</i><a href="#" class="lam-link" onclick="LamSearchTools.zoomToItemLayer({{{lon}}}, {{{lat}}}, {{@index}}, true);return false">';
    template += "{{{display_name}}}";
    template += "</a>";
    template += "</div>";
    template += "{{/each}}";
    template += "</div>";
    return Handlebars.compile(template);
  };

  var templateResultEmpty = function(results) {
    var template = "<p>Nessun risultato disponibile</p>";
    return Handlebars.compile(template);
  };

  /**
   * Switch the address/layers tools
   */
  var showSearchAddress = function() {
    $("#search-tools__label").text("Indirizzo");
    $("#search-tools__address").show();
    $("#search-tools__layers").hide();
  };

  /**
   * Switch the address/layers tools
   */
  var showSearchLayers = function() {
    $("#search-tools__label").text("Layers");
    $("#search-tools__address").hide();
    $("#search-tools__layers").show();
  };

  /**
   * Zoom the map to the item provided
   * @param {int} index  Item's index in the Nominatim array result
   */
  var zoomToItemNominatim = function(index) {
    let result = searchResults[index];
    lamDispatch({
      eventName: "zoom-lon-lat",
      zoom: 18,
      lon: parseFloat(result.lon),
      lat: parseFloat(result.lat)
    });
    lamDispatch({
      eventName: "add-wkt-info-map",
      wkt: "POINT(" + result.lon + " " + result.lat + ")"
    });
    lamDispatch({ eventName: "hide-menu-mobile" });
  };

  // /**
  //  * Zoom the map to the lon-lat given and add a point to the map
  //  * @param {float} lon
  //  * @param {float} lat
  //  */
  // var zoomToItemWFSGeoserver = function(lon, lat) {
  //   lamDispatch("remove-info");
  //   lamDispatch({
  //     eventName: "zoom-lon-lat",
  //     zoom: 18,
  //     lon: parseFloat(lon),
  //     lat: parseFloat(lat)
  //   });
  //   lamDispatch({
  //     eventName: "add-wkt-info-map",
  //     wkt: "POINT(" + payload.lon + " " + payload.lat + ")"
  //   });
  //   lamDispatch("hide-menu-mobile");
  // };

  /**
   * Zoom the map to the lon-lat given and show the infobox of the given item index
   * @param {float} lon
   * @param {float} lat
   * @param {int} index Item's index in the result array
   * @param {boolean} showInfo
   */
  var zoomToItemLayer = function(lon, lat, index, showInfo) {
    lamDispatch("remove-info");
    if (searchResults[index]) {
      lamDispatch({
        eventName: "zoom-geometry",
        geometry: searchResults[index].item.geometry,
        srid: 4326
      });
      if (showInfo) {
        lamDispatch({
          eventName: "show-info-items",
          features: searchResults[index].item,
          element: "search-tools__search-results"
        });
      }
      let payload = {
        eventName: "add-geometry-info-map",
        geometry: searchResults[index].item.geometry
      };
      try {
        payload.srid = searchResults[index].item.crs;
        if (payload.srid == null) {
          payload.srid = 4326;
        }
      } catch (e) {
        payload.srid = 4326;
      }
      lamDispatch(payload);
      lamDispatch("hide-menu-mobile");
    } else {
      lamDispatch({
        eventName: "zoom-lon-lat",
        zoom: 18,
        lon: parseFloat(lon),
        lat: parseFloat(lat),
        eventName: "add-wkt-info-map",
        wkt: "POINT(" + lon + " " + lat + ")"
      });
      lamDispatch("hide-menu-mobile");
    }
  };

  var getRegioneFromComuneNominatim = function(idcomune) {
    return "Emilia-Romagna";
  };

  /**
   * Start the search in the Nominatim Provider
   * @param {Object} ev key click event result
   */
  var doSearchAddressNominatim = function(ev) {
    if (ev.keyCode == 13) {
      $("#search-tools__search-via").blur();
    }
    var comune = $("#search-tools__comune option:selected").text();
    var idcomune = $("#search-tools__comune option:selected").val();
    var regione = getRegioneFromComuneNominatim(idcomune);
    var via = $("#search-tools__search-via").val();

    if (via.length > 3 && comune) {
      via = via.replace("'", " ");
      var url = "http://nominatim.openstreetmap.org/search/IT/" + regione + "/" + comune + "/" + via + "?format=jsonv2&addressdetails=1" + "&";
      console.log(url);
      currentSearchDate = new Date().getTime();
      var searchDate = new Date().getTime();
      $.ajax({
        dataType: "json",
        url: url
      })
        .done(function(data) {
          //verifica che la ricerca sia ancora valida
          if (currentSearchDate > searchDate) {
            return;
          }
          var results = [];
          if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].osm_type == "way") {
                results.push(data[i]);
              }
            }
            searchResults = results;
            //renderizzo i risultati

            var templateTemp = templateResultsNominatim();
            var output = templateTemp(results);
            jQuery("#search-tools__search-results").html(output);
          } else {
            var templateTemp = templateResultEmpty();
            var output = templateTemp();
            jQuery("#search-tools__search-results").html(output);
          }
        })
        .fail(function(data) {
          lamDispatch({
            eventName: "log",
            message: "LamSearchTools: unable to bind comuni"
          });
        });
    }
  };

  /**
   * Start the search in the WFS Geoserver Provider
   * @param {Object} ev key click event result
   */
  var doSearchAddressWMSG = function(ev) {
    if (ev.keyCode == 13) {
      $("#search-tools__search-via").blur();
    }
    var via = $("#search-tools__search-via").val();
    var cql = "";
    var arrTerms = via.split(" ");
    var street = "";
    var civico = "";

    if (via.indexOf(",") > -1) {
      var viaArr = via.split(",");
      street = viaArr[0];
      civico = viaArr[1];
    } else {
      for (var i = 0; i < arrTerms.length; i++) {
        //verifica dei civici e dei barrati
        if (isNaN(arrTerms[i])) {
          if (arrTerms[i].indexOf("/") > -1) {
            civico += arrTerms[i];
          } else if (arrTerms[i].length === 1) {
            civico += arrTerms[i];
          } else {
            street += arrTerms[i] + " ";
          }
        } else {
          if (i === 0) {
            //se ho il primo elemento numerico lo tratto come una via
            street += arrTerms[i];
          } else {
            civico += arrTerms[i];
          }
        }
      }
    }
    var url = searchAddressProviderUrl;
    if (!civico) {
      //solo ricerca via
      url += "&cql_filter=[" + searchAddressProviderField + "]ilike%27%25" + street.trim() + "%25%27";
    } else {
      //ricerca via e civico
      var url = searchHouseNumberProviderUrl;
      url +=
        "&cql_filter=" +
        searchAddressProviderField +
        "%20ilike%20%27%25" +
        street.trim() +
        "%25%27%20AND%20" +
        searchHouseNumberProviderField +
        "%20ILIKE%20%27" +
        civico +
        "%25%27";
    }

    if (via.length > 2) {
      via = via.replace("'", " ");
      currentSearchDate = new Date().getTime();
      var searchDate = new Date().getTime();
      $.ajax({
        dataType: "jsonp",
        url: url,
        jsonp: true,
        jsonpCallback: "parseResponse",
        success: function(data) {
          //verifica che la ricerca sia ancora valida
          if (currentSearchDate > searchDate) {
            return;
          }
          var results = [];
          if (data.features.length > 0) {
            var toponimi = [];
            var results = [];
            for (var i = 0; i < data.features.length; i++) {
              var currentAddress = data.features[i].properties[searchAddressProviderField];
              if (data.features[i].properties[searchHouseNumberProviderField]) {
                currentAddress = " " + data.features[i].properties[searchHouseNumberProviderField];
              }
              if ($.inArray(currentAddress, toponimi) === -1) {
                var cent = null;
                if (data.features[i].geometry.type != "POINT") {
                  cent = LamMap.getCentroid(data.features[i].geometry.coordinates);
                } else {
                  cent = data.features[i].geometry.coordinates;
                }
                var tempItem = {
                  display_name: data.features[i].properties[searchAddressProviderField],
                  lon: cent[0],
                  lat: cent[1],
                  item: data.features[i]
                };
                if (searchHouseNumberProviderField) {
                  tempItem.display_name2 = data.features[i].properties[searchHouseNumberProviderField];
                }
                results.push(tempItem);
                toponimi.push(data.features[i].properties[searchAddressProviderField]);
              }
            }
            searchResults = results.sort(SortByDisplayName);
            //renderizzo i risultati
            var templateTemp = templateSearchResultsWFSGeoserver();
            var output = templateTemp(results);
            jQuery("#search-tools__search-results").html(output);
          } else {
            var templateTemp = templateResultEmpty();
            var output = templateTemp();
            jQuery("#search-tools__search-results").html(output);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          lamDispatch({
            eventName: "log",
            message: "LamSearchTools: unable to complete response"
          });
        }
      });
    }
  };

  /**
   * Start the search in the WFS Geoserver Provider
   * @param {Object} ev key click event result
   */
  var doSearchLayers = function(ev) {
    if (ev.keyCode == 13) {
      $("#search-tools__search-layers").blur();
    }
    var itemStr = $("#search-tools__search-layers").val();
    var cql = "";
    //ricavo l'elenco dei layer da interrogare
    currentSearchDate = new Date().getTime();
    var searchDate = new Date().getTime();
    var currentLayer = $("#search-tools__select-layers option:selected").val();

    if (itemStr.length > 2) {
      jQuery("#search-tools__search-results").html("");
      for (li = 0; li < searchLayers.length; li++) {
        if (searchLayers[li].layer == currentLayer) {
          var layer = searchLayers[li];
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
          itemStr = itemStr.replace("'", " ");

          $.ajax({
            dataType: "jsonp",
            url: url,
            jsonp: true,
            jsonpCallback: "parseResponse",
            success: function(data) {
              //verifica che la ricerca sia ancora valida
              if (currentSearchDate > searchDate) {
                return;
              }
              data.features.forEach(function(feature) {
                feature.layerGid = layer.gid;
                feature.srid = LamMap.getSRIDfromCRSName(data.crs.properties.name);
              });
              if (data.features.length > 0) {
                lamDispatch({
                  eventName: "show-search-items",
                  features: data
                });
                lamDispatch({
                  eventName: "show-info-geometries",
                  features: data
                });
              } else {
                var templateTemp = templateResultEmpty();
                var output = templateTemp();
                jQuery("#search-tools__search-results").html(output);
              }
              return;
            },
            error: function(jqXHR, textStatus, errorThrown) {
              lamDispatch({
                eventName: "log",
                message: "LamSearchTools: unable to complete response"
              });
            }
          });
        }
      }
    }
  };

  /**
   * Show the search results in menu
   * @param {Object} featureInfoCollection GeoJson feature collection
   */
  let showSearchInfoFeatures = function(featureInfoCollection) {
    var title = "Risultati";
    if (!featureInfoCollection) {
      return;
    }
    var body = LamTemplates.renderInfoFeatures(featureInfoCollection);
    $("#search-tools__search-results").html(body);
  };

  /**
   * Mostra dei risultati generici ricavati ad esempio da un reverseGeocoding
   * @param  {object} data Elenco di oggetti
   * @return {null}
   */
  var displayGenericResults = function(data) {
    var results = [];
    if (data.length > 0) {
      var resultsIndex = [];
      var results = [];
      for (var i = 0; i < data.length; i++) {
        //ricavo il layer relativo
        var layer = LamStore.getLayerByName(data[i].id.split(".")[0]);
        if (layer) {
          var cent = null;
          if (data[i].geometry.coordinates[0][0]) {
            cent = LamMap.getCentroid(data[i].geometry.coordinates[0]);
          } else {
            cent = LamMap.getCentroid(data[i].geometry.coordinates);
          }
          var item = data[i];
          //salvo il crs della feature
          item.crs = data.crs;
          //item.id = currentLayer;
          results.push({
            display_name: layer.layerName + "-" + data[i].properties[layer.labelField],
            lon: cent[0],
            lat: cent[1],
            item: item
          });
          resultsIndex.push(data[i].properties[layer.labelField]);
        }
      }
      searchResults = results;
      //renderizzo i risultati
      var templateTemp = templateSearchResultsLayers();
      var output = templateTemp(results);
      jQuery("#search-tools__search-results").html(output);
    } else {
      var templateTemp = templateResultEmpty();
      var output = templateTemp();
      jQuery("#search-tools__search-results").html(output);
    }
  };

  var selectLayer = function(layer) {
    $("#search-tools__select-layers").val(layer);
  };

  function SortByDisplayName(a, b) {
    var aName = a.display_name.toLowerCase();
    var bName = b.display_name.toLowerCase();
    return aName < bName ? -1 : aName > bName ? 1 : 0;
  }

  return {
    displayGenericResults: displayGenericResults,
    render: render,
    templateSearchNominatim: templateSearchNominatim,
    init: init,
    doSearchAddressNominatim: doSearchAddressNominatim,
    updateComuniNominatim: updateComuniNominatim,
    zoomToItemNominatim: zoomToItemNominatim,
    doSearchAddressWMSG: doSearchAddressWMSG,
    doSearchLayers: doSearchLayers,
    selectLayer: selectLayer,
    showSearchInfoFeatures: showSearchInfoFeatures,
    showSearchAddress: showSearchAddress,
    showSearchLayers: showSearchLayers,
    //zoomToItemWFSGeoserver: zoomToItemWFSGeoserver,
    zoomToItemLayer: zoomToItemLayer
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

let LamSelectTools = (function() {
  let isRendered = false;
  let selectLayers = [];
  let selectionResult = [];

  let init = function init(layers) {
    selectLayers = layers.filter(function(layer) {
      return layer.labelField != null && layer.labelField != "";
    });

    let btn = $("<button/>", {
      class: "lam-btn lam-btn-floating lam-btn-large",
      click: function(e) {
        e.preventDefault();
        lamDispatch("show-select-tools");
      }
    }).append("<i class='large lam-icon '>select_all</i>");
    $("#menu-toolbar").append(btn);

    let divSelect = $("<div />", { id: "select-tools", class: "lam-panel-content-item" });
    $("#panel__content").append(divSelect);

    LamDispatcher.bind("show-select-tools", function(payload) {
      LamToolbar.toggleToolbarItem("select-tools");
      if (LamToolbar.getCurrentToolbarItem() === "select-tools") {
        lamDispatch("set-select");
      } else {
        lamDispatch("unset-select");
      }
      lamDispatch("clear-layer-info");
    });

    LamDispatcher.bind("set-select", function(payload) {
      LamMap.removeSelectInteraction();
      LamMap.addSelectInteraction(payload.type);
    });

    LamDispatcher.bind("unset-select", function(payload) {
      LamMap.removeSelectInteraction();
      LamMap.clearLayerSelection();
      LamMap.clearLayerSelectionMask();
    });

    LamDispatcher.bind("start-selection-search", function(payload) {
      LamMap.clearLayerSelection();
      let coords = payload.coords;
      if (!coords) {
        coords = LamMap.getSelectionMask();
      }
      let layerName = payload.layerName;
      if (!layerName) {
        layerName = $("#select-tools__layers option:selected").val();
      }
      if (!coords || !layerName) {
        lamDispatch({
          eventName: "log",
          message: "Parametri per la selezione non validi"
        });
        return;
      }
      LamSelectTools.doSelectionLayers(coords, layerName);
    });

    LamToolbar.addResetToolsEvent({
      eventName: "unset-select"
    });
  };

  let render = function(layers) {
    if (!isRendered) {
      init(layers);
    }
    let templateTemp = templateSelect();
    let output = templateTemp();
    jQuery("#select-tools").html(output);
    //forzo che il contenuto non sia visualizzato
    $("#select-tools__content").hide();

    $("#select-tools__layers").on("change", function() {
      lamDispatch({
        eventName: "start-selection-search"
      });
    });

    try {
      $(".dropdown-trigger").dropdown();
    } catch (e) {
    } finally {
    }

    isRendered = true;
  };

  let templateSelect = function() {
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
  let templateLayersInput = function(selectLayers) {
    let template = "";
    template += '<select id="select-tools__layers" class="lam-input">';
    template += '<option value="">Seleziona layer</option>';
    selectLayers.forEach(function(layer) {
      template += '<option value="' + layer.layer + '">' + layer.layerName + "</option>";
    });
    template += "</select>";
    template += "<p>Disegna un poligono sulla mappa per avviare la selezione</p>";
    template += "<div id='select-tools__results'></div>";

    return template;
  };

  /**
   * Display the list of the WFS Layers results in the left panel
   * @param {Object} results
   */
  let templateSelectionResults = function(results) {
    template = '<div class="lam-grid lam-grid-1">';
    template += "{{#each this}}";
    template += '<div class="lam-col">';
    template += '<i class="lam-icon md-icon">&#xE55F;</i><a href="#" onclick="LamSelectTools.zoomToItem({{{lon}}}, {{{lat}}}, {{@index}}, true);return false">';
    template += "{{{display_name}}}";
    template += "</a>";
    template += "</div>";
    template += "{{/each}}";
    template += "</div>";

    template += "<button onclick='LamSelectTools.exportCSVFile();'>Esporta risultati</button>";

    return Handlebars.compile(template);
  };

  let templateEmpty = function(results) {
    let template = "<p></p>";
    return Handlebars.compile(template);
  };

  let templateResultEmpty = function(results) {
    let template = "<p>Non sono stati trovati risultati.</p>";
    return Handlebars.compile(template);
  };

  let deleteFeatures = function() {
    lamDispatch({
      eventName: "delete-selection"
    });
  };

  /**
   * Start the selection on the specified layer
   * @param {Array} coords coordinate of the selected polygon
   */
  let doSelectionLayers = function(coords, currentLayer) {
    if (Array.isArray(coords)) coords = coords[0];
    let coordsString = coords
      .map(function(coord) {
        return coord[0] + " " + coord[1];
      })
      .join(",");
    let cql = "INTERSECTS(ORA_GEOMETRY, Polygon((" + coordsString + ")))";

    let currentSearchDate = new Date().getTime();
    let searchDate = new Date().getTime();

    jQuery("#select-tools__results").html("");
    let layers = selectLayers.filter(function(layer) {
      return layer.layer == currentLayer;
    });
    if (layers.length == 0) {
      lamDispatch({ eventName: "log", message: "Layer " + currentLayer + "non valido" });
      return;
    }

    let layer = layers[0];
    let url = layer.mapUri;
    url =
      url.replace("/wms", "/") +
      "ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
      layer.layer +
      "&maxFeatures=50&outputFormat=text%2Fjavascript&cql_filter=" +
      cql;

    $.ajax({
      dataType: "jsonp",
      url: url,
      jsonp: true,
      jsonpCallback: "parseResponse",
      success: function(data) {
        //verifica che la ricerca sia ancora valida
        if (currentSearchDate > searchDate) {
          return;
        }
        let results = [];
        if (data.features.length > 0) {
          let resultsIndex = [];
          let results = [];
          for (let i = 0; i < data.features.length; i++) {
            if ($.inArray(data.features[i].properties[layer.labelField], resultsIndex) === -1) {
              //aggiungo la feature alla mappa
              LamMap.addFeatureSelectionToMap(data.features[i].geometry, data.crs);
              let cent = null;
              if (data.features[i].geometry.coordinates[0][0]) {
                cent = LamMap.getCentroid(data.features[i].geometry.coordinates[0]);
              } else {
                cent = data.features[i].geometry.coordinates;
              }
              let item = data.features[i];
              item.crs = data.crs; //salvo il crs della feature
              item.layerGid = layer.gid;
              //item.id = currentLayer;
              results.push({
                display_name: data.features[i].properties[layer.labelField],
                lon: cent[0],
                lat: cent[1],
                item: item
              });
              resultsIndex.push(data.features[i].properties[layer.labelField]);
            }
          }
          selectionResult = results.sort(sortByDisplayName);
          //renderizzo i risultati
          let templateTemp = templateSelectionResults();
          let output = templateTemp(selectionResult);
          jQuery("#select-tools__results").append(output);
        } else {
          let templateTemp = templateResultEmpty();
          let output = templateTemp();
          jQuery("#select-tools__results").html(output);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        lamDispatch({
          eventName: "log",
          message: "LamSelectTools: unable to complete response"
        });
        lamDispatch({
          eventName: "show-message",
          message: "Non è stato possibile completare la richiesta."
        });
      }
    });
  };

  /**
   * Zoom the map to the lon-lat given and show the infobox of the given item index
   * @param {float} lon
   * @param {float} lat
   * @param {int} index Item's index in the result array
   * @param {boolean} showInfo
   */
  var zoomToItem = function(lon, lat, index, showInfo) {
    if (selectionResult[index]) {
      lamDispatch({
        eventName: "zoom-geometry",
        geometry: selectionResult[index].item.geometry
      });
      if (showInfo) {
        lamDispatch({
          eventName: "show-info-items",
          features: selectionResult[index].item
        });
      }
      let payload = {
        eventName: "add-geometry-info-map",
        geometry: selectionResult[index].item.geometry
      };
      try {
        payload.srid = selectionResult[index].item.crs;
      } catch (e) {
        payload.srid = null;
      }
      lamDispatch(payload);
      lamDispatch("hide-menu-mobile");
    } else {
      lamDispatch({
        eventName: "zoom-lon-lat",
        zoom: 18,
        lon: parseFloat(lon),
        lat: parseFloat(lat),
        eventName: "add-wkt-info-map",
        wkt: "POINT(" + lon + " " + lat + ")"
      });
      lamDispatch("hide-menu-mobile");
    }
  };

  function sortByDisplayName(a, b) {
    var aName = a.display_name.toLowerCase();
    var bName = b.display_name.toLowerCase();
    return aName < bName ? -1 : aName > bName ? 1 : 0;
  }

  let convertToCSV = function(objArray) {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "";
    for (var i = 0; i < array.length; i++) {
      var line = "";
      for (var index in array[i]) {
        if (line != "") line += ";";
        line += array[i][index];
      }
      str += line + "\r\n";
    }
    return str;
  };

  let exportCSVFile = function() {
    let items = selectionResult;
    let fileName = "esportazione.csv";
    var jsonObject = JSON.stringify(items);
    var csv = LamSelectTools.convertToCSV(jsonObject);
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
    deleteFeatures: deleteFeatures,
    convertToCSV: convertToCSV,
    doSelectionLayers: doSelectionLayers,
    exportCSVFile: exportCSVFile,
    init: init,
    render: render,
    templateSelect: templateSelect,
    zoomToItem: zoomToItem
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

var LamShareTools = (function() {
  var isRendered = false;

  var init = function init() {
    //events binding
    LamDispatcher.bind("create-share-url", function(payload) {
      LamShareTools.createShareUrl();
    });

    LamDispatcher.bind("show-share-url-query", function(payload) {
      LamShareTools.createShareUrl();
      LamShareTools.setShareUrlQuery(LamShareTools.writeUrlShare());
    });

    LamDispatcher.bind("show-share", function(payload) {
      LamToolbar.toggleToolbarItem("share-tools");
      lamDispatch("clear-layer-info");
    });
  };

  var render = function(div) {
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

  var templateShare = function() {
    template = "";
    //pannello ricerca via
    if (!LamStore.getAppState().logoPanelUrl) {
      template += '<h4 class="lam-title">Condividi</h4>';
    }
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
    if (!LamStore.getAppState().modules["map-tools-create-url"]) {
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

  var templateEmpty = function(results) {
    var template = "<p></p>";
    return Handlebars.compile(template);
  };

  /**
   * Chiama il disptcher per creare l'url di condivisione
   * @return {null} la funzione non restituisce valori
   */
  var createUrl = function() {
    LamDispatcher.dispatch("create-share-url");
  };

  /**
   * Visualizza l'url da condividere
   * @param  {string} appStateId Link da visualizzare per copia o condivisione
   * @param  {url} appStateId url opzionale dell'appstate
   * @return {null}  la funzione non restituisce valori
   */
  var displayUrl = function(appStateId, url) {
    ////ricavo lurl di base
    var urlArray = location.href.split("?");
    var baseUrl = urlArray[0].replace("#", "");
    var shareLink = baseUrl + "?appstate=" + appStateId;

    //$("#share-tools__url").text(shareLink);
    $("#share-tools__url").attr("href", shareLink);
    $("#share-tools__input-url").val(shareLink);

    var clipboard = new ClipboardJS("#share-tools__copy-url", {
      text: function(trigger) {
        return shareLink;
      }
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
  var hideUrl = function() {
    $("#share-tools__content").hide();
  };

  var setShareUrlQuery = function(shareLink) {
    $("#share-tools__input-query").val(shareLink);
    $("#share-tools__url-query").attr("href", shareLink);

    var clipboard = new ClipboardJS("#share-tools__copy-url-query", {
      text: function(trigger) {
        return shareLink;
      }
    });
  };

  var createShareUrl = function() {
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
      appstate: JSON.stringify(appState)
    })
      .done(function(data) {
        var url = data.Url;
        var appStateId = data.AppStateId;
        LamShareTools.displayUrl(appStateId, url);
      })
      .fail(function(err) {
        lamDispatch({
          eventName: "log",
          message: "LamStore: create-share-url " + err
        });
      });
  };

  /**
   * Genera l'url da copiare per visualizzare lo stato dell'applicazione solo tramite querystring
   * @return {null} Nessun valore restituito
   */
  var writeUrlShare = function() {
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
    writeUrlShare: writeUrlShare
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
var LamDispatcher = (function() {
  var init = function functionName() {
    this.bind("log", function(payload) {
      console.log("log", payload);
    });

    this.bind("show-menu", function(payload) {
      LamToolbar.showMenu();
    });

    this.bind("hide-menu", function(payload) {
      LamToolbar.hideMenu();
    });

    this.bind("reset-tools", function(payload) {
      LamToolbar.resetTools();
    });

    this.bind("stop-copy-coordinate", function(payload) {
      LamMapTools.stopCopyCoordinate();
    });

    this.bind("clear-layer-info", function(payload) {
      LamMapInfo.clearLayerInfo();
      LamMapTooltip.hideMapTooltip();
    });

    // this.bind("show-tool", function(payload) {
    //   if (payload.tool == "layers") {
    //     LamToolbar.toggleToolbarItem("lam-layer-tree");
    //   }
    //   if (payload.tool.indexOf("print") > -1) {
    //     LamToolbar.toggleToolbarItem("print-tools");
    //   }
    //   if (payload.tool.indexOf("share") > -1) {
    //     LamToolbar.toggleToolbarItem("share-tools");
    //   }
    //   if (payload.tool.indexOf("map") > -1) {
    //     LamToolbar.toggleToolbarItem("map-tools");
    //   }
    //   if (payload.tool.indexOf("draw") > -1) {
    //     LamToolbar.toggleToolbarItem("draw-tools");
    //   }
    //   if (payload.tool.indexOf("search") > -1) {
    //     LamToolbar.toggleToolbarItem("search-tools");
    //     //verifica dei layers
    //     if (payload.tool.indexOf("search-layers") > -1) {
    //       var arrSearch = payload.tool.split(",");
    //       setTimeout(function() {
    //         LamSearchTools.showSearchLayers();
    //         if (arrSearch.length > 1) {
    //           LamSearchTools.selectLayer(arrSearch[1]);
    //         }
    //       }, 1000);
    //     }
    //   }
    // });

    this.bind("hide-menu-mobile", function(payload) {
      if (LamStore.isMobile()) {
        LamStore.hideMenu();
      }
    });

    this.bind("hide-info-window", function(payload) {
      LamStore.hideInfoWindow();
      LamMapInfo.clearLayerInfo();
    });

    this.bind("hide-editor-window", function(payload) {
      EditorTools.hideEditorWindow();
    });

    this.bind("hide-loader", function(payload) {
      LamStore.toggleLoader(false);
    });

    this.bind("show-loader", function(payload) {
      LamStore.toggleLoader(true);
    });

    this.bind("live-reload", function(payload) {
      LamStore.liveReload(payload.appState);
    });

    this.bind("show-legend", function(payload) {
      LamStore.showLegend(payload.gid, payload.scaled);
    });

    this.bind("search-address", function(payload) {
      LamStore.searchAddress(payload.data, "LamStore.processAddress");
    });

    this.bind("zoom-lon-lat", function(payload) {
      LamMap.goToLonLat(payload.lon, payload.lat, payload.zoom);
    });

    this.bind("zoom-geometry", function(payload) {
      let geometryOl = LamMap.convertGeometryToOl(payload.geometry, LamMapEnums.geometryFormats().GeoJson);
      LamMap.goToGeometry(geometryOl, payload.srid);
    });

    this.bind("zoom-info-feature", function(payload) {
      try {
        let feature = LamStore.getCurrentInfoItems().features[payload.index];
        let layer = LamStore.getLayer(feature.layerGid);
        let featureOl = LamMap.convertGeoJsonFeatureToOl(feature);
        featureOl = LamMap.transform3857(featureOl, feature.srid);
        LamMap.goToGeometry(featureOl.getGeometry());
        let tooltip = LamTemplates.getLabelFeature(feature.properties, layer.labelField, layer.layerName);
        if (tooltip) {
          lamDispatch({ eventName: "show-map-tooltip", geometry: featureOl.getGeometry().getCoordinates(), tooltip: tooltip });
        }
        lamDispatch({
          eventName: "set-layer-visibility",
          gid: feature.layerGid,
          visibility: 1
        });
        lamDispatch({
          eventName: "flash-feature",
          feature: feature
        });
      } catch (error) {
        lamDispatch({ eventName: "log", message: error });
      }
    });

    this.bind("add-wkt-info-map", function(payload) {
      LamMapInfo.addWktInfoToMap(payload.wkt);
    });

    this.bind("add-geometry-info-map", function(payload) {
      let geometryOl = LamMap.convertGeometryToOl(payload.geometry, LamMapEnums.geometryFormats().GeoJson);
      LamMapInfo.addGeometryInfoToMap(geometryOl, payload.srid);
    });

    this.bind("toggle-layer", function(payload) {
      LamMap.toggleLayer(payload.gid);
      LamStore.toggleLayer(payload.gid);
    });

    this.bind("set-layer-visibility", function(payload) {
      LamMap.setLayerVisibility(payload.gid, payload.visibility);
      LamStore.setLayerVisibility(payload.gid, payload.visibility);
    });

    this.bind("reset-layers", function(payload) {
      LamStore.resetInitialLayers();
    });

    this.bind("start-copy-coordinate", function(payload) {
      LamMap.startCopyCoordinate();
    });

    this.bind("map-click", function(payload) {
      LamMapTools.addCoordinate(payload.lon, payload.lat);
    });

    this.bind("remove-info", function(payload) {
      LamMapInfo.clearLayerInfo();
    });

    this.bind("add-info-point", function(payload) {
      let geometryOl = new ol.geom.Point([payload.lon, payload.lat]);
      let featureOl = new ol.Feature({
        geometry: geometryOl
      });
      featureOl.srid = 4326;
      LamMapInfo.addFeatureInfoToMap(featureOl);
    });

    this.bind("init-map-app", function(payload) {
      LamInit(payload.mapDiv, payload.appStateUrl, payload.mapTemplateUrl);
    });

    this.bind("map-move-end", function(payload) {
      LamShareTools.hideUrl();
      LamShareTools.setShareUrlQuery(LamShareTools.writeUrlShare());
    });

    this.bind("map-zoom-end", function(payload) {
      LamShareTools.hideUrl();
      LamShareTools.setShareUrlQuery(LamShareTools.writeUrlShare());
    });

    this.bind("map-zoom-in", function(payload) {
      LamMap.zoomIn();
    });

    this.bind("map-zoom-out", function(payload) {
      LamMap.zoomOut();
    });

    this.bind("map-browser-location", function(payload) {
      LamMap.goToBrowserLocation();
    });

    this.bind("do-login", function(payload) {
      LamStore.doLogin(payload.username, payload.password);
    });

    this.bind("open-url-location", function(payload) {
      LamStore.openUrlTemplate(payload.urlTemplate);
    });

    this.bind("reverse-geocoding", function(payload) {
      //conversione coordinate
      LamMap.getRequestInfo(payload.coordinate, null, false);
    });

    this.bind("show-reverse-geocoding-result", function(payload) {
      //conversione coordinate
      LamToolbar.toggleToolbarItem("search-tools", true);
      LamSearchTools.showSearchLayers();
      LamSearchTools.displayGenericResults(payload.results);
    });

    this.bind("enable-map-info", function(payload) {
      LamStore.setInfoClickEnabled(true);
    });

    this.bind("disable-map-info", function(payload) {
      LamStore.setInfoClickEnabled(false);
    });

    this.bind("log", function(payload) {
      if (console) {
        console.log(payload.str);
      }
      if (payload.showAlert) {
        alert(payload.str);
      }
    });

    this.bind("show-message", function(payload) {
      let msg = {
        html: "",
        classes: ""
      };
      if (payload.message) {
        msg.html += "<div>" + payload.message + "<div>";
      }
      switch (payload.type) {
        case "error":
          msg.classes = "lam-error";
          M.toast(msg);
          break;
        case "info":
          msg.classes = "lam-info";
          M.toast(msg);
          break;
        case "warning":
          msg.classes = "lam-warning";
          M.toast(msg);
          break;
        case "notice":
          msg.classes = "lam-secondary";
          M.toast(msg);
          break;

        default:
          M.toast(msg);
          break;
      }
    });
  };

  var dispatch = function lamDispatch(payload) {
    if (typeof payload == "string") {
      payload = {
        eventName: payload
      };
    }
    LamDispatcher.trigger(payload.eventName, payload);
  };

  return {
    dispatch: dispatch,
    init: init
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
  svgCheckboxAdd:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
  svgCheckboxMinus:
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="28" height="28"><defs><path id="a" d="M0 0h24v24H0z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><path clip-path="url(#b)" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/></svg>',
  svgRefreshMap:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19.81 14.99l1.19-.92-1.43-1.43-1.19.92 1.43 1.43zm-.45-4.72L21 9l-9-7-2.91 2.27 7.87 7.88 2.4-1.88zM3.27 1L2 2.27l4.22 4.22L3 9l1.63 1.27L12 16l2.1-1.63 1.43 1.43L12 18.54l-7.37-5.73L3 14.07l9 7 4.95-3.85L20.73 21 22 19.73 3.27 1z"/></svg>',
  svgExpandLess:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
  svgExpandMore:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
};

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

var LamStore = (function() {
  var mapDiv = null;
  var mapTemplateUrl = null;
  var appState = null;
  var initialAppState = null;
  var authToken = null;
  let infoClickEnabled = true;

  var setMapDiv = function(div) {
    mapDiv = div;
  };

  var setMapTemplateUrl = function(url) {
    mapTemplateUrl = url;
  };

  var getMapTemplateUrl = function() {
    let tempTemplateUrl = "map.html";
    if (LamStore.getAppState().urlMapTemplate != null) {
      tempTemplateUrl = LamStore.getAppState().urlMapTemplate;
    }
    return mapTemplateUrl ? mapTemplateUrl : tempTemplateUrl;
  };

  /**
   * Init map function
   * @param {string} mapDiv Target Id of the div where the map will be rendered in.  Default is lam-app
   * @param {*} appStateUrl Url of the appstate. Appstate given in the url will have priority over this. Otherwise states/app-state.json will be used
   * @param {*} mapTemplateUrl Url of the map template to load.
   */
  function lamInit(mapDiv, appStateUrl, mapTemplateUrl) {
    LamStore.setMapDiv(!mapDiv ? "lam-app" : mapDiv);
    LamStore.setMapTemplateUrl(mapTemplateUrl);
    //appstate loader
    //appstate with filename
    var appStateId =
      decodeURIComponent((new RegExp("[?|&]" + "appstate" + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [null, ""])[1].replace(/\+/g, "%20")) || null;

    //appstate json inline with url
    var appStateJson =
      decodeURIComponent((new RegExp("[?|&]" + "appstatejson" + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [null, ""])[1].replace(/\+/g, "%20")) ||
      null;

    if (appStateId) {
      //call with ajax
      $.ajax({
        dataType: "json",
        url: "states/" + appStateId
      })
        .done(function(appState) {
          loadLamState(appState);
        })
        .fail(function() {
          //LamStore.mapInit();
          lamDispatch({
            eventName: "log",
            message: "Share: Impossibile caricare la mappa condivisa"
          });
        });
    } else if (appStateJson) {
      $.ajax({
        dataType: "json",
        url: appStateJson
      })
        .done(function(appstate) {
          loadLamState(appstate);
        })
        .fail(function() {
          lamDispatch({
            eventName: "log",
            message: "Share: Impossibile caricare la mappa condivisa"
          });
        });
    } else if (appStateUrl) {
      $.ajax({
        dataType: "json",
        url: appStateUrl
      })
        .done(function(appstate) {
          loadLamState(appstate);
        })
        .fail(function() {
          lamDispatch({
            eventName: "log",
            message: "Share: Impossibile caricare la mappa condivisa"
          });
        });
    } else {
      $.ajax({
        dataType: "json",
        url: "states/app-state.json"
      })
        .done(function(appstate) {
          loadLamState(appstate);
        })
        .fail(function() {
          lamDispatch({
            eventName: "log",
            message: "Share: Impossibile caricare la mappa"
          });
        });
    }

    function loadLamState(appstate) {
      //normalizing appstate
      appState = normalizeAppState(appstate);
      if (appState.authentication.requireAuthentication) {
        LamAuthTools.render("login-container");
      }
      lamTemplateMapinit();
    }
  }

  var lamTemplateMapinit = function() {
    $.ajax({
      dataType: "text",
      url: LamStore.getMapTemplateUrl()
    })
      .done(function(data) {
        $("#" + mapDiv).html(data);
        LamStore.mapInit(appState, customFunctions);
      })
      .fail(function(data) {
        lamDispatch({
          eventName: "log",
          message: "Init Map: Unable to load map template"
        });
      });
  };
  var init = function() {
    if (isMobile() && appState.improveMobileBehaviour) {
      appState = normalizeMobile(appState);
    }
    //Comuni array load
    if (appState.searchProvider == "nominatim") {
      var url = appState.restAPIUrl + "/api/comuni";
      $.ajax({
        dataType: "json",
        url: url
      })
        .done(function(data) {
          LamSearchTools.updateComuniNM(data);
        })
        .fail(function(data) {
          lamDispatch({
            eventName: "log",
            message: "LamStore: Unable to load comuni from rest service"
          });
        });
    }
  };

  /**
   * Restituisce l'appstate corrente
   * @return {object} AppState corrente
   */
  var getAppState = function() {
    return appState;
  };

  /**
   * Restituisce l'appstate iniziale
   * @return {object} AppState iniziale
   */
  var getInitialAppState = function() {
    return initialAppState;
  };

  /**
   * Imposta l'appstate corrente
   */
  var setAppState = function(currentAppState) {
    appState = currentAppState;
  };

  /**
   * Imposta l'appstate iniziale
   */
  var setInitialAppState = function(appState) {
    initialAppState = JSON.parse(JSON.stringify(appState));
  };

  /**
   * Set the default parameters for appstate
   * @param {Object} normalize the given appstate
   */
  let normalizeAppState = function(appstate) {
    if (!appstate.currentInfoItems) appstate.currentInfoItems = [];
    if (!appstate.infoSelectBehaviour) appstate.infoSelectBehaviour = 2;
    if (!appstate.relations) appstate.relations = [];
    return appstate;
  };

  /**
   * Improve the appstate for mobile
   * @param {Object} normalize the given appstate
   */
  let normalizeMobile = function(appstate) {
    let normalizeMobileArray = function(layers) {
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

  var showAppTools = function() {
    if (appState.modules) {
      $("#menu-toolbar__layer-tree").toggle(appState.modules["lam-layer-tree"]);
      $("#menu-toolbar__search-tools").toggle(appState.modules["search-tools"]);
      $("#menu-toolbar__print-tools").toggle(appState.modules["print-tools"]);
      $("#menu-toolbar__share-tools").toggle(appState.modules["share-tools"]);
      $("#menu-toolbar__map-tools").toggle(appState.modules["map-tools"]);
      $("#menu-toolbar__draw-tools").toggle(appState.modules["draw-tools"]);
      $("#menu-toolbar__gps-tools").toggle(appState.modules["gps-tools"]);
    }
  };

  var showRelation = function(relationGid, resultIndex) {
    var item = LamStore.getCurrentInfoItems().features[resultIndex];
    var relation = LamStore.getRelation(relationGid);
    var templateUrl = Handlebars.compile(relation.serviceUrlTemplate);
    var urlService = templateUrl(item.properties);

    var template = LamTemplates.getTemplate(relation.gid, relation.templateUrl, LamStore.getAppState().templatesRepositoryUrl);

    $.ajax({
      dataType: "jsonp",
      url: urlService,
      jsonp: true,
      jsonpCallback: "parseResponse",
      success: function(data) {
        if (data.features) {
          data = data.features;
        }
        var title = relation.title;
        var body = "";
        if (!Array.isArray(data)) {
          data = [data];
        }
        let propsList = [];
        for (let i = 0; i < data.length; i++) {
          var props = data[i].properties ? data[i].properties : data[i];
          propsList.push(props);
          if (!template.multipleItems) {
            //single template not active by default
            body += LamTemplates.processTemplate(template, props);
            if (!body) {
              body += LamTemplates.standardTemplate(props);
            }
            if (data.length > 1) {
              body += "<div class='div-10'></div>";
            }
          }
        }

        //single template not active by default
        if (template.multipleItems && propsList.length > 0) {
          body += LamTemplates.processTemplate(template, propsList);
        }
        if (data.length === 0) {
          body += '<div class="lam-warning lam-mb-2 lam-p-2">' + LamResources.risultati_non_trovati + "</div>";
        }
        LamStore.showContent(title, body);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        lamDispatch({
          eventName: "log",
          message: "LamSearchTools: unable to complete response"
        });
      }
    });
  };

  var hideInfoWindow = function() {
    $("#info-window").hide();
  };

  var showLegend = function(gid, scaled) {
    var html = "<div>";
    var urlImg = "";

    //verifico che non ci sia un url custom
    var thisLayer = getLayer(gid);
    if (!thisLayer.hideLegend) {
      if (thisLayer.legendUrl) {
        urlImg = thisLayer.legendUrl;
      } else {
        urlImg = LamMap.getLegendUrl(gid, scaled);
      }

      if (urlImg) {
        html += "<img src='" + urlImg + "'>";
      }
    }
    if (thisLayer.attribution) {
      html += "<p>Dati forniti da " + thisLayer.attribution + "</p>";
    }

    if (scaled) {
      html +=
        "<p class='mt-2'><a href='#' onclick=\"LamDispatcher.dispatch({ eventName: 'show-legend', gid: '" +
        gid +
        "', scaled: false })\">Visualizza legenda completa</a></p>";
    }

    html += "<div>";
    var layer = LamStore.getLayer(gid);
    var layerName = "";
    if (layer) {
      layerName = layer.layerName;
    }
    LamStore.showContent(layerName, html, "", "info-results");
    return true;
  };

  var toggleLoader = function(visibility) {
    if (visibility) {
      $("#app-loader").removeClass("lam-hidden");
    } else {
      $("#app-loader").addClass("lam-hidden");
    }
  };

  /**
   * Inverte la visualizzazione del layer
   * @param  {string} gid Identificativo del layer
   * @return {null}     Nessun valore restituito
   */
  var toggleLayer = function(gid) {
    let layer = getLayer(gid);
    if (layer) {
      layer.visible = 1 - layer.visible;
    }
    LamLayerTree.setCheckVisibility(gid, layer.visible);
  };

  /**
   * Imposta la visibilità del layer
   * @param  {string} gid  Identificativo del layer
   * @param  {boolean} visibility Visibilità del layer da impostare
   * @return {null}  Nessun valore restituito
   */
  var setLayerVisibility = function(gid, visibility) {
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
  var getLayerArray = function(layers, gid) {
    var layerFound = null;
    layers.forEach(function(layer) {
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
  var getLayerArrayByName = function(layers, layerName) {
    var layerFound = null;
    layers.forEach(function(layer) {
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
   * Restituisce il layer dall'identificativo
   * @param  {string} gid identificativo del layer
   * @return {object}     Layer
   */
  var getLayer = function(gid) {
    return LamStore.getLayerArray(appState.layers, gid);
  };

  /**
   * Restituisce il layer dal nome
   * @param  {string} layerName nome del layer
   * @return {object}     Layer
   */
  var getLayerByName = function(layerName) {
    return LamStore.getLayerArrayByName(appState.layers, layerName);
  };

  function SortByLayerName(a, b) {
    var aName = a.layerName.toLowerCase();
    var bName = b.layerName.toLowerCase();
    return aName < bName ? -1 : aName > bName ? 1 : 0;
  }

  /**
   * Restituisce tutti i layer abilitati all'interrogazione
   * @return {array} Array dei layer interrogabili
   */
  var getQueryLayers = function() {
    let layers = getQueryLayersArray(appState.layers);
    layers.sort(SortByLayerName);
    return layers;
  };

  var getQueryLayersArray = function(layers) {
    var layersFound = [];
    layers.forEach(function(layer) {
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
  var getSearchLayers = function() {
    let layers = getSearchLayersArray(appState.layers);
    layers.sort(SortByLayerName);
    return layers;
  };

  var getSearchLayersArray = function(layers) {
    var layersFound = [];
    layers.forEach(function(layer) {
      if (layer.searchable && layer.searchField) {
        layersFound.push(layer);
      }
      if (layer.layers) {
        layersFound = layersFound.concat(getSearchLayersArray(layer.layers));
      }
    });
    return layersFound;
  };

  var dragElement = function(elmnt) {
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

  /*
  Funzione di inizializzazione dell'applicazione in cui può essere passato uno state alternativo
  */
  var mapInit = function(state, callback) {
    LamStore.setInitialAppState(state);
    LamStore.setAppState(state);

    $("#" + mapDiv).removeClass("lam-hidden");

    //definizione dei loghi
    if (state.logoUrl) {
      $("#lam-logo__img").attr("src", state.logoUrl);
    }
    if (state.logoPanelUrl) {
      $("#panel__logo-img").attr("src", state.logoPanelUrl);
      $("#panel__logo").removeClass("lam-hidden");
    }

    //inizializzazione dell LamStore
    LamStore.init();
    LamStore.showAppTools();
    //map init
    LamMap.render("lam-map", appState);
    LamMapTooltip.init();
    //carico i layers
    LamLayerTree.init(function() {
      //carico gli strumenti di ricerca
      LamSearchTools.render(
        "search-tools",
        appState.searchProvider,
        appState.searchProviderAddressUrl,
        appState.searchProviderAddressField,
        appState.searchProviderHouseNumberUrl,
        appState.searchProviderHouseNumberField,
        getSearchLayers()
      );
      //carico gli strumenti di share
      LamShareTools.render("share-tools", null);
      //carico gli strumenti di Stampa
      LamPrintTools.render("print-tools");
      //carico gli strumenti di mappa
      LamMapTools.render("map-tools");
      //carico gli strumenti di disegno
      LamDrawTools.render("draw-tools");
      if (appState.modules["select-tools"]) {
        LamSelectTools.render(getQueryLayers());
      }
      //loading templates
      LamTemplates.init();
    });

    LamToolbar.init();

    //eseguo il callback
    callback();
  };

  /**
   * Ricarica i livelli della mappa
   * @return {null}
   */
  var liveReload = function(newAppState) {
    LamStore.setAppState(newAppState);
    LamStore.showAppTools();
    LamLayerTree.render("lam-layer-tree", newAppState.layers);
    LamMap.removeAllLayersFromMap();
    LamMap.loadConfig(newAppState);
  };

  var mapReload = function() {
    LamLayerTree.render("lam-layer-tree", appState.layers);
    LamMap.removeAllLayersFromMap();
    LamMap.loadConfig(appState);
  };

  /**
   * Resetta i layer alla situazione iniziale
   * @return {null} Nessun valore restituito
   */
  var resetInitialLayers = function() {
    if (initialAppState.layers) {
      resetLayersArray(initialAppState.layers);
    }
  };

  var resetLayersArray = function(layers) {
    layers.forEach(function(layer) {
      lamDispatch({
        eventName: "set-layer-visibility",
        gid: layer.gid,
        visibility: parseInt(layer.visible)
      });
      if (layer.layers) {
        resetLayersArray(layer.layers);
      }
    });
  };

  var isMobile = function() {
    return /Mobi/.test(navigator.userAgent);
  };

  var getInfoClickEnabled = function() {
    return infoClickEnabled;
  };

  var setInfoClickEnabled = function(status) {
    infoClickEnabled = status;
  };

  var doLogin = function(username, password) {
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
          data: '{"username": "' + username + '", "password" : "' + password + '"}',
          success: function() {
            alert("Thanks for your comment!");
          }
        });
        LamAuthTools.hideLogin();
        break;
      case "custom":
        //TODO implement custom auth url ancd object
        var url = getAppState().restAPIUrl + "/api/auth?username=" + username + "&password=" + password;
        $.ajax({
          dataType: "json",
          url: url
        })
          .done(function(data) {
            authToken = data;
            LamAuthTools.hideLogin();
          })
          .fail(function(data) {
            LamAuthTools.showError();
            lamDispatch({
              eventName: "log",
              message: "LamStore: Unable to autheticate user"
            });
          });
        break;
      default:
        break;
    }
    mapReload();
  };

  var openUrlTemplate = function(urlTemplate) {
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

  var getRelations = function() {
    return appState.relations;
  };

  var getRelation = function(gid) {
    let relationResult = appState.relations.filter(function(el) {
      return el.gid == gid;
    });
    return relationResult[0];
  };

  var getAuthorizationHeader = function() {
    switch (appState.authentication.authType) {
      case "basic":
        return "Basic " + appState.authentication.authToken;
      default:
        return appState.authentication.authToken;
    }
  };

  let getCurrentInfoItems = function() {
    return LamStore.getAppState().currentInfoItems;
  };

  let getCurrentInfoItem = function(index) {
    return LamStore.getAppState().currentInfoItems.features[index];
  };

  /**
   * Genera un GUID
   * @return {string} guid
   */
  let guid = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
  };

  let showContent = function(title, body, bodyMobile, htmlElement) {
    if (!htmlElement) htmlElement = "info-results";
    if (!bodyMobile) bodyMobile = body;
    $("#" + htmlElement + "__content").html(body);
    $("#" + htmlElement + "__title").html(title);
    $("#" + htmlElement + "").show();
    if (!LamStore.isMobile()) {
      LamToolbar.toggleToolbarItem(htmlElement, true);
    } else {
      $("#info-tooltip").show();
      $("#info-tooltip").html(bodyMobile);
    }
  };

  return {
    doLogin: doLogin,
    init: init,
    getAppState: getAppState,
    getAuthorizationHeader: getAuthorizationHeader,
    getCurrentInfoItem: getCurrentInfoItem,
    getCurrentInfoItems: getCurrentInfoItems,
    getInfoClickEnabled: getInfoClickEnabled,
    getInitialAppState: getInitialAppState,
    getLayer: getLayer,
    getLayerArray: getLayerArray,
    getLayerArrayByName: getLayerArrayByName,
    getLayerByName: getLayerByName,
    getQueryLayers: getQueryLayers,
    getMapTemplateUrl: getMapTemplateUrl,
    getSearchLayers: getSearchLayers,
    getRelations: getRelations,
    getRelation: getRelation,
    guid: guid,
    setInfoClickEnabled: setInfoClickEnabled,
    isMobile: isMobile,
    mapInit: mapInit,
    mapReload: mapReload,
    lamInit: lamInit,
    liveReload: liveReload,
    openUrlTemplate: openUrlTemplate,
    setAppState: setAppState,
    setInitialAppState: setInitialAppState,
    setMapDiv: setMapDiv,
    setMapTemplateUrl: setMapTemplateUrl,
    showLegend: showLegend,
    showAppTools: showAppTools,
    showContent: showContent,
    showRelation: showRelation,
    toggleLoader: toggleLoader,
    resetInitialLayers: resetInitialLayers,
    hideInfoWindow: hideInfoWindow,
    setLayerVisibility: setLayerVisibility,
    toggleLayer: toggleLayer
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

var LamLayerTree = (function() {
  let treeDiv = "lam-layer-tree";
  let isRendered = false;
  let layerGroupPrefix = "lt";
  //let layerGroupItemPrefix = "lti";
  //let layerGroupItemIconPrefix = "ltic";
  let layerUriCount = 0;
  let countRequest = 0;

  var init = function(callback) {
    //carico i layer
    countRequest = 0;
    LamStore.getAppState().layers.forEach(function(layer) {
      loadLayersUri(layer, callback);
    });
    if (layerUriCount === 0) {
      //no ajax request sent, loading all json immediately
      render(treeDiv, LamStore.getAppState().layers);
      callback();
    }

    //events binding
    LamDispatcher.bind("show-layers", function(payload) {
      LamToolbar.toggleToolbarItem("lam-layer-tree");
    });
  };

  var loadLayersUri = function(layer, callback) {
    if (layer.layersUri) {
      countRequest++;
      layerUriCount++;
      $.ajax({
        dataType: "json",
        url: layer.layersUri
      })
        .done(function(data) {
          layer.layers = data;
          layer.layers.forEach(function(e) {
            loadLayersUri(e);
          });
        })
        .fail(function(data) {
          lamDispatch({
            eventName: "log",
            message: "Layer Tree: Unable to load layers " + layer.layersUri
          });
        })
        .always(function(data) {
          countRequest--;
          if (countRequest === 0) {
            render(treeDiv, LamStore.getAppState().layers);
            LamStore.setInitialAppState(LamStore.getAppState());
            LamMap.loadConfig(LamStore.getAppState()); //reloading layer state
            callback();
          }
        });
    } else if (layer.layers) {
      layer.layers.forEach(function(e) {
        loadLayersUri(e);
      });
    }
  };

  var render = function(div, layers) {
    var output = "";
    if (!LamStore.getAppState().logoPanelUrl) {
      output += '<h4 class="lam-title">Temi</h4>';
    }
    output += '<div class="layertree">'; //generale
    let index = 0;
    layers.forEach(function(element) {
      output += renderGroup(element, layerGroupPrefix + "_" + index);
      index++;
    });
    //sezione funzioni generali
    output += '<div class="layertree-item">';
    output +=
      '<button class="lam-btn lam-btn-small lam-btn-floating lam-right lam-depth-1 ripple" alt="Reset dei layer" title="Reset dei layer" onClick="LamDispatcher.dispatch({eventName:\'reset-layers\'})"><i class="lam-icon">' +
      LamResources.svgRefreshMap +
      "</i></button>";
    output += "</div>";
    output += '<div class="layertree-item layertree-item-bottom lam-scroll-padding"></div>'; //spaziatore
    output += "</div>"; //generale

    jQuery("#" + div).html(output);
    isRendered = true;
  };

  var renderLayer = function(layer, layerId) {
    let output = "";
    //--------------
    output += formatString('<div id="{0}" class="layertree-layer">', layerId);
    output += formatString('<div class="layertree-layer__title">{0}</div>', layer.layerName);
    output += '<div class="layertree-layer__icons">';
    output += formatString(
      '<i title="Informazioni sul layer" class="layertree-icon lam-right" onclick="LamDispatcher.dispatch({ eventName: \'show-legend\', gid: \'{0}\', scaled: true })">{1}</i>',
      layer.gid,
      LamResources.svgInfo
    );
    output += formatString(
      '<i title="Mostra/Nascondi layer" id="{2}_c" class="layertree-icon lam-right" onclick="LamDispatcher.dispatch({eventName:\'toggle-layer\',gid:\'{2}\'})">{1}</i>',
      layerId,
      layer.visible ? LamResources.svgCheckbox : LamResources.svgCheckboxOutline,
      layer.gid
    );
    output += "</div>";
    output += "</div>";
    return output;
  };

  var renderGroup = function(groupLayer, groupId) {
    let output = "";
    output += '<div class="layertree-item" >';
    output += formatString(
      '<div  class="layertree-item__title lam-background {1} {2}">',
      groupId,
      groupLayer.color,
      groupLayer.nestingStyle ? "layertree-item__title--" + groupLayer.nestingStyle : ""
    );
    output += formatString(
      '<i id="{0}_i" class="layertree-item__title-icon {3}" onclick="LamLayerTree.toggleGroup(\'{0}\');">{2}</i>',
      groupId,
      groupLayer.color,
      groupLayer.visible ? LamResources.svgExpandLess : LamResources.svgExpandMore,
      groupLayer.visible ? "lam-plus" : "lam-minus"
    );

    output += "<span class='layertree-item__title-text'>" + groupLayer.layerName + "</span>";
    output += "</div>";
    output += formatString('<div id="{0}_u" class="layertree-item__layers layertree--{1}">', groupId, groupLayer.visible ? "visible" : "hidden");
    if (groupLayer.layers) {
      let index = 0;
      groupLayer.layers.forEach(function(element) {
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
    output += "</div>";
    output += "</div>";
    return output;
  };

  var setCheckVisibility = function(layerGid, visibility) {
    const item = "#" + layerGid + "_c";
    if (visibility) {
      $(item).html(LamResources.svgCheckbox);
      $(item).removeClass("lam-checked");
    } else {
      $(item).html(LamResources.svgCheckboxOutline);
      $(item).removeClass("lam-unchecked");
    }
  };

  var toggleCheck = function(layerGid, groupId) {
    const item = "#" + layerGid + "_c";
    if ($(item).hasClass("lam-unchecked")) {
      $(item).removeClass("lam-unchecked");
      $(item).addClass("lam-checked");
      $(item).html(LamResources.svgCheckbox);
      $("#" + groupId).addClass("layertree-layer--selected");
      return;
    }
    if ($(item).hasClass("lam-checked")) {
      $(item).removeClass("lam-checked");
      $(item).addClass("lam-unchecked");
      $(item).html(LamResources.svgCheckboxOutline);
      $("#" + groupId).removeClass("layertree-layer--selected");
      return;
    }
  };

  var toggleGroup = function(groupName) {
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
      $(icon).html(LamResources.svgExpandMore);
      return;
    } else {
      $(icon).removeClass("lam-minus");
      $(icon).addClass("lam-plus");
      $(icon).html(LamResources.svgExpandLess);
      return;
    }
  };

  let formatString = function() {
    var str = arguments[0];
    for (k = 0; k < arguments.length - 1; k++) {
      str = str.replace(new RegExp("\\{" + k + "\\}", "g"), arguments[k + 1]);
    }
    return str;
  };

  let setLayerVisibility = function(layerGid) {
    $("#" + layerGid + "_c");
  };

  return {
    formatString: formatString,
    render: render,
    init: init,
    setCheckVisibility: setCheckVisibility,
    setLayerVisibility: setLayerVisibility,
    toggleCheck: toggleCheck,
    toggleGroup: toggleGroup
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
let LamTemplates = (function() {
  let templates = [];

  let init = function init() {
    //Ciclo i livelli che non hanno un template
    let tempLayers = LamStore.getAppState().layers;
    const repoTemplatesUrl = LamStore.getAppState().templatesRepositoryUrl;
    const tempRelations = LamStore.getAppState().relations;
    loadLayersTemplates(tempLayers, repoTemplatesUrl);
    loadRelationsTemplates(tempRelations, repoTemplatesUrl);
  };

  let loadLayersTemplates = function(layers, repoTemplatesUrl) {
    layers.forEach(function(layer) {
      if (layer.queryable || layer.preload || layer.searchable) {
        let templateUrl = getTemplateUrl(layer.gid, layer.templateUrl, repoTemplatesUrl);
        let template = templates.filter(function(el) {
          return el.templateUrl === templateUrl;
        });
        if (template.length === 0) {
          //aggiungo il layer vi ajax
          loadTemplateAjax(templateUrl);
        }
      }
      if (layer.layers) loadLayersTemplates(layer.layers, repoTemplatesUrl);
    });
  };

  let loadRelationsTemplates = function(tempRelations, repoTemplatesUrl) {
    for (let i = 0; i < tempRelations.length; i++) {
      const relation = tempRelations[i];
      let templateUrl = getTemplateUrl(relation.gid, relation.templateUrl, repoTemplatesUrl);
      let template = templates.filter(function(el) {
        return el.templateUrl === templateUrl;
      });
      if (!template.length) {
        //aggiungo il layer vi ajax
        loadTemplateAjax(templateUrl);
      }
    }
  };

  let loadTemplateAjax = function(templateUrl) {
    $.ajax({
      dataType: "json",
      url: templateUrl
    })
      .done(function(data) {
        if (data) {
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
              let thisTemplate = data[i];
              thisTemplate.templateUrl = templateUrl;
              templates.push(thisTemplate);
            }
          } else {
            data.templateUrl = templateUrl;
            templates.push(data);
          }
        }
      })
      .fail(function(data) {
        lamDispatch({
          eventName: "log",
          message: "LamStore: Unable to load template"
        });
      });
  };

  /**
   * Gets the uri of the template to be loaded by ajax
   * @param {object} layer Oggetto del layer/relation
   * @param {string} repoUrl Url del repository
   */
  let getTemplateUrl = function(gid, templateUrl, repoUrl) {
    if (templateUrl) {
      if (templateUrl.toLowerCase().includes("http://")) {
        return templateUrl;
      } else {
        return repoUrl + "/" + templateUrl;
      }
    }
    return repoUrl + "/" + gid + ".json";
  };

  let getTemplate = function(gid, templateUrl, repoUrl) {
    let templatesFilter = templates.filter(function(el) {
      return el.templateUrl === getTemplateUrl(gid, templateUrl, repoUrl);
    });
    if (templatesFilter.length > 0) {
      return templatesFilter[0];
    }
    return null;
  };

  let processTemplate = function(template, props, layer) {
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
          message: e
        });
      }
    }
    return result;
  };

  let standardTemplate = function(props, layer) {
    let body = "";
    if (layer) {
      body += "<div class='lam-grid lam-feature-heading' ><div class='lam-col'>" + layer.layerName;
      if (layer.labelField) {
        body += " - " + getLabelFeature(props, layer.labelField);
      }
      body += "</div></div>";
    }
    for (let propertyName in props) {
      body +=
        "<div class='lam-grid lam-mb-1'>" +
        "<div class='lam-feature-title lam-col'>" +
        propertyName +
        ":</div>" +
        "<div class='lam-feature-content lam-col'>" +
        (props[propertyName] == null ? "" : props[propertyName]) +
        "</div>" +
        "</div>";
    }
    body += "";
    return body;
  };

  let featureIconsTemplate = function(index) {
    //icons
    let icons =
      "<div class='lam-feature__icons'>" +
      '<i title="Centra sulla mappa" class="lam-feature__icon" onclick="LamDispatcher.dispatch({ eventName: \'zoom-info-feature\', index: \'' +
      index +
      "' })\">" +
      LamResources.svgMarker +
      "</i>";
    let feature = LamStore.getCurrentInfoItem(index);
    let centroid = LamMap.getLabelPoint(feature.geometry.coordinates);
    let geometryOl = LamMap.convertGeometryToOl(
      {
        coordinates: centroid,
        type: "Point",
        srid: 3857
      },
      LamMapEnums.geometryFormats().GeoJson
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

  let relationsTemplate = function(relations, props, index) {
    let result = "";
    if (relations.length > 0) {
      result += '<div class="">';
      relations.map(function(relation) {
        result += '<div class="lam-mb-2 col s12">';
        result += '<a href="#" onclick="LamStore.showRelation(\'' + relation.gid + "', " + index + ')">' + relation.labelTemplate + "</option>"; //' + relation.gid + ' //relation.labelTemplate
        result += "</div>";
      });
      result += "</div>";
    }
    return result;
  };

  let generateTemplate = function(template, layer) {
    if (template.templateType === "string") {
      return template.templateString;
    }
    let str = "";
    if (template.templateType === "simple") {
      str += "<div class='lam-grid lam-feature-heading' ><div class='lam-col'>" + template.title + "</div></div>";

      for (let i = 0; i < template.fields.length; i++) {
        str += "<div class='lam-grid lam-mb-1'>";
        let field = template.fields[i];
        switch (field.type) {
          case "int":
            str += "<div class='lam-feature-title lam-col'>" + field.label + ":</div><div class='lam-feature-content lam-col'>{{{" + field.field + "}}}</div>";
            break;
          case "string":
            str += "<div class='lam-feature-title lam-col'>" + field.label + ":</div><div class='lam-feature-content lam-col'>{{{" + field.field + "}}}</div>";
            break;
          case "yesno":
            str +=
              "<div class='lam-feature-title lam-col'>" +
              field.label +
              ":</div><div class='lam-feature-content lam-col'>{{#if " +
              field.field +
              "}}Sì{{else}}No{{/if}}</div>";
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
            str += '<div class="lam-feature-content lam-col"><a href="{{' + field.field + '}}" target="_blank">' + field.label + "</a></div>";
            break;
        }
        str += "</div>";
      }
    }
    return str;
  };

  let getLabelFeature = function(props, labelName, layerTitle) {
    try {
      let label = props[labelName];
      if (layerTitle) {
        label = layerTitle + " - " + label;
      }
      return label;
    } catch (error) {
      lamDispatch({ eventName: "log", data: "Unable to compute label field " + labelName });
    }
  };

  /**
   * Render te given collection into HTML format
   * @param {Object} featureInfoCollection GeoJson Collection
   */
  let renderInfoFeatures = function(featureInfoCollection) {
    let body = "";
    //single feature sent
    if (!featureInfoCollection.features) {
      featureInfoCollection = {
        features: featureInfoCollection
      };
    }
    LamStore.getAppState().currentInfoItems = featureInfoCollection;
    let index = 0;
    featureInfoCollection.features.forEach(function(feature) {
      let props = feature.properties ? feature.properties : feature;
      let layer = LamStore.getLayer(feature.layerGid);
      let template = LamTemplates.getTemplate(feature.layerGid, layer.templateUrl, LamStore.getAppState().templatesRepositoryUrl);
      let tempBody = LamTemplates.processTemplate(template, props, layer);
      if (!tempBody) {
        tempBody += LamTemplates.standardTemplate(props, layer);
      }
      //sezione relations
      let layerRelations = LamStore.getRelations().filter(function(relation) {
        return $.inArray(feature.layerGid, relation.layerGids) >= 0;
      });
      tempBody += LamTemplates.relationsTemplate(layerRelations, props, index);
      tempBody += LamTemplates.featureIconsTemplate(index);

      body += "<div class='lam-feature lam-depth-1 lam-mb-3'>" + tempBody + "</div>";
      index++;
    });
    return body;
  };

  let renderInfoFeaturesMobile = function(featureInfoCollection) {
    let body = "";
    //single feature sent
    if (!featureInfoCollection.features) {
      featureInfoCollection = {
        features: featureInfoCollection
      };
    }

    let index = 0;
    featureInfoCollection.features.forEach(function(feature) {
      let props = feature.properties ? feature.properties : feature;
      let layer = LamStore.getLayer(feature.layerGid);
      let tempBody = "";
      let tooltip = LamTemplates.getLabelFeature(feature.properties, layer.labelField, layer.layerName);
      tempBody += "<div class='lam-depth-2 lam-info-tooltip__content'>";
      tempBody += "<div class='lam-grid'>";
      tempBody += "<div class='lam-col'>";
      tempBody += tooltip;
      tempBody += "</div>";
      tempBody += "<div class='lam-col'>";
      tempBody +=
        '<button class="lam-btn lam-btn-floating lam-btn-small lam-info-expander lam-icon" alt="Apri dettagli" title="Apri dettagli" onclick="LamDispatcher.dispatch(\'show-mobile-info-results\')">';
      tempBody += "<i class='lam-icon'>" + LamResources.svgExpandLess + "</i>";
      tempBody += "</button>";
      tempBody += "</div>";
      tempBody += "</div>";
      tempBody += "</div>";
      body += tempBody;
      index++;
    });
    return body;
  };

  return {
    init: init,
    generateTemplate: generateTemplate,
    getLabelFeature: getLabelFeature,
    getTemplate: getTemplate,
    getTemplateUrl: getTemplateUrl,
    featureIconsTemplate: featureIconsTemplate,
    processTemplate: processTemplate,
    relationsTemplate: relationsTemplate,
    renderInfoFeatures: renderInfoFeatures,
    renderInfoFeaturesMobile: renderInfoFeaturesMobile,
    standardTemplate: standardTemplate,
    templates: templates
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
let LamToolbar = (function() {
  "use strict";

  var easingTime = 300;
  var currentToolbarItem = "";

  let resetToolsPayloads = [{ eventName: "stop-copy-coordinate" }];

  let init = function() {
    //eseguo degli aggiustamente in caso di browser mobile
    if (LamStore.isMobile()) {
      $("#menu-toolbar").css("padding-left", "10px");
      $(".lam-toolbar button").css("margin-right", "0px");
      easingTime = 0;
    }
    // else {
    //   //definizione degli eventi jquery
    //   dragElement(document.getElementById("info-window"));
    // }

    //nascondo il draw per dimensioni piccole
    if ($(window).width() < 640) {
      $("#menu-toolbar__draw-tools").hide();
    }
  };

  /**
   * Resetta tutti i controlli mappa al cambio di menu
   * @return {null} La funzione non restituisce un valore
   */
  let resetTools = function() {
    resetToolsPayloads.forEach(function(payload) {
      lamDispatch(payload);
    });
  };

  let addResetToolsEvent = function(event) {
    resetToolsPayloads.push(event);
  };

  let showMenu = function(toolId) {
    $("#panel").animate(
      {
        width: "show"
      },
      {
        duration: easingTime,
        complete: function() {
          if (toolId) {
            $("#" + toolId).show();
          }
          $("#panel__open").hide();
        }
      }
    );
  };

  /**
   * Nasconde il pannello del menu
   */
  var hideMenu = function() {
    $("#panel").animate(
      {
        width: "hide"
      },
      easingTime,
      function() {
        $("#panel__open").show();
      }
    );
  };

  var toggleToolbarItem = function(toolId, keepOpen) {
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

  let getCurrentToolbarItem = function() {
    return currentToolbarItem;
  };

  return {
    addResetToolsEvent: addResetToolsEvent,
    getCurrentToolbarItem: getCurrentToolbarItem,
    hideMenu: hideMenu,
    init: init,
    showMenu: showMenu,
    toggleToolbarItem: toggleToolbarItem
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
  LamStore.lamInit(mapDiv, appStateUrl, mapTemplateUrl);
}
/*Custom functions*/
function customFunctions() {
  //Right click menu
  var items = [
    //   {
    //     text: "Cerca qui",
    //     classname: "some-style-class",
    //     callback: reverseGeocoding
    //   }
  ];
  //TODO Revisione del context menu
  //LamMap.addContextMenu(items);
}

function reverseGeocoding(obj) {
  lamDispatch({
    eventName: "reverse-geocoding",
    coordinate: obj.coordinate
  });
}
