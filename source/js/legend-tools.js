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

var LamLegendTools = (function() {
  var isRendered = false;

  var init = function init() {
    //events binding
    LamDispatcher.bind("show-legend", function(payload) {
      LamLegendTools.showLegend(payload.gid, payload.scaled, payload.showInfoWindow);
    });

    LamDispatcher.bind("show-legend-visible-layers", function(payload) {
      let layers = LamStore.getVisibleLayers();
      LamLegendTools.showLegendLayers(layers, true, true);
    });
  };

  var render = function(div) {
    if (!isRendered) {
      init();
    }
    isRendered = true;
  };

  var showLegend = function(gid, scaled, showInfoWindow) {
    var html = "<div>";
    var urlImg = "";
    //checking custom url
    var thisLayer = LamStore.getLayer(gid);
    if (!thisLayer.hideLegend) {
      if (thisLayer.legendUrl) {
        urlImg = thisLayer.legendUrl;
      } else {
        urlImg = LamMap.getLegendUrl(gid, scaled);
      }
      if (urlImg) {
        html += "<img class='lam-legend' src='" + urlImg + "' />";
      }
    }
    if (thisLayer.attribution) {
      html += "<p>Dati forniti da " + thisLayer.attribution + "</p>";
    }
    if (scaled) {
      html +=
        "<p class='mt-2'><a href='#' class='lam-btn lam-depth-1' onclick=\"LamDispatcher.dispatch({ eventName: 'show-legend', gid: '" +
        gid +
        "', scaled: false, showInfoWindow: true })\">Visualizza legenda completa</a></p>";
    }
    html += "<div>";
    var layerName = "Legenda ";
    if (thisLayer) {
      layerName += " - " + thisLayer.layerName;
    }
    if (showInfoWindow) {
      LamStore.showContentInfoWindow(layerName, html, "");
    } else {
      LamStore.showContent(layerName, html, "");
    }
    return true;
  };

  var showLegendLayers = function(layers, scaled, showInfoWindow) {
    let html = "";
    layers.forEach(function(layer) {
      if (!layer.hideLegend) {
        if (layer.legendUrl) {
          urlImg = layer.legendUrl;
        } else {
          urlImg = LamMap.getLegendUrl(layer.gid, scaled);
        }
        if (urlImg) {
          html += "<div><img class='lam-legend' src='" + urlImg + "' /></div>";
        }
      }
      let title = "Legenda";
      if (showInfoWindow) {
        LamStore.showContentInfoWindow(title, html, "");
      } else {
        LamStore.showContent(title, html, "");
      }
    });
  };

  return {
    init: init,
    render: render,
    showLegend: showLegend,
    showLegendLayers: showLegendLayers
  };
})();