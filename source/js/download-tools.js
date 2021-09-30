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

var LamDownloadTools = (function () {
  var isRendered = false;

  var init = function init() {
    //events binding
    LamDispatcher.bind("download-relation-results", function (payload) {
      LamDownloadTools.downloadRelationResults();
    });
  };

  var render = function (div) {
    if (!isRendered) {
      init();
    }
    isRendered = true;
  };

  let downloadRelationResults = function () {
    var results = LamRelations.getRelationResults();
    if (!results.data || !results.template) return;
    let propsList = [];
    var csv = "";
    for (let i = 0; i < results.data.length; i++) {
      propsList.push(results.data[i].properties ? results.data[i].properties : results.data[i]);
    }
    results.template.fields.forEach(function (field) {
      csv += '"' + field.label + '";';
    });
    csv += "\n";
    propsList.forEach(function (row) {
      results.template.fields.forEach(function (field) {
        csv += '"' + row[field.field] + '";';
      });
      csv += "\n";
    });

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = results.template.title + ".csv";
    hiddenElement.click();
  };

  let convertToCSV = function (objArray, template) {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "";

    template.fields.forEach(function (field) {
      str += '"' + field.label + '";';
    });
    str += "\n";

    array.forEach(function (row) {
      template.fields.forEach(function (field) {
        str += '"' + row[field.field] + '";';
      });
      str += "\r\n";
    });
    return str;
  };

  let downloadCSVFile = function (fileName, jsonObject, template) {
    var csv = LamDownloadTools.convertToCSV(jsonObject, template);
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
    init: init,
    convertToCSV: convertToCSV,
    downloadCSVFile: downloadCSVFile,
    render: render,
    downloadRelationResults: downloadRelationResults,
  };
})();
