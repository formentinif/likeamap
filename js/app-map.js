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

let AppMap = (function() {
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

  let formatWKT = new ol.format.WKT();
  let featuresWKT = new ol.Collection();
  let vectorWKT;
  let featuresSelection = new ol.Collection();
  let featuresSelectionMask = new ol.Collection();
  let vectorSelectionMask;
  let vectorSelection;
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
    style: styleSelection
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
      point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:900913");
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

  let goToGeometry = function goToGeometry(geometry, srid) {
    let geometryOl = getGeometryFromGeoJsonGeometry(geometry);
    let feature = new ol.Feature({
      geometry: geometryOl
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
   * @param {float} lon1 Longitune o X minimo
   * @param {float} lat1 Latitudine o Y minimo
   * @param {float} lon2 Longitune o X massimo
   * @param {float} lat2 Latitudine o Y massimo
   */
  let goToExtent = function goToExtent(lon1, lat1, lon2, lat2) {
    let point1 = new ol.geom.Point([lon1, lat1]);
    if (lon1 < 180) {
      point1 = ol.proj.transform([lon1, lat1], "EPSG:4326", "EPSG:900913");
    }
    let point2 = new ol.geom.Point([lon2, lat2]);
    if (lon2 < 180) {
      point2 = ol.proj.transform([lon2, lat2], "EPSG:4326", "EPSG:900913");
    }

    let extent = [point1[0], point1[1], point2[0], point2[1]];
    mainMap.getView().fit(extent, mainMap.getSize());
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

  let addLayerToMap = function addLayerToMap(
    gid,
    uri,
    layerType,
    layer,
    srs,
    format,
    params,
    tileMode,
    visible,
    zIndex,
    queryable,
    opacity,
    attribution,
    secured,
    apikey
  ) {
    /// <summary>
    /// Aggiunge un layer alla mappa
    /// </summary>
    /// <param name="gid">Codice numerico identificativo del layer</param>
    /// <param name="uri">Url sorgente del layer</param>
    /// <param name="layerType">Tipologia del layer  osm, wms, wmstiled, tms</param>
    /// <param name="params">Parametri aggiuntivi da aggiungere alle chiamate (formato url querystring)</param>
    /// <param name="tileMode">Tipo di tile in caso di layer TMS (non implementato)</param>
    /// <param name="opacity">Opacit del layer</param>

    let thisLayer;
    if (!params) {
      params = "";
    }
    params += "LAYERS=" + layer;
    //params += "&QUERY_LAYERS=" + layer;
    params += "&SRS=EPSG:" + srs;
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
          case "tms":
            break;
          case "quadkey":
            break;
          case "xyz":
            break;
        }
        break;
    }
    if (thisLayer) {
      thisLayer.gid = gid;
      thisLayer.queryable = queryable;
      mainMap.addLayer(thisLayer);
      thisLayer.setVisible(visible);
      thisLayer.zIndex = parseInt(zIndex);
      thisLayer.setZIndex(parseInt(zIndex));
      thisLayer.setOpacity(parseFloat(opacity));
    } else {
      log("Impossibile aggiungere il layer " + gid + ", " + uri + ", " + layerType + ", " + params + ", " + tileMode);
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

  let getLayerWMS = function getLayerWMS(gid, uri, params, attribution) {
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

  let getLayerWMSTiled = function getLayerWMSTiled(gid, uri, params, attribution, secured) {
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
        xhr.setRequestHeader("Authorization", AppStore.getAuthorizationHeader());
        xhr.send();
      });
    }
    let wms = new ol.layer.Tile({
      //extent: [-13884991, 2870341, -7455066, 6338219],
      source: source
    });
    return wms;
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

  let GetBrowserLocationControl = function(opt_options) {
    let options = opt_options || {};
    let button = document.createElement("button");
    button.innerHTML = '<i class="material-icons">&#xE55C;</i>';
    let this_ = this;
    let handleGetBrowserLocation = function() {
      goToBrowserLocation();
    };
    button.id = "map__browser-location";
    button.addEventListener("click", handleGetBrowserLocation, false);
    button.addEventListener("touchstart", handleGetBrowserLocation, false);
    button.className = "btn-floating btn-small waves-effect waves-light";
    let element = document.createElement("div");
    element.className = "lk-map__browser-location ol-unselectable ";
    element.appendChild(button);
    ol.control.Control.call(this, {
      element: element,
      target: options.target
    });
  };

  let GetZoomInControl = function(opt_options) {
    let options = opt_options || {};
    let button = document.createElement("button");
    button.innerHTML = '<i class="material-icons">&#xE145;</i>';
    let this_ = this;
    let handleZoomIn = function() {
      let currentView = mainMap.getView();
      currentView.setZoom(currentView.getZoom() + 1);
      mainMap.setView(currentView);
    };
    button.addEventListener("click", handleZoomIn, false);
    button.addEventListener("touchstart", handleZoomIn, false);
    button.id = "map__zoom-in";
    button.className = "btn-floating btn-small waves-effect waves-light";
    let element = document.createElement("div");
    element.className = "lk-map__zoom-in ol-unselectable ";
    element.appendChild(button);
    ol.control.Control.call(this, {
      element: element,
      target: options.target
    });
  };

  let GetZoomOutControl = function(opt_options) {
    let options = opt_options || {};
    let button = document.createElement("button");
    button.innerHTML = '<i class="material-icons">&#xE15B;</i>';
    let this_ = this;
    let handleZoomOut = function() {
      let currentView = mainMap.getView();
      currentView.setZoom(currentView.getZoom() - 1);
      mainMap.setView(currentView);
    };
    button.addEventListener("click", handleZoomOut, false);
    button.addEventListener("touchstart", handleZoomOut, false);
    button.id = "map__zoom-out";
    button.className = "btn-floating btn-small waves-effect waves-light";
    let element = document.createElement("div");
    element.className = "lk-map__zoom-out ol-unselectable ";
    element.appendChild(button);
    ol.control.Control.call(this, {
      element: element,
      target: options.target
    });
  };

  let render = function render(divMap, mapConfig) {
    /// <summary>
    /// Inizializza l'oggetto mappa
    /// </summary>
    /// <param name="divMap">Identificativo html in cui caricare la mappa</param>
    /// <returns type=""></returns>

    log("Creazione della mappa in corso");
    ol.inherits(GetBrowserLocationControl, ol.control.Control);
    ol.inherits(GetZoomOutControl, ol.control.Control);
    ol.inherits(GetZoomInControl, ol.control.Control);

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
        new GetBrowserLocationControl(),
        new GetZoomInControl(),
        new GetZoomOutControl(),
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

    mainMap.on("singleclick", function(evt) {
      //interrogo solo i layer visibile
      AppMapInfo.getRequestInfo(evt.coordinate, true);
    });

    mainMap.on("moveend", function() {
      dispatch("map-move-end");
    });

    proj4.defs("EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    proj4.defs(
      "EPSG:3003",
      "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +units=m +no_defs"
    );

    // mainMap.on("zoomend", map, function() {
    //     dispatch("map-zoom-end");
    // });

    //mainMap.on('pointermove', function (evt) {
    //    if (evt.dragging) {
    //        return;
    //    }
    //    let pixel = mainMap.getEventPixel(evt.originalEvent);
    //    let hit = mainMap.forEachLayerAtPixel(pixel, function (layer) {
    //        return true;
    //    });
    //    mainMap.getTargetElement().style.cursor = hit ? 'pointer' : '';
    //});
    mainMap.addInteraction(dragInteractionPrint);

    // let modify = new ol.interaction.Modify({
    //     features: featuresWKT,
    //     // the SHIFT key must be pressed to delete vertices, so
    //     // that new vertices can be drawn at the same position
    //     // of existing vertices
    //     deleteCondition: function(event) {
    //         return ol.events.condition.shiftKeyOnly(event) &&
    //             ol.events.condition.singleClick(event);
    //     }
    // });
    // mainMap.addInteraction(modify);
    //
    // let draw; // global so we can remove it later
    //
    // draw = new ol.interaction.Draw({
    //     features: featuresWKT,
    //     type: "Point"
    // });
    // mainMap.addInteraction(draw);

    log("Creazione della mappa completata");
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
    let initTool = getUriParameter("tool");
    try {
      if (initLon) config.mapLon = parseFloat(initLon);
      if (initLat) config.mapLat = parseFloat(initLat);
      if (initZoom) config.mapZoom = parseInt(initZoom);
    } catch (e) {
      log("Main-Map: Impossibile caricare la posizione iniziale dall'url");
    }
    goToLonLat(config.mapLon, config.mapLat, config.mapZoom);
    addLayersToMap(config.layers);
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
            dispatch(payload);
          }
        }
      } catch (e) {
        log("Main-Map: Impossibile caricare i layer iniziali dall'url");
      } finally {
      }
    }
    if (initTool) {
      dispatch({
        eventName: "show-tool",
        tool: initTool
      });
    }
    //aggiungo layer WKT alla mappa
    vectorWKT = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: featuresWKT
      }),
      style: (function() {
        let style = new ol.style.Style({
          fill: new ol.style.Fill({
            color: getCurrentColor(0.2, [68, 138, 255, 0.2])
          }),
          stroke: new ol.style.Stroke({
            color: getCurrentColor(1, [68, 138, 255, 1]),
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: getCurrentColor(1, [68, 138, 255, 1])
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
        let styles = [style];
        return function(feature, resolution) {
          style.getText().setText(feature.get("name"));
          return styles;
        };
      })()
    });

    vectorSelectionMask = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: featuresSelectionMask
      }),
      style: (function() {
        let style = new ol.style.Style({
          fill: new ol.style.Fill({
            color: getCurrentColor(0.2, [255, 216, 0, 0.1])
          }),
          stroke: new ol.style.Stroke({
            color: getCurrentColor(1, [255, 216, 0, 0.5]),
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: getCurrentColor(1, [255, 216, 0, 0.5])
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
        let styles = [style];
        return function(feature, resolution) {
          style.getText().setText(feature.get("name"));
          return styles;
        };
      })()
    });

    vectorSelection = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: featuresSelection
      }),
      style: (function() {
        let style = new ol.style.Style({
          fill: new ol.style.Fill({
            color: getCurrentColor(0.2, [0, 255, 255, 0.2])
          }),
          stroke: new ol.style.Stroke({
            color: getCurrentColor(1, [0, 255, 255, 1]),
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: getCurrentColor(1, [0, 255, 255, 1])
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
        let styles = [style];
        return function(feature, resolution) {
          style.getText().setText(feature.get("name"));
          return styles;
        };
      })()
    });

    vectorWKT.setMap(mainMap);
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
          feat.setStyle(vectorWKT.style);
          vectorWKT.getSource().addFeature(feat);
        }
      } catch (e) {
        log("Main-Map: Impossibile caricare le features KML");
      } finally {
      }
    }

    vectorPrint.setMap(mainMap);
    //mainMap.addLayer(vectorPrint);
  };

  let addLayersToMap = function addLayersToMap(tempLayers) {
    for (let i = 0; i < tempLayers.length; i++) {
      let layer = tempLayers[i];
      addLayerToMap(
        layer.gid,
        layer.mapUri,
        layer.layerType,
        layer.layer,
        layer.srs,
        layer.format,
        layer.params,
        layer.tileMode,
        layer.visible,
        layer.zIndex,
        layer.queryable,
        layer.opacity,
        layer.attribution,
        layer.secured,
        layer.apikey
      );
      if (layer.layers) {
        addLayersToMap(layer.layers);
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
    let layerStore = AppStore.getLayer(gid);
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
      url += "&SCALE=" + AppMap.getMapScale();
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
    }
  };

  let setLayerVisibility = function setLayerVisibility(gid, visibility) {
    let layer = getLayer(gid);
    if (layer) {
      layer.setVisible(visibility);
    }
  };

  let log = function log(str) {
    /// <summary>
    /// Scrive un messaggio nella console del browser se attivata
    /// </summary>
    /// <param name="str">Messaggio da scrivere</param>
    /// <returns type=""></returns>
    if (console) {
      Dispatcher.dispatch({
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
    vectorWKT.getSource().addFeature(feature);
  };

  let addFeatureToMap = function addFeatureToMap(geometry, srid, vector) {
    let feature = null;
    if (geometry) {
      let geometryOl = getGeometryFromGeoJsonGeometry(geometry);
      feature = new ol.Feature({
        geometry: geometryOl
      });
      feature = transform3857(feature, srid);
      //feature.getGeometry().transform(projection, 'EPSG:3857');
      vector.getSource().addFeature(feature);
    }
    return feature;
  };

  let startCopyCoordinate = function() {
    copyCoordinateEvent = mainMap.on("singleclick", function(evt) {
      let pp = new ol.geom.Point([evt.coordinate[0], evt.coordinate[1]]);
      if (evt.coordinate[0] > 180) {
        pp = ol.proj.transform([evt.coordinate[0], evt.coordinate[1]], "EPSG:900913", "EPSG:4326");
      }
      dispatch({
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
    let vertices = [[[x1, y1], [x1, y2], [x2, y2], [x2, y1], [x1, y1]]];
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
      style: styleSelection
    });
    selectInteraction.on("drawend", function(evt) {
      let feature = evt.feature.clone();
      dispatch({
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
    return addFeatureToMap(geometry, srid, vectorSelection);
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
      // evt.feature.set("name", $("#draw-tools__textarea").val());
      // let defaultStyle = new ol.style.Style({
      //   fill: new ol.style.Fill({
      //     color: getCurrentColor(1)
      //   }),
      //   stroke: new ol.style.Stroke({
      //     color: getCurrentColor(1),
      //     width: 1
      //   })
      //});
      //evt.feature.setStyle(defaultStyle); //$("#draw-tools__textarea").val());
    });
    mainMap.addInteraction(drawInteraction);
  };

  let addDrawDeleteInteraction = function(geomType) {
    deleteInteraction = new ol.interaction.Select({
      // make sure only the desired layer can be selected
      layers: [vectorWKT]
    });

    let style_modify = new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 2,
        color: getCurrentColor(1, [255, 0, 0, 1])
      }),
      fill: new ol.style.Stroke({
        color: getCurrentColor(1, [255, 0, 0, 0.2])
      })
    });

    deleteInteraction.on("select", function(evt) {
      let selected = evt.selected;
      let deselected = evt.deselected;

      if (selected.length) {
        selected.forEach(function(feature) {
          feature.setStyle(style_modify);
          //abilita eliminazione single click
          //vectorWKT.getSource().removeFeature(feature);
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
      vectorWKT.getSource().removeFeature(deleteInteraction.getFeatures().getArray()[i]);
    }
    deleteInteraction.getFeatures().clear();
  };

  /**
   * Restituisce tutte le feature disegnate in formato KML
   * @return {string} Elenco delle feature in formato KML
   */
  let getDrawFeature = function() {
    let features = vectorWKT.getSource().getFeatures();
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
      switch (srid) {
        case 3003:
          feature.getGeometry().transform("EPSG:3003", "EPSG:3857");
          break;
        case 25832:
          feature.getGeometry().transform("EPSG:25832", "EPSG:3857");
          break;
        case 3857:
          //feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
          break;
        default:
          feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
      }
    } else {
      feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
    }
    return feature;
  };

  let goToBrowserLocation = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(AppMap.showBrowserLocation);
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

  let addContextMenu = function(items) {
    //Aggiunta del menu contestuale
    let contextmenu = new ContextMenu({
      width: 170,
      defaultItems: false, // defaultItems are (for now) Zoom In/Zoom Out
      items: items
    });
    mainMap.addControl(contextmenu);
  };

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

  /**
   * Rimuove tutte le geometrie dal layer feature info
   * @return {null} La funzione non restituisce un valore
   */
  let clearLayerPrint = function() {
    vectorPrint.getSource().clear(true);
  };

  return {
    addContextMenu: addContextMenu,
    addDrawInteraction: addDrawInteraction,
    addDrawDeleteInteraction: addDrawDeleteInteraction,
    addFeatureSelectionToMap: addFeatureSelectionToMap,
    addFeatureToMap: addFeatureToMap,
    addLayerToMap: addLayerToMap,
    addSelectInteraction: addSelectInteraction,
    setPrintBox: setPrintBox,
    addWKTToMap: addWKTToMap,
    aspectRatio: aspectRatio,
    clearLayerPrint: clearLayerPrint,
    clearLayerSelection: clearLayerSelection,
    clearLayerSelectionMask: clearLayerSelectionMask,
    deleteDrawFeatures: deleteDrawFeatures,
    render: render,
    getCentroid: getCentroid,
    getCurrentColor: getCurrentColor,
    getDrawFeature: getDrawFeature,
    getLegendUrl: getLegendUrl,
    getMap: getMap,
    getMapResolution: getMapResolution,
    getMapCenter: getMapCenter,
    getMapCenterLonLat: getMapCenterLonLat,
    getMapScale: getMapScale,
    getMapZoom: getMapZoom,
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
    toggleLayer: toggleLayer
  };
})();
