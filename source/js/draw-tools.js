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

var LamDrawTools = (function() {
  var isRendered = false;

  var init = function init() {
    $("#draw-tools__point").click(function() {
      $("#draw-tools__draw-settings").show();
      $("#draw-tools__delete-settings").hide();
      lamDispatch({
        eventName: "set-draw",
        type: "Point"
      });
    });
    $("#draw-tools__polyline").click(function() {
      $("#draw-tools__draw-settings").show();
      $("#draw-tools__delete-settings").hide();
      lamDispatch({
        eventName: "set-draw",
        type: "LineString"
      });
    });
    $("#draw-tools__polygon").click(function() {
      $("#draw-tools__draw-settings").show();
      $("#draw-tools__delete-settings").hide();
      lamDispatch({
        eventName: "set-draw",
        type: "Polygon"
      });
    });
    $("#draw-tools__delete").click(function() {
      $("#draw-tools__draw-settings").hide();
      $("#draw-tools__delete-settings").show();
      lamDispatch({
        eventName: "set-draw-delete",
        type: "Delete"
      });
    });

    //adding tool reset
    LamToolbar.addResetToolsEvent({ eventName: "unset-draw" });

    //Events binding
    LamDispatcher.bind("show-draw-tools", function(payload) {
      LamToolbar.toggleToolbarItem("draw-tools");
      if (LamToolbar.getCurrentToolbarItem() === "draw-tools") {
        LamStore.setInfoClickEnabled(false);
      }
      lamDispatch("clear-layer-info");
    });

    LamDispatcher.bind("set-draw", function(payload) {
      LamMap.removeDrawInteraction();
      LamMap.removeDrawDeleteInteraction();
      LamMap.addDrawInteraction(payload.type);
    });

    LamDispatcher.bind("unset-draw", function(payload) {
      LamMap.removeDrawInteraction();
      LamMap.removeDrawDeleteInteraction();
    });

    LamDispatcher.bind("set-draw-delete", function(payload) {
      LamMap.removeDrawInteraction();
      LamMap.removeDrawDeleteInteraction();
      LamMap.addDrawDeleteInteraction(payload.type);
    });

    LamDispatcher.bind("delete-draw", function(payload) {
      LamMap.deleteDrawFeatures(payload.type);
    });
  };

  var render = function(div) {
    var templateTemp = templateDraw();
    var output = templateTemp();
    jQuery("#" + div).html(output);
    if (!isRendered) {
      init();
    }
    //forzo che il contenuto non sia visualizzato
    $("#draw-tools__content").hide();
    isRendered = true;
  };

  var templateDraw = function() {
    template = "";
    //pannello ricerca via
    template += '<h4 class="lam-title">Disegna</h4>';
    template += '<div class="lam-card lam-depth-2">';

    template += "<div>";
    template += '  <button id="draw-tools__point" class="lam-btn lam-btn-floating ">';
    template += '    <svg width="24px" height="24px">';
    template += '      <circle cx="12" cy="12" r="6" stroke="green" stroke-width="0" fill="white" />';
    template += "    </svg>";
    template += "  </button>";

    template += '  <button id="draw-tools__polyline" class="lam-btn lam-btn-floating">';
    template += '    <svg width="24px" height="24px">';
    template += '      <polyline points="4,4 20,20" style="fill:white;stroke:white;stroke-width:3" />';
    template += '      <circle cx="4" cy="4" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += '      <circle cx="20" cy="20" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += "    </svg>";
    template += "  </button>";

    template += '  <button id="draw-tools__polygon" class="lam-btn lam-btn-floating ">';
    template += '    <svg width="24px" height="24px">';
    template += '    <rect x="3" y="3" rx="0" ry="0" width="18" height="18"  stroke="white" stroke-width="3" fill="transparent" />';
    template += '      <circle cx="4" cy="4" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += '      <circle cx="4" cy="20" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += '      <circle cx="20" cy="4" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += '      <circle cx="20" cy="20" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += "    </svg>";
    template += "  </button>";

    //template += '  <button id="draw-tools__text" class="lam-btn lam-btn-floating lam-btn-large" >';
    //template += '    <i class="lam-icon" style="font-size:35px !important; top:45%;  ">T</i>';
    //template += '  </button>';

    template += '  <button id="draw-tools__delete" class="lam-btn lam-btn-floating" >';
    template += '<i class="lam-icon">';
    template +=
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /><path d="M0 0h24v24H0z" fill="none" /></svg>';
    template += "</i>";
    template += "  </button>";

    //template += '  <div class="div-20" ></div>';
    //template += '  <div id="draw-tools__draw-settings" style="width:100%" >';
    //template += '  <div> <input id="draw-tools__color" type="text" name="draw-tools__color" value="#448AFF" /></div>';

    template += '  <div class="div-20" ></div>';
    template += '  <textarea  id="draw-tools__textarea" rows="6" style="width:95%" placeholder="Aggiungi label..."></textarea>';
    //template += '  <button id="draw-tools__delete-button" onclick="LamDrawTools.deleteFeatures(); return false;" class="" >Elimina</button>';
    template += "  </div>";

    template += '  <div id="draw-tools__delete-settings" class="lam-hidden" >';
    template += '  <div class="div-20" ></div>';
    template += "  Tocca una geometria per eliminarla ";
    //template += '  <button id="draw-tools__delete-button" onclick="LamDrawTools.deleteFeatures(); return false;" class="" >Elimina</button>';
    template += "  </div>";

    template += "</div>";

    template += '<div class="div-10"></div>';

    template += "</div>";

    return Handlebars.compile(template);
  };

  var setDraw = function(type) {
    lamDispatch({
      eventName: "set-draw",
      type: type
    });
  };

  var deleteFeatures = function() {
    lamDispatch({
      eventName: "delete-draw"
    });
  };

  return {
    setDraw: setDraw,
    deleteFeatures: deleteFeatures,
    init: init,
    render: render,
    templateDraw: templateDraw
  };
})();
