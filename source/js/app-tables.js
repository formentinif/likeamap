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

let LamTables = (function () {
  let currentLayerGid = 0;
  let currentPageIndex = 0;
  let currentPageSize = 25;
  let sortAttribute = "OGR_FID";
  let currentFeatureCount = -1;

  let init = function () {
    LamDispatcher.bind("show-attribute-table", function (payload) {
      LamTables.renderLayerAttributeTable(payload.gid, payload.maxFeatures, payload.pageIndex, payload.sortBy);
    });
  };

  let renderLayerAttributeTable = function (layerGid, maxFeatures, pageIndex, sortBy) {
    if (currentLayerGid != layerGid) {
      currentLayerGid = layerGid;
      currentFeatureCount = -1;
    }
    if (maxFeatures) currentPageSize = maxFeatures;
    if (sortBy) sortAttribute = sortBy;
    currentPageIndex = pageIndex ? pageIndex : 0;
    //page index should be reset when overflows the feature count
    if (currentFeatureCount === -1) {
      currentPageIndex = 0;
    } else {
      if (currentFeatureCount < currentPageIndex * currentPageSize) currentPageIndex = 0;
    }

    let startIndex = pageIndex ? currentPageIndex * currentPageSize : 0;
    lamDispatch("show-loader");
    let layer = LamStore.getLayer(layerGid);
    if (!layer) return;
    let wfsUrl = LamMap.getWFSUrlfromLayer(layer, "text/javascript");
    //WFS version 2
    wfsUrl = wfsUrl.replace("version=1.0.0", "version=2.0.0");
    wfsUrl += "&sortBy=" + sortAttribute;
    wfsUrl += "&format_options=callback:LamTables.parseResponseTable";
    if (currentPageSize) wfsUrl += "&count=" + currentPageSize;
    if (startIndex) wfsUrl += "&startIndex=" + startIndex;
    $.ajax({
      dataType: "jsonp",
      url: wfsUrl,
      jsonp: true,
      cache: false,
      error: function (jqXHR, textStatus, errorThrown) {
        lamDispatch({
          eventName: "log",
          message: "LamTables: unable to complete response",
        });
        lamDispatch("hide-loader");
      },
    });
  };

  let parseResponseTable = function (data) {
    lamDispatch("hide-loader");
    let layer = LamStore.getLayer(currentLayerGid);
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
    let template = LamTemplates.getTemplate(currentLayerGid, layer.templateUrl, LamStore.getAppState().templatesRepositoryUrl);
    let tableTemplate = template ? LamTables.getTableTemplate(template, layer) : LamTemplates.standardTableTemplate(propsList[0], layer);
    let title = layer.layerName;
    let body = "";
    let compiledTemplate = Handlebars.compile(tableTemplate);
    body += compiledTemplate(propsList);
    //pulsanti paginazione
    body += "<div class='lam-grid lam-no-bg lam-mt-1'>";
    let startIndex = currentPageIndex * currentPageSize + 1;
    body += "<div class='lam-col'> N° ";
    body +=
      "" +
      startIndex +
      "-" +
      ((currentPageIndex + 1) * currentPageSize > currentFeatureCount ? currentFeatureCount : startIndex + currentPageSize - 1) +
      " su " +
      currentFeatureCount;
    body += "</div>";
    body += "<div class='lam-col'> Mostra ";
    body += "<select class='lam-select-small ' onchange='LamTables.updatePageSize(this)'>";
    for (let index = 25; index <= 100; index += 25) {
      body += "<option value='" + index + "' " + (index === currentPageSize ? "selected" : "") + ">" + index + "</option>\n";
    }
    body += " </select>";
    body += "</div>";
    body += "<div class='lam-col'>";
    body += " Pag. <select class='lam-select-small ' onchange='LamTables.updatePageIndex(this)'>";
    for (let index = 1; index <= Math.floor(currentFeatureCount / currentPageSize) + 1; index++) {
      body += "<option value='" + index + "' " + (index === currentPageIndex + 1 ? "selected" : "") + ">" + index + "</option>";
    }
    body += " </select>";

    body += "/" + (Math.floor(currentFeatureCount / currentPageSize) + 1);
    body += "</div>";
    body += "<div class='lam-col'>";
    if (currentPageIndex > 0) {
      body +=
        "<button class='lam-btn lam-btn-small' onclick=\"lamDispatch({ eventName: 'show-attribute-table', gid: '" +
        currentLayerGid +
        "', pageIndex: " +
        (currentPageIndex - 1) +
        ' });"><i class="lam-icon">' +
        LamResources.svgArrowLeft +
        "</i></button>";
    }
    if (propsList.length == currentPageSize) {
      body +=
        "<button class='lam-btn lam-btn-small' onclick=\"lamDispatch({ eventName: 'show-attribute-table', gid: '" +
        currentLayerGid +
        "', pageIndex:" +
        (currentPageIndex + 1) +
        ' });"><i class="lam-icon">' +
        LamResources.svgArrowRight +
        "</i></button>";
    }
    body += "</div>";
    body += "</div>";
    LamDom.showContent(LamEnums.showContentMode().InfoWindow, title, body);
  };

  let getTableTemplate = function (template, layer) {
    let attribute = getNormalizedSortAttribute();

    let str = "<table class='lam-table'>";
    str += "<tr>";
    for (let i = 0; i < template.fields.length; i++) {
      str += "<th class='" + (template.fields[i].field === attribute ? " lam-sorted " : "") + "' >";
      str +=
        "<i class='lam-pointer ' onclick=\"lamDispatch({ eventName: 'show-attribute-table', sortBy: '" +
        (template.fields[i].field === sortAttribute ? template.fields[i].field + " DESC" : template.fields[i].field) +
        "', gid: '" +
        layer.gid +
        "'  }); return false;\">";
      str += template.fields[i].field === attribute && !sortAttributeIsDescending(sortAttribute) ? LamResources.svgExpandLess16 : LamResources.svgExpandMore16;
      str += "</i></a>";
      str += template.fields[i].label + "</th>";
    }
    str += "</tr>";
    str += "{{#each this}}<tr>";
    for (let i = 0; i < template.fields.length; i++) {
      str += "<td>{{" + template.fields[i].field + "}}</td>";
    }
    str += "</tr>{{/each}}";
    str += "</table>";
    return str;
  };

  let updatePageSize = function (sender) {
    if ($(sender).val()) {
      LamTables.renderLayerAttributeTable(currentLayerGid, parseInt($(sender).val()), currentPageIndex, sortAttribute);
    }
  };
  let updatePageIndex = function (sender) {
    if ($(sender).val()) {
      LamTables.renderLayerAttributeTable(currentLayerGid, currentPageSize, parseInt($(sender).val()) - 1, sortAttribute);
    }
  };

  let getNormalizedSortAttribute = function () {
    let attributeName = sortAttribute || "";
    if (sortAttributeIsDescending(attributeName)) {
      attributeName = sortAttribute.slice(0, -5); //Descending
    }
    return attributeName;
  };

  let sortAttributeIsDescending = function (attribute) {
    return attribute.indexOf(" DESC", attribute.length - " DESC".length) !== -1;
  };

  return {
    init: init,
    renderLayerAttributeTable: renderLayerAttributeTable,
    getTableTemplate: getTableTemplate,
    parseResponseTable: parseResponseTable,
    updatePageSize: updatePageSize,
    updatePageIndex: updatePageIndex,
  };
})();
