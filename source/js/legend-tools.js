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
  var currentLegendPayload = false;

  var init = function init() {
    //events binding
    LamDispatcher.bind("show-legend", function(payload) {
      currentLegendPayload = payload;
      LamLegendTools.showLegend(payload.gid, payload.scaled, payload.showInfoWindow || LamStore.getAppState().openLegendInInfoWindow);
    });

    /**
     * Helper event to open legend for all layers at the current scale
     */
    LamDispatcher.bind("show-legend-visible-layers", function(payload) {
      currentLegendPayload = payload;
      let layers = LamStore.getVisibleLayers();
      LamLegendTools.showLegendLayers(layers, true, payload.showInfoWindow || LamStore.getAppState().openLegendInInfoWindow);
    });

    /**
     * Helper event to open legend for all layers with scale parameter
     */
    LamDispatcher.bind("show-full-legend-visible-layers", function(payload) {
      currentLegendPayload = payload;
      let layers = LamStore.getVisibleLayers();
      LamLegendTools.showLegendLayers(layers, payload.scaled, payload.showInfoWindow || LamStore.getAppState().openLegendInInfoWindow);
    });

    LamDispatcher.bind("update-legend", function() {
      LamLegendTools.updateLegend();
    });

    //laoding legend on map init based on appstate
    if (LamStore.getAppState().showLegendOnLoad) {
      LamDispatcher.dispatch({
        eventName: "show-full-legend-visible-layers",
        showInfoWindow: LamStore.getAppState().openLegendInInfoWindow,
        scaled: true
      });
    }

    //adding zoom-end event for automatic legend updates
    LamMap.addZoomEndEvent({
      eventName: "update-legend"
    });
  };

  var render = function(div) {
    if (!isRendered) {
      init();
    }
    isRendered = true;
  };

  var showLegend = function(gid, scaled, showInfoWindow) {
    $("#lam-legend-container").remove();
    var html = "<div id='lam-legend-container'>";
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
    html += "<div class='lam-layer-metadata'></div>";
    showLayerMetadata(thisLayer);
    if (thisLayer.attribution) {
      html += "<p>Dati forniti da " + thisLayer.attribution + "</p>";
    }
    if (scaled) {
      html +=
        "<div class='mt-2' style='display:flow-root;'><a href='#' class='lam-btn lam-depth-1' onclick=\"LamDispatcher.dispatch({ eventName: 'show-legend', gid: '" +
        gid +
        "', scaled: false })\">Visualizza legenda completa</a></div>";
    }
    html += "<div>";
    var layerName = "Legenda ";
    if (thisLayer) {
      layerName += " - " + thisLayer.layerName;
    }
    if (showInfoWindow) {
      LamDom.showContent(LamEnums.showContentMode().InfoWindow, layerName, html, "");
    } else {
      LamDom.showContent(LamEnums.showContentMode().LeftPanel, layerName, html, "");
    }
    return true;
  };

  var showLegendLayers = function(layers, scaled, showInfoWindow) {
    let html = $("<div />", {
      id: "lam-legend-container"
    });
    layers.forEach(function(layer) {
      if (!layer.hideLegend && layer.layerType != "group") {
        if (layer.legendUrl) {
          urlImg = layer.legendUrl;
        } else {
          urlImg = LamMap.getLegendUrl(layer.gid, scaled);
        }
        if (urlImg) {
          let img = $("<img />")
            .addClass("lam-legend")
            .attr("src", urlImg)
            .on("error", function() {
              $("#legend_" + layer.gid).addClass("lam-hidden");
            });
          let container = $("<div id='legend_" + layer.gid + "' />").addClass("lam-legend-container");
          container.append($("<h4>" + layer.layerName + "</h4>").addClass("lam-title-legend"));
          container.append(img);
          html.append(container);
        }
      }
    });
    let title = "Legenda dei temi attivi";
    if (html.html() === "") html.append("Per visualizzare la legenda rendi visibile uno o più temi.");
    if (showInfoWindow) {
      LamDom.showContent(
        LamEnums.showContentMode().InfoWindow,
        title,
        $("<div>")
          .append(html.clone())
          .html(),
        ""
      );
    } else {
      LamDom.showContent(
        LamEnums.showContentMode().LeftPanel,
        title,
        $("<div>")
          .append(html.clone())
          .html(),
        ""
      );
    }
  };

  let loadImage = function(imageSrc, success, error) {
    var img = new Image();
    img.onload = success;
    img.onerror = error;
    img.src = imageSrc;
  };

  var showLayerMetadata = function(layer) {
    if (!LamStore.getAppState().metaDataServiceUrlTemplate) return;
    var templateUrl = Handlebars.compile(LamStore.getAppState().metaDataServiceUrlTemplate);
    var urlService = templateUrl(layer);
    $.ajax({
      dataType: "jsonp",
      url: urlService + "&format_options=callback:LamLegendTools.parseResponseMetadata",
      jsonp: true,
      cache: false,
      error: function(jqXHR, textStatus, errorThrown) {
        lamDispatch({
          eventName: "log",
          message: "LamLegend: unable to complete response"
        });
        lamDispatch("hide-loader");
      }
    });
  };

  let parseResponseMetadata = function(data) {
    if (!data.features.length) return;
    var template = !LamStore.getAppState().metaDataTemplate ? LamTemplates.getTemplateMetadata() : Handlebars.compile(LamStore.getAppState().metaDataTemplate);
    var html = template(data.features[0].properties);
    $(".lam-layer-metadata").html(html.replace(/(?:\r\n|\r|\n)/g, "<br>"));
  };

  let updateLegend = function() {
    if ($("#lam-legend-container").is(":visible")) {
      LamDispatcher.dispatch(currentLegendPayload);
    }
  };

  return {
    init: init,
    parseResponseMetadata: parseResponseMetadata,
    render: render,
    showLegend: showLegend,
    showLegendLayers: showLegendLayers,
    updateLegend: updateLegend
  };
})();
