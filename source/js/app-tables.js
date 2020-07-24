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

  let init = function () {
    LamDispatcher.bind("show-attribute-table", function (payload) {
      let maxFeatures = payload.maxFeatures ? payload.maxFeatures : currentPageSize;
      currentPageIndex = payload.pageIndex ? payload.pageIndex : 0;
      let startIndex = payload.pageIndex ? currentPageIndex * currentPageSize : 0;
      LamTables.getLayerAttributeTable(payload.gid, maxFeatures, startIndex, sortAttribute);
    });
  };

  let getLayerAttributeTable = function (layerGid, maxFeatures, startIndex, sortBy) {
    lamDispatch("show-loader");
    currentLayerGid = layerGid;
    let layer = LamStore.getLayer(layerGid);
    if (!layer) return;
    let wfsUrl = LamMap.getWFSUrlfromLayer(layer, "text/javascript");
    //WFS 2
    wfsUrl = wfsUrl.replace("version=1.0.0", "version=2.0.0");
    wfsUrl += "&sortBy=" + sortBy;
    wfsUrl += "&format_options=callback:LamTables.parseResponseTable";
    if (maxFeatures) wfsUrl += "&count=" + maxFeatures;
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
    let tableTemplate = template ? LamTemplates.getTableTemplate(template, layer) : LamTemplates.standardTableTemplate(propsList[0], layer);
    let title = layer.layerName;
    let body = "";
    let compiledTemplate = Handlebars.compile(tableTemplate);
    body += compiledTemplate(propsList);
    //pulsanti paginazione
    body += "<div class='lam-grid lam-no-bg lam-mt-1'>";
    body += "<div class='lam-col'>";
    if (currentPageIndex > 0) {
      body +=
        "<button class='lam-btn' onclick=\"lamDispatch({ eventName: 'show-attribute-table', gid: '" +
        currentLayerGid +
        "', pageIndex: " +
        (currentPageIndex - 1) +
        ' });"> << </button>';
    }
    body += "</div>";
    body += "<div class='lam-col'>Pag. " + (currentPageIndex + 1) + "</div>";
    body += "<div class='lam-col'>";
    if (propsList.length == currentPageSize) {
      body +=
        "<button class='lam-btn' onclick=\"lamDispatch({ eventName: 'show-attribute-table', gid: '" +
        currentLayerGid +
        "', pageIndex:" +
        (currentPageIndex + 1) +
        ' });"> >> </button>';
    }
    body += "</div>";
    body += "</div>";
    LamDom.showContent(LamEnums.showContentMode().InfoWindow, title, body);
  };

  return {
    init: init,
    getLayerAttributeTable: getLayerAttributeTable,
    parseResponseTable: parseResponseTable,
  };
})();
