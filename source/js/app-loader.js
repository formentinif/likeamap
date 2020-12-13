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
   * @param {fucntion} callback Function to be called after the map is loaded
   */
  var appInit = function (callback) {
    registerHandlebarsHelpers();
    LamDom.domUpdatesFromState();

    //inizializzazione globale
    LamHandlebars.init();
    LamDom.init();
    LamRelations.init();
    LamTables.init();
    LamDom.showAppTools();
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
      LamSelectTools.render(getQueryLayers());
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

exports.LamLoader = LamLoader;
