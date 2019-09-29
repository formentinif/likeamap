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

    //adding tool reset
    AppToolbar.addResetToolsEvent({ eventName: "unset-draw" });

    //Events binding
    Dispatcher.bind("show-draw-tools", function(payload) {
      AppToolbar.toggleToolbarItem("draw-tools");
      if (AppToolbar.getCurrentToolbarItem() === "draw-tools") {
        AppStore.setInfoClickEnabled(false);
      }
      dispatch("clear-layer-info");
    });

    Dispatcher.bind("set-draw", function(payload) {
      AppMap.removeDrawInteraction();
      AppMap.removeDrawDeleteInteraction();
      AppMap.addDrawInteraction(payload.type);
    });

    Dispatcher.bind("unset-draw", function(payload) {
      AppMap.removeDrawInteraction();
      AppMap.removeDrawDeleteInteraction();
    });

    Dispatcher.bind("set-draw-delete", function(payload) {
      AppMap.removeDrawInteraction();
      AppMap.removeDrawDeleteInteraction();
      AppMap.addDrawDeleteInteraction(payload.type);
    });

    Dispatcher.bind("delete-draw", function(payload) {
      AppMap.deleteDrawFeatures(payload.type);
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
    template += '<div class="lam-card z-depth-2">';

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
    //template += '    <i class="material-icons" style="font-size:35px !important; top:45%;  ">T</i>';
    //template += '  </button>';

    template += '  <button id="draw-tools__delete" class="btn-floating btn-large waves-effect waves-light" >';
    template += '    <i class="material-icons" style="font-size:35px !important; top:50%; left:40%; ">&#xE872;</i>';
    template += "  </button>";

    //template += '  <div class="div-20" ></div>';
    //template += '  <div id="draw-tools__draw-settings" style="width:100%" >';
    //template += '  <div> <input id="draw-tools__color" type="text" name="draw-tools__color" value="#448AFF" /></div>';

    template += '  <div class="div-20" ></div>';
    template += '  <textarea  id="draw-tools__textarea" rows="6" style="width:95%" placeholder="Aggiungi label..."></textarea>';
    //template += '  <button id="draw-tools__delete-button" onclick="DrawTools.deleteFeatures(); return false;" class="mdl-button mdl-js-button mdl-button--raised  mdl-js-ripple-effect" >Elimina</button>';
    template += "  </div>";

    template += '  <div id="draw-tools__delete-settings" class="lam-hidden" >';
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
      dispatch("clear-layer-info");
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
      template += '<h4 class="lam-title">Strumenti</h4>';
    }
    template += '<div class="lam-card z-depth-2">';
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
      '<button id="search-tools__start-copy-url" class="waves-effect waves-light btn lam-input-margin-right" onclick="MapTools.startCopyCoordinate()">Inizia</button>';
    template +=
      '<button id="search-tools__stop-copy-url" class="waves-effect waves-light btn lam-input-margin-right lam-hidden" onclick="MapTools.stopCopyCoordinate()">Fine</button>';
    template += '<button id="search-tools__copy-url"  class="waves-effect waves-light btn lam-input-margin-right" >Copia</button>';

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

var PrintTools = (function() {
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
    M.AutoInit();

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
    AppToolbar.addResetToolsEvent({ eventName: "clear-layer-print" });

    //events binding
    Dispatcher.bind("show-print-tools", function(payload) {
      AppToolbar.toggleToolbarItem("print-tools");
      if (AppToolbar.getCurrentToolbarItem() === "print-tools") {
        PrintTools.showPrintArea();
        AppStore.setInfoClickEnabled(false);
      }
      dispatch("clear-layer-info");
    });

    Dispatcher.bind("print-map", function(payload) {
      PrintTools.printMap(payload.paper, payload.orientation, payload.format, payload.template);
    });

    Dispatcher.bind("clear-layer-print", function(payload) {
      AppMap.clearLayerPrint();
    });

    Dispatcher.bind("show-print-area", function(payload) {
      //ricavo posizione e risoluzione
      //Cerco il centro del rettangolo attuale di stampa o lo metto al centro della mappa
      var printCenter = AppMap.getPrintCenter();
      if (!printCenter) {
        printCenter = AppMap.getMapCenter();
      }
      //setto la risoluzione base a quella della mappa
      var scale = payload.scale;
      var resolution = AppMap.getMapResolution() / 2;
      //se la scala non è nulla setto la risoluzione in base alla Scala
      if (scale) {
        resolution = AppMap.getResolutionForScale(scale, "m");
      } else {
        //setto la scala per la stampa in ui
        PrintTools.setScale(AppMap.getMapScale() / 2);
      }
      var paper = payload.paper;
      var orientation = payload.orientation;
      var printSize = PrintTools.getPrintMapSize(paper, orientation, resolution);

      AppMap.setPrintBox(printCenter[0], printCenter[1], printSize.width, printSize.height);
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
    //pannello ricerca via
    if (!AppStore.getAppState().logoPanelUrl) {
      template += '<h4 class="lam-title">Stampa</h4>';
    }
    template += '<div class="lam-card z-depth-2">';

    template += '<div class="input-field">';
    template += '<select id="print-tools__paper" class="">';
    template += '<option value="A4">A4</option>';
    template += '<option value="A3">A3</option>';
    template += "</select>";
    template += "</div>";

    template += '<div class="input-field">';
    template += '<select id="print-tools__orientation" class="">';
    template += '<option value="portrait">Verticale</option>';
    template += '<option value="landscape">Orizzontale</option>';
    template += "</select>";
    template += "</div>";

    template += '<div class="input-field">';
    template += '<label class="" id="print-tools__scale-label" for="print-tools__scale">Scala...</label>';
    template += '<input class="" type="text" id="print-tools__scale">';
    template += "</div>";

    template += '<div class="input-field">';
    template += '<select id="print-tools__template" class="">';
    template += '<option value="standard">Standard</option>';
    //template += '<option value="personalizzato">Personalizzato</option>';
    template += "</select>";
    template += "</div>";

    template += '<button id="print-tools__print-button" onclick="PrintTools.printClick(); return false;" class="waves-effect waves-light btn" >Stampa</button>';

    template += '<div class="div-10"></div>';

    template += "</div>";

    return Handlebars.compile(template);
  };

  var templateEmpty = function(results) {
    var template = "<p>Nessun risultato disponibile</p>";
    return Handlebars.compile(template);
  };

  /**
   * Send the map print request to the Dispatcher
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
    Dispatcher.dispatch(payload);
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
    let appState = AppStore.getAppState();
    //ricavo le dimensioni di Stampa
    appState.printPaper = paper;
    appState.printOrientation = orientation;
    appState.printFormat = format;
    appState.printTemplate = template;
    var paperDimension = PrintTools.getPaperSize(paper, orientation);
    appState.printWidth = paperDimension.width;
    appState.printHeight = paperDimension.height;

    //ricavo i dati della mappa per la stampa
    var resolution = AppMap.getResolutionForScale(scale);
    var center = AppMap.getPrintCenter();
    var centerLL = AppMap.getPrintCenterLonLat();
    //La scala viene ricalcolata in base ad un parametero di conversione locale
    //Questa parte è tutta rivedere
    var scale = PrintTools.getScale() * AppMap.aspectRatio(centerLL[1] * 1.12, centerLL[1] * 0.88);

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
    dispatch({
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

var SearchTools = (function() {
  var isRendered = false;

  var comuni = [];
  var searchResults = [];
  var searchAddressProviderUrl = "";
  var searchAddressProviderField = "";
  var searchHouseNumberProviderUrl = "";
  var searchHouseNumberProviderField = "";
  var currentSearchDate = "";
  var searchLayers = [];

  var init = function init() {
    Handlebars.registerHelper("hasLayers", function(options) {
      //return searchLayers.length > 0;
      return true;
    });

    //events binding
    Dispatcher.bind("show-search", function(payload) {
      AppToolbar.toggleToolbarItem("search-tools");
      dispatch("clear-layer-info");
    });

    Dispatcher.bind("show-search-items", function(payload) {
      SearchTools.showSearchInfoFeatures(payload.features);
    });

    try {
      M.AutoInit();
      $(".dropdown-trigger").dropdown();
    } catch (e) {
    } finally {
    }
  };

  var render = function(div, provider, providerAddressUrl, providerAddressField, providerHouseNumberUrl, providerHouseNumberField, layers) {
    searchLayers = layers;
    switch (provider) {
      case "wms_geoserver":
        searchAddressProviderUrl = providerAddressUrl;
        searchAddressProviderField = providerAddressField;
        searchHouseNumberProviderUrl = providerHouseNumberUrl;
        searchHouseNumberProviderField = providerHouseNumberField;

        var templateTemp = templateSearchWFSGeoserver(searchLayers);
        var output = templateTemp(searchLayers);
        jQuery("#" + div).html(output);
        $("#search-tools__select-layers").on("change", function() {
          var currentLayer = $("#search-tools__select-layers option:selected").val();
          for (li = 0; li < searchLayers.length; li++) {
            if (searchLayers[li].layer == currentLayer) {
              $("#search-tools__search-layers__label").text(searchLayers[li].searchField);
            }
          }
        });
        break;
      case "nominatim":
      default:
        var templateTemp = templateSearchNominatim(searchLayers);
        var output = templateTemp(searchLayers);
        jQuery("#" + div).html(output);
    }

    updateScroll(220);
    $(window).resize(function() {
      updateScroll(20);
    });

    if (!isRendered) {
      init();
    }

    isRendered = true;
  };

  /**
   * Aggiorna la dimensione dello scroll dei contenuti
   * @return {null} La funzione non restituisce un valore
   */
  var updateScroll = function(offset) {
    var positionMenu = $("#menu-toolbar").offset();
    var positionSearch = $("#search-tools__search-results").offset();
    $("#search-tools__search-results").height(positionMenu.top - positionSearch.top - offset);
  };

  var updateComuniNominatim = function(comuni) {
    $.each(comuni, function(i, comune) {
      var nomeComune = comune.nomeComune;
      if (nomeComune) {
        nomeComune = nomeComune.replace(/_/g, " ");
        if (nomeComune.indexOf("Reggio") >= 0) {
          nomeComune = nomeComune.replace("nell Emilia", "nell'Emilia");
        }
      }
      $("#search-tools__comune").append(
        $("<option>", {
          value: comune.istat,
          text: nomeComune
        })
      );
    });
  };

  /**
   * General html code that will be injected in the panel as the main tools
   */
  var templateTopTools = function() {
    let template = '<div class="lam-bar lam-background">';
    template += '<div class="row lam-no-margin">';
    template +=
      '<div class="col s6"><a class="waves-effect waves-light btn btn-small" onclick="SearchTools.showSearchAddress(); return false;" >Indirizzi</a></div>';
    template +=
      '<div class="col s6"><a class="waves-effect waves-light btn btn-small" onclick="SearchTools.showSearchLayers(); return false;" >Layers</a></div>';
    template += "</div>";
    template += "</div>";
    return template;
  };
  // var templateTopTools = function() {
  //   let template = '<div class="lam-bar lam-background">';
  //   template += '<button id="search-tools__menu" class="dropdown-trigger btn" value="Indirizzo" data-target="search-tools__menu-items">';
  //   template += '<i class="material-icons">more_vert</i>';
  //   template += '</button> <span id="search-tools__label">Indirizzo</span>';
  //   template += "</div>";
  //   template += '<ul id="search-tools__menu-items" class="dropdown-content" >';
  //   template += '<li onclick="SearchTools.showSearchAddress(); return false;"><span >Indirizzo</span></li>';
  //   template += "{{#if this.length}}";
  //   template += '<li onclick="SearchTools.showSearchLayers(); return false;"><span >Layer</span></li>';
  //   template += "{{/if}}";
  //   template += "</ul>";
  //   return template;
  // };

  /**
   * General html code that will be injected in order to display the layer tools
   */
  var templateLayersTools = function(searchLayers) {
    let template = '<div id="search-tools__layers" class="lam-card z-depth-2" style="display:none;">';
    template += '<select id="search-tools__select-layers" class="input-field">';
    for (var i = 0; i < searchLayers.length; i++) {
      template += '<option value="' + searchLayers[i].layer + '">' + searchLayers[i].layerName + "</option>";
    }
    template += "</select>";
    template += '<div class="div-5"></div>';
    template += '<div id="search-tools__search-layers-field" class="input-field" >';
    template += '<input id="search-tools__search-layers" class="input-field" type="search" onkeyup="SearchTools.doSearchLayers(event)">';
    template += '<label class="input-field" id="search-tools__search-layers__label" for="search-tools__search-layers">';
    if (searchLayers.length > 0) {
      template += searchLayers[0].searchField;
    } else {
      template += "Layers...";
    }
    template += "</label>";
    template += "</div>";
    template += "</div>";
    return template;
  };

  /**
   * Initialize the panel if Nominatim is selected as default address provider
   */
  var templateSearchNominatim = function(searchLayers) {
    let template = "";
    //pannello ricerca via
    if (!AppStore.getAppState().logoPanelUrl) {
      template += '<h4 class="lam-title">Ricerca</h4>';
    }
    template += templateTopTools();
    template += '<div id="search-tools__address" class="lam-card z-depth-2">';
    template += '<select id="search-tools__comune" class="input-field">';
    template += "</select>";
    template += '<div class="div-5"></div>';
    template += '<div id="search-tools__search-via-field" class="input-field" >';
    template += '<input id="search-tools__search-via" class="input-field" type="search" onkeyup="SearchTools.doSearchAddressNominatim(event)">';
    template += '<label class="input-field" id="search-tools__search-via__label" for="search-tools__search-via">Via...</label>';
    template += "</div>";
    template += "</div>";
    template += templateLayersTools(searchLayers);
    template += '<div class="div-10"></div>';
    template += '<div id="search-tools__search-results" class="lam-card z-depth-2 lam-scrollable">';
    template += "</div>";
    return Handlebars.compile(template);
  };

  /**
   * Initialize the panel if Geoserver is selected as default address provider
   */
  var templateSearchWFSGeoserver = function() {
    let template = "";
    //pannello ricerca via
    if (!AppStore.getAppState().logoPanelUrl) {
      template += '<h4 class="lam-title">Ricerca</h4>';
    }
    template += templateTopTools();
    template += '<div id="search-tools__address" class="lam-card z-depth-2">';
    template += '<div id="search-tools__search-via-field" class="input-field" >';
    template += '<input id="search-tools__search-via" class="input-field" type="search" onkeyup="SearchTools.doSearchAddressWMSG(event)">';
    template += '<label class="input-field" id="search-tools__search-via__label" for="search-tools__search-via">Via...</label>';
    template += "</div>";
    template += "</div>";
    template += templateLayersTools(searchLayers);
    template += '<div class="div-10"></div>';
    template += '<div id="search-tools__search-results" >';
    template += "</div>";
    return Handlebars.compile(template);
  };

  /**
   * Display the list of the nominatim results in the left panel
   * @param {Object} results
   */
  var templateResultsNominatim = function(results) {
    template = '<h5>Risultati della ricerca</h5><ul class="mdl-list">';
    template += "{{#each this}}";
    template += '<li class="mdl-list__item">';
    template += '<i class="material-icons md-icon">&#xE55F;</i><a href="#" onclick="SearchTools.zoomToItemNominatim({{{@index}}});return false">';
    template += "{{{display_name}}}";
    template += "</a>";
    template += "</li>";
    template += "{{/each}}";
    template += "</ul>";
    return Handlebars.compile(template);
  };

  /**
   * Display the list of the WFS Address results in the left panel
   * @param {Object} results
   */
  var templateSearchResultsWFSGeoserver = function(results) {
    template = '<h5>Risultati della ricerca</h5><ul class="mdl-list">';
    template += "{{#each this}}";
    template += '<li class="mdl-list__item">';
    template +=
      '<i class="material-icons md-icon">&#xE55F;</i><a href="#" onclick="SearchTools.zoomToItemLayer({{{lon}}}, {{{lat}}}, {{@index}}, false);return false">';
    template += "{{{display_name}}} ";
    template += "{{{display_name2}}} ";
    template += "</a>";
    template += "</li>";
    template += "{{/each}}";
    template += "</ul>";
    return Handlebars.compile(template);
  };

  /**
   * Display the list of the WFS Layers results in the left panel
   * @param {Object} results
   */
  var templateSearchResultsLayers = function(results) {
    template = '<ul class="mdl-list">';
    template += "{{#each this}}";
    template += '<li class="mdl-list__item">';
    template +=
      '<i class="material-icons md-icon">&#xE55F;</i><a href="#" onclick="SearchTools.zoomToItemLayer({{{lon}}}, {{{lat}}}, {{@index}}, true);return false">';
    template += "{{{display_name}}}";
    template += "</a>";
    template += "</li>";
    template += "{{/each}}";
    template += "</ul>";
    return Handlebars.compile(template);
  };

  var templateResultEmpty = function(results) {
    var template = "<p>Nessun risultato disponibile</p>";
    return Handlebars.compile(template);
  };

  /**
   * Switch the address/layers tools
   */
  var showSearchAddress = function() {
    $("#search-tools__label").text("Indirizzo");
    $("#search-tools__address").show();
    $("#search-tools__layers").hide();
  };

  /**
   * Switch the address/layers tools
   */
  var showSearchLayers = function() {
    $("#search-tools__label").text("Layers");
    $("#search-tools__address").hide();
    $("#search-tools__layers").show();
  };

  /**
   * Zoom the map to the item provided
   * @param {int} index  Item's index in the Nominatim array result
   */
  var zoomToItemNominatim = function(index) {
    let result = searchResults[index];
    dispatch({
      eventName: "zoom-lon-lat",
      zoom: 18,
      lon: parseFloat(result.lon),
      lat: parseFloat(result.lat)
    });
    dispatch({
      eventName: "add-wkt-info-map",
      wkt: "POINT(" + result.lon + " " + result.lat + ")"
    });
    dispatch({ eventName: "hide-menu-mobile" });
  };

  // /**
  //  * Zoom the map to the lon-lat given and add a point to the map
  //  * @param {float} lon
  //  * @param {float} lat
  //  */
  // var zoomToItemWFSGeoserver = function(lon, lat) {
  //   dispatch("remove-info");
  //   dispatch({
  //     eventName: "zoom-lon-lat",
  //     zoom: 18,
  //     lon: parseFloat(lon),
  //     lat: parseFloat(lat)
  //   });
  //   dispatch({
  //     eventName: "add-wkt-info-map",
  //     wkt: "POINT(" + payload.lon + " " + payload.lat + ")"
  //   });
  //   dispatch("hide-menu-mobile");
  // };

  /**
   * Zoom the map to the lon-lat given and show the infobox of the given item index
   * @param {float} lon
   * @param {float} lat
   * @param {int} index Item's index in the result array
   * @param {boolean} showInfo
   */
  var zoomToItemLayer = function(lon, lat, index, showInfo) {
    dispatch("remove-info");
    if (searchResults[index]) {
      dispatch({
        eventName: "zoom-geometry",
        geometry: searchResults[index].item.geometry
      });
      if (showInfo) {
        dispatch({
          eventName: "show-info-items",
          features: searchResults[index].item,
          element: search - tools__search - results
        });
      }
      let payload = {
        eventName: "add-feature-info-map",
        geometry: searchResults[index].item.geometry
      };
      try {
        payload.srid = searchResults[index].item.crs;
      } catch (e) {
        payload.srid = null;
      }
      dispatch(payload);
      dispatch("hide-menu-mobile");
    } else {
      dispatch({
        eventName: "zoom-lon-lat",
        zoom: 18,
        lon: parseFloat(lon),
        lat: parseFloat(lat),
        eventName: "add-wkt-info-map",
        wkt: "POINT(" + lon + " " + lat + ")"
      });
      dispatch("hide-menu-mobile");
    }
  };

  var getRegioneFromComuneNominatim = function(idcomune) {
    return "Emilia-Romagna";
  };

  /**
   * Start the search in the Nominatim Provider
   * @param {Object} ev key click event result
   */
  var doSearchAddressNominatim = function(ev) {
    if (ev.keyCode == 13) {
      $("#search-tools__search-via").blur();
    }
    var comune = $("#search-tools__comune option:selected").text();
    var idcomune = $("#search-tools__comune option:selected").val();
    var regione = getRegioneFromComuneNominatim(idcomune);
    var via = $("#search-tools__search-via").val();

    if (via.length > 3 && comune) {
      via = via.replace("'", " ");
      var url = "http://nominatim.openstreetmap.org/search/IT/" + regione + "/" + comune + "/" + via + "?format=jsonv2&addressdetails=1" + "&";
      console.log(url);
      currentSearchDate = new Date().getTime();
      var searchDate = new Date().getTime();
      $.ajax({
        dataType: "json",
        url: url
      })
        .done(function(data) {
          //verifica che la ricerca sia ancora valida
          if (currentSearchDate > searchDate) {
            return;
          }
          var results = [];
          if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].osm_type == "way") {
                results.push(data[i]);
              }
            }
            searchResults = results;
            //renderizzo i risultati

            var templateTemp = templateResultsNominatim();
            var output = templateTemp(results);
            jQuery("#search-tools__search-results").html(output);
          } else {
            var templateTemp = templateResultEmpty();
            var output = templateTemp();
            jQuery("#search-tools__search-results").html(output);
          }
        })
        .fail(function(data) {
          dispatch({
            eventName: "log",
            message: "SearchTools: unable to bind comuni"
          });
        });
    }
  };

  /**
   * Start the search in the WFS Geoserver Provider
   * @param {Object} ev key click event result
   */
  var doSearchAddressWMSG = function(ev) {
    if (ev.keyCode == 13) {
      $("#search-tools__search-via").blur();
    }
    var via = $("#search-tools__search-via").val();
    var cql = "";
    var arrTerms = via.split(" ");
    var street = "";
    var civico = "";

    if (via.indexOf(",") > -1) {
      var viaArr = via.split(",");
      street = viaArr[0];
      civico = viaArr[1];
    } else {
      for (var i = 0; i < arrTerms.length; i++) {
        //verifica dei civici e dei barrati
        if (isNaN(arrTerms[i])) {
          if (arrTerms[i].indexOf("/") > -1) {
            civico += arrTerms[i];
          } else if (arrTerms[i].length === 1) {
            civico += arrTerms[i];
          } else {
            street += arrTerms[i] + " ";
          }
        } else {
          if (i === 0) {
            //se ho il primo elemento numerico lo tratto come una via
            street += arrTerms[i];
          } else {
            civico += arrTerms[i];
          }
        }
      }
    }
    var url = searchAddressProviderUrl;
    if (!civico) {
      //solo ricerca via
      url += "&cql_filter=[" + searchAddressProviderField + "]ilike%27%25" + street.trim() + "%25%27";
    } else {
      //ricerca via e civico
      var url = searchHouseNumberProviderUrl;
      url +=
        "&cql_filter=" +
        searchAddressProviderField +
        "%20ilike%20%27%25" +
        street.trim() +
        "%25%27%20AND%20" +
        searchHouseNumberProviderField +
        "%20ILIKE%20%27" +
        civico +
        "%25%27";
    }

    if (via.length > 2) {
      via = via.replace("'", " ");
      currentSearchDate = new Date().getTime();
      var searchDate = new Date().getTime();
      $.ajax({
        dataType: "jsonp",
        url: url,
        jsonp: true,
        jsonpCallback: "parseResponse",
        success: function(data) {
          //verifica che la ricerca sia ancora valida
          if (currentSearchDate > searchDate) {
            return;
          }
          var results = [];
          if (data.features.length > 0) {
            var toponimi = [];
            var results = [];
            for (var i = 0; i < data.features.length; i++) {
              var currentAddress = data.features[i].properties[searchAddressProviderField];
              if (data.features[i].properties[searchHouseNumberProviderField]) {
                currentAddress = " " + data.features[i].properties[searchHouseNumberProviderField];
              }
              if ($.inArray(currentAddress, toponimi) === -1) {
                var cent = null;
                if (data.features[i].geometry.type != "POINT") {
                  cent = AppMap.getCentroid(data.features[i].geometry.coordinates);
                } else {
                  cent = data.features[i].geometry.coordinates;
                }
                var tempItem = {
                  display_name: data.features[i].properties[searchAddressProviderField],
                  lon: cent[0],
                  lat: cent[1],
                  item: data.features[i]
                };
                if (searchHouseNumberProviderField) {
                  tempItem.display_name2 = data.features[i].properties[searchHouseNumberProviderField];
                }
                results.push(tempItem);
                toponimi.push(data.features[i].properties[searchAddressProviderField]);
              }
            }
            searchResults = results.sort(SortByDisplayName);
            //renderizzo i risultati
            var templateTemp = templateSearchResultsWFSGeoserver();
            var output = templateTemp(results);
            jQuery("#search-tools__search-results").html(output);
          } else {
            var templateTemp = templateResultEmpty();
            var output = templateTemp();
            jQuery("#search-tools__search-results").html(output);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          dispatch({
            eventName: "log",
            message: "SearchTools: unable to complete response"
          });
        }
      });
    }
  };

  /**
   * Start the search in the WFS Geoserver Provider
   * @param {Object} ev key click event result
   */
  var doSearchLayers = function(ev) {
    if (ev.keyCode == 13) {
      $("#search-tools__search-layers").blur();
    }
    var itemStr = $("#search-tools__search-layers").val();
    var cql = "";
    //ricavo l'elenco dei layer da interrogare
    currentSearchDate = new Date().getTime();
    var searchDate = new Date().getTime();
    var currentLayer = $("#search-tools__select-layers option:selected").val();

    if (itemStr.length > 2) {
      jQuery("#search-tools__search-results").html("");
      for (li = 0; li < searchLayers.length; li++) {
        if (searchLayers[li].layer == currentLayer) {
          var layer = searchLayers[li];
          var url = layer.mapUri;
          url =
            url.replace("/wms", "/") +
            "ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
            layer.layer +
            "&maxFeatures=50&outputFormat=text%2Fjavascript&cql_filter=[" +
            layer.searchField +
            "]ilike%27%25" +
            itemStr.trim() +
            "%25%27";
          itemStr = itemStr.replace("'", " ");

          $.ajax({
            dataType: "jsonp",
            url: url,
            jsonp: true,
            jsonpCallback: "parseResponse",
            success: function(data) {
              //verifica che la ricerca sia ancora valida
              if (currentSearchDate > searchDate) {
                return;
              }
              data.features.forEach(function(feature) {
                feature.layerGid = layer.gid;
                feature.srid = AppMap.getSRIDfromCRSName(data.crs.properties.name);
              });
              if (data.features.length > 0) {
                dispatch({
                  eventName: "show-search-items",
                  features: data
                });
                dispatch({
                  eventName: "show-info-geometries",
                  features: data
                });
              } else {
                var templateTemp = templateResultEmpty();
                var output = templateTemp();
                jQuery("#search-tools__search-results").html(output);
              }
              return;
            },
            error: function(jqXHR, textStatus, errorThrown) {
              dispatch({
                eventName: "log",
                message: "SearchTools: unable to complete response"
              });
            }
          });
        }
      }
    }
  };

  /**
   * Show the search results in menu
   * @param {Object} featureInfoCollection GeoJson feature collection
   */
  let showSearchInfoFeatures = function(featureInfoCollection) {
    var title = "Risultati";
    if (!featureInfoCollection) {
      return;
    }
    var body = AppTemplates.renderInfoFeatures(featureInfoCollection);
    $("#search-tools__search-results").html(body);
  };

  /**
   * Mostra dei risultati generici ricavati ad esempio da un reverseGeocoding
   * @param  {object} data Elenco di oggetti
   * @return {null}
   */
  var displayGenericResults = function(data) {
    var results = [];
    if (data.length > 0) {
      var resultsIndex = [];
      var results = [];
      for (var i = 0; i < data.length; i++) {
        //ricavo il layer relativo
        var layer = AppStore.getLayerByName(data[i].id.split(".")[0]);
        if (layer) {
          var cent = null;
          if (data[i].geometry.coordinates[0][0]) {
            cent = AppMap.getCentroid(data[i].geometry.coordinates[0]);
          } else {
            cent = AppMap.getCentroid(data[i].geometry.coordinates);
          }
          var item = data[i];
          //salvo il crs della feature
          item.crs = data.crs;
          //item.id = currentLayer;
          results.push({
            display_name: layer.layerName + "-" + data[i].properties[layer.labelField],
            lon: cent[0],
            lat: cent[1],
            item: item
          });
          resultsIndex.push(data[i].properties[layer.labelField]);
        }
      }
      searchResults = results;
      //renderizzo i risultati
      var templateTemp = templateSearchResultsLayers();
      var output = templateTemp(results);
      jQuery("#search-tools__search-results").html(output);
    } else {
      var templateTemp = templateResultEmpty();
      var output = templateTemp();
      jQuery("#search-tools__search-results").html(output);
    }
  };

  var selectLayer = function(layer) {
    $("#search-tools__select-layers").val(layer);
  };

  function SortByDisplayName(a, b) {
    var aName = a.display_name.toLowerCase();
    var bName = b.display_name.toLowerCase();
    return aName < bName ? -1 : aName > bName ? 1 : 0;
  }

  return {
    displayGenericResults: displayGenericResults,
    render: render,
    templateSearchNominatim: templateSearchNominatim,
    init: init,
    doSearchAddressNominatim: doSearchAddressNominatim,
    updateComuniNominatim: updateComuniNominatim,
    zoomToItemNominatim: zoomToItemNominatim,
    doSearchAddressWMSG: doSearchAddressWMSG,
    doSearchLayers: doSearchLayers,
    selectLayer: selectLayer,
    showSearchInfoFeatures: showSearchInfoFeatures,
    showSearchAddress: showSearchAddress,
    showSearchLayers: showSearchLayers,
    //zoomToItemWFSGeoserver: zoomToItemWFSGeoserver,
    zoomToItemLayer: zoomToItemLayer
  };
})();

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

let SelectTools = (function() {
  let isRendered = false;
  let selectLayers = [];
  let selectionResult = [];

  let init = function init(layers) {
    selectLayers = layers.filter(function(layer) {
      return layer.labelField != null && layer.labelField != "";
    });

    let btn = $("<button/>", {
      class: "btn-floating btn-large waves-effect waves-light ",
      click: function(e) {
        e.preventDefault();
        dispatch("show-select-tools");
      }
    }).append("<i class='large material-icons '>select_all</i>");
    $("#menu-toolbar").append(btn);

    let divSelect = $("<div />", { id: "select-tools", class: "lam-menu-panel-content-item" });
    $("#menu-panel__content").append(divSelect);

    Dispatcher.bind("show-select-tools", function(payload) {
      AppToolbar.toggleToolbarItem("select-tools");
      if (AppToolbar.getCurrentToolbarItem() === "select-tools") {
        dispatch("set-select");
      } else {
        dispatch("unset-select");
      }
      dispatch("clear-layer-info");
    });

    Dispatcher.bind("set-select", function(payload) {
      AppMap.removeSelectInteraction();
      AppMap.addSelectInteraction(payload.type);
    });

    Dispatcher.bind("unset-select", function(payload) {
      AppMap.removeSelectInteraction();
      AppMap.clearLayerSelection();
      AppMap.clearLayerSelectionMask();
    });

    Dispatcher.bind("start-selection-search", function(payload) {
      AppMap.clearLayerSelection();
      let coords = payload.coords;
      if (!coords) {
        coords = AppMap.getSelectionMask();
      }
      let layerName = payload.layerName;
      if (!layerName) {
        layerName = $("#select-tools__layers option:selected").val();
      }
      if (!coords || !layerName) {
        dispatch({
          eventName: "log",
          message: "Parametri per la selezione non validi"
        });
        return;
      }
      SelectTools.doSelectionLayers(coords, layerName);
    });

    AppToolbar.addResetToolsEvent({
      eventName: "unset-select"
    });
  };

  let render = function(layers) {
    if (!isRendered) {
      init(layers);
    }
    let templateTemp = templateSelect();
    let output = templateTemp();
    jQuery("#select-tools").html(output);
    //forzo che il contenuto non sia visualizzato
    $("#select-tools__content").hide();

    $("#select-tools__layers").on("change", function() {
      dispatch({
        eventName: "start-selection-search"
      });
    });

    try {
      M.AutoInit();
      $(".dropdown-trigger").dropdown();
    } catch (e) {
    } finally {
    }

    isRendered = true;
  };

  let templateSelect = function() {
    let template = "";
    //pannello ricerca via
    template += '<h4 class="lam-title">Seleziona</h4>';
    template += '<div class="lam-card z-depth-2 lam-full-height">';
    template += "<div class='mb-2'>";
    template += templateLayersInput(selectLayers);
    template += "</div>";
    return Handlebars.compile(template);
  };

  /**
   * General html code that will be injected in order to display the layer tools
   */
  let templateLayersInput = function(selectLayers) {
    let template = "";
    template += '<select id="select-tools__layers" class="input-field">';
    template += '<option value="">Seleziona layer</option>';
    selectLayers.forEach(function(layer) {
      template += '<option value="' + layer.layer + '">' + layer.layerName + "</option>";
    });
    template += "</select>";
    template += "<p>Disegna un poligono sulla mappa per avviare la selezione</p>";
    template += "<div id='select-tools__results'></div>";

    return template;
  };

  /**
   * Display the list of the WFS Layers results in the left panel
   * @param {Object} results
   */
  let templateSelectionResults = function(results) {
    template = '<ul class="mdl-list">';
    template += "{{#each this}}";
    template += '<li class="mdl-list__item">';
    template +=
      '<i class="material-icons md-icon">&#xE55F;</i><a href="#" onclick="SelectTools.zoomToItem({{{lon}}}, {{{lat}}}, {{@index}}, true);return false">';
    template += "{{{display_name}}}";
    template += "</a>";
    template += "</li>";
    template += "{{/each}}";
    template += "</ul>";

    template += "<button onclick='SelectTools.exportCSVFile();'>Esporta risultati</button>";

    return Handlebars.compile(template);
  };

  let templateEmpty = function(results) {
    let template = "<p></p>";
    return Handlebars.compile(template);
  };

  let templateResultEmpty = function(results) {
    let template = "<p>Non sono stati trovati risultati.</p>";
    return Handlebars.compile(template);
  };

  let deleteFeatures = function() {
    dispatch({
      eventName: "delete-selection"
    });
  };

  /**
   * Start the selection on the specified layer
   * @param {Array} coords coordinate of the selected polygon
   */
  let doSelectionLayers = function(coords, currentLayer) {
    if (Array.isArray(coords)) coords = coords[0];
    let coordsString = coords
      .map(function(coord) {
        return coord[0] + " " + coord[1];
      })
      .join(",");
    let cql = "INTERSECTS(ORA_GEOMETRY, Polygon((" + coordsString + ")))";

    let currentSearchDate = new Date().getTime();
    let searchDate = new Date().getTime();

    jQuery("#select-tools__results").html("");
    let layers = selectLayers.filter(function(layer) {
      return layer.layer == currentLayer;
    });
    if (layers.length == 0) {
      dispatch({ eventName: "log", message: "Layer " + currentLayer + "non valido" });
      return;
    }

    let layer = layers[0];
    let url = layer.mapUri;
    url =
      url.replace("/wms", "/") +
      "ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
      layer.layer +
      "&maxFeatures=50&outputFormat=text%2Fjavascript&cql_filter=" +
      cql;

    $.ajax({
      dataType: "jsonp",
      url: url,
      jsonp: true,
      jsonpCallback: "parseResponse",
      success: function(data) {
        //verifica che la ricerca sia ancora valida
        if (currentSearchDate > searchDate) {
          return;
        }
        let results = [];
        if (data.features.length > 0) {
          let resultsIndex = [];
          let results = [];
          for (let i = 0; i < data.features.length; i++) {
            if ($.inArray(data.features[i].properties[layer.labelField], resultsIndex) === -1) {
              //aggiungo la feature alla mappa
              AppMap.addFeatureSelectionToMap(data.features[i].geometry, data.crs);
              let cent = null;
              if (data.features[i].geometry.coordinates[0][0]) {
                cent = AppMap.getCentroid(data.features[i].geometry.coordinates[0]);
              } else {
                cent = data.features[i].geometry.coordinates;
              }
              let item = data.features[i];
              item.crs = data.crs; //salvo il crs della feature
              item.layerGid = layer.gid;
              //item.id = currentLayer;
              results.push({
                display_name: data.features[i].properties[layer.labelField],
                lon: cent[0],
                lat: cent[1],
                item: item
              });
              resultsIndex.push(data.features[i].properties[layer.labelField]);
            }
          }
          selectionResult = results.sort(sortByDisplayName);
          //renderizzo i risultati
          let templateTemp = templateSelectionResults();
          let output = templateTemp(selectionResult);
          jQuery("#select-tools__results").append(output);
        } else {
          let templateTemp = templateResultEmpty();
          let output = templateTemp();
          jQuery("#select-tools__results").html(output);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        dispatch({
          eventName: "log",
          message: "SelectTools: unable to complete response"
        });
        dispatch({
          eventName: "show-message",
          message: "Non è stato possibile completare la richiesta."
        });
      }
    });
  };

  /**
   * Zoom the map to the lon-lat given and show the infobox of the given item index
   * @param {float} lon
   * @param {float} lat
   * @param {int} index Item's index in the result array
   * @param {boolean} showInfo
   */
  var zoomToItem = function(lon, lat, index, showInfo) {
    if (selectionResult[index]) {
      dispatch({
        eventName: "zoom-geometry",
        geometry: selectionResult[index].item.geometry
      });
      if (showInfo) {
        dispatch({
          eventName: "show-info-items",
          features: selectionResult[index].item
        });
      }
      let payload = {
        eventName: "add-feature-info-map",
        geometry: selectionResult[index].item.geometry
      };
      try {
        payload.srid = selectionResult[index].item.crs;
      } catch (e) {
        payload.srid = null;
      }
      dispatch(payload);
      dispatch("hide-menu-mobile");
    } else {
      dispatch({
        eventName: "zoom-lon-lat",
        zoom: 18,
        lon: parseFloat(lon),
        lat: parseFloat(lat),
        eventName: "add-wkt-info-map",
        wkt: "POINT(" + lon + " " + lat + ")"
      });
      dispatch("hide-menu-mobile");
    }
  };

  function sortByDisplayName(a, b) {
    var aName = a.display_name.toLowerCase();
    var bName = b.display_name.toLowerCase();
    return aName < bName ? -1 : aName > bName ? 1 : 0;
  }

  let convertToCSV = function(objArray) {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "";
    for (var i = 0; i < array.length; i++) {
      var line = "";
      for (var index in array[i]) {
        if (line != "") line += ";";
        line += array[i][index];
      }
      str += line + "\r\n";
    }
    return str;
  };

  let exportCSVFile = function() {
    let items = selectionResult;
    let fileName = "esportazione.csv";
    var jsonObject = JSON.stringify(items);
    var csv = SelectTools.convertToCSV(jsonObject);
    var exportedFilenmae = fileName + ".csv";
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, exportedFilenmae); // IE 10+
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilenmae);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return {
    deleteFeatures: deleteFeatures,
    convertToCSV: convertToCSV,
    doSelectionLayers: doSelectionLayers,
    exportCSVFile: exportCSVFile,
    init: init,
    render: render,
    templateSelect: templateSelect,
    zoomToItem: zoomToItem
  };
})();

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
