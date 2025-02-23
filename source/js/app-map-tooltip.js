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

/**
 * This Class manages the tooltip features
 */
let LamMapTooltip = (function() {
  "use strict";

  let mapTooltip;

  let init = function() {
    mapTooltip = new ol.Overlay({
      element: document.getElementById("map-tooltip"),
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    LamMap.getMap().addOverlay(mapTooltip);

    // LamDispatcher.bind("show-tooltip", function(payload) {
    //   LamMapInfo.showTooltip(payload.x, payload.y, payload.title);
    // });
    // LamDispatcher.bind("hide-tooltip", function(payload) {
    //   LamMapTooltip.hideTooltip();
    // });
    LamDispatcher.bind("show-map-tooltip", function(payload) {
      LamMapTooltip.showMapTooltip(payload.geometry, payload.tooltip);
    });
    LamDispatcher.bind("hide-map-tooltip", function(payload) {
      LamMapTooltip.hideMapTooltip();
    });
  };

  // /**
  //  * Shows an HTML tooltip on the map as an HTML positioned element
  //  * @param {Array} coordinates
  //  * @param {string} title
  //  */
  // let showMapHtmlTooltip = function(coordinates, title) {
  //   if (!title) {
  //     hideHtmlTooltip();
  //     return;
  //   }
  //   let labelPoint = LamMap.getLabelPoint(coordinates);
  //   let pixel = LamMap.getPixelFromCoordinate(labelPoint[0], labelPoint[1]);
  //   let tooltip = $("#map-tooltip");
  //   let tooltipTitle = $("#map-tooltip__title");
  //   tooltipTitle.html(title);
  //   tooltip.css({ top: pixel[0], left: pixel[1] });
  //   tooltip.show();
  // };

  // /**
  //  * Hides an HTML tooltip on the map as an HTML positioned element
  //  */
  // let hideMapHtmlTooltip = function() {
  //   let toolTip = $("#map-tooltip");
  //   let toolTipTitle = $("#map-tooltip__title");
  //   toolTip.hide();
  //   toolTipTitle.html("");
  //   toolTip.css({ top: 0, left: 0 });
  //   toolTip.hide();
  // };

  let showHtmlTooltip = function(coordinates, title) {};

  let hideHtmlTooltip = function() {};

  let showMapTooltip = function(coordinates, title) {
    if (!title) {
      hideMapTooltip();
      return;
    }
    let labelPoint = LamMap.getLabelPoint(coordinates);
    let toolTip = $("#map-tooltip");
    let tooltipTitle = $("#map-tooltip__title");
    toolTip.show();
    tooltipTitle.html(title);
    mapTooltip.setPosition(labelPoint);
  };

  let hideMapTooltip = function() {
    mapTooltip.setPosition(undefined);
    return false;
  };

  return {
    hideHtmlTooltip: hideHtmlTooltip,
    hideMapTooltip: hideMapTooltip,
    init: init,
    showHtmlTooltip: showHtmlTooltip,
    showMapTooltip: showMapTooltip
  };
})();
