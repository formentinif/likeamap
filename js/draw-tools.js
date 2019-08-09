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

var DrawTools = (function() {
  var isRendered = false;

  var init = function init() {
    $("#draw-tools__point").click(function() {
      $("#draw-tools__draw-settings").show();
      $("#draw-tools__delete-settings").hide();
      dispatch({
        eventName: "set-draw",
        type: "Point"
      });
    });
    $("#draw-tools__polyline").click(function() {
      $("#draw-tools__draw-settings").show();
      $("#draw-tools__delete-settings").hide();
      dispatch({
        eventName: "set-draw",
        type: "LineString"
      });
    });
    $("#draw-tools__polygon").click(function() {
      $("#draw-tools__draw-settings").show();
      $("#draw-tools__delete-settings").hide();
      dispatch({
        eventName: "set-draw",
        type: "Polygon"
      });
    });
    $("#draw-tools__delete").click(function() {
      $("#draw-tools__draw-settings").hide();
      $("#draw-tools__delete-settings").show();
      dispatch({
        eventName: "set-draw-delete",
        type: "Delete"
      });
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
    template += '<h4 class="lk-title">Disegna</h4>';
    template += '<div class="lk-card z-depth-2">';

    template += "<div>";
    template += '  <button id="draw-tools__point" class="btn-floating btn-large waves-effect waves-light">';
    template += '    <svg width="100%" height="100%">';
    template += '      <circle cx="28" cy="28" r="6" stroke="green" stroke-width="0" fill="white" />';
    template += "    </svg>";
    template += "  </button>";

    template += '  <button id="draw-tools__polyline" class="btn-floating btn-large waves-effect waves-light">';
    template += '    <svg width="100%" height="100%">';
    template += '      <polyline points="16,16 40,40 " style="fill:white;stroke:white;stroke-width:3" />';
    template += '      <circle cx="16" cy="16" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += '      <circle cx="40" cy="40" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += "    </svg>";
    template += "  </button>";

    template += '  <button id="draw-tools__polygon" class="btn-floating btn-large waves-effect waves-light">';
    template += '    <svg width="100%" height="100%">';
    template += '    <rect x="16" y="16" rx="0" ry="0" width="25" height="25"  stroke="white" stroke-width="3" fill="transparent" />';
    template += '      <circle cx="16" cy="16" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += '      <circle cx="16" cy="41" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += '      <circle cx="41" cy="41" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += '      <circle cx="41" cy="16" r="4" stroke="green" stroke-width="0" fill="white" />';
    template += "    </svg>";
    template += "  </button>";

    //template += '  <button id="draw-tools__text" class="btn-floating waves-effect waves-light" >';
    //template += '    <i class="materilk-icons" style="font-size:35px !important; top:45%;  ">T</i>';
    //template += '  </button>';

    template += '  <button id="draw-tools__delete" class="btn-floating btn-large waves-effect waves-light" >';
    template += '    <i class="materilk-icons" style="font-size:35px !important; top:50%; left:40%; ">&#xE872;</i>';
    template += "  </button>";

    //template += '  <div class="div-20" ></div>';
    //template += '  <div id="draw-tools__draw-settings" style="width:100%" >';
    //template += '  <div> <input id="draw-tools__color" type="text" name="draw-tools__color" value="#448AFF" /></div>';

    template += '  <div class="div-20" ></div>';
    template += '  <textarea  id="draw-tools__textarea" rows="6" style="width:95%" placeholder="Aggiungi label..."></textarea>';
    //template += '  <button id="draw-tools__delete-button" onclick="DrawTools.deleteFeatures(); return false;" class="mdl-button mdl-js-button mdl-button--raised  mdl-js-ripple-effect" >Elimina</button>';
    template += "  </div>";

    template += '  <div id="draw-tools__delete-settings" class="lk-hidden" >';
    template += '  <div class="div-20" ></div>';
    template += "  Tocca una geometria per eliminarla ";
    //template += '  <button id="draw-tools__delete-button" onclick="DrawTools.deleteFeatures(); return false;" class="mdl-button mdl-js-button mdl-button--raised  mdl-js-ripple-effect" >Elimina</button>';
    template += "  </div>";

    template += "</div>";

    template += '<div class="div-10"></div>';

    template += "</div>";

    return Handlebars.compile(template);
  };

  var templateEmpty = function(results) {
    var template = "<p></p>";
    return Handlebars.compile(template);
  };

  var setDraw = function(type) {
    dispatch({
      eventName: "set-draw",
      type: type
    });
  };

  var deleteFeatures = function() {
    dispatch({
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
