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

var LamLegendTools = (function () {
  var isRendered = false;
  var currentLegendPayload = false;

  var init = function init() {
    //events binding
    LamDispatcher.bind("show-legend", function (payload) {
      currentLegendPayload = payload;
      LamLegendTools.showLegend(payload.gid, payload.scaled, payload.showInfoWindow || LamStore.getAppState().openLegendInInfoWindow);
    });

    /**
     * Helper event to open legend for all layers at the current scale
     */
    LamDispatcher.bind("show-legend-visible-layers", function (payload) {
      currentLegendPayload = payload;
      let layers = LamStore.getVisibleLayers();
      LamLegendTools.showLegendLayers(layers, true, payload.showInfoWindow || LamStore.getAppState().openLegendInInfoWindow);
    });

    /**
     * Helper event to open legend for all layers at the current scale that toggles the main menu
     *
     */
    LamDispatcher.bind("show-legend-visible-layers-toggle", function (payload) {
      //if legend is visible toggle
      if ($("#lam-legend-container").is(":visible")) {
        LamToolbar.toggleToolbarItem("legend", false);
        return;
      }
      //else show legend
      payload.eventName = "show-legend-visible-layers"; //toggle once
      currentLegendPayload = payload;
      let layers = LamStore.getVisibleLayers();
      LamLegendTools.showLegendLayers(layers, true, payload.showInfoWindow || LamStore.getAppState().openLegendInInfoWindow);
    });

    /**
     * Helper event to open legend for all layers with scale parameter
     */
    LamDispatcher.bind("show-full-legend-visible-layers", function (payload) {
      currentLegendPayload = payload;
      let layers = LamStore.getVisibleLayers();
      LamLegendTools.showLegendLayers(layers, payload.scaled, payload.showInfoWindow || LamStore.getAppState().openLegendInInfoWindow);
    });

    LamDispatcher.bind("update-legend", function () {
      LamLegendTools.updateLegend();
    });

    //laoding legend on map init based on appstate
    if (LamStore.getAppState().showLegendOnLoad) {
      LamDispatcher.dispatch({
        eventName: "show-full-legend-visible-layers",
        showInfoWindow: LamStore.getAppState().openLegendInInfoWindow,
        scaled: true,
      });
    }

    //adding zoom-end event for automatic legend updates
    LamMap.addZoomEndEvent({
      eventName: "update-legend",
    });
  };

  var render = function (div) {
    if (!isRendered) {
      init();
    }
    isRendered = true;
  };

  var showLegend = function (gid, scaled, showInfoWindow) {
    var thisLayer = LamStore.getLayer(gid);
    let isGropuLayerGeoserver = false;
    if (thisLayer.groupTemplateUrls) isGropuLayerGeoserver = thisLayer.groupTemplateUrls.length > 0;
    $("#lam-legend-container").remove();
    var html = "<div id='lam-legend-container'>";
    if (thisLayer) html += "<h4 class='lam-title-legend'>" + thisLayer.layerName + "</h4>";
    var urlImg = "";
    //checking custom url
    if (!thisLayer.hideLegend && !thisLayer.hideLegendImage) {
      if (thisLayer.legendUrl) {
        urlImg = thisLayer.legendUrl;
      } else {
        urlImg = LamMap.getLegendUrl(gid, scaled);
      }
      if (urlImg) {
        html += "<img class='lam-legend' src='" + urlImg + "' />";
      }
    }
    if (thisLayer.layerDescription) {
      html += "<div class='lam-layer-description'>" + thisLayer.layerDescription + "</div>";
    }
    html += "<div class='lam-layer-metadata'></div>";
    showLayerMetadata(thisLayer);
    if (thisLayer.attribution) {
      html += "<p>Dati forniti da " + thisLayer.attribution + "</p>";
    }
    if (!thisLayer.hideLegend && !thisLayer.hideLegendImage && !thisLayer.legendUrl) {
      if (scaled) {
        html +=
          "<div class='lam-mt-2' style='display:flow-root;'><a href='#' class='lam-btn lam-depth-1' onclick=\"LamDispatcher.dispatch({ eventName: 'show-legend', gid: '" +
          gid +
          "', scaled: false })\">Visualizza legenda completa</a></div>";
      }
    }

    if (thisLayer.legendUrl) {
      html +=
        "<div class='lam-mt-2' style='display:flow-root;'><a href='" + thisLayer.legendUrl + "' target='_blank' class='lam-btn lam-depth-1'>Visualizza legenda</a></div>";
    }

    if (thisLayer.queryable && !isGropuLayerGeoserver) {
      html += "<div class='lam-mt-2' style='display:flow-root;'>";
      //open attribute table
      html += "<a href='#' target='_blank' class='lam-btn lam-btn-small lam-depth-1' ";
      html +=
        "onclick=\"lamDispatch({ eventName: 'show-attribute-table', sortBy: 'OGR_FID', gid: '" +
        thisLayer.gid +
        "'  }); return false;\"><i class='lam-icon'>" +
        LamResources.svgTable16 +
        "</i> Apri tabella</a>";
      //open xslx
      var layerUrl = LamMap.getWFSUrlfromLayer(thisLayer, "excel2007");
      html +=
        "<a href='" +
        layerUrl +
        "' target='_blank' class='lam-btn lam-btn-small lam-depth-1'><i class='lam-icon'>" +
        LamResources.svgDownload16 +
        "</i> XSLX</a>";
      //open shp
      layerUrl = LamMap.getWFSUrlfromLayer(thisLayer);
      html +=
        " <a href='" +
        layerUrl +
        "' target='_blank' class='lam-btn lam-btn-small lam-depth-1'><i class='lam-icon'>" +
        LamResources.svgDownload16 +
        "</i> SHP</a></div>";
    }

    html += "<div class='lam-mt-2 lam-mb-2' style='display:flow-root;'>";
    html += "<div class='lam-slidecontainer'>";
    html += "Trasparenza del layer <br />";
    var layerOpacity = thisLayer.opacity * 100;
    html += "<input type='range' id='lam-layer-opacity' min='0' max='100' value='" + layerOpacity + "' class='lam-slider'>";
    html += "</div>";
    html += "</div>";

    html += "<div>";
    let layerCharts = LamCharts.getCharts().filter(function (chart) {
      return $.inArray(gid, chart.layerGids) >= 0 && chart.target == 1;
    });
    if (layerCharts.length) html += LamTemplates.chartsTemplateButton(layerCharts);

    if (showInfoWindow) {
      LamDom.showContent(LamEnums.showContentMode().InfoWindow, "Informazioni", html, "", "legend");
    } else {
      LamDom.showContent(LamEnums.showContentMode().LeftPanel, "Informazioni", html, "", "legend");
    }

    //bind degli oggetti
    $("#lam-layer-opacity").change(function (e) {
      thisLayer.opacity = parseFloat($("#lam-layer-opacity").val() / 100);
      LamMap.setLayerOpacity(gid, thisLayer.opacity);
    });
    return true;
  };

  var showLegendLayers = function (layers, scaled, showInfoWindow) {
    let html = $("<div />", {
      id: "lam-legend-container",
    });
    layers.forEach(function (layer) {
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
            .on("error", function () {
              $("#legend_" + layer.gid).addClass("lam-hidden");
            });
          let container = $("<div id='legend_" + layer.gid + "' />").addClass("lam-legend-container");
          container.append($("<h4>" + layer.layerName + "</h4>").addClass("lam-title-legend"));
          container.append(img);
          if (layer.layerDescription) {
            let divDescription = $("<div />").addClass("lam-layer-description").text(layer.layerDescription);
            container.append(divDescription);
          }
          html.append(container);
        }
      }
    });
    let title = "Legenda dei layer attivi";
    if (html.html() === "") html.append("Per visualizzare la legenda rendi visibile uno o più layer.");
    if (showInfoWindow) {
      LamDom.showContent(LamEnums.showContentMode().InfoWindow, title, $("<div>").append(html.clone()).html(), "", "legend");
    } else {
      LamDom.showContent(LamEnums.showContentMode().LeftPanel, title, $("<div>").append(html.clone()).html(), "", "legend");
    }
  };

  let loadImage = function (imageSrc, success, error) {
    var img = new Image();
    img.onload = success;
    img.onerror = error;
    img.src = imageSrc;
  };

  var showLayerMetadata = function (layer) {
    if (!LamStore.getAppState().metaDataServiceUrlTemplate) return;
    var templateUrl = Handlebars.compile(LamStore.getAppState().metaDataServiceUrlTemplate);
    var urlService = templateUrl(layer);
    $.ajax({
      dataType: "jsonp",
      url: urlService + "&format_options=callback:LamLegendTools.parseResponseMetadata",
      jsonp: true,
      cache: false,
      error: function (jqXHR, textStatus, errorThrown) {
        lamDispatch({
          eventName: "log",
          message: "LamLegend: unable to complete response",
        });
        lamDispatch("hide-loader");
      },
    });
  };

  let parseResponseMetadata = function (data) {
    if (!data.features.length) return;
    var template = !LamStore.getAppState().metaDataTemplate ? LamTemplates.getTemplateMetadata() : Handlebars.compile(LamStore.getAppState().metaDataTemplate);
    var html = template(data.features[0].properties);
    html = formatMetadata(html);
    $(".lam-layer-metadata").html(html);
  };

  let formatMetadata = function (html) {
    //newline to br
    html = html.replace(/(?:\r\n|\r|\n)/g, "<br>");
    //sostituzione dei link
    html = replaceLinks(html);
    //replace delle stringhe
    if (LamStore.getAppState().metaDataReplacementStrings) {
      let strings = LamStore.getAppState().metaDataReplacementStrings;
      strings.forEach(function (element) {
        html = html.replace(new RegExp(element[0], "gi"), element[1]);
      });
    }
    return html;
  };

  let updateLegend = function () {
    if ($("#lam-legend-container").is(":visible")) {
      LamDispatcher.dispatch(currentLegendPayload);
    }
  };

  let replaceLinks = function (text) {
    return (text || "").replace(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi, function (match, space, url) {
      var hyperlink = url;
      if (!hyperlink.match("^https?://")) {
        hyperlink = "http://" + hyperlink;
      }
      return space + '<a href="' + hyperlink + '">' + url + "</a>";
    });
  };

  return {
    formatMetadata: formatMetadata,
    init: init,
    parseResponseMetadata: parseResponseMetadata,
    render: render,
    showLegend: showLegend,
    showLegendLayers: showLegendLayers,
    updateLegend: updateLegend,
  };
})();
