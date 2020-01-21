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

var LamPrintTools = (function() {
  var isRendered = false;

  var papersMM = {
    A4: {
      width: 210,
      height: 297
    },
    A3: {
      width: 210,
      height: 420
    }
  };

  var papersPX = {
    A4: {
      width: 794,
      height: 1123
    },
    A3: {
      width: 1123,
      height: 1587
    }
  };

  var init = function init() {
    //Upgrade grafici

    //bindo la scala con solo numeri
    $("#print-tools__scale").keyup(function(event) {
      //console.log(event.which);
      if (event.which != 8 && isNaN(String.fromCharCode(event.which))) {
        event.preventDefault();
      }
      showPrintArea();
    });

    //bindo i controlli per formato e orientamento
    $("#print-tools__orientation").change(function() {
      showPrintArea();
    });

    $("#print-tools__paper").change(function() {
      showPrintArea();
    });

    //adding tool reset
    LamToolbar.addResetToolsEvent({ eventName: "clear-layer-print" });

    //events binding
    LamDispatcher.bind("show-print-tools", function(payload) {
      LamToolbar.toggleToolbarItem("print-tools");
      if (LamToolbar.getCurrentToolbarItem() === "print-tools") {
        LamPrintTools.showPrintArea();
        LamStore.setInfoClickEnabled(false);
      }
      lamDispatch("clear-layer-info");
    });

    LamDispatcher.bind("print-map", function(payload) {
      LamPrintTools.printMap(payload.paper, payload.orientation, payload.format, payload.template);
    });

    LamDispatcher.bind("clear-layer-print", function(payload) {
      LamMap.clearLayerPrint();
    });

    LamDispatcher.bind("show-print-area", function(payload) {
      //ricavo posizione e risoluzione
      //Cerco il centro del rettangolo attuale di stampa o lo metto al centro della mappa
      var printCenter = LamMap.getPrintCenter();
      if (!printCenter) {
        printCenter = LamMap.getMapCenter();
      }
      //setto la risoluzione base a quella della mappa
      var scale = payload.scale;
      var resolution = LamMap.getMapResolution() / 2;
      //se la scala non è nulla setto la risoluzione in base alla Scala
      if (scale) {
        resolution = LamMap.getResolutionForScale(scale, "m");
      } else {
        //setto la scala per la stampa in ui
        LamPrintTools.setScale(LamMap.getMapScale() / 2);
      }
      var paper = payload.paper;
      var orientation = payload.orientation;
      var printSize = LamPrintTools.getPrintMapSize(paper, orientation, resolution);

      LamMap.setPrintBox(printCenter[0], printCenter[1], printSize.width, printSize.height);
    });
  };

  var render = function(div) {
    var templateTemp = templatePrint();
    var output = templateTemp();
    jQuery("#" + div).html(output);
    if (!isRendered) {
      init();
    }
    //aggiungo a4 al centro della mappa
    isRendered = true;
  };

  var templatePrint = function() {
    template = "";
    if (!LamStore.getAppState().logoPanelUrl) {
      template += '<h4 class="lam-title">Stampa</h4>';
    }
    template += '<div class="lam-card lam-depth-2">';

    template += '<div class="lam-mb-2">';
    template += '<label class="lam-label" for="print-tools__paper" class="lam-label">Dimensione</label>';
    template += '<select id="print-tools__paper" class="lam-select">';
    template += '<option value="A4">A4</option>';
    template += '<option value="A3">A3</option>';
    template += "</select>";
    template += "</div>";

    template += '<div class="lam-mb-2">';
    template += '<label class="lam-label" for="print-tools__orientation" class="lam-label">Orientamento</label>';
    template += '<select id="print-tools__orientation" class="lam-select">';
    template += '<option value="portrait">Verticale</option>';
    template += '<option value="landscape">Orizzontale</option>';
    template += "</select>";
    template += "</div>";

    template += '<div class="lam-mb-2">';
    template += '<label class="lam-label" id="print-tools__scale-label" for="print-tools__scale">Scala</label>';
    template += '<input class="lam-input" type="text" id="print-tools__scale">';
    template += "</div>";

    template += '<div class="lam-mb-2">';
    template += '<label class="lam-label" id="print-tools__scale-label" for="print-tools__scale">Template</label>';
    template += '<select id="print-tools__template" class="lam-select">';
    template += '<option value="standard">Standard</option>';
    //template += '<option value="personalizzato">Personalizzato</option>';
    template += "</select>";
    template += "</div>";

    template += '<button id="print-tools__print-button" onclick="LamPrintTools.printClick(); return false;" class="lam-btn" >Stampa</button>';

    template += '<div class="div-10"></div>';

    template += "</div>";

    return Handlebars.compile(template);
  };

  var templateEmpty = function(results) {
    var template = "<p>Nessun risultato disponibile</p>";
    return Handlebars.compile(template);
  };

  /**
   * Send the map print request to the LamDispatcher
   * @return {void}
   */
  var printClick = function() {
    var paper = $("#print-tools__paper").val();
    var orientation = $("#print-tools__orientation").val();
    var format = "PDF";
    var template = $("#print-tools__template").val();
    var payload = {
      eventName: "print-map",
      paper: paper,
      format: format,
      orientation: orientation,
      template: template
    };
    LamDispatcher.dispatch(payload);
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
    let appState = LamStore.getAppState();
    //ricavo le dimensioni di Stampa
    appState.printPaper = paper;
    appState.printOrientation = orientation;
    appState.printFormat = format;
    appState.printTemplate = template;
    var paperDimension = LamPrintTools.getPaperSize(paper, orientation);
    appState.printWidth = paperDimension.width;
    appState.printHeight = paperDimension.height;

    //ricavo i dati della mappa per la stampa
    var resolution = LamMap.getResolutionForScale(scale);
    var center = LamMap.getPrintCenter();
    var centerLL = LamMap.getPrintCenterLonLat();
    //La scala viene ricalcolata in base ad un parametero di conversione locale
    //Questa parte è tutta rivedere
    var scale = LamPrintTools.getScale() * LamMap.aspectRatio(centerLL[1] * 1.12, centerLL[1] * 0.88);

    //
    appState.printCenterX = center[0];
    appState.printCenterY = center[1];
    appState.printScale = scale;
    appState.printDpi = 96;

    appState.printParams = {};
    appState.printParams.dummy = "null";

    //invio la richiesta al servizio di print

    $.post(appState.restAPIUrl + "/api/print", {
      appstate: JSON.stringify(appState)
    })
      .done(function(pdf) {
        window.location = appState.restAPIUrl + "/api/print/" + pdf.pdfName;
      })
      .fail(function(err) {
        //TODO completare fail
      });
  };

  /**
   * Return paper dimensions in map units
   * @param  {string} paper       paper size (A4 | A3
   * @param  {string} orientation paper orientation (portrait | landscape)
   * @param  {float} resolution  map pixel resolution
   * @return {object}             object with width and height properties
   */
  var getPrintMapSize = function(paper, orientation, resolution) {
    var width = 0;
    var height = 0;
    var size = getPaperSize(paper, orientation);
    size.width = size.width * resolution;
    size.height = size.height * resolution;
    return size;
  };

  /**
   * Aggiorna il rettangolo di stampa nella mappa
   * @param  {Int} scale       scala di stampa
   * @param  {String} paper       formato carta
   * @param  {String} orientation orientamento carta
   * @return {null}
   */
  var showPrintArea = function(scale, paper, orientation) {
    if (!scale) {
      scale = parseInt($("#print-tools__scale").val());
    }
    if (!paper) {
      paper = $("#print-tools__paper").val();
    }
    if (!orientation) {
      orientation = $("#print-tools__orientation").val();
    }
    lamDispatch({
      eventName: "show-print-area",
      scale: scale,
      paper: paper,
      orientation: orientation
    });
  };

  var setScale = function(scale) {
    $("#print-tools__scale").val(Math.round(scale));
    $("#print-tools__scale-label").addClass("active");
    //$("#print-tools__scale").parent().addClass("active");
  };

  var getScale = function() {
    return Math.round(parseInt($("#print-tools__scale").val()));
  };

  var getPaperSize = function(paper, orientation) {
    var width = 0;
    var height = 0;
    switch (paper) {
      case "A4":
        width = papersPX.A4.width;
        height = papersPX.A4.height;
        break;
      case "A3":
        width = papersPX.A3.width;
        height = papersPX.A3.height;
        break;
      default:
    }
    //inverto le dimensioni in caso di landscape
    switch (orientation) {
      case "portrait":
        break;
      case "landscape":
        var tmp = width;
        width = height;
        height = tmp;
        break;
    }

    var size = {};

    size.width = width;
    size.height = height;

    return size;
  };

  /**
   * Return the map envelope to be printed
   * @param  {float} x      [description]
   * @param  {float} y      [description]
   * @param  {float} width  [description]
   * @param  {float} height [description]
   * @return {object}        [description]
   */
  var getPrintEnvelopeCenter = function(x, y, width, height) {
    var xMin = x - width / 2;
    var xMax = x + width / 2;
    var yMin = y - height / 2;
    var yMax = y + height / 2;
    return {
      xMin: xMin,
      xMax: xMax,
      yMin: yMin,
      yMax: yMax
    };
  };

  return {
    getPaperSize: getPaperSize,
    getPrintMapSize: getPrintMapSize,
    getPrintEnvelopeCenter: getPrintEnvelopeCenter,
    getScale: getScale,
    init: init,
    printClick: printClick,
    printMap: printMap,
    render: render,
    setScale: setScale,
    showPrintArea: showPrintArea,
    templatePrint: templatePrint
  };
})();
