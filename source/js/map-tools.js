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

var LamMapTools = (function () {
  var isRendered = false;

  var init = function init() {
    //Events binding
    LamDispatcher.bind("show-map-tools", function (payload) {
      LamToolbar.toggleToolbarItem("map-tools");
      if (LamToolbar.getCurrentToolbarItem() === "map-tools") {
        LamStore.setInfoClickEnabled(false);
      }

      LamDispatcher.bind("stop-copy-coordinate", function (payload) {
        LamMapTools.stopCopyCoordinate();
      });

      lamDispatch("clear-layer-info");
    });
  };

  var render = function (div) {
    var templateTemp = templateTools();
    var output = templateTemp();
    jQuery("#" + div).html(output);
    if (!isRendered) {
      init();
    }
    //forzo che il contenuto non sia visualizzato
    //
    //aggiungo la copia nel bottone

    var clipboard = new ClipboardJS("#search-tools__copy-url", {
      text: function (trigger) {
        return $("#map-tools__coordinate-textarea").val();
      },
    });

    isRendered = true;
  };

  var templateTools = function () {
    template = "";
    //pannello ricerca via
    template += '<h4 class="lam-title">Strumenti</h4>';
    template += '<div class="lam-card lam-depth-2">';
    template += '<h5 class="lam-title-h4">Vai a..</h5>';
    template += '<div id="map-tools__lon-field" class="lam-mb-2" >';
    template += '<label class="lam-label" for="map-tools__lon">Longitune</label>';
    template += '<input id="map-tools__lon" class="lam-input" type="number" step="any">';
    template += "</div>";
    template += '<div id="map-tools__lat-field" class="lam-mb-2" >';
    template += '<label class="lam-label" for="map-tools__lat">Latitudine</label>';
    template += '<input id="map-tools__lat" class="lam-input" type="number" step="any">';
    template += "</div>";
    template += '<div class="lam-grid ">';
    template += '<div class="lam-col"></div>';
    template += '<div class="lam-col"></div>';
    template += '<div class="lam-col"></div>';
    template += '<div class="lam-col">';
    template += '<button id="search-tools__gotolonlat"  class="lam-btn" onclick="LamMapTools.goToLonLat()">Vai</button>';
    template += "</div>";
    template += "</div>";
    template += '<div class="div-20"></div>';

    template += "<div>";
    template += '<h5 class="lam-title-h4">Copia coordinate</h5>';
    template += '<textarea  id="map-tools__coordinate-textarea" rows="6" style="width:95%"></textarea>';
    template += '<div class="lam-grid">';
    template += '<div class="lam-col"></div>';
    template += '<div class="lam-col"></div>';
    template += '<div class="lam-col">';
    template += '<button id="search-tools__start-copy-url" class="lam-btn" onclick="LamMapTools.startCopyCoordinate()">Inizia</button>';
    template += '<button id="search-tools__stop-copy-url" class="lam-btn lam-hidden" onclick="LamMapTools.stopCopyCoordinate()">Fine</button>';
    template += "</div>";
    template += '<div class="lam-col">';
    template += '<button id="search-tools__copy-url"  class="lam-btn " >Copia</button>';
    template += "</div>";
    template += "</div>";

    template += '<div class="div-10"></div>';
    //template += 'Crea link da condividere con i tuoi colleghi';
    template += "</div>";

    return Handlebars.compile(template);
  };

  /**
   * Chiama il disptcher per creare l'url di condivisione
   * @return {null} la funzione non restituisce valori
   */
  var goToLonLat = function () {
    var payload = {};
    try {
      payload.eventName = "zoom-lon-lat";
      payload.lon = parseFloat($("#map-tools__lon").val());
      payload.lat = parseFloat($("#map-tools__lat").val());
      lamDispatch(payload);
    } catch (e) {
      lamDispatch({
        eventName: "log",
        message: "LamStore: map-tools " + e,
      });
    }

    try {
      payload = {};
      payload.eventName = "clear-layer-info";
      lamDispatch(payload);
      payload = {};
      payload.eventName = "add-info-point";
      payload.lon = parseFloat($("#map-tools__lon").val());
      payload.lat = parseFloat($("#map-tools__lat").val());
      lamDispatch(payload);
    } catch (e) {
      lamDispatch({
        eventName: "log",
        message: "LamStore: map-tools " + e,
      });
    }
  };

  var startCopyCoordinate = function () {
    $("#search-tools__start-copy-url").hide();
    $("#search-tools__stop-copy-url").show();
    lamDispatch("start-copy-coordinate");
  };

  var stopCopyCoordinate = function () {
    $("#search-tools__start-copy-url").show();
    $("#search-tools__stop-copy-url").hide();
    LamMap.stopCopyCoordinate();
  };

  var addCoordinate = function (lon, lat) {
    lamDispatch({ eventName: "add-info-point", lon: lon, lat: lat }), (lon = Math.round(lon * 1000000) / 1000000);
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
    templateTools: templateTools,
  };
})();
