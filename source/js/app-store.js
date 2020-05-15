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
   * Inverte la visualizzazione del layer
   * @param  {string} gid Identificativo del layer
   * @return {null}     Nessun valore restituito
   */
  var toggleLayer = function (gid) {
    let layer = getLayer(gid);
    if (layer) {
      layer.visible = 1 - layer.visible;
    }
    LamLayerTree.setCheckVisibility(gid, layer.visible);
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
  };

  var resetLayersArray = function (layers) {
    layers.forEach(function (layer) {
      lamDispatch({
        eventName: "set-layer-visibility",
        gid: layer.gid,
        visibility: parseInt(layer.visible),
      });
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

  let parseResponse = function (e) {};

  return {
    doLogin: doLogin,
    getAppState: getAppState,
    getAuthorizationHeader: getAuthorizationHeader,
    getCurrentInfoItem: getCurrentInfoItem,
    getCurrentInfoItems: getCurrentInfoItems,
    getGroupLayerByLayerGid: getGroupLayerByLayerGid,
    getInfoClickEnabled: getInfoClickEnabled,
    getInitialAppState: getInitialAppState,
    getLayer: getLayer,
    getLayerArray: getLayerArray,
    getLayerArrayByName: getLayerArrayByName,
    getLayerByName: getLayerByName,
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
