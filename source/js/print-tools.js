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

var LamPrintTools = (function () {
  var isRendered = false;

  var papersMM = {
    a4: {
      width: 210,
      height: 297,
    },
    a3: {
      width: 210,
      height: 420,
    },
  };

  var papersPX = {
    a4: {
      width: 794,
      height: 1123,
    },
    a3: {
      width: 1123,
      height: 1587,
    },
  };

  var init = function init() {
    //Upgrade grafici
    //adding tool reset
    LamToolbar.addResetToolsEvent({ eventName: "clear-layer-print" });

    //events binding
    LamDispatcher.bind("show-print-tools", function (payload) {
      LamToolbar.toggleToolbarItem("print-tools");
      lamDispatch("print-map-size-update");
      if (LamToolbar.getCurrentToolbarItem() === "print-tools") {
        //LamStore.setInfoClickEnabled(false);
      }
      //lamDispatch("clear-layer-info");
    });

    LamDispatcher.bind("print-map", function (payload) {
      LamPrintTools.printMap(payload.paper, payload.orientation);
    });

    LamDispatcher.bind("clear-layer-print", function (payload) {
      LamMap.clearLayerPrint();
    });

    LamDispatcher.bind("print-map-size-update", function (payload) {
      var paper = $("#print-tools__paper").val();
      var orientation = $("#print-tools__orientation").val();
      updatePrintMapSize(paper, orientation);
    });

    LamDispatcher.bind("print-map-size-reset", function (payload) {
      resetPrintMapSize();
    });

    //bind elements
    $("#print-tools__paper").change(function () {
      lamDispatch("print-map-size-update");
    });
    $("#print-tools__orientation").change(function () {
      lamDispatch("print-map-size-update");
    });

    //add reset tools
    LamToolbar.addResetToolsEvent({ eventName: "print-map-size-reset" });
  };

  var render = function (div) {
    if (!LamStore.getAppState().modules["print-tools"]) return;
    var templateTemp = templatePrint();
    var output = templateTemp();
    jQuery("#" + div).html(output);
    if (!isRendered) {
      init();
    }

    //aggiungo a4 al centro della mappa
    isRendered = true;
  };

  var templatePrint = function () {
    template = "";

    template += '<h4 class="lam-title">Stampa</h4>';
    template += '<div class="lam-card lam-depth-2">';

    if (LamStore.getAppState().printDisclaimer) {
      template += '<div class="lam-mb-2 lam-app-bg lam-p-1">';
      if (LamStore.getAppState().printDisclaimerTitle) {
        template += '<div class="lam-title-h4 lam-mb-0 lam-mt-0">';
        template += LamStore.getAppState().printDisclaimerTitle;
        template += "</div>";
      }
      template += '<div class="lam-italic ">';
      template += LamStore.getAppState().printDisclaimer;
      template += "</div>";
      template += "</div>";
    }

    template += '<div class="lam-mb-2">';
    template += "La modalità di stampa è attiva. Seleziona la dimensione e orientamento preferito e clicca su <i>Stampa mappa</i>.";
    template += "<br/>Per creare un pdf, cliccare su <i>Stampa mappa</i> e poi selezionare <i>Salva come pdf</i>.";
    template += "</div>";

    template += '<div class="lam-mb-2">';
    template += '<label class="lam-label" for="print-tools__paper" class="lam-label">Dimensione</label>';
    template += '<select id="print-tools__paper" class="lam-select">';
    template += '<option value="a4">A4</option>';
    template += '<option value="a3">A3</option>';
    template += "</select>";
    template += "</div>";

    template += '<div class="lam-mb-2">';
    template += '<label class="lam-label" for="print-tools__orientation" class="lam-label">Orientamento</label>';
    template += '<select id="print-tools__orientation" class="lam-select">';
    template += '<option value="portrait">Verticale</option>';
    template += '<option value="landscape">Orizzontale</option>';
    template += "</select>";
    template += "</div>";

    template += '<button id="print-tools__print-button" onclick="LamPrintTools.printClick(); return false;" class="lam-btn" >Stampa mappa</button>';
    template +=
      '<button id="print-tools__print-button" onclick="LamPrintTools.closePrintMap(); return false;" class="lam-btn" >Chiudi modalità stampa</button>';

    template += '<div class="div-10"></div>';

    template += "</div>";

    return Handlebars.compile(template);
  };

  /**
   * Stampa la mappa under contruction
   * @param  {[type]} paper       [description]
   * @param  {[type]} orientation [description]
   * @return {[type]}             [description]
   */
  let updatePrintMapSize = function (paper, orientation) {
    removePrintClass("#lam-app");
    removePrintClass("#lam-map");
    let classId = "lam-app-print-" + paper + "-" + orientation;
    $("#lam-app").addClass(classId);
    $("#lam-map").addClass(classId);
    LamMap.getMap().updateSize();
  };

  let resetPrintMapSize = function (paper, orientation) {
    removePrintClass("#lam-app");
    removePrintClass("#lam-map");
    LamMap.getMap().updateSize();
  };

  let removePrintClass = function (elementId) {
    $(elementId).removeClass(function (index, css) {
      return (css.match(/(^|\s)lam-app-print-\S+/g) || []).join(" ");
    });
  };

  let closePrintMap = function () {
    LamToolbar.toggleToolbarItem("print-tools");
    lamDispatch("print-map-size-reset");
  };

  let printClick = function () {
    window.print();
  };

  return {
    closePrintMap: closePrintMap,
    init: init,
    printClick: printClick,
    updatePrintMapSize: updatePrintMapSize,
    resetPrintMapSize: resetPrintMapSize,
    render: render,
    templatePrint: templatePrint,
  };
})();
