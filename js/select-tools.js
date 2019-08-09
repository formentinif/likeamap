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
    debugger;
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

    let divSelect = $("<div />", { id: "select-tools", class: "lk-menu-panel-content-item" });
    $("#menu-panel__content").append(divSelect);

    Dispatcher.bind("show-select-tools", function(payload) {
      AppStore.showMenuContent("select-tools");
      if (AppStore.getPanelContentItemSelected() === "select-tools") {
        dispatch("set-select");
      } else {
        dispatch("unset-select");
      }
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

    AppStore.addResetToolsEvent({
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
    template += '<h4 class="lk-title">Seleziona</h4>';
    template += '<div class="lk-card z-depth-2 lk-full-height">';
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
    debugger;
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
        debugger;
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
          eventName: "show-info-item",
          data: selectionResult[index].item
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
        eventName: "add-info-map",
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
