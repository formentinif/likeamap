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

let LamSelectTools = (function() {
  let isRendered = false;
  let selectLayers = [];
  let selectionResult = [];

  let init = function init(layers) {
    selectLayers = layers.filter(function(layer) {
      return layer.labelField != null && layer.labelField != "";
    });

    let btn = $("<button/>", {
      class: "lam-btn lam-btn-floating lam-btn-large",
      click: function(e) {
        e.preventDefault();
        lamDispatch("show-select-tools");
      }
    }).append("<i class='large lam-icon '>select_all</i>");
    $("#menu-toolbar").append(btn);

    let divSelect = $("<div />", { id: "select-tools", class: "lam-panel-content-item" });
    $("#panel__content").append(divSelect);

    LamDispatcher.bind("show-select-tools", function(payload) {
      LamToolbar.toggleToolbarItem("select-tools");
      if (LamToolbar.getCurrentToolbarItem() === "select-tools") {
        lamDispatch("set-select");
      } else {
        lamDispatch("unset-select");
      }
      lamDispatch("clear-layer-info");
    });

    LamDispatcher.bind("set-select", function(payload) {
      LamMap.removeSelectInteraction();
      LamMap.addSelectInteraction(payload.type);
    });

    LamDispatcher.bind("unset-select", function(payload) {
      LamMap.removeSelectInteraction();
      LamMap.clearLayerSelection();
      LamMap.clearLayerSelectionMask();
    });

    LamDispatcher.bind("start-selection-search", function(payload) {
      LamMap.clearLayerSelection();
      let coords = payload.coords;
      if (!coords) {
        coords = LamMap.getSelectionMask();
      }
      let layerName = payload.layerName;
      if (!layerName) {
        layerName = $("#select-tools__layers option:selected").val();
      }
      if (!coords || !layerName) {
        lamDispatch({
          eventName: "log",
          message: "Parametri per la selezione non validi"
        });
        return;
      }
      LamSelectTools.doSelectionLayers(coords, layerName);
    });

    LamToolbar.addResetToolsEvent({
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
      lamDispatch({
        eventName: "start-selection-search"
      });
    });

    try {
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
    template += '<div class="lam-card lam-depth-2 lam-full-height">';
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
    template += '<select id="select-tools__layers" class="lam-input">';
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
    template = '<div class="lam-grid lam-grid-1">';
    template += "{{#each this}}";
    template += '<div class="lam-col">';
    template += '<i class="lam-icon md-icon">&#xE55F;</i><a href="#" onclick="LamSelectTools.zoomToItem({{{lon}}}, {{{lat}}}, {{@index}}, true);return false">';
    template += "{{{display_name}}}";
    template += "</a>";
    template += "</div>";
    template += "{{/each}}";
    template += "</div>";

    template += "<button onclick='LamSelectTools.exportCSVFile();'>Esporta risultati</button>";

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
    lamDispatch({
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
      lamDispatch({ eventName: "log", message: "Layer " + currentLayer + "non valido" });
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
              LamMap.addFeatureSelectionToMap(data.features[i].geometry, data.crs);
              let cent = null;
              if (data.features[i].geometry.coordinates[0][0]) {
                cent = LamMap.getCentroid(data.features[i].geometry.coordinates[0]);
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
        lamDispatch({
          eventName: "log",
          message: "LamSelectTools: unable to complete response"
        });
        lamDispatch({
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
      lamDispatch({
        eventName: "zoom-geometry",
        geometry: selectionResult[index].item.geometry
      });
      if (showInfo) {
        lamDispatch({
          eventName: "show-info-items",
          features: selectionResult[index].item
        });
      }
      let payload = {
        eventName: "add-geometry-info-map",
        geometry: selectionResult[index].item.geometry
      };
      try {
        payload.srid = selectionResult[index].item.crs;
      } catch (e) {
        payload.srid = null;
      }
      lamDispatch(payload);
      lamDispatch("hide-menu-mobile");
    } else {
      lamDispatch({
        eventName: "zoom-lon-lat",
        zoom: 18,
        lon: parseFloat(lon),
        lat: parseFloat(lat),
        eventName: "add-wkt-info-map",
        wkt: "POINT(" + lon + " " + lat + ")"
      });
      lamDispatch("hide-menu-mobile");
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
    var csv = LamSelectTools.convertToCSV(jsonObject);
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
