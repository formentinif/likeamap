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
        url: "states/" + appStateId,
        cache: false
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
        url: appStateJson,
        cache: false
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
        url: appStateUrl,
        cache: false
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
        url: "states/app-state.json",
        cache: false
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
      url: LamStore.getMapTemplateUrl(),
      cache: false
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
        url: url,
        cache: false
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
    lamDispatch("show-loader");
    var item = LamStore.getCurrentInfoItems().features[resultIndex];
    var relation = LamStore.getRelation(relationGid);
    var templateUrl = Handlebars.compile(relation.serviceUrlTemplate);
    var urlService = templateUrl(item.properties);

    var template = LamTemplates.getTemplate(relation.gid, relation.templateUrl, LamStore.getAppState().templatesRepositoryUrl);

    $.ajax({
      dataType: "jsonp",
      url: urlService,
      jsonp: true,
      cache: false,
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
        LamStore.showContentInfoWindow(title, body);
        lamDispatch("hide-loader");
      },
      error: function(jqXHR, textStatus, errorThrown) {
        lamDispatch({
          eventName: "log",
          message: "LamSearchTools: unable to complete response"
        });
        lamDispatch("hide-loader");
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

  let toggleLayersInGroup = function(gid) {
    let groupLayer = getLayer(gid);
    let icon = $("#" + gid + "_c");
    let visibility = !icon.hasClass("lam-checked");
    if (groupLayer && groupLayer.layers) {
      groupLayer.layers.forEach(function(layer) {
        LamMap.setLayerVisibility(layer.gid, visibility);
        LamStore.setLayerVisibility(layer.gid, visibility);
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
  var getQueryLayers = function() {
    let layers = getQueryLayersArray(appState.layers);
    layers.sort(SortByLayerName);
    return layers;
  };

  /**
   * Function needed for getting query layers recursively
   * @param {Object} layers
   */
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

  /**
   * Function needed for getting search layers recursively
   * @param {Object} layers
   */
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

  /**
   * Get Group Layer bu Layer Gid
   * @param {string} gid Layer gid
   */
  var getGroupLayerByLayerGid = function(gid) {
    var layerGroupsFound = [];
    debugger;
    appState.layers.forEach(function(layer) {
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
  var getGroupLayerByLayerGidArray = function(layerGroup, gid) {
    var layerFound = null;
    layerGroup.layers.forEach(function(layer) {
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
   * Dragging helper
   * @param {Object} elmnt
   */
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
          cache: false,
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
          url: url,
          cache: false
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

  let showContentInfoWindow = function(title, body, bodyMobile, htmlElement) {
    if (!htmlElement) htmlElement = "info-window";
    if (!bodyMobile) bodyMobile = body;
    $("#" + htmlElement + "__content").html(body);
    $("#" + htmlElement + "__title").html(title);
    $("#" + htmlElement + "").show();
    // if (!LamStore.isMobile()) {
    //   LamToolbar.toggleToolbarItem(htmlElement, true);
    // } else {
    //   $("#info-tooltip").show();
    //   $("#info-tooltip").html(bodyMobile);
    // }
  };

  return {
    doLogin: doLogin,
    dragElement: dragElement,
    init: init,
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
    showContentInfoWindow: showContentInfoWindow,
    showRelation: showRelation,
    toggleLoader: toggleLoader,
    toggleLayersInGroup: toggleLayersInGroup,
    resetInitialLayers: resetInitialLayers,
    hideInfoWindow: hideInfoWindow,
    setLayerVisibility: setLayerVisibility,
    toggleLayer: toggleLayer
  };
})();
