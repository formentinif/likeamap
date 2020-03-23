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

var LamRequests = (function() {
  let requestsData = [];

  let addRequestData = function(key, data) {
    requestsData.push({
      key: key,
      data: data
    });
  };

  let removeRequestData = function(key) {
    requestsData = requestsData.filter(function(element) {
      return element.key != key;
    });
  };

  let getRequestData = function(key) {
    return requestsData.filter(function(element) {
      return element.key == key;
    });
  };

  let getRequestsData = function() {
    return requestsData;
  };

  /**
   * Sends a preload request using JSONP protocol. Even if JSONP has been replaced by CORS, geoserver sens a 404 response if not
   * authenticated and the Allow-Control-Allow-Origin is not always predictable
   */
  let sendPreloadRequest = function(url) {
    $.ajax({
      dataType: "jsonp",
      url: url + "&format_options=callback:LamRequests.parseResponsePreload",
      error: function(jqXHR, textStatus, errorThrown) {
        lamDispatch({
          eventName: "log",
          message: "LamSearchTools: unable to complete response preload"
        });
      }
    });
  };

  let parseResponsePreload = function(data) {
    if (!data.features.length) return;
    let layerId = data.features[0].id.split(".")[0];
    var layer = getRequestData(layerId);
    if (!layer.length) return;
    layer = layer[0].data;
    let vectorSource = new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      features: new ol.format.GeoJSON().readFeatures(data),
      strategy: ol.loadingstrategy.all
    });
    let vector = new ol.layer.Vector({
      //zIndex: parseInt(zIndex),
      source: vectorSource,
      visible: layer.getVisible(),
      style: LamMapStyles.getPreloadStyle(layer.vectorWidth, layer.vectorRadius)
    });
    try {
      vector.gid = layer.gid + "_preload";
      vector.hoverTooltip = layer.hoverTooltip;
      vector.srid = layer.srid;
      //LamMap. mainMap.addLayer(vector);
    } catch (error) {}
    LamMap.getMap().addLayer(vector);
    vector.setZIndex(parseInt(layer.zIndex));
    //vector.setMap(LamMap.getMap());
  };

  // let xhr = new XMLHttpRequest();
  // xhr.withCredentials = false;
  // xhr.open("GET", getWFSfromWMS(preloadUrl));
  // xhr.setRequestHeader("Accept", "*/*");
  // xhr.setRequestHeader("Sec-Fetch-Mode", "no-cors");
  // xhr.setRequestHeader("Sec-Fetch-Site", "cross-sited");
  // xhr.setRequestHeader("Host", "geoserver.comune.re.it");
  // let onError = function() {
  //   //vectorSource.removeLoadedExtent(extent);
  // };
  // xhr.onerror = onError;
  // xhr.onload = function() {
  //   if (xhr.status == 200) {
  //     vectorSource.addFeatures(vectorSource.getFormat().readFeatures(xhr.responseText));
  //   } else {
  //     onError();
  //   }
  // };
  // xhr.send();

  return {
    getRequestsData: getRequestsData,
    getRequestData: getRequestData,
    addRequestData: addRequestData,
    removeRequestData: removeRequestData,

    sendPreloadRequest: sendPreloadRequest,
    parseResponsePreload: parseResponsePreload
  };
})();
