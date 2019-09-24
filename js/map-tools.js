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

var MapTools = (function() {
  var isRendered = false;

  var init = function init() {
    //Events binding
    Dispatcher.bind("show-map-tools", function(payload) {
      AppToolbar.toggleToolbarItem("map-tools");
      if (AppToolbar.getCurrentToolbarItem() === "map-tools") {
        AppStore.setInfoClickEnabled(false);
      }
    });
  };

  var render = function(div) {
    var templateTemp = templateTools();
    var output = templateTemp();
    jQuery("#" + div).html(output);
    if (!isRendered) {
      init();
    }
    //forzo che il contenuto non sia visualizzato
    //
    //aggiungo la copia nel bottone

    var clipboard = new Clipboard("#search-tools__copy-url", {
      text: function(trigger) {
        return $("#map-tools__coordinate-textarea").val();
      }
    });

    isRendered = true;
  };

  var templateTools = function() {
    template = "";
    //pannello ricerca via
    if (!AppStore.getAppState().logoPanelUrl) {
      template += '<h4 class="lk-title">Strumenti</h4>';
    }
    template += '<div class="lk-card z-depth-2">';
    template += "<h5>Vai a..</h5>";
    template += '<div id="map-tools__lon-field" class="input-field" >';
    template += '<input id="map-tools__lon" class="mdl-textfield__input" type="number" step="any">';
    template += '<label class="mdl-textfield__label" for="map-tools__lon">Longitune</label>';
    template += "</div>";
    template += '<div id="map-tools__lat-field" class="input-field" >';
    template += '<input id="map-tools__lat" class="mdl-textfield__input" type="number" step="any">';
    template += '<label class="mdl-textfield__label" for="map-tools__lat">Latitudine</label>';
    template += "</div>";
    template += '<button id="search-tools__gotolonlat"  class="waves-effect waves-light btn" onclick="MapTools.goToLonLat()">Vai</button>';

    template += '<div class="div-20"></div>';

    template += "<div>";
    template += "<h5>Copia coordinate</h5>";
    template += '<textarea  id="map-tools__coordinate-textarea" rows="6" style="width:95%"></textarea>';
    template +=
      '<button id="search-tools__start-copy-url" class="waves-effect waves-light btn lk-input-margin-right" onclick="MapTools.startCopyCoordinate()">Inizia</button>';
    template +=
      '<button id="search-tools__stop-copy-url" class="waves-effect waves-light btn lk-input-margin-right lk-hidden" onclick="MapTools.stopCopyCoordinate()">Fine</button>';
    template += '<button id="search-tools__copy-url"  class="waves-effect waves-light btn lk-input-margin-right" >Copia</button>';

    template += "</div>";

    template += '<div class="div-10"></div>';
    //template += 'Crea link da condividere con i tuoi colleghi';
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
  var goToLonLat = function() {
    var payload = {};
    try {
      payload.eventName = "zoom-lon-lat";
      payload.lon = parseFloat($("#map-tools__lon").val());
      payload.lat = parseFloat($("#map-tools__lat").val());
      dispatch(payload);
    } catch (e) {
      dispatch({
        eventName: "log",
        message: "AppStore: map-tools " + e
      });
    }

    try {
      payload = {};
      payload.eventName = "remove-info";
      dispatch(payload);
      payload = {};
      payload.eventName = "add-info-point";
      payload.lon = parseFloat($("#map-tools__lon").val());
      payload.lat = parseFloat($("#map-tools__lat").val());
      dispatch(payload);
    } catch (e) {
      dispatch({
        eventName: "log",
        message: "AppStore: map-tools " + e
      });
    }
  };

  var startCopyCoordinate = function() {
    $("#search-tools__start-copy-url").hide();
    $("#search-tools__stop-copy-url").show();
    dispatch("start-copy-coordinate");
  };

  var stopCopyCoordinate = function() {
    $("#search-tools__start-copy-url").show();
    $("#search-tools__stop-copy-url").hide();
    AppMap.stopCopyCoordinate();
  };

  var addCoordinate = function(lon, lat) {
    dispatch({ eventName: "add-info-point", lon: lon, lat: lat }), (lon = Math.round(lon * 1000000) / 1000000);
    lat = Math.round(lat * 1000000) / 1000000;
    $("#map-tools__coordinate-textarea").val($("#map-tools__coordinate-textarea").val() + lon + " " + lat + ";\n");
  };

  return {
    addCoordinate: addCoordinate,
    startCopyCoordinate: startCopyCoordinate,
    stopCopyCoordinate: stopCopyCoordinate,
    goToLonLat: goToLonLat,
    init: init,
    render: render,
    templateTools: templateTools
  };
})();
