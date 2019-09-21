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
    if (!appState.currentInfoItems) {
      appState.currentInfoItems = [];
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

  var showInfoItems = function(featureInfoCollection) {
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

    this.showInfoWindow(title, body);
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
          body += '<div class="lk-warning lk-mb-2 lk-p-2">' + AppResources.risultati_non_trovati + "</div>";
        }
        AppStore.showInfoWindow(title, body);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        dispatch({
          eventName: "log",
          message: "SearchTools: unable to complete response"
        });
      }
    });
  };

  var showInfoWindow = function(title, body) {
    AppToolbar.toggleToolbarItem("info-results", true);
    $("#info-results__content").html(body);
    $("#info-results__title").html(title);
    $("#info-results").show();
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
    showInfoWindow(layerName, html);
    return true;
  };

  var toggleLoader = function(visibility) {
    if (visibility) {
      $("#app-loader").removeClass("lk-hidden");
    } else {
      $("#app-loader").addClass("lk-hidden");
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

    $("#map-container").removeClass("lk-hidden");

    //definizione dei loghi
    if (state.logoUrl) {
      $("#lk-logo__img").attr("src", state.logoUrl);
    }
    if (state.logoPanelUrl) {
      $("#menu-panel__logo-img").attr("src", state.logoPanelUrl);
      $("#menu-panel__logo").removeClass("lk-hidden");
    }

    //inizializzazione dell appstore
    AppStore.init();
    AppStore.showAppTools();
    //inizializzazione della mappa
    AppMap.render("map", appState);
    //carico i templates
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
    AppLayerTree.render("layer-tree", initialAppState.layers);
    for (var i = 0; i < initialAppState.layers.length; i++) {
      dispatch({
        eventName: "set-layer-visibility",
        gid: initialAppState.layers[i].gid,
        visibility: parseInt(initialAppState.layers[i].visible)
      });
      if (initialAppState.layers[i].layers) {
        for (var ki = 0; ki < initialAppState.layers[i].layers.length; ki++) {
          dispatch({
            eventName: "set-layer-visibility",
            gid: initialAppState.layers[i].layers[ki].gid,
            visibility: parseInt(initialAppState.layers[i].layers[ki].visible)
          });
        }
      }
    }
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

  var getCurrentInfoItems = function() {
    return AppStore.getAppState().currentInfoItems;
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
    showInfoItems: showInfoItems,
    showInfoWindow: showInfoWindow,
    showAppTools: showAppTools,
    showRelation: showRelation,
    toggleLoader: toggleLoader,
    resetInitialLayers: resetInitialLayers,
    hideInfoWindow: hideInfoWindow,
    setLayerVisibility: setLayerVisibility,
    toggleLayer: toggleLayer
  };
})();
