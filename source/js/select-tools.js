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

let LamSelectTools = (function () {
  let isRendered = false;
  let selectLayers = [];
  let selectionResult = [];
  let currentSearchDate = new Date().getTime();
  let currentSelectCoordinates;
  let sortAttribute = null;
  let init = function init(layers) {
    selectLayers = layers.filter(function (layer) {
      return layer.labelField != null && layer.labelField != "";
    });

    // let btn = $("<button/>", {
    //   class: "lam-btn lam-btn-floating lam-btn-large",
    //   click: function (e) {
    //     e.preventDefault();
    //     lamDispatch("show-select-tools");
    //   },
    // }).append("<i class='large lam-icon '>select_all</i>");
    // $("#menu-toolbar").append(btn);

    let divSelect = $("<div />", { id: "select-tools", class: "lam-panel-content-item" });
    $("#panel__content").append(divSelect);

    LamDispatcher.bind("show-select-tools", function (payload) {
      LamToolbar.toggleToolbarItem("select-tools");

      if (LamToolbar.getCurrentToolbarItem() === "select-tools") {
        LamStore.setInfoClickEnabled(false);
        lamDispatch("set-select");
      } else {
        lamDispatch("unset-select");
        LamStore.setInfoClickEnabled(true);
      }
      lamDispatch("clear-layer-info");
    });

    LamDispatcher.bind("set-select", function (payload) {
      LamMap.removeSelectInteraction();
      LamMap.addSelectInteraction(payload.type);
    });

    LamDispatcher.bind("unset-select", function (payload) {
      LamMap.removeSelectInteraction();
      LamMap.clearLayerSelection();
      LamMap.clearLayerSelectionMask();
    });

    LamDispatcher.bind("start-selection-search", function (payload) {
      LamMap.clearLayerSelection();
      let coords = payload.coords;
      if (!coords) {
        coords = LamMap.getSelectionMask();
      }
      currentSelectCoordinates = coords;
      let layerName = payload.layerName;
      if (!layerName) {
        layerName = $("#select-tools__layers option:selected").val();
      }
      if (!layerName) {
        lamDispatch({
          eventName: "show-message",
          message: "Selezionare un layer tra quelli disponibili",
          type: "warning",
        });
        return;
      }
      LamSelectTools.doSelectionLayers(coords);
    });

    LamToolbar.addResetToolsEvent({
      eventName: "unset-select",
    });
  };

  let render = function (layers) {
    if (!isRendered) {
      init(layers);
    }
    let templateTemp = templateSelect();
    let output = templateTemp();
    jQuery("#select-tools").html(output);
    //forzo che il contenuto non sia visualizzato
    $("#select-tools__content").hide();

    $("#select-tools__layers").on("change", function () {
      lamDispatch({
        eventName: "start-selection-search",
      });
    });

    try {
    } catch (e) {
    } finally {
    }

    isRendered = true;
  };

  let templateSelect = function () {
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
  let templateLayersInput = function (selectLayers) {
    let template = "";
    template += '<select id="select-tools__layers" class="lam-input">';
    template += '<option value="">Seleziona layer</option>';
    selectLayers.forEach(function (layer) {
      template += '<option value="' + layer.gid + '">' + layer.layerName + "</option>";
    });
    template += "</select>";
    template += "<p>Disegna un poligono sulla mappa. Doppio click per completare poligono e avviare la selezione</p>";
    template += "<div><button class='lam-btn' onclick='LamSelectTools.reloadSelection();'>Ricarica</button></div>";
    template += "<div id='select-tools__results'></div>";

    return template;
  };

  /**
   * Display the list of the WFS Layers results in the left panel
   * @param {Object} results
   */
  // let templateSelectionResults = function (results) {
  //   template = '<div class="lam-grid lam-grid-1">';
  //   template += "{{#each this}}";
  //   template += '<div class="lam-col">';
  //   template += '<i class="lam-icon md-icon">&#xE55F;</i><a href="#" onclick="LamSelectTools.zoomToItem({{{lon}}}, {{{lat}}}, {{@index}}, true);return false">';
  //   template += "{{{display_name}}}";
  //   template += "</a>";
  //   template += "</div>";
  //   template += "{{/each}}";
  //   template += "</div>";

  //   template += "<button onclick='LamSelectTools.exportCSVFile();'>Esporta risultati</button>";

  //   return Handlebars.compile(template);
  // };

  let deleteFeatures = function () {
    lamDispatch({
      eventName: "delete-selection",
    });
  };

  /**
   * Start the selection on the specified layer
   * @param {Array} coords coordinate of the selected polygon
   */
  let doSelectionLayers = function (coords) {
    if (!coords) return;
    let layer = getCurrentSelectLayer();
    if (Array.isArray(coords)) coords = coords[0];
    let coordsString = coords
      .map(function (coord) {
        return coord[0] + " " + coord[1];
      })
      .join(",");
    let cql = "INTERSECTS(" + LamStore.getLayerGeometryName(layer.gid) + ", Polygon((" + coordsString + ")))";

    jQuery("#select-tools__results").html("");
    let url = layer.mapUri;
    url =
      url.replace("/wms", "/") +
      "ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
      layer.layer +
      "&maxFeatures=9999999&outputFormat=text%2Fjavascript&cql_filter=" +
      cql;

    $.ajax({
      dataType: "jsonp",
      url: url + "&format_options=callback:LamSelectTools.parseResponseSelect",
      cache: false,
      jsonp: true,
      error: function (jqXHR, textStatus, errorThrown) {
        // lamDispatch({
        //   eventName: "log",
        //   message: "LamSelectTools: unable to complete response",
        // });
      },
    });
  };

  let parseResponseSelect = function (data) {
    lamDispatch("hide-loader");
    //verifica che la ricerca sia ancora valida
    let searchDate = new Date().getTime();
    if (currentSearchDate > searchDate) {
      return;
    }
    let layer = getCurrentSelectLayer();
    if (!data.features.length) {
      jQuery("#select-tools__results").html(LamTemplates.getResultEmpty());
      return;
    }
    if (data.features.length > 0) {
      parseSelectTable(data);

      let resultsIndex = [];
      let results = [];
      for (let i = 0; i < data.features.length; i++) {
        //aggiungo la feature alla mappa
        LamStore.getAppState().currentInfoItems = data;
        selectionResult = data;
        LamMap.addFeatureSelectionToMap(data.features[i], data.crs, layer.gid);
        //   let cent = null;
        //   if (data.features[i].geometry.coordinates[0][0]) {
        //     cent = LamMap.getCentroid(data.features[i].geometry.coordinates[0]);
        //   } else {
        //     cent = data.features[i].geometry.coordinates;
        //   }
        //   let item = data.features[i];
        //   item.crs = data.crs; //salvo il crs della feature
        //   item.layerGid = layer.gid;
        //   results.push({
        //     display_name: data.features[i].properties[layer.labelField],
        //     lon: cent[0],
        //     lat: cent[1],
        //     item: item,
        //   });
        //   resultsIndex.push(data.features[i].properties[layer.labelField]);
      }
      // selectionResult = results.sort(sortByDisplayName);
      // parseSelectTable(selectionResult);
    }
  };

  let parseSelectTable = function (data) {
    let layer = getCurrentSelectLayer();
    currentFeatureCount = data.totalFeatures;
    if (data.features) {
      data = data.features;
    }
    if (!Array.isArray(data)) data = [data];
    let propsList = [];
    for (let i = 0; i < data.length; i++) {
      let props = data[i].properties ? data[i].properties : data[i];
      propsList.push(props);
    }
    let template = LamTemplates.getTemplate(layer.gid, layer.templateUrl, LamStore.getAppState().templatesRepositoryUrl);
    let tableTemplate = template ? LamSelectTools.getSelectTemplate(template, layer) : LamTemplates.standardTableTemplate(propsList[0], layer);
    let title = layer.layerName;
    let body = "";
    let compiledTemplate = Handlebars.compile(tableTemplate);
    body += compiledTemplate(propsList);
    LamDom.showContent(LamEnums.showContentMode().InfoWindow, title, body);
  };

  let getCurrentSelectLayerGid = function () {
    return $("#select-tools__layers option:selected").val();
  };
  let getCurrentSelectLayer = function () {
    let layers = selectLayers.filter(function (layer) {
      return layer.gid == getCurrentSelectLayerGid();
    });
    if (layers.length == 0) {
      lamDispatch({ eventName: "log", message: "Layer " + getCurrentSelectLayerGid() + "non valido" });
      return;
    }
    return layers[0];
  };

  let getSelectTemplate = function (template, layer) {
    //sezione relations
    let layerRelations = LamTemplates.getLayerRelations(layer.gid);
    //sezione charts
    let layerCharts = LamTemplates.getLayerCharts(layer.gid);

    let attribute = LamTables.getNormalizedSortAttribute();
    let str = "<table class='lam-table'>";
    str += "<tr>";
    str += "<th></th>";

    if (layerRelations.length) {
      str += "<th>Relazioni</th>";
    }
    if (layerCharts.length) {
      str += "<th>Grafici</th>";
    }

    for (let i = 0; i < template.fields.length; i++) {
      str += "<th class='" + (template.fields[i].field === attribute ? " lam-sorted " : "") + "' >";
      str +=
        "<i class='lam-pointer ' onclick=\"lamDispatch({ eventName: 'render-relation-table', sortBy: '" +
        (template.fields[i].field === sortAttribute ? template.fields[i].field + " DESC" : template.fields[i].field) +
        "'  }); return false;\">";
      str += template.fields[i].field === attribute && !sortAttributeIsDescending(sortAttribute) ? LamResources.svgExpandLess16 : LamResources.svgExpandMore16;
      str += "</i></a>";
      str += (!template.fields[i].header ? template.fields[i].label : template.fields[i].header) + "</th>";
    }

    str += "</tr>";
    //feature
    str += "{{#each this}}<tr>";
    str += "<td>";
    str +=
      "<div class='lam-feature__icons'>" +
      '<i title="Centra sulla mappa" class="lam-feature__icon" onclick="LamDispatcher.dispatch({ eventName: \'zoom-info-feature\', index: \'' +
      "{{@index}}" +
      "' })\">" +
      LamResources.svgMarker +
      "</i></div>";
    str += "</td>";
    if (layerRelations.length) {
      str += "<td><a class='lam-link lam-pointer' onclick='LamSelectTools.toggle(this)'>Relazioni</a><div class='lam-hidden'>";
      if (layerRelations.length) str += LamTemplates.relationsTemplate(layerRelations, null, null);
      str += "</div></td>";
    }
    if (layerCharts.length) {
      str += "<td><a class='lam-link lam-pointer' onclick='LamSelectTools.toggle(this)'>Grafici</a><div class='lam-hidden'>";
      if (layerCharts.length) str += LamTemplates.chartsTemplate(layerCharts, null);
      str += "</div></td>";
    }

    for (let i = 0; i < template.fields.length; i++) {
      str += LamTemplates.getFieldTemplate(template.fields[i]);
    }
    str += "</tr>{{/each}}";
    str += "</table>";
    str += "<div><button class='lam-btn' onclick='LamSelectTools.exportCSVFile();'>Esporta risultati</button></div>";
    return str;
  };

  /**
   * Zoom the map to the lon-lat given and show the infobox of the given item index
   * @param {float} lon
   * @param {float} lat
   * @param {int} index Item's index in the result array
   * @param {boolean} showInfo
   */
  // var zoomToItem = function (lon, lat, index, showInfo) {
  //   if (selectionResult[index]) {
  //     lamDispatch({
  //       eventName: "zoom-geometry",
  //       geometry: selectionResult[index].item.geometry,
  //     });
  //     if (showInfo) {
  //       lamDispatch({
  //         eventName: "show-info-items",
  //         features: selectionResult[index].item,
  //       });
  //     }
  //     let payload = {
  //       eventName: "add-geometry-info-map",
  //       geometry: selectionResult[index].item.geometry,
  //     };
  //     try {
  //       payload.srid = selectionResult[index].item.crs;
  //     } catch (e) {
  //       payload.srid = null;
  //     }
  //     lamDispatch(payload);
  //     lamDispatch("hide-menu-mobile");
  //   } else {
  //     lamDispatch({
  //       eventName: "zoom-lon-lat",
  //       zoom: 18,
  //       lon: parseFloat(lon),
  //       lat: parseFloat(lat),
  //       eventName: "add-wkt-info-map",
  //       wkt: "POINT(" + lon + " " + lat + ")",
  //     });
  //     lamDispatch("hide-menu-mobile");
  //   }
  // };

  // function sortByDisplayName(a, b) {
  //   var aName = a.display_name.toLowerCase();
  //   var bName = b.display_name.toLowerCase();
  //   return aName < bName ? -1 : aName > bName ? 1 : 0;
  // }

  let exportCSVFile = function () {
    let layer = getCurrentSelectLayer();
    let template = LamTemplates.getTemplate(layer.gid, layer.templateUrl, LamStore.getAppState().templatesRepositoryUrl);
    let fileName = "esportazione.csv";
    var jsonObject = JSON.stringify(
      selectionResult.features.map(function (element) {
        return element.properties;
      })
    );
    LamDownloadTools.downloadCSVFile(fileName, jsonObject, template);
  };

  let toggle = function (e) {
    $(e).next().toggle();
  };

  let reloadSelection = function () {
    lamDispatch({
      eventName: "start-selection-search",
      coords: currentSelectCoordinates,
    });
  };

  return {
    deleteFeatures: deleteFeatures,
    doSelectionLayers: doSelectionLayers,
    exportCSVFile: exportCSVFile,
    getCurrentSelectLayerGid: getCurrentSelectLayerGid,
    getCurrentSelectLayer: getCurrentSelectLayer,
    getSelectTemplate: getSelectTemplate,
    init: init,
    parseResponseSelect: parseResponseSelect,
    render: render,
    reloadSelection: reloadSelection,
    templateSelect: templateSelect,
    //zoomToItem: zoomToItem,
    toggle: toggle,
  };
})();
