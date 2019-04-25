/*
Copyright 2015-2017 Perspectiva di Formentini Filippo

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Copyright 2015-2017 Perspectiva di Formentini Filippo
Concesso in licenza secondo i termini della Licenza Apache, versione 2.0 (la "Licenza"); è proibito usare questo file se non in conformità alla Licenza. Una copia della Licenza è disponibile all'indirizzo:

http://www.apache.org/licenses/LICENSE-2.0

Se non richiesto dalla legislazione vigente o concordato per iscritto,
il software distribuito nei termini della Licenza è distribuito
"COSÌ COM'È", SENZA GARANZIE O CONDIZIONI DI ALCUN TIPO, esplicite o implicite.
Consultare la Licenza per il testo specifico che regola le autorizzazioni e le limitazioni previste dalla medesima.

*/

var MainMap = (function() {
  /// <summary>
  /// Classe per la gestione delle funzionalità di mapping
  /// </summary>
  "use strict";

  var defaultLayers = {
    OSM: {
      gid: 1000
    },
    OCM: {
      gid: 1001
    }
  };

  var mainMap;
  var mainConfig;
  var layers = [];

  var requestQueue = {};
  var requestQueueData = [];

  var formatWKT = new ol.format.WKT();
  var featuresWKT = new ol.Collection();
  var vectorWKT;

  var getCurrentColor = function(opacity, color) {
    if (!opacity) opacity = 1;
    var resultColor = {
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
        var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(resultColor);
        resultColor = rgb ? {
          r: parseInt(rgb[1], 16),
          g: parseInt(rgb[2], 16),
          b: parseInt(rgb[3], 16)
        } : null;
      }
    } catch (e) {

    }

    return [resultColor.r, resultColor.g, resultColor.b, opacity];
  }

  var vectorInfo = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: []
    }),
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: getCurrentColor(1, [255, 125, 0, 1])
      }),
      stroke: new ol.style.Stroke({
        color: getCurrentColor(1, [255, 125, 0, 1]),
        width: 3
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: getCurrentColor(1, [255, 125, 0, 1])
        })
      })
    })
  });

  var vectorPrint = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: []
    }),
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: getCurrentColor(1, [68, 138, 255, 0.2])
      }),
      stroke: new ol.style.Stroke({
        color: getCurrentColor(1, [68, 138, 255, 1]),
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: getCurrentColor(1, [255, 255, 0, 1])
        })
      })
    })
  });



  var copyCoordinateEvent; //evento per la copia coordinate

  var getMap = function getMap() {
    /// <summary>
    /// Restituisce l'oggetto Mappa inizializzato da questa classe
    /// </summary>
    return mainMap;
  };


  var goToLonLat = function goToLonLat(lon, lat, zoom) {
    /// <summary>
    /// Posiziona la mappa per Longitudine, Latitudine, Zoom o X, Y con EPSG:3857 , Zoom
    /// </summary>
    /// <param name="lon">Longitune o X</param>
    /// <param name="lat">Latitudine o Y</param>
    /// <param name="zoom">Zoom 1-22</param>
    if (!zoom) {
      zoom = 16;
    }
    var point = new ol.geom.Point([lon, lat]);
    if (lon < 180) {
      point = ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:900913');
    }
    mainMap.setView(new ol.View({
      center: point,
      zoom: zoom
    }));

  };

  var goToGeometry = function goToGeometry(geometry, srid) {
    var geometryOl = getGeometryFromGeoJsonGeometry(geometry)
    var feature = new ol.Feature({
      geometry: geometryOl
    });
    feature = transform3857(feature, srid);
    var extent = feature.getGeometry().getExtent();
    mainMap.getView().fit(extent, mainMap.getSize(), {
      maxZoom: 17
    });
  }

  var goToExtent = function goToExtent(lon1, lat1, lon2, lat2) {
    /// <summary>
    /// Posiziona la mappa per bounding box in Longitudine, Latitudine o X,Y con EPSG:3857
    /// </summary>
    /// <param name="lon1">Longitune o X minimo</param>
    /// <param name="lat1">Latitudine o Y minimo</param>
    /// <param name="lon2">Longitune o X massimo</param>
    /// <param name="lat2">Latitudine o Y massimo</param>
    var point1 = new ol.geom.Point([lon1, lat1]);
    if (lon1 < 180) {
      point1 = ol.proj.transform([lon1, lat1], 'EPSG:4326', 'EPSG:900913');
    }
    var point2 = new ol.geom.Point([lon2, lat2]);
    if (lon2 < 180) {
      point2 = ol.proj.transform([lon2, lat2], 'EPSG:4326', 'EPSG:900913');
    }

    var extent = [point1[0], point1[1], point2[0], point2[1]];
    mainMap.getView().fitExtent(extent, mainMap.getSize());
  };

  var layerIsPresent = function layerIsPresent(gid) {
    /// <summary>
    /// Verifica se un layer è presente in base ad un identificativo numerico univoco
    /// </summary>
    /// <param name="gid">Codice numerico identificativo del layer</param>
    var result = false;
    for (var i = 0; i < mainMap.getLayers().getLength(); i++) {
      if (mainMap.getLayers().item(i).gid === gid) {
        result = true;
      }
    }
    return result;
  };

  var getLayer = function getLayer(gid) {
    /// <summary>
    /// Restituisce un layer in base al proprio identificativo numerico
    /// </summary>
    /// <param name="gid">Codice numerico identificativo del layer</param>
    var layer = null;
    for (var i = 0; i < mainMap.getLayers().getLength(); i++) {
      if (mainMap.getLayers().item(i).gid === gid) {
        layer = mainMap.getLayers().item(i);
        return layer;
      }
    }
    return layer;
  };

  var getLayerInfo = function getLayerInfo(gid) {
    /// <summary>
    /// Restituisce un layer in base al proprio identificativo numerico
    /// </summary>
    /// <param name="gid">Codice numerico identificativo del layer</param>
    var layer = null;
    for (var i = 0; i < mainConfig.layers.length; i++) {
      if (gid == mainConfig.layers[i].gid) {
        return mainConfig.layers[i];
      }
      for (var ki = 0; ki < mainConfig.layers[i].layers.length; ki++) {
        if (gid == mainConfig.layers[i].layers[ki].gid) {
          return mainConfig.layers[i].layers[ki];
        }
      }
    }
    return layer;
  };


  var addLayerToMap = function addLayerToMap(gid, uri, layerType, layer, srs, format, params, tileMode, visible, zIndex, queryable, opacity, attribution) {
    /// <summary>
    /// Aggiunge un layer alla mappa
    /// </summary>
    /// <param name="gid">Codice numerico identificativo del layer</param>
    /// <param name="uri">Url sorgente del layer</param>
    /// <param name="layerType">Tipologia del layer  osm, wms, wmstiled, tms</param>
    /// <param name="params">Parametri aggiuntivi da aggiungere alle chiamate (formato url querystring)</param>
    /// <param name="tileMode">Tipo di tile in caso di layer TMS (non implementato)</param>
    /// <param name="opacity">Opacit del layer</param>

    var thisLayer;
    if (!params) {
      params = "";
    }
    params += "LAYERS=" + layer;
    //params += "&QUERY_LAYERS=" + layer;
    params += "&SRS=EPSG:" + srs;
    if (format) {
      if (format !== 'none') {
        params += "&FORMAT=" + wmsImageFormat(format);
      }
    }
    switch (layerType.toLowerCase()) {
      case "group":
        return
        break;
      case "osm":
        thisLayer = getLayerOSM();
        break;
      case "ocm":
        thisLayer = getLayerOCM();
        break;
      case "wms":
        thisLayer = getLayerWMS(gid, uri, params, attribution);
        break;
      case "wmstiled":
        thisLayer = getLayerWMSTiled(gid, uri, params, attribution);
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

  var getLayerOSM = function getLayerOSM() {
    /// <summary>
    /// Restituisce il layer standard di Open Street Map
    /// </summary>
    var osm = new ol.layer.Tile({
      source: new ol.source.OSM({
        crossOrigin: null
      })
    });
    osm.gid = defaultLayers.OSM.gid;
    return osm;
  };

  var getLayerOCM = function getLayerOCM() {
    /// <summary>
    /// Restituisce il layer standard di Open Street Map
    /// </summary>
    var ocm = new ol.layer.Tile({
      source: new ol.source.OSM({
        "url": "https://b.tile.thunderforest.com/cycle/{z}/{x}/{y}.png",
        crossOrigin: null
      })
    });
    ocm.gid = defaultLayers.OCM.gid;
    return ocm;
  };




  var getLayerWMS = function getLayerWMS(gid, uri, params, attribution) {
    /// <summary>
    /// Restituisce un layer in formato WMS
    /// </summary>
    /// <param name="gid">Codice numerico identificativo del layer</param>
    /// <param name="uri">Url sorgente del layer</param>
    /// <param name="params">Parametri aggiuntivi da aggiungere alle chiamate (formato url querystring)</param>
    var params = queryToDictionary(params);
    var serverType = "geoserver";
    // if (!params.format) {
    //     params.format = "PNG";
    // }
    // if (params.format === 'none') {
    //     params.format = null;
    // } else {
    //     params.format = wmsImageFormat(params.format);
    //
    // }
    if (params.serverType) {
      serverType = params.serverType;
    }
    var wms = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: uri,
        params: params,
        serverType: serverType,
        //crossOrigin: "Anonymous"
        attributions: attribution
      })
    })
    return wms;
  };

  var getLayerWMSTiled = function getLayerWMSTiled(gid, uri, params, attribution) {
    /// <summary>
    /// Restituisce un layer in formato WMS, con le chiamate tagliate a Tile
    /// </summary>
    /// <param name="gid">Codice numerico identificativo del layer</param>
    /// <param name="uri">Url sorgente del layer</param>
    /// <param name="params">Parametri aggiuntivi da aggiungere alle chiamate (formato url querystring)</param>
    var params = queryToDictionary(params);
    var serverType = "geoserver";
    params.tiled = "true";
    //
    // if (!params.format) {
    //     params.format = "PNG";
    // }
    // if (params.format === 'none') {
    //
    //     params.format = null;
    // } else {
    //     params.format = wmsImageFormat(params.format);
    // }
    if (params.serverType) {
      serverType = params.serverType;
    }
    var wms = new ol.layer.Tile({
      //extent: [-13884991, 2870341, -7455066, 6338219],
      source: new ol.source.TileWMS( /** @type {olx.source.TileWMSOptions} */ ({
        url: uri,
        params: params,
        serverType: serverType,
        //crossOrigin: "Anonymous"
        attributions: attribution
      }))
    })
    return wms;
  };

  /**
   * restituisce il formato wms di immagine standard
   * @param  {string} format formato immagine
   * @return {string}        formato immagine wms
   */
  var wmsImageFormat = function(format) {
    var result = format;
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
  }


  /**
   * [[Description]]
   * @param {int} gid [[Codice numerico del layer]]
   */
  var removeLayerFromMap = function FromMap(gid) {
    /// <summary>
    /// Rimuove un layer dalla mappa
    /// </summary>
    /// <param name="gid">Codice numerico identificativo del layer</param>
    for (var i = 0; i < mainMap.getLayers().getLength(); i++) {

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
  var removeAllLayersFromMap = function() {
    try {
      mainMap.getLayers().clear()
      layers = [];
    } catch (e) {

    } finally {

    }

  }


  var queryToDictionary = function queryToDictionary(params) {
    /// <summary>
    /// Trasforma una stringa in formato "url querystring" in un oggetto dictionary con le coppie chiave/valore
    /// </summary>
    /// <param name="params"></param>
    var dict = {};
    var arrKeys = params.split('&');
    for (var i = 0; i < arrKeys.length; i++) {
      try {
        var arrVal = arrKeys[i].split('=');
        dict[arrVal[0]] = arrVal[1];
      } catch (e) {}
    }
    return dict;
  };

  var GetBrowserLocationControl = function(opt_options) {
    var options = opt_options || {};
    var button = document.createElement('button');
    button.innerHTML = '<i class="material-icons">&#xE55C;</i>';
    var this_ = this;
    var handleGetBrowserLocation = function() {
      goToBrowserLocation();
    };
    button.id = "map__browser-location";
    button.addEventListener('click', handleGetBrowserLocation, false);
    button.addEventListener('touchstart', handleGetBrowserLocation, false);
    button.className = 'btn-floating btn-small waves-effect waves-light';
    var element = document.createElement('div');
    element.className = 'al-map__browser-location ol-unselectable ';
    element.appendChild(button);
    ol.control.Control.call(this, {
      element: element,
      target: options.target
    });

  };


  var GetZoomInControl = function(opt_options) {
    var options = opt_options || {};
    var button = document.createElement('button');
    button.innerHTML = '<i class="material-icons">&#xE145;</i>';
    var this_ = this;
    var handleZoomIn = function() {
      var currentView = mainMap.getView();
      currentView.setZoom(currentView.getZoom() + 1);
      mainMap.setView(currentView);
    };
    button.addEventListener('click', handleZoomIn, false);
    button.addEventListener('touchstart', handleZoomIn, false);
    button.id = "map__zoom-in";
    button.className = 'btn-floating btn-small waves-effect waves-light';
    var element = document.createElement('div');
    element.className = 'al-map__zoom-in ol-unselectable ';
    element.appendChild(button);
    ol.control.Control.call(this, {
      element: element,
      target: options.target
    });

  };

  var GetZoomOutControl = function(opt_options) {
    var options = opt_options || {};
    var button = document.createElement('button');
    button.innerHTML = '<i class="material-icons">&#xE15B;</i>';
    var this_ = this;
    var handleZoomOut = function() {
      var currentView = mainMap.getView();
      currentView.setZoom(currentView.getZoom() - 1);
      mainMap.setView(currentView);
    };
    button.addEventListener('click', handleZoomOut, false);
    button.addEventListener('touchstart', handleZoomOut, false);
    button.id = "map__zoom-out";
    button.className = 'btn-floating btn-small waves-effect waves-light';
    var element = document.createElement('div');
    element.className = 'al-map__zoom-out ol-unselectable ';
    element.appendChild(button);
    ol.control.Control.call(this, {
      element: element,
      target: options.target
    });

  };



  var render = function render(divMap, mapConfig) {
    /// <summary>
    /// Inizializza l'oggetto mappa
    /// </summary>
    /// <param name="divMap">Identificativo html in cui caricare la mappa</param>
    /// <returns type=""></returns>

    log("Creazione della mappa in corso");
    ol.inherits(GetBrowserLocationControl, ol.control.Control);
    ol.inherits(GetZoomOutControl, ol.control.Control);
    ol.inherits(GetZoomInControl, ol.control.Control);

    var layers = [
      //new ol.layer.Tile({
      //    source: new ol.source.OSM()
      //})
    ];

    // ol.control.defaults({
    //     attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
    //         collapsible: false
    //     })
    // }).
    var controls = new ol.Collection([]);
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
        center: ol.proj.transform([10.41, 44.94], 'EPSG:4326', 'EPSG:3857'),
        zoom: 10
      })
    });


    loadConfig(mapConfig);

    mainMap.on('singleclick', function(evt) {
      //interrogo solo i layer visibile
      getRequestInfo(evt.coordinate, true);
    });

    mainMap.on("moveend", function() {
      dispatch("map-move-end");
    });


    proj4.defs("EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    proj4.defs("EPSG:3003", "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +units=m +no_defs");

    // mainMap.on("zoomend", map, function() {
    //     dispatch("map-zoom-end");
    // });

    //mainMap.on('pointermove', function (evt) {
    //    if (evt.dragging) {
    //        return;
    //    }
    //    var pixel = mainMap.getEventPixel(evt.originalEvent);
    //    var hit = mainMap.forEachLayerAtPixel(pixel, function (layer) {
    //        return true;
    //    });
    //    mainMap.getTargetElement().style.cursor = hit ? 'pointer' : '';
    //});
    mainMap.addInteraction(dragInteractionPrint);





    // var modify = new ol.interaction.Modify({
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
    // var draw; // global so we can remove it later
    //
    // draw = new ol.interaction.Draw({
    //     features: featuresWKT,
    //     type: "Point"
    // });
    // mainMap.addInteraction(draw);

    log("Creazione della mappa completata");
  };

  var loadConfig = function loadConfig(config) {
    /// <summary>
    /// Carica l'oggetto di configurazione sulla mappa
    /// </summary>
    /// <param name="config">Oggetto con i parametri di configurazione</param>
    /// <returns type=""></returns>
    mainConfig = config;

    //ricavo i parametri per il posizionamento custom da querystring
    var initLon = getUriParameter("lon");
    var initLat = getUriParameter("lat");
    var initZoom = getUriParameter("zoom");
    var initLayers = getUriParameter("layers");
    var initTool = getUriParameter("tool");
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
        initLayers = initLayers.split(',');
        for (var i = 0; i < initLayers.length; i++) {
          if (initLayers[i]) {
            var initLayer = initLayers[i].split(":");
            var payload = {};
            payload.eventName = "set-layer-visibility";
            payload.gid = initLayer[0];
            payload.visibility = parseInt(initLayer[1]);
            dispatch(payload);
          }
        }
      } catch (e) {
        log("Main-Map: Impossibile caricare i layer iniziali dall'url");
      } finally {}
    }
    if (initTool){
      dispatch({
        "eventName": "show-tool",
        "tool": initTool
      });
    }
    //aggiungo layer WKT alla mappa
    //mainMap.addLayer(vectorWKT);
    vectorWKT = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: featuresWKT
      }),

      style: (function() {
        var style = new ol.style.Style({
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
            text: '',
            scale: 1.7,
            textAlign: 'Left',
            textBaseline: 'Top',
            fill: new ol.style.Fill({
              color: '#000000'
            }),
            stroke: new ol.style.Stroke({
              color: '#FFFFFF',
              width: 3.5
            })
          })
        });
        var styles = [style];
        return function(feature, resolution) {
          style.getText().setText(feature.get("name"));
          return styles;
        };
      })()
    });

    vectorWKT.setMap(mainMap);

    //aggiungo le feature KML alla mappa
    if (config.drawFeatures) {
      try {
        var formatKml = new ol.format.KML();
        var tempfeaturesWKT = formatKml.readFeatures(config.drawFeatures, {
          featureProjection: 'EPSG:3857'
        });
        for (var i = 0; i < tempfeaturesWKT.length; i++) {
          var feat = tempfeaturesWKT[i].clone();
          feat.setStyle(vectorWKT.style);
          vectorWKT.getSource().addFeature(feat);

        }
      } catch (e) {
        log("Main-Map: Impossibile caricare le features KML")
      } finally {

      }
    }
    vectorInfo.setMap(mainMap);
    vectorPrint.setMap(mainMap);
    //mainMap.addLayer(vectorInfo);
    //mainMap.addLayer(vectorPrint);



  };

  var addLayersToMap = function addLayersToMap(tempLayers) {
    for (var i = 0; i < tempLayers.length; i++) {
      var layer = tempLayers[i];
      addLayerToMap(layer.gid, layer.mapUri, layer.layerType, layer.layer, layer.srs, layer.format, layer.params, layer.tileMode, layer.visible, layer.zIndex, layer.queryable, layer.opacity, layer.attribution);
      if (layer.layers) {
        addLayersToMap(layer.layers);
      }
    }
  };

  var getRequestInfo = function getRequestInfo(coordinate, visibleLayers) {
    /// <summary>
    /// Richiama l'identificazione puntuale su tutti i livelli visibili
    /// </summary>
    /// <param name="coordinate">Coordiante del punto cliccato</param>
    /// <returns type=""></returns>
    ///
    //verifico che non sia attivo il disegno globale
    if (AppStore.isDrawing()) {
      return;
    }
    requestQueue.id = guid();
    requestQueue.layers = [];
    requestQueue.coordinate = coordinate;
    requestQueueData = [];
    var viewResolution = (mainMap.getView().getResolution());

    //ricavo i livelli visibili e li ordino per livello di visualizzazione
    for (var i = 0; i < mainMap.getLayers().getLength(); i++) {
      var layer = mainMap.getLayers().item(i);
      if (layer.queryable) {
        if (!visibleLayers || layer.getVisible()) {
          //getFeatureInfo(coordinate, layer);
          var layerTemp = {};
          //var layer = getLayer(gid);
          var url = layer.getSource().getGetFeatureInfoUrl(coordinate, viewResolution, 'EPSG:3857', {
            'INFO_FORMAT': 'text/javascript',
            'feature_count': 50
          });
          layerTemp.url = url;
          layerTemp.zIndex = layer.zIndex;
          layerTemp.sent = false;
          requestQueue.layers.push(layerTemp);
        }
      }
    }

    requestQueue.layers = requestQueue.layers.sort(SortByZIndex);

    //eseguo il loop delle richieste
    if (!requestQueue.pending) {
      getFeatureInfoRequest(visibleLayers);
    } else {
      //resetto la richiesta
      requestQueue.restarted = true;
    }
  };

  var getFeatureInfoRequest = function getFeatureInfoRequest(visibleLayers) {
    var url = "";
    //ricavo l'url corrente dalla coda globale e setto il layer come completato
    for (var i = 0; i < requestQueue.layers.length; i++) {
      if (!requestQueue.layers[i].sent) {
        requestQueue.layers[i].sent = true;
        url = requestQueue.layers[i].url;
        break;
      }
    }
    if (!url) {
      //dispatch("hide-loader");
      requestQueue.pending = false;
      //se la query è su tutti i layer mostro i risultati
      if (!visibleLayers) {
        if (requestQueueData.length > 0) {
          dispatch({
            "eventName": "show-reverse-geocoding-result",
            "results": requestQueueData
          });
        }
      }
      return;
    }
    if (visibleLayers) {
      url += '&format_options=callback:MainMap.processRequest';
    } else {
      url += '&format_options=callback:MainMap.processRequestAll';
    }
    //console.log(url);
    requestQueue.pending = true;
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
        requestQueue.pending = false;
        //dispatch("hide-loader");
      }
    });
  };

  /**
   * Visualizza le info bloccandosi alla prima occorrenza
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  var processRequest = function processRequest(data) {
    clearLayerInfo();
    requestQueue.pending = false;
    dispatch("hide-loader");
    //se il dato è presente lo visualizzo
    if (data && data.features.length > 0) {
      if (data.features[0].geometry) {
        var srid = getSRIDfromCRSName(data.crs.properties.name);
        addFeatureInfoToMap(data.features[0].geometry, srid);
      }
      Dispatcher.dispatch({
        eventName: 'show-info-item',
        data: data
      });
    }

    //se non è presente o una nuova richiesta è stata accodata procedo al passo successivo
    if (requestQueue.restarted) {
      requestQueue.restarted = false;
      getFeatureInfoRequest();
    }
    //se il dato a questo punto è nullo procedo
    if (!data || data.features.length == 0) {
      getFeatureInfoRequest();
    }

  };

  /**
   * Visualizza tutte le info trovate
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  var processRequestAll = function processRequestAll(data) {
    clearLayerInfo();
    //requestQueue.pending = false;
    dispatch("hide-loader");
    //se il dato è presente lo aggiungo al contenitore globalse
    if (data && data.features.length > 0) {
      for (var i = 0; i < data.features.length; i++) {
        requestQueueData.push(data.features[i]);
      }
    }

    //se non è presente o una nuova richiesta è stata accodata procedo al passo successivo
    if (requestQueue.restarted) {
      requestQueue.restarted = false;
      getFeatureInfoRequest();
    }
    //se il dato a questo punto è nullo procedo
    //if (!data || data.features.length == 0) {
    getFeatureInfoRequest(false);
    //}

  };

  /**
   * Return the resolution of the current map
   * @return {float} resolution in map units
   */
  var getMapResolution = function getMapResolution() {
    return mainMap.getView().getResolution();
  }

  /**
   * return the map scale based on  current resolution
   * @return {float} map scale (approx)
   */
  var getMapScale = function getMapScale() {
    return getScaleFromResolution(mainMap.getView().getResolution(), 'm');
  }


  /**
   * TEST
   * @param  {[type]} resolution [description]
   * @param  {[type]} units      [description]
   * @return {[type]}            [description]
   */
  var getScaleFromResolution = function(resolution, units) {
    var dpi = 25.4 / 0.28; //inch in mm / dpi in mm
    var mpu = ol.proj.Units.METERS_PER_UNIT[units]; //'degrees', 'ft', 'm' or 'pixels'.
    var inchesPerMeter = 39.3701;
    return parseFloat(resolution) * (mpu * inchesPerMeter * dpi);
  }

  /**
   * TEST do not use
   * @param  {[type]} scale [description]
   * @param  {[type]} units [description]
   * @return {[type]}       [description]
   */
  var getResolutionForScale = function(scale, units) {
    var dpi = 25.4 / 0.28; //inch in mm / dpi in mm
    var mpu = ol.proj.Units.METERS_PER_UNIT[units]; //'degrees', 'ft', 'm' or 'pixels'.
    var inchesPerMeter = 39.37;
    return parseFloat(scale) / (mpu * inchesPerMeter * dpi);
  }


  var getMapCenter = function getMapCenter() {
    return mainMap.getView().getCenter();
  }

  var getMapCenterLonLat = function getMapCenterLonLat() {
    var center = mainMap.getView().getCenter();
    return (ol.proj.transform(center, 'EPSG:3857', 'EPSG:4326'));
  }

  var getMapZoom = function getMapZoom() {
    return mainMap.getView().getZoom();
  }

  var getLegendUrl = function getLegendUrl(gid) {
    var layer = getLayer(gid);
    var url = "";
    try {
      if (layer) {
        try {
          url = layer.getSource().getUrls()[0];
        } catch (err) {
          url = layer.getSource().getUrl();
        }
        url += '?REQUEST=GetLegendGraphic&sld_version=1.0.0&layer=' + layer.getSource().getParams().LAYERS.trim() + '&format=image/jpeg&legend_options=fontAntiAliasing:true;dpi:180';
      }
    } catch (e) {

    }
    return url;
  }


  var toggleLayer = function toggleLayer(gid) {
    /// <summary>
    /// Cambia lo stato di visibilità (acceso/spento) di un layer
    /// </summary>
    /// <param name="gid">Codice numerico identificativo del layer</param>
    /// <returns type=""></returns>
    var layer = getLayer(gid);
    if (layer) {
      layer.setVisible(!layer.getVisible())
    }
  }

  var setLayerVisibility = function setLayerVisibility(gid, visibility) {
    var layer = getLayer(gid);
    if (layer) {
      layer.setVisible(visibility)
    }
  }

  var log = function log(str) {
    /// <summary>
    /// Scrive un messaggio nella console del browser se attivata
    /// </summary>
    /// <param name="str">Messaggio da scrivere</param>
    /// <returns type=""></returns>
    if (console) {
      Dispatcher.dispatch({
        eventName: 'log',
        message: str
      });
    }
  }


  var addWKTToMap = function addWKTToMap(wkt) {
    /// <summary>
    /// Aggiunge una geometria in formato WKT nella mappa
    /// </summary>
    /// <param name="wkt">Geometria da caricare</param>
    /// <returns type=""></returns>
    var feature = formatWKT.readFeature(wkt);
    /*var feature = formatWKT.readFeature(
    'POLYGON ((10.6112420275072 44.7089045353454, 10.6010851023631 44.6981632996669, 10.6116329324321 44.685907897919, 10.6322275666758 44.7050600304689, 10.6112420275072 44.7089045353454))');*/
    feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
    vectorWKT.getSource().addFeature(feature);
  }

  var addInfoToMap = function addInfoToMap(wkt) {

    /// <summary>
    /// Aggiunge una geometria in formato GeoJson nella mappa dopo una selezione
    /// </summary>
    /// <param name="wkt">Geometria da caricare</param>
    /// <returns type=""></returns>

    var geometryOl = null;
    var feature = null;
    var feature = formatWKT.readFeature(wkt);
    /*var feature = formatWKT.readFeature(
    'POLYGON ((10.6112420275072 44.7089045353454, 10.6010851023631 44.6981632996669, 10.6116329324321 44.685907897919, 10.6322275666758 44.7050600304689, 10.6112420275072 44.7089045353454))');*/
    feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');

    //feature.getGeometry().transform(projection, 'EPSG:3857');
    vectorInfo.getSource().addFeature(feature);

    return feature;
  }

  var addFeatureInfoToMap = function addFeatureInfoToMap(geometry, srid) {
    /// <summary>
    /// Aggiunge una geometria in formato GeoJson nella mappa dopo una selezione
    /// </summary>
    /// <param name="wkt">Geometria da caricare</param>
    /// <returns type=""></returns>
    var geometryOl = null;
    var feature = null;
    if (geometry) {
      var geometryOl = getGeometryFromGeoJsonGeometry(geometry)
      feature = new ol.Feature({
        geometry: geometryOl
      });
      feature = transform3857(feature, srid);
      //feature.getGeometry().transform(projection, 'EPSG:3857');
      vectorInfo.getSource().addFeature(feature);
    }
    return feature;
  }

  /**
   * Aggiunge un infopoint alla mappa
   * @return {[type]} [description]
   */
  var addInfoPoint = function(lon, lat) {
    var geometryOl = null;
    var feature = null;
    geometryOl = new ol.geom.Point([lon, lat]);
    feature = new ol.Feature({
      geometry: geometryOl
    });
    feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
    //feature.getGeometry().transform(projection, 'EPSG:3857');
    vectorInfo.getSource().addFeature(feature);
    return feature;
  }


  /**
   * Aggiunge un poligono alla mappa
   * @param  {object} geometry geometria in formato geojson
   * @return {object} Feature appena creata
   */
  var addPolygonInfo = function(geometry) {
    var geometryOl = null;
    var feature = null;
    geometryOl = new ol.geom.Polygon(geometry.coordinates);
    feature = new ol.Feature({
      geometry: geometryOl
    });
    feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
    //feature.getGeometry().transform(projection, 'EPSG:3857');
    vectorInfo.getSource().addFeature(feature);

    return feature;
  }

  /**
   * Rimuove tutte le geometrie dal layer feature info
   * @return {null} La funzione non restituisce un valore
   */
  var clearLayerInfo = function() {
    vectorInfo.getSource().clear(true);
  }


  var startCopyCoordinate = function() {
    copyCoordinateEvent = mainMap.on('singleclick', function(evt) {
      var pp = new ol.geom.Point([evt.coordinate[0], evt.coordinate[1]]);
      if (evt.coordinate[0] > 180) {
        pp = ol.proj.transform([evt.coordinate[0], evt.coordinate[1]], 'EPSG:900913', 'EPSG:4326');
      }
      dispatch({
        eventName: "map-click",
        //"lon": evt,
        lon: pp[0],
        lat: pp[1]
      })
      //var feature = map.forEachFeatureAtPixel(evt.pixel,
      // function(feature, layer) {
      // do stuff here with feature
      // return [feature, layer];
      //});
    });


  }

  var stopCopyCoordinate = function() {
    mainMap.un(copyCoordinateEvent);
  }


  /**
   * Aggiunge un rettangolo alla mappa per la stampa
   * @param  {float} x      x del centro in sistema di riferimento EPSG:3857
   * @param  {float} y      y del centro in sistema di riferimento EPSG:3857
   * @param  {float} width  larghezza in pixel
   * @param  {float} height altezza in pixels
   * @return {object}        feature generata dalla funzione
   */
  var setPrintBox = function(x, y, width, height) {
    //elimino la geometria attuale
    clearLayerPrint();
    var geometryOl = null;
    var feature = null;
    // geometryOl = new ol.geom.Point([lon, lat]);
    // feature = new ol.Feature({
    //     geometry: geometryOl
    // });
    // feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
    // lon = feature.coordinates[0][0];
    // lat = feature.coordinates[0][1];

    var x1 = x - (width / 2);
    var x2 = x + (width / 2);
    var y1 = y - (height / 2);
    var y2 = y + (height / 2);
    var vertices = [
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
    feature.gid = 'print-box';
    //feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
    vectorPrint.getSource().addFeature(feature);

    return feature;
  }



  //oggetti helper per il drag della stampa
  var dragFeaturePrint = null;
  var dragCoordinatePrint = null;
  var dragCursorPrint = 'pointer';
  var dragPrevCursorPrint = null;
  /**
   * Aggiunge l'interazione di drag anc drop per la stampa
   */
  var dragInteractionPrint = new ol.interaction.Pointer({
    handleDownEvent: function(event) {
      var feature = mainMap.forEachFeatureAtPixel(event.pixel,
        function(feature, layer) {
          return feature;
        }
      );

      if (feature && feature.gid === 'print-box') { //
        dragCoordinatePrint = event.coordinate;
        dragFeaturePrint = feature;
        return true;
      }

      return false;
    },
    handleDragEvent: function(event) {
      var deltaX = event.coordinate[0] - dragCoordinatePrint[0];
      var deltaY = event.coordinate[1] - dragCoordinatePrint[1];

      var geometry = dragFeaturePrint.getGeometry();
      geometry.translate(deltaX, deltaY);


      dragCoordinatePrint[0] = event.coordinate[0];
      dragCoordinatePrint[1] = event.coordinate[1];
    },
    handleMoveEvent: function(event) {
      if (dragCursorPrint) {
        var mainMap = event.map;

        var feature = mainMap.forEachFeatureAtPixel(event.pixel,
          function(feature, layer) {
            return feature;
          });

        var element = event.map.getTargetElement();

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

  var getPrintCenter = function() {
    var feature = null;
    var features = vectorPrint.getSource().getFeatures();
    for (var i = 0; i < features.length; i++) {
      if (features[i].gid === 'print-box') {
        var geomOl = features[i].getGeometry().getCoordinates();
        var x = (geomOl[0][0][0] + geomOl[0][2][0]) / 2;
        var y = (geomOl[0][0][1] + geomOl[0][1][1]) / 2;
        feature = [x, y];
        break;
      }

    }
    return feature;
  }

  var getPrintCenterLonLat = function() {
    var center = getPrintCenter();
    return (ol.proj.transform(center, 'EPSG:3857', 'EPSG:4326'));
  }

  /**
   * Rimuove tutte le geometrie dal layer feature info
   * @return {null} La funzione non restituisce un valore
   */
  var clearLayerPrint = function() {
    vectorPrint.getSource().clear(true);
  }

  /* SEZIONE DRAWING    *************************************/

  //Tipo di interazione per la modifica
  //oggetti globali per poterlo rimuovere in un momento successivo
  var modifyInteraction;
  var drawInteraction;
  var deleteInteraction;

  /**
   * Elimina l'interazione per il disegno
   * @return {null}
   */
  var removeDrawInteraction = function() {
    try {
      mainMap.removeInteraction(modifyInteraction);
    } catch (e) {

    }
    try {
      mainMap.removeInteraction(drawInteraction);
    } catch (e) {

    }
  }

  /**
   * Rimuove l'interazione per l'eliminazione delle features
   * @return {null}
   */
  var removeDrawDeleteInteraction = function() {
    try {
      mainMap.removeInteraction(deleteInteraction);
    } catch (e) {

    }
  }

  var addDrawInteraction = function(geomType) {
    //Se ci sono freature inserite
    try {
      mainMap.removeInteraction(modifyInteraction);
    } catch (e) {}
    modifyInteraction = new ol.interaction.Modify({
      features: featuresWKT,
      // the SHIFT key must be pressed to delete vertices, so
      // that new vertices can be drawn at the same position
      // of existing vertices
      deleteCondition: function(event) {
        return ol.events.condition.shiftKeyOnly(event) &&
          ol.events.condition.singleClick(event);
      }
    });
    modifyInteraction.on('modifyend', function(event) {});
    mainMap.addInteraction(modifyInteraction);

    try {
      mainMap.removeInteraction(drawInteraction);
    } catch (e) {

    }
    drawInteraction = new ol.interaction.Draw({
      features: featuresWKT, //definizione delle features
      type: geomType
    });
    drawInteraction.on("drawend", function(evt) {
      //evt.feature.NAME = "pippo";
      evt.feature.set("name", $("#draw-tools__textarea").val());
      var defaultStyle = new ol.style.Style({
        fill: new ol.style.Fill({
          color: getCurrentColor(1)
        }),
        stroke: new ol.style.Stroke({
          color: getCurrentColor(1),
          width: 1
        })
      });
      //evt.feature.setStyle(defaultStyle); //$("#draw-tools__textarea").val());
    });
    mainMap.addInteraction(drawInteraction);

  }

  var addDrawDeleteInteraction = function(geomType) {
    deleteInteraction = new ol.interaction.Select({
      // make sure only the desired layer can be selected
      layers: [vectorWKT]
    });

    var style_modify = new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 2,
        color: getCurrentColor(1, [255, 0, 0, 1])
      }),
      fill: new ol.style.Stroke({
        color: getCurrentColor(1, [255, 0, 0, 0.2])
      }),
    });

    deleteInteraction.on('select', function(evt) {
      var selected = evt.selected;
      var deselected = evt.deselected;

      if (selected.length) {
        selected.forEach(function(feature) {
          console.info(feature);
          feature.setStyle(style_modify);
          //abilita eliminazione single click
          //vectorWKT.getSource().removeFeature(feature);
          //
          deleteDrawFeatures();
        });
      } else {
        deselected.forEach(function(feature) {
          console.info(feature);
          feature.setStyle(null);
        });
      }
    });
    mainMap.addInteraction(deleteInteraction);


  }

  var deleteDrawFeatures = function() {
    for (var i = 0; i < deleteInteraction.getFeatures().getArray().length; i++) {
      vectorWKT.getSource().removeFeature(deleteInteraction.getFeatures().getArray()[i]);
    }
    deleteInteraction.getFeatures().clear();
  }

  /**
   * Restituisce tutte le feature disegnate in formato KML
   * @return {string} Elenco delle feature in formato KML
   */
  var getDrawFeature = function() {
    var features = vectorWKT.getSource().getFeatures();
    var kmlFormat = new ol.format.KML();
    var kml = kmlFormat.writeFeatures(features, {
      featureProjection: 'EPSG:3857'
    });
    return kml;
  }

  /**
   * Genera un GUID
   * @return {string} guid
   */
  var guid = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  function SortByZIndex(a, b) {
    var aName = a.zIndex;
    var bName = b.zIndex;
    return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
  }

  var getGeometryFromGeoJsonGeometry = function(geometry) {
    var geometryOl = null;
    switch (geometry.type.toLowerCase()) {
      case 'polygon':
        geometryOl = new ol.geom.Polygon(geometry.coordinates);
        break;
      case 'multipolygon':
        geometryOl = new ol.geom.MultiPolygon(geometry.coordinates);
        break;
      case 'linestring':
        geometryOl = new ol.geom.LineString(geometry.coordinates);
        break;
      case 'multilinestring':
        geometryOl = new ol.geom.MultiLineString(geometry.coordinates);
        break;
      case 'point':
        geometryOl = new ol.geom.Point(geometry.coordinates);
        break;
      case 'multipoint':
        geometryOl = new ol.geom.MultiPoint(geometry.coordinates);
        break;
    }
    return geometryOl;
  }

  var getSRIDfromCRSName = function(name) {
    var srid;
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
      return null
    }
    return srid;
  }

  var transform3857 = function(feature, srid) {
    //verifico che lo srid sia un oggetto crs
    if (srid) {
      if (srid.properties) {
        srid = getSRIDfromCRSName(srid.properties.name);
      }
      switch (srid) {
        case 3003:
          feature.getGeometry().transform('EPSG:3003', 'EPSG:3857');
          break;
        case 25832:
          feature.getGeometry().transform('EPSG:25832', 'EPSG:3857');
          break;
        case 3857:
          //feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
          break;
        default:
          feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
      }
    } else {
      feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
    }
    return feature;
  }

  var goToBrowserLocation = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(MainMap.showBrowserLocation);
    }
  }
  var showBrowserLocation = function(position) {
    goToLonLat(position.coords.longitude, position.coords.latitude, 18)
  }

  var getUriParameter = function(parameter) {
    return decodeURIComponent((new RegExp('[?|&]' + parameter + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
  }

  var degreesToRadians = function(degrees) {
    return degrees / 180 * Math.PI;
  }

  var mercatorLatitudeToY = function(latitude) {
    return Math.log(Math.tan(Math.PI / 4 + degreesToRadians(latitude) / 2));
  }

  /**
   * Calcola l'aspect ratio da applicare alla stampa da ESPG:3857
   * @param  {float} topLatitude    latitude top dell'area da stampare
   * @param  {float} bottomLatitude latitude bottom dell'area da stampare
   * @return {float}                Aspect Ratio
   */
  var aspectRatio = function(topLat, bottomLat) {
    return (mercatorLatitudeToY(topLat) - mercatorLatitudeToY(bottomLat)) / (degreesToRadians(topLat) - degreesToRadians(bottomLat));
  }

  var addContextMenu = function(items) {
    //Aggiunta del menu contestuale
    var contextmenu = new ContextMenu({
      width: 170,
      defaultItems: false, // defaultItems are (for now) Zoom In/Zoom Out
      items: items
    });
    mainMap.addControl(contextmenu);
  }

  return {
    addContextMenu: addContextMenu,
    addDrawInteraction: addDrawInteraction,
    addDrawDeleteInteraction: addDrawDeleteInteraction,
    addFeatureInfoToMap: addFeatureInfoToMap,
    addLayerToMap: addLayerToMap,
    addInfoToMap: addInfoToMap,
    addInfoPoint: addInfoPoint,
    setPrintBox: setPrintBox,
    addWKTToMap: addWKTToMap,
    aspectRatio: aspectRatio,
    clearLayerInfo: clearLayerInfo,
    clearLayerPrint: clearLayerPrint,
    deleteDrawFeatures: deleteDrawFeatures,
    render: render,
    getDrawFeature: getDrawFeature,
    getRequestInfo: getRequestInfo,
    getLayerInfo: getLayerInfo,
    getLegendUrl: getLegendUrl,
    getMap: getMap,
    getMapResolution: getMapResolution,
    getMapCenter: getMapCenter,
    getMapCenterLonLat: getMapCenterLonLat,
    getMapScale: getMapScale,
    getMapZoom: getMapZoom,
    getPrintCenter: getPrintCenter,
    getPrintCenterLonLat: getPrintCenterLonLat,
    getSRIDfromCRSName: getSRIDfromCRSName,
    goToBrowserLocation: goToBrowserLocation,
    goToLonLat: goToLonLat,
    goToExtent: goToExtent,
    goToGeometry: goToGeometry,
    getResolutionForScale: getResolutionForScale,
    layerIsPresent: layerIsPresent,
    loadConfig: loadConfig,
    log: log,
    processRequest: processRequest,
    processRequestAll: processRequestAll,
    removeAllLayersFromMap: removeAllLayersFromMap,
    removeLayerFromMap: removeLayerFromMap,
    removeDrawInteraction: removeDrawInteraction,
    removeDrawDeleteInteraction: removeDrawDeleteInteraction,
    setLayerVisibility: setLayerVisibility,
    showBrowserLocation: showBrowserLocation,
    startCopyCoordinate: startCopyCoordinate,
    stopCopyCoordinate: stopCopyCoordinate,
    toggleLayer: toggleLayer
  };

}());
