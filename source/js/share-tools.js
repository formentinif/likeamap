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

var ShareTools = (function() {
  var isRendered = false;

  var init = function init() {
    //events binding
    Dispatcher.bind("create-share-url", function(payload) {
      ShareTools.createShareUrl();
    });

    Dispatcher.bind("show-share-url-query", function(payload) {
      ShareTools.createShareUrl();
      ShareTools.setShareUrlQuery(ShareTools.writeUrlShare());
    });

    Dispatcher.bind("show-share", function(payload) {
      AppToolbar.toggleToolbarItem("share-tools");
      dispatch("clear-layer-info");
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
    dispatch("show-share-url-query");
  };

  var templateShare = function() {
    template = "";
    //pannello ricerca via
    if (!AppStore.getAppState().logoPanelUrl) {
      template += '<h4 class="lam-title">Condividi</h4>';
    }
    template += '<div class="lam-card z-depth-2">';

    //template += 'Crea link da condividere con i tuoi colleghi';
    template += '<div class="div-20"></div>';
    template += '<h4 class="lam-title-h4">Link breve</h4>';
    template += "<p>Il link breve condivide la posizione e i layer attivi.</p>";

    template += '<input type="text" class="" id="share-tools__input-query"/>';
    template += '<div class="div-20"></div>';

    template += '<div class="row">';
    template += '<div class="col s6"><a id="share-tools__url-query" target="_blank" class="waves-effect waves-light btn btn-small">Apri</a></div>';
    template +=
      '<div class="col s6"><a id="share-tools__copy-url-query" class=" waves-effect waves-light btn btn-small fake-link" target="_blank" >Copia</a></div>';
    template += "</div>";

    template += '<div class="div-20"></div>';
    template += "<div id='share-tools__create_tool' class='";
    if (!AppStore.getAppState().modules["map-tools-create-url"]) {
      template += " lam-hidden ";
    }
    template += "'>";
    template += '<h4 class="lam-title-h4">Mappa</h4>';
    template += "<p>La mappa condivide la posizione, i layer attivi e i tuoi disegni.</p>";
    //template += 'Crea link da condividere con i tuoi colleghi';
    template += '<button id="share-tools__create-url" onclick="ShareTools.createUrl(); return false;" class="waves-effect waves-light btn">Crea mappa</button>';

    template += '<div id="share-tools__content" class="lam-hidden">';

    //template += '<div class="mdl-textfield mdl-js-textfield">';
    template += '<div class="div-20"></div>';
    template += '<input type="text" class="" id="share-tools__input-url"/>';
    template += '<div class="div-20"></div>';

    template += '<div class="row">';
    template += '<div class="col s6"><a id="share-tools__url" target="_blank" >Apri</a></div>';
    template += '<div class="col s6"><a id="share-tools__copy-url" class="fake-link" target="_blank" >Copia</a></div>';
    template += "</div>";
    template += "</div>";

    //template += '<button id="share-tools__copy-url"  class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect lam-input-margin-right">Copia</button>';
    //template += '<button id="share-tools__email-url" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">Email</button>';
    //template += '</div>';
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
    Dispatcher.dispatch("create-share-url");
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

    var clipboard = new Clipboard("#share-tools__copy-url", {
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

    var clipboard = new Clipboard("#share-tools__copy-url-query", {
      text: function(trigger) {
        return shareLink;
      }
    });
  };

  var createShareUrl = function() {
    let appState = AppStore.getAppState();

    //invio una copia dell'appstate con gli attuali valori che sarà saòvato per la condivisione
    var centerMap = AppMap.getMapCenter();
    centerMap = ol.proj.transform([centerMap[0], centerMap[1]], "EPSG:3857", "EPSG:4326");

    appState.mapLon = centerMap[0];
    appState.mapLat = centerMap[1];
    appState.mapZoom = AppMap.getMapZoom();
    appState.drawFeatures = AppMap.getDrawFeature();

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
   * Genera l'url da copiare per visualizzare lo stato dell'applicazione solo tramite querystring
   * @return {null} Nessun valore restituito
   */
  var writeUrlShare = function() {
    let appState = AppStore.getAppState();
    //posizione
    var qPos = "";
    var center = AppMap.getMapCenterLonLat();
    qPos += "lon=" + center[0] + "&lat=" + center[1];
    qPos += "&zoom=" + AppMap.getMapZoom();
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