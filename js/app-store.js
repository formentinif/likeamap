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

var AppStore = (function() {
  var appState = null;
  var initialAppState = null;
  var authToken = null;
  var easingTime = 300;

  var panelContentItemSelected = "";

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

  /**
   * Resetta tutti i controlli mappa al cambio di menu
   * @return {null} La funzione non restituisce un valore
   */
  var resetTools = function() {
    MapTools.stopCopyCoordinate();
    MainMap.clearLayerInfo();
    MainMap.clearLayerPrint();
  };

  var showMenu = function(content) {
    resetTools();
    $("#menu-panel").animate(
      {
        width: "show"
      },
      {
        duration: easingTime,
        complete: function() {
          if (content) {
            $("#" + content).show();
          }
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
      easingTime
    );
  };

  var showMenuContent = function(content, keepOpen) {
    //verifico se il pannello non è già selezionato
    if (panelContentItemSelected != content) {
      panelContentItemSelected = content;
      $(".al-menu-panel-content-item").hide();
      showMenu(content);
    } else {
      if ($("#menu-panel").css("display") == "none" || keepOpen) {
        showMenu(content);
      } else {
        hideMenu();
        $("#" + content).hide();
      }
    }
    //resetto funzioni mappa
    Dispatcher.dispatch("unset-draw");
    switch (content) {
      case "share-tools":
        //resetto lo share tool
        ShareTools.render();
        break;
      case "print-tools":
        PrintTools.showPrintArea();
        break;
      default:
    }
  };

  var showInfoItem = function(data) {
    var title = "Risultati dell'interrogazione";
    var body = "";
    if (!data) {
      return;
    }
    if (!data.features) {
      data = [data];
    } else {
      data = data.features;
    }
    AppStore.getAppState().currentInfoItems = data;
    if (data.length > 0) {
      title += " (" + data.length + ")";
    }
    for (var i = 0; i < data.length; i++) {
      var props = data[i].properties ? data[i].properties : data[i];
      var template = AppTemplates.getTemplate(
        data[i].layerGid,
        data[i].templateUri,
        AppStore.getAppState().templatesRepositoryUrl
      );
      var tempBody = AppTemplates.processTemplate(template, props);
      if (!tempBody) {
        tempBody += AppTemplates.standardTemplate(props);
      }
      //sezione relations
      var layerRelations = AppStore.getRelations().filter(function(relation) {
        return relation.layerGid === data[i].layerGid;
      });
      tempBody += AppTemplates.relationsTemplate(layerRelations, props, i);

      if (data.length > 0) {
        tempBody += "<div class='div-20'/>";
      }
      body += tempBody;
    }
    this.showInfoWindow(title, body);
  };

  var showRelation = function(relationGid, resultIndex) {
    debugger;
    var item = AppStore.getCurrentInfoItems()[resultIndex];
    var relation = AppStore.getRelation(relationGid);
    var templateUrl = Handlebars.compile(relation.serviceUrlTemplate);
    var urlService = templateUrl(item.properties);
    var template = AppTemplates.getTemplate(
      relation.gid,
      relation.templateUri,
      AppStore.getAppState().templatesRepositoryUrl
    );

    $.ajax({
      dataType: "jsonp",
      url: urlService,
      jsonp: true,
      jsonpCallback: "parseResponse",
      success: function(data) {
        if (data.features) {
          data = data.features;
        }
        var title = "Relations";
        var body = "";
        if (!Array.isArray(data)) {
          data = [data];
        }
        for (let i = 0; i < data.length; i++) {
          var props = data[i].properties ? data[i].properties : data[i];
          body += AppTemplates.processTemplate(template, props);
          if (!body) {
            body += AppTemplates.standardTemplate(props);
          }
          if (data.length > 1) {
            body += "<div class='div-20'></div>";
          }
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

    /*
    var ajaxRelationRequest = function() {
      var deferred = Q.defer();
      $.get(urlService, "", deferred.resolve);
      return deferred.promise;
    };
    ajaxRelationRequest()
      .then(function(data) {
        debugger;
        var title = "Relations";
        var body = "";
        if (!Array.isArray(data)) {
          data = [data];
        }
        for (let i = 0; i < data.length; i++) {
          body += AppTemplates.processTemplate(template, data[i]);
          if (!body) {
            body += AppTemplates.standardTemplate(props);
          }
          if (data.length > 1) {
            body += "<div class='div-20'></div>";
          }
        }
        AppStore.showInfoWindow(title, body);
      })
      .fail(function() {
        dispatch({
          eventName: "log",
          message: "AppStore: show-relation" + err
        });
      });
      */
  };

  var showInfoWindow = function(title, body) {
    $("#info-window__title").html(title);
    $("#info-window__body").html(body);
    $("#info-window").show();
    $("#info-window").animate(
      {
        scrollTop: 0
      },
      "fast"
    );
  };

  var hideInfoWindow = function() {
    $("#info-window").hide();
  };

  var showLegend = function(gid) {
    var html = "<div>";
    var urlImg = "";

    //verifico che non ci sia un url custom
    var thisLayer = getLayer(gid);
    if (!thisLayer.hideLegend) {
      if (thisLayer.legendUrl) {
        urlImg = thisLayer.legendUrl;
      } else {
        urlImg = MainMap.getLegendUrl(gid);
      }

      if (urlImg) {
        html += "<img src='" + urlImg + "'>";
      }
    }
    if (thisLayer.attribution) {
      html += "<p>Dati forniti da " + thisLayer.attribution + "</p>";
    }
    html += "<div>";
    var layer = MainMap.getLayerInfo(gid);
    var layerName = "";
    if (layer) {
      layerName = layer.layerName;
    }
    showInfoWindow(layerName, html);
    return true;
  };

  var toggleLoader = function(visibility) {
    if (visibility) {
      $("#app-loader").removeClass("al-hidden");
    } else {
      $("#app-loader").addClass("al-hidden");
    }
  };

  /**
   * Inverte la visualizzazione del layer
   * @param  {string} gid Identificativo del layer
   * @return {null}     Nessun valore restituito
   */
  var toggleLayer = function(gid) {
    for (var i = 0; i < appState.layers.length; i++) {
      if (appState.layers[i].gid === gid) {
        if (appState.layers[i].visible === 0) {
          appState.layers[i].visible = 1;
        } else {
          appState.layers[i].visible = 0;
        }
      }
      if (appState.layers[i].layers) {
        for (var ki = 0; ki < appState.layers[i].layers.length; ki++) {
          if (appState.layers[i].layers[ki].gid === gid) {
            if (appState.layers[i].layers[ki].visible === 0) {
              appState.layers[i].layers[ki].visible = 1;
            } else {
              appState.layers[i].layers[ki].visible = 0;
            }
          }
        }
      }
    }
  };

  /**
   * Imposta la visibilità del layer
   * @param  {string} gid  Identificativo del layer
   * @param  {boolean} visibility Visibilità del layer da impostare
   * @return {null}  Nessun valore restituito
   */
  var setLayerVisibility = function(gid, visibility) {
    for (var i = 0; i < appState.layers.length; i++) {
      if (appState.layers[i].gid === gid) {
        appState.layers[i].visible = visibility;
      }
      if (appState.layers[i].layers) {
        for (var ki = 0; ki < appState.layers[i].layers.length; ki++) {
          if (appState.layers[i].layers[ki].gid === gid) {
            appState.layers[i].visible = visibility;
          }
        }
      }
    }
  };

  /**
   * Restituisce il layer dall'identificativo
   * @param  {string} gid identificativo del layer
   * @return {object}     Layer
   */
  var getLayer = function(gid) {
    for (var i = 0; i < appState.layers.length; i++) {
      if (appState.layers[i].gid === gid) {
        return appState.layers[i];
      }
      if (appState.layers[i].layers) {
        for (var ki = 0; ki < appState.layers[i].layers.length; ki++) {
          if (appState.layers[i].layers[ki].gid === gid) {
            return appState.layers[i].layers[ki];
          }
        }
      }
    }

    return null;
  };

  /**
   * Restituisce il layer dal nome
   * @param  {string} layerName nome del layer
   * @return {object}     Layer
   */
  var getLayerByName = function(layerName) {
    for (var i = 0; i < appState.layers.length; i++) {
      if (appState.layers[i].layer) {
        if ($.inArray(layerName, appState.layers[i].layer.split(":")) >= 0) {
          return appState.layers[i];
        }
      }
      if (appState.layers[i].layers) {
        for (var ki = 0; ki < appState.layers[i].layers.length; ki++) {
          if (appState.layers[i].layers[ki].layer) {
            if (
              $.inArray(
                layerName,
                appState.layers[i].layers[ki].layer.split(":")
              ) >= 0
            ) {
              return appState.layers[i].layers[ki];
            }
          }
        }
      }
    }

    return null;
  };

  /**
   * Genera l'url da copiare per visualizzare lo stato dell'applicazione solo tramite querystring
   * @return {null} Nessun valore restituito
   */
  var writeUrlShare = function() {
    //posizione
    var qPos = "";
    var center = MainMap.getMapCenterLonLat();
    qPos += "lon=" + center[0] + "&lat=" + center[1];
    qPos += "&zoom=" + MainMap.getMapZoom();
    //layers
    var qLayers = "";
    for (var i = 0; i < appState.layers.length; i++) {
      qLayers +=
        appState.layers[i].gid +
        ":" +
        parseInt(appState.layers[i].visible) +
        ",";
      if (appState.layers[i].layers) {
        for (var ki = 0; ki < appState.layers[i].layers.length; ki++) {
          qLayers +=
            appState.layers[i].layers[ki].gid +
            ":" +
            parseInt(appState.layers[i].layers[ki].visible) +
            ",";
        }
      }
    }
    var url = window.location.href;
    var arrUrl = url.split("?");
    return arrUrl[0] + "?" + qPos + "&layers=" + qLayers;
  };

  /**
   * Restituisce tutti i layer abilitati alla ricerca
   * @return {array} Array dei layer ricercarbili
   */
  var getSearchLayers = function() {
    var searchLayers = [];
    for (var i = 0; i < appState.layers.length; i++) {
      if (appState.layers[i].layers) {
        for (var ki = 0; ki < appState.layers[i].layers.length; ki++) {
          if (appState.layers[i].layers[ki].searchable) {
            searchLayers.push(appState.layers[i].layers[ki]);
          }
        }
      }
    }
    return searchLayers;
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
    //ricavo le dimensioni di Stampa
    appState.printPaper = paper;
    appState.printOrientation = orientation;
    appState.printFormat = format;
    appState.printTemplate = template;
    var paperDimension = PrintTools.getPaperSize(paper, orientation);
    appState.printWidth = paperDimension.width;
    appState.printHeight = paperDimension.height;

    //ricavo i dati della mappa per la stampa
    var resolution = MainMap.getResolutionForScale(scale);
    var center = MainMap.getPrintCenter();
    var centerLL = MainMap.getPrintCenterLonLat();
    //La scala viene ricalcolata in base ad un parametero di conversione locale
    //Questa parte è tutta rivedere
    var scale =
      PrintTools.getScale() *
      MainMap.aspectRatio(centerLL[1] * 1.12, centerLL[1] * 0.88);

    //
    appState.printCenterX = center[0];
    appState.printCenterY = center[1];
    appState.printScale = scale;
    appState.printDpi = 96;

    appState.printParams = {};
    appState.printParams.dummy = "null";

    var print = function() {
      var deferred = Q.defer();
      $.post(
        appState.restAPIUrl + "/api/print",
        {
          appstate: JSON.stringify(appState)
        },
        deferred.resolve
      );
      return deferred.promise;
    };

    print()
      .then(function(pdf) {
        window.location = appState.restAPIUrl + "/api/print/" + pdf.pdfName;
      })
      .fail(function() {
        //TODO completare fail
      });

    //invio la richiesta al servizio di print
  };

  var createShareUrl = function() {
    //invio una copia dell'appstate con gli attuali valori che sarà saòvato per la condivisione
    var centerMap = MainMap.getMapCenter();
    centerMap = ol.proj.transform(
      [centerMap[0], centerMap[1]],
      "EPSG:900913",
      "EPSG:4326"
    );

    appState.mapLon = centerMap[0];
    appState.mapLat = centerMap[1];
    appState.mapZoom = MainMap.getMapZoom();
    appState.drawFeatures = MainMap.getDrawFeature();

    //invio la richiesta
    var share = function() {
      var deferred = Q.defer();
      $.post(
        appState.restAPIUrl + "/api/share/",
        {
          appstate: JSON.stringify(appState)
        },
        deferred.resolve
      );
      return deferred.promise;
    };

    share()
      .then(function(data) {
        var url = data.Url;
        var appStateId = data.AppStateId;
        ShareTools.displayUrl(appStateId, url);
      })
      .fail(function() {
        dispatch({
          eventName: "log",
          message: "AppStore: create-share-url " + err
        });
      });
    //invio la richiesta al servizio di print
  };

  /**
   * mostra maggiori informazioni dell'oggetto selezionato
   * @param  {[type]} gid        identificativo dell'oggetto
   * @param  {[type]} url        parte dell'url da chiamare. La radice dell'url è sempre il sito attuale.
   * @param  {[type]} templateId id del template da richiamare per maggiori informazioni.
   * @return {null}            La funzione non restituisce un valore ma una promise
   
  var showMoreInfo = function(gid, url, layerGid) {
    //costruisco l'url da richiemare
    var urlArray = location.href.split("/");
    var baseUrl = urlArray[2];
    var urlService =
      "http://" + baseUrl.replace("#", "") + "/" + url + "/" + gid;
    //invio la richiesta
    var moreInfo = function() {
      var deferred = Q.defer();
      $.get(urlService, "", deferred.resolve);
      return deferred.promise;
    };
    moreInfo()
      .then(function(data) {
        var title = "Informazioni aggiuntive";
        var body = "";
        body = AppTemplates.processTemplate(template, data);
        if (!body) {
          body = AppTemplates.standardTemplate(props);
        }
        AppStore.showInfoWindow(title, body);
      })
      .fail(function() {
        dispatch({
          eventName: "log",
          message: "AppStore: more-info " + err
        });
      });
  };
 */

  var dragElement = function(elmnt) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(elmnt.id + "__title")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "__title").onmousedown = dragMouseDown;
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

    $("#map-container").removeClass("al-hidden");

    //inizializzazione dell appstore
    AppStore.init();

    AppStore.showAppTools();

    //inizializzazione della mappa
    MainMap.render("map", appState);

    //carico i templates
    AppTemplates.init();

    //carico i layers
    LayerTree.render("layer-tree", appState.layers);

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

    //eseguo degli aggiustamente in caso di browser mobile
    if (isMobile()) {
      $("#menu-toolbar__layer-tree").addClass("mdl-button--mini-fab");
      $("#menu-toolbar__search-tools").addClass("mdl-button--mini-fab");
      $("#menu-toolbar__print-tools").addClass("mdl-button--mini-fab");
      $("#menu-toolbar__share-tools").addClass("mdl-button--mini-fab");
      $("#menu-toolbar__map-tools").addClass("mdl-button--mini-fab");
      $("#menu-toolbar__draw-tools").addClass("mdl-button--mini-fab");
      $("#menu-toolbar__gps-tools").addClass("mdl-button--mini-fab");
      $("#menu-toolbar").height("50px");
      $("#menu-toolbar").css("padding-left", "10px");
      $(".al-menu-toolbar-bottom button").css("margin-right", "0px");
      easingTime = 0;
    } else {
      //definizione degli eventi jquery
      dragElement(document.getElementById("info-window"));
    }

    //nascondo il draw per dimensioni piccole
    if ($(window).width() < 640) {
      $("#menu-toolbar__draw-tools").hide();
    }

    //eseguo il callback
    callback();

    //TODO da modificare inizializzo l'editor
    try {
      EditorTools.init();
    } catch (e) {}
  };

  /**
   * Ricarica i livelli della mappa
   * @return {null}
   */
  var liveReload = function(newAppState) {
    AppStore.setAppState(newAppState);
    AppStore.showAppTools();
    LayerTree.render("layer-tree", newAppState.layers);
    MainMap.removeAllLayersFromMap();
    MainMap.loadConfig(newAppState);
  };

  /**
   * Resetta i layer alla situazione iniziale
   * @return {null} Nessun valore restituito
   */
  var resetInitialLayers = function() {
    LayerTree.render("layer-tree", initialAppState.layers);
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

  var isDrawing = function() {
    if ($("#menu-panel").css("display") == "none") {
      return false;
    }
    if (panelContentItemSelected == "draw-tools") {
      return true;
    }
    return false;
  };

  var doLogin = function(username, password) {
    switch (appState.authentication.authType) {
      case "anonymous":
        AuthTools.hideLogin();
        break;
      case "basic":
        //adding the base64 token
        appState.authentication.authToken = window.btoa(
          username + ":" + password
        );
        AuthTools.hideLogin();
        break;
      case "custom":
        //TODO implement custom auth url ancd object
        var url =
          getAppState().restAPIUrl +
          "/api/auth?username=" +
          username +
          "&password=" +
          password;
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
  };

  var openUrlTemplate = function(urlTemplate) {
    //credo delle proprietà standard
    var props = {};
    props.token = authToken.token;
    var ll = MainMap.getMapCenterLonLat();
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
    switch (appstate.authentication.authType) {
      case "basic":
        return "Basic " + appState.authentication.authToken;
      default:
        return appState.authentication.authToken;
    }
  };

  var getCurrentInfoItems = function() {
    return AppStore.getAppState().currentInfoItems;
  };

  return {
    createShareUrl: createShareUrl,
    doLogin: doLogin,
    init: init,
    hideMenu: hideMenu,
    getAppState: getAppState,
    getAuthorizationHeader: getAuthorizationHeader,
    getCurrentInfoItems: getCurrentInfoItems,
    getInitialAppState: getInitialAppState,
    getLayer: getLayer,
    getLayerByName: getLayerByName,
    getSearchLayers: getSearchLayers,
    getRelations: getRelations,
    getRelation: getRelation,
    isDrawing: isDrawing,
    isMobile: isMobile,
    mapInit: mapInit,
    liveReload: liveReload,
    openUrlTemplate: openUrlTemplate,
    printMap: printMap,
    setAppState: setAppState,
    setInitialAppState: setInitialAppState,
    showLegend: showLegend,
    showMenu: showMenu,
    showMenuContent: showMenuContent,
    showInfoItem: showInfoItem,
    showInfoWindow: showInfoWindow,
    showAppTools: showAppTools,
    showRelation: showRelation,
    toggleLoader: toggleLoader,
    resetInitialLayers: resetInitialLayers,
    //showMoreInfo: showMoreInfo,
    hideInfoWindow: hideInfoWindow,
    setLayerVisibility: setLayerVisibility,
    toggleLayer: toggleLayer,
    writeUrlShare: writeUrlShare
  };
})();
