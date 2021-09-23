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
      /** @type {olx.source.TileWMSOptions} */ ({
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
      } catch (e) {}
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
    });

    vectorSelectionMask = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: featuresSelectionMask,
      }),
      style: LamMapStyles.getSelectionMaskStyle(),
    });

    vectorSelection = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: featuresSelection,
      }),
      style: LamMapStyles.getSelectionStyle(),
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
    modifyInteraction.on("modifyend", function (event) {});
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
