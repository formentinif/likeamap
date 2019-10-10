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

//definizione e inizializzazione del Dispatcher
var Dispatcher = (function() {
  var init = function functionName() {
    this.bind("log", function(payload) {
      console.log("log", payload);
    });

    this.bind("show-menu", function(payload) {
      AppToolbar.showMenu();
    });

    this.bind("hide-menu", function(payload) {
      AppToolbar.hideMenu();
    });

    this.bind("reset-tools", function(payload) {
      AppToolbar.resetTools();
    });

    this.bind("stop-copy-coordinate", function(payload) {
      MapTools.stopCopyCoordinate();
    });

    this.bind("clear-layer-info", function(payload) {
      AppMapInfo.clearLayerInfo();
      AppMapTooltip.hideMapTooltip();
    });

    // this.bind("show-tool", function(payload) {
    //   if (payload.tool == "layers") {
    //     AppToolbar.toggleToolbarItem("layer-tree");
    //   }
    //   if (payload.tool.indexOf("print") > -1) {
    //     AppToolbar.toggleToolbarItem("print-tools");
    //   }
    //   if (payload.tool.indexOf("share") > -1) {
    //     AppToolbar.toggleToolbarItem("share-tools");
    //   }
    //   if (payload.tool.indexOf("map") > -1) {
    //     AppToolbar.toggleToolbarItem("map-tools");
    //   }
    //   if (payload.tool.indexOf("draw") > -1) {
    //     AppToolbar.toggleToolbarItem("draw-tools");
    //   }
    //   if (payload.tool.indexOf("search") > -1) {
    //     AppToolbar.toggleToolbarItem("search-tools");
    //     //verifica dei layers
    //     if (payload.tool.indexOf("search-layers") > -1) {
    //       var arrSearch = payload.tool.split(",");
    //       setTimeout(function() {
    //         SearchTools.showSearchLayers();
    //         if (arrSearch.length > 1) {
    //           SearchTools.selectLayer(arrSearch[1]);
    //         }
    //       }, 1000);
    //     }
    //   }
    // });

    this.bind("hide-menu-mobile", function(payload) {
      if (AppStore.isMobile()) {
        AppStore.hideMenu();
      }
    });

    this.bind("hide-info-window", function(payload) {
      AppStore.hideInfoWindow();
      AppMapInfo.clearLayerInfo();
    });

    this.bind("hide-editor-window", function(payload) {
      EditorTools.hideEditorWindow();
    });

    this.bind("hide-loader", function(payload) {
      AppStore.toggleLoader(false);
    });

    this.bind("show-loader", function(payload) {
      AppStore.toggleLoader(true);
    });

    this.bind("live-reload", function(payload) {
      AppStore.liveReload(payload.appState);
    });

    this.bind("show-legend", function(payload) {
      AppStore.showLegend(payload.gid, payload.scaled);
    });

    this.bind("search-address", function(payload) {
      AppStore.searchAddress(payload.data, "AppStore.processAddress");
    });

    this.bind("zoom-lon-lat", function(payload) {
      AppMap.goToLonLat(payload.lon, payload.lat, payload.zoom);
    });

    this.bind("zoom-geometry", function(payload) {
      let geometryOl = AppMap.convertGeometryToOl(payload.geometry, AppMapEnums.geometryFormats().GeoJson);
      AppMap.goToGeometry(geometryOl);
    });

    this.bind("zoom-info-feature", function(payload) {
      try {
        let feature = AppStore.getCurrentInfoItems().features[payload.index];
        let layer = AppStore.getLayer(feature.layerGid);
        let featureOl = AppMap.convertGeoJsonFeatureToOl(feature);
        featureOl = AppMap.transform3857(featureOl, feature.srid);
        AppMap.goToGeometry(featureOl.getGeometry());
        let tooltip = AppTemplates.getLabelFeature(feature.properties, layer.labelField, layer.layerName);
        if (tooltip) {
          dispatch({ eventName: "show-map-tooltip", geometry: featureOl.getGeometry().getCoordinates(), tooltip: tooltip });
        }
        dispatch({
          eventName: "set-layer-visibility",
          gid: feature.layerGid,
          visibility: 1
        });
        dispatch({
          eventName: "flash-feature",
          feature: feature
        });
      } catch (error) {
        dispatch({ eventName: "log", message: error });
      }
    });

    this.bind("add-wkt-info-map", function(payload) {
      AppMapInfo.addWktInfoToMap(payload.wkt);
    });

    this.bind("add-feature-info-map", function(payload) {
      AppMapInfo.addFeatureInfoToMap(payload.geometry);
    });

    this.bind("toggle-layer", function(payload) {
      AppMap.toggleLayer(payload.gid);
      AppStore.toggleLayer(payload.gid);
    });

    this.bind("set-layer-visibility", function(payload) {
      AppMap.setLayerVisibility(payload.gid, payload.visibility);
      AppStore.setLayerVisibility(payload.gid, payload.visibility);
    });

    this.bind("reset-layers", function(payload) {
      AppStore.resetInitialLayers();
    });

    this.bind("start-copy-coordinate", function(payload) {
      AppMap.startCopyCoordinate();
    });

    this.bind("map-click", function(payload) {
      MapTools.addCoordinate(payload.lon, payload.lat);
    });

    this.bind("remove-info", function(payload) {
      AppMapInfo.clearLayerInfo();
    });

    this.bind("add-info-point", function(payload) {
      let geometryOl = new ol.geom.Point([payload.lon, payload.lat]);
      let featureOl = new ol.Feature({
        geometry: geometryOl
      });
      featureOl.srid = 4326;
      AppMapInfo.addFeatureInfoToMap(featureOl);
    });

    this.bind("init-map-app", function(payload) {
      appInit();
    });

    this.bind("map-move-end", function(payload) {
      ShareTools.hideUrl();
      ShareTools.setShareUrlQuery(ShareTools.writeUrlShare());
    });

    this.bind("map-zoom-end", function(payload) {
      ShareTools.hideUrl();
      ShareTools.setShareUrlQuery(ShareTools.writeUrlShare());
    });

    this.bind("map-zoom-in", function(payload) {
      AppMap.zoomIn();
    });

    this.bind("map-zoom-out", function(payload) {
      AppMap.zoomOut();
    });

    this.bind("map-browser-location", function(payload) {
      AppMap.goToBrowserLocation();
    });

    this.bind("do-login", function(payload) {
      AppStore.doLogin(payload.username, payload.password);
    });

    this.bind("open-url-location", function(payload) {
      AppStore.openUrlTemplate(payload.urlTemplate);
    });

    this.bind("reverse-geocoding", function(payload) {
      //conversione coordinate
      AppMap.getRequestInfo(payload.coordinate, null, false);
    });

    this.bind("show-reverse-geocoding-result", function(payload) {
      //conversione coordinate
      AppToolbar.toggleToolbarItem("search-tools", true);
      SearchTools.showSearchLayers();
      SearchTools.displayGenericResults(payload.results);
    });

    this.bind("enable-map-info", function(payload) {
      AppStore.setInfoClickEnabled(true);
    });

    this.bind("disable-map-info", function(payload) {
      AppStore.setInfoClickEnabled(false);
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

  var dispatch = function dispatch(payload) {
    if (typeof payload == "string") {
      payload = {
        eventName: payload
      };
    }
    Dispatcher.trigger(payload.eventName, payload);
  };

  return {
    dispatch: dispatch,
    init: init
  };
})();

MicroEvent.mixin(Dispatcher);
Dispatcher.init();

var AppResources = {
  risultati_non_trovati: "Non sono stati trovati risultati"
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

var AppStore = (function() {
  var appState = null;
  var initialAppState = null;
  var authToken = null;
  let infoClickEnabled = true;

  var init = function() {
    //normalizing appstate
    appState = normalizeAppState(appState);
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
          SearchTools.updateComuniNM(data);
        })
        .fail(function(data) {
          dispatch({
            eventName: "log",
            message: "AppStore: Unable to load comuni from rest service"
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
      $("#menu-toolbar__layer-tree").toggle(appState.modules["layer-tree"]);
      $("#menu-toolbar__search-tools").toggle(appState.modules["search-tools"]);
      $("#menu-toolbar__print-tools").toggle(appState.modules["print-tools"]);
      $("#menu-toolbar__share-tools").toggle(appState.modules["share-tools"]);
      $("#menu-toolbar__map-tools").toggle(appState.modules["map-tools"]);
      $("#menu-toolbar__draw-tools").toggle(appState.modules["draw-tools"]);
      $("#menu-toolbar__gps-tools").toggle(appState.modules["gps-tools"]);
    }
  };

  var showRelation = function(relationGid, resultIndex) {
    var item = AppStore.getCurrentInfoItems().features[resultIndex];
    var relation = AppStore.getRelation(relationGid);
    var templateUrl = Handlebars.compile(relation.serviceUrlTemplate);
    var urlService = templateUrl(item.properties);

    var template = AppTemplates.getTemplate(relation.gid, relation.templateUrl, AppStore.getAppState().templatesRepositoryUrl);

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
            body += AppTemplates.processTemplate(template, props);
            if (!body) {
              body += AppTemplates.standardTemplate(props);
            }
            if (data.length > 1) {
              body += "<div class='div-10'></div>";
            }
          }
        }

        //single template not active by default
        if (template.multipleItems && propsList.length > 0) {
          body += AppTemplates.processTemplate(template, propsList);
        }
        if (data.length === 0) {
          body += '<div class="lam-warning lam-mb-2 lam-p-2">' + AppResources.risultati_non_trovati + "</div>";
        }
        AppMapInfo.showInfoWindow(title, body);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        dispatch({
          eventName: "log",
          message: "SearchTools: unable to complete response"
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
        urlImg = AppMap.getLegendUrl(gid, scaled);
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
        "<p class='mt-2'><a href='#' onclick=\"Dispatcher.dispatch({ eventName: 'show-legend', gid: '" +
        gid +
        "', scaled: false })\">Visualizza legenda completa</a></p>";
    }

    html += "<div>";
    var layer = AppStore.getLayer(gid);
    var layerName = "";
    if (layer) {
      layerName = layer.layerName;
    }
    AppMapInfo.showInfoWindow(layerName, html, "info-results");
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
        layerFound = AppStore.getLayerArray(layer.layers, gid);
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
        layerFound = AppStore.getLayerArrayByName(layer.layers, layerName);
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
    return AppStore.getLayerArray(appState.layers, gid);
  };

  /**
   * Restituisce il layer dal nome
   * @param  {string} layerName nome del layer
   * @return {object}     Layer
   */
  var getLayerByName = function(layerName) {
    return AppStore.getLayerArrayByName(appState.layers, layerName);
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
      if (layer.searchable) {
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
    AppStore.setInitialAppState(state);
    AppStore.setAppState(state);

    $("#map-container").removeClass("lam-hidden");

    //definizione dei loghi
    if (state.logoUrl) {
      $("#lam-logo__img").attr("src", state.logoUrl);
    }
    if (state.logoPanelUrl) {
      $("#menu-panel__logo-img").attr("src", state.logoPanelUrl);
      $("#menu-panel__logo").removeClass("lam-hidden");
    }

    //inizializzazione dell appstore
    AppStore.init();
    AppStore.showAppTools();
    //map init
    AppMap.render("map", appState);
    AppMapTooltip.init();
    //loading templates
    AppTemplates.init();
    //carico i layers
    AppLayerTree.init(function() {
      //carico gli strumenti di ricerca
      SearchTools.render(
        "search-tools",
        appState.searchProvider,
        appState.searchProviderAddressUrl,
        appState.searchProviderAddressField,
        appState.searchProviderHouseNumberUrl,
        appState.searchProviderHouseNumberField,
        getSearchLayers()
      );
      //carico gli strumenti di share
      ShareTools.render("share-tools", null);
      //carico gli strumenti di Stampa
      PrintTools.render("print-tools");
      //carico gli strumenti di mappa
      MapTools.render("map-tools");
      //carico gli strumenti di disegno
      DrawTools.render("draw-tools");
      if (appState.modules["select-tools"]) {
        SelectTools.render(getQueryLayers());
      }
    });

    AppToolbar.init();

    //eseguo il callback
    callback();
  };

  /**
   * Ricarica i livelli della mappa
   * @return {null}
   */
  var liveReload = function(newAppState) {
    AppStore.setAppState(newAppState);
    AppStore.showAppTools();
    AppLayerTree.render("layer-tree", newAppState.layers);
    AppMap.removeAllLayersFromMap();
    AppMap.loadConfig(newAppState);
  };

  var mapReload = function() {
    AppLayerTree.render("layer-tree", appState.layers);
    AppMap.removeAllLayersFromMap();
    AppMap.loadConfig(appState);
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
      dispatch({
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
        AuthTools.hideLogin();
        break;
      case "basic":
        //adding the base64 token
        appState.authentication.authToken = window.btoa(username + ":" + password);
        AuthTools.hideLogin();
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
        AuthTools.hideLogin();
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
            AuthTools.hideLogin();
          })
          .fail(function(data) {
            AuthTools.showError();
            dispatch({
              eventName: "log",
              message: "AppStore: Unable to autheticate user"
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
    var ll = AppMap.getMapCenterLonLat();
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
    return AppStore.getAppState().currentInfoItems;
  };

  let getCurrentInfoItem = function(index) {
    return AppStore.getAppState().currentInfoItems.features[index];
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
    getSearchLayers: getSearchLayers,
    getRelations: getRelations,
    getRelation: getRelation,
    guid: guid,
    setInfoClickEnabled: setInfoClickEnabled,
    isMobile: isMobile,
    mapInit: mapInit,
    mapReload: mapReload,
    liveReload: liveReload,
    openUrlTemplate: openUrlTemplate,
    setAppState: setAppState,
    setInitialAppState: setInitialAppState,
    showLegend: showLegend,
    showAppTools: showAppTools,
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

var AppLayerTree = (function() {
  let treeDiv = "layer-tree";
  let isRendered = false;
  let layerGroupPrefix = "lt";
  //let layerGroupItemPrefix = "lti";
  //let layerGroupItemIconPrefix = "ltic";
  let layerUriCount = 0;
  let countRequest = 0;

  var init = function(callback) {
    //carico i layer
    countRequest = 0;
    AppStore.getAppState().layers.forEach(function(layer) {
      loadLayersUri(layer, callback);
    });
    if (layerUriCount === 0) {
      //no ajax request sent, loading all json immediately
      render(treeDiv, AppStore.getAppState().layers);
      callback();
    }

    //events binding
    Dispatcher.bind("show-layers", function(payload) {
      AppToolbar.toggleToolbarItem("layer-tree");
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
          dispatch({
            eventName: "log",
            message: "Layer Tree: Unable to load layers " + layer.layersUri
          });
        })
        .always(function(data) {
          countRequest--;
          if (countRequest === 0) {
            render(treeDiv, AppStore.getAppState().layers);
            AppStore.setInitialAppState(AppStore.getAppState());
            AppMap.loadConfig(AppStore.getAppState()); //reloading layer state
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
    if (!AppStore.getAppState().logoPanelUrl) {
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
      '<button class="btn-floating btn-small waves-effect waves-light right" alt="Reset dei layer" title="Reset dei layer" onClick="Dispatcher.dispatch({eventName:\'reset-layers\'})"><i class="material-icons">close</i></button>';
    output += "</div>";
    output += '<div class="layertree-item layertree-item-bottom lam-menu-scroll-padding"></div>'; //spaziatore
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
      '<i title="Informazioni sul layer" class="fas fa-info-circle fa-lg fa-pull-right layertree-icon icon-base-info" onclick="Dispatcher.dispatch({ eventName: \'show-legend\', gid: \'{0}\', scaled: true })"></i>',
      layer.gid
    );
    output += formatString(
      '<i title="Mostra/Nascondi layer" id="{0}_c" class="far {1} fa-lg fa-fw layertree-icon icon-base-info fa-pull-right " onclick="AppLayerTree.toggleCheck(\'{0}_c\');Dispatcher.dispatch({eventName:\'toggle-layer\',gid:\'{2}\'})"></i>',
      layerId,
      layer.visible ? "fa-check-square" : "fa-square",
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
      '<div  class="layertree-item__title lam-background {1} {3}"><i id="{0}_i" class="fas {2} fa-fw lam-pointer" onclick="AppLayerTree.toggleGroup(\'{0}\');"></i>',
      groupId,
      groupLayer.color,
      groupLayer.visible ? "fa-minus-square" : "fa-plus-square",
      groupLayer.nestingStyle ? "layertree-item__title--" + groupLayer.nestingStyle : ""
    );
    output += "<span>" + groupLayer.layerName + "</span>";
    output += "</div>";
    output += formatString(
      '<div id="{0}_u" class="layertree-item__layers layertree--{1}">',
      groupId,
      groupLayer.visible ? "visible" : "hidden"
    );
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

  var toggleCheck = function(iconId, groupId) {
    const item = "#" + iconId;
    if ($(item).hasClass("fa-square")) {
      $(item).removeClass("fa-square");
      $(item).addClass("fa-check-square");
      $("#" + groupId).addClass("layertree-layer--selected");
      return;
    }
    if ($(item).hasClass("fa-check-square")) {
      $(item).removeClass("fa-check-square");
      $(item).addClass("fa-square");
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
      if ($(item).hasClass("layertree--visible")) {
        $(item).removeClass("layertree--visible");
        $(item).addClass("layertree--hidden");
      }
    }
    const icon = "#" + groupName + "_i";
    if ($(icon).hasClass("fa-plus-square")) {
      $(icon).removeClass("fa-plus-square");
      $(icon).addClass("fa-minus-square");
      return;
    } else {
      if ($(icon).hasClass("fa-minus-square")) {
        $(icon).removeClass("fa-minus-square");
        $(icon).addClass("fa-plus-square");
        return;
      }
    }
  };

  let formatString = function() {
    var str = arguments[0];
    for (k = 0; k < arguments.length - 1; k++) {
      str = str.replace(new RegExp("\\{" + k + "\\}", "g"), arguments[k + 1]);
    }
    return str;
  };

  return {
    formatString: formatString,
    render: render,
    init: init,
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

let AppTemplates = (function() {
  let templates = [];

  let init = function init() {
    //Ciclo i livelli che non hanno un template
    let tempLayers = AppStore.getAppState().layers;
    const repoTemplatesUrl = AppStore.getAppState().templatesRepositoryUrl;
    const tempRelations = AppStore.getAppState().relations;
    loadLayersTemplates(tempLayers, repoTemplatesUrl);
    loadRelationsTemplates(tempRelations, repoTemplatesUrl);
  };

  let loadLayersTemplates = function(tempLayers, repoTemplatesUrl) {
    for (let i = 0; i < tempLayers.length; i++) {
      let groupLayer = tempLayers[i];
      if (groupLayer.layers) {
        for (let li = 0; li < groupLayer.layers.length; li++) {
          //il layer deve essere selezionabile
          if (!groupLayer.layers[li].layer || !groupLayer.layers[li].queryable) {
            continue;
          }
          let templateUrl = getTemplateUrl(
            groupLayer.layers[li].gid,
            groupLayer.layers[li].templateUrl,
            repoTemplatesUrl
          );
          let template = templates.filter(function(el) {
            return el.templateUrl === templateUrl;
          });
          if (template.length === 0) {
            //aggiungo il layer vi ajax
            loadTemplateAjax(templateUrl);
          }
        }
      }
    }
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
        dispatch({
          eventName: "log",
          message: "AppStore: Unable to load template"
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
        dispatch({
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
      body += "<div class='row lam-feature-heading' ><div class='col s12'>" + layer.layerName;
      if (layer.labelField) {
        body += " - " + getLabelFeature(props, layer.labelField);
      }
      body += "</div></div>";
    }
    for (let propertyName in props) {
      body +=
        "<div class='lam-feature-row row lam-mb-1'>" +
        "<div class='lam-feature-title col s6'>" +
        propertyName +
        ":</div>" +
        "<div class='lam-feature-content col s6'>" +
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
      '<i title="Centra sulla mappa" class="fas fa-map-marker-alt fa-lg lam-feature__icon" onclick="Dispatcher.dispatch({ eventName: \'zoom-info-feature\', index: \'' +
      index +
      "' })\"></i>";
    let feature = AppStore.getCurrentInfoItem(index);
    let centroid = AppMap.getLabelPoint(feature.geometry.coordinates);
    let geometryOl = AppMap.convertGeometryToOl(
      {
        coordinates: centroid,
        type: "Point",
        srid: 3857
      },
      AppMapEnums.geometryFormats().GeoJson
    );
    centroid = AppMap.transformGeometrySrid(geometryOl, 3857, 4326);
    icons +=
      //"<a target='_blank' href='https://www.google.com/maps/@?api=1&map_action=map&center=" +
      "<a target='_blank' href='https://www.google.com/maps/search/?api=1&query=" +
      centroid.flatCoordinates[1] +
      "," +
      centroid.flatCoordinates[0] +
      "&'><i title='Apri in Google' class='fab fa-google fa-lg lam-feature__icon'></i></a>";
    //https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=48.857832,2.295226&heading=-45&pitch=38&fov=80
    icons +=
      //"<a target='_blank' href='https://www.google.com/maps/@?api=1&map_action=map&center=" +
      "<a target='_blank' href='https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" +
      centroid.flatCoordinates[1] +
      "," +
      centroid.flatCoordinates[0] +
      "&'><i title='Apri in Google' class='fas fa-street-view fa-lg lam-feature__icon'></i></a>";
    icons += "</div>";
    return icons;
  };

  let relationsTemplate = function(relations, props, index) {
    let result = "";
    if (relations.length > 0) {
      result += '<div class="">';
      relations.map(function(relation) {
        result += '<div class="lam-mb-2 col s12">';
        result +=
          '<a href="#" onclick="AppStore.showRelation(\'' +
          relation.gid +
          "', " +
          index +
          ')">' +
          relation.labelTemplate +
          "</option>"; //' + relation.gid + ' //relation.labelTemplate
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
      str += "<div class='lam-h6'>" + template.title + "</div>";
      str += "<table class='lam-table lam-mb-3'>";
      for (let i = 0; i < template.fields.length; i++) {
        let field = template.fields[i];
        switch (field.type) {
          case "int":
            str += "<tr><td class='lam-strong'>" + field.label + "</td><td>{{{" + field.field + "}}}</td></tr>";
            break;
          case "string":
            str += "<tr><td class='lam-strong'>" + field.label + "</td><td>{{{" + field.field + "}}}</td></tr>";
            break;
          case "yesno":
            str += "<tr><td class='lam-strong'>" + field.label + "</td>";
            str += "<td>{{#if " + field.field + "}}Sì{{else}}No{{/if}}</td></tr>";
            break;
          /*  case "moreinfo":
            str +=
              '<tr><td colspan="2"><a href="#" onclick="dispatch({ eventName: \'more-info\', gid: \'{{' +
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
            str += '<tr><td colspan="2"><a href="{{' + field.field + '}}" target="_blank">' + field.label + "</a></td>";
            break;
        }
      }
      str += "</table>";
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
      dispatch({ eventName: "log", data: "Unable to compute label field " + labelName });
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
    AppStore.getAppState().currentInfoItems = featureInfoCollection;
    let index = 0;
    featureInfoCollection.features.forEach(function(feature) {
      let props = feature.properties ? feature.properties : feature;
      let layer = AppStore.getLayer(feature.layerGid);
      let template = AppTemplates.getTemplate(
        feature.layerGid,
        layer.templateUrl,
        AppStore.getAppState().templatesRepositoryUrl
      );
      let tempBody = AppTemplates.processTemplate(template, props, layer);
      if (!tempBody) {
        tempBody += AppTemplates.standardTemplate(props, layer);
      }
      //sezione relations
      let layerRelations = AppStore.getRelations().filter(function(relation) {
        return $.inArray(feature.layerGid, relation.layerGids) >= 0;
      });
      tempBody += AppTemplates.relationsTemplate(layerRelations, props, index);
      tempBody += AppTemplates.featureIconsTemplate(index);

      body += "<div class='lam-feature z-depth-1 lam-mb-3'>" + tempBody + "</div>";
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
      let layer = AppStore.getLayer(feature.layerGid);
      let tempBody = "";
      let tooltip = AppTemplates.getLabelFeature(feature.properties, layer.labelField, layer.layerName);
      tempBody += "<div class='z-depth-2 lam-info-tooltip__content'>";
      tempBody += "<div class='row'>";
      tempBody += "<div class='col-12'>";
      tempBody += tooltip;
      tempBody += "</div>";
      tempBody += "<div class='col-12'>";
      tempBody +=
        '<button class="btn-floating btn-small waves-effect waves-light lam-info-expander" alt="Apri dettagli" title="Apri dettagli" onclick="Dispatcher.dispatch(\'show-mobile-info-results\')">';
      tempBody += "<i class='fas fa-chevron-up'></i>";
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
let AppToolbar = (function() {
  "use strict";

  var easingTime = 300;
  var currentToolbarItem = "";

  let resetToolsPayloads = [{ eventName: "stop-copy-coordinate" }];

  let init = function() {
    //eseguo degli aggiustamente in caso di browser mobile
    if (AppStore.isMobile()) {
      $("#menu-toolbar").css("padding-left", "10px");
      $(".lam-menu-toolbar-bottom button").css("margin-right", "0px");
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
      dispatch(payload);
    });
  };

  let addResetToolsEvent = function(event) {
    resetToolsPayloads.push(event);
  };

  let showMenu = function(toolId) {
    $("#menu-panel").animate(
      {
        width: "show"
      },
      {
        duration: easingTime,
        complete: function() {
          if (toolId) {
            $("#" + toolId).show();
          }
          $("#menu-panel__open").hide();
        }
      }
    );
  };

  /**
   * Nasconde il pannello del menu
   */
  var hideMenu = function() {
    $("#menu-panel").animate(
      {
        width: "hide"
      },
      easingTime,
      function() {
        $("#menu-panel__open").show();
      }
    );
  };

  var toggleToolbarItem = function(toolId, keepOpen) {
    AppStore.setInfoClickEnabled(true);
    //verifico se il pannello non è già selezionato
    if (currentToolbarItem != toolId) {
      //new tool selected
      currentToolbarItem = toolId;
      resetTools();
      $(".lam-menu-panel-content-item").hide();
      showMenu(toolId);
    } else {
      if ($("#menu-panel").css("display") == "none" || keepOpen) {
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
function dispatch(payload) {
  Dispatcher.dispatch(payload);
}

function appInit() {
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
        loadState(appState);
      })
      .fail(function() {
        //AppStore.mapInit();
        dispatch({
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
        loadState(appstate);
      })
      .fail(function() {
        dispatch({
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
        loadState(appstate);
      })
      .fail(function() {
        dispatch({
          eventName: "log",
          message: "Share: Impossibile caricare la mappa"
        });
      });
  }

  function loadState(appstate) {
    if (appstate.authentication.requireAuthentication) {
      AuthTools.render("login-container");
    }
    AppStore.mapInit(appstate, customFunctions);
  }
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
  //AppMap.addContextMenu(items);
}

function reverseGeocoding(obj) {
  dispatch({
    eventName: "reverse-geocoding",
    coordinate: obj.coordinate
  });
}
//inizializzazione della mappa
appInit();
