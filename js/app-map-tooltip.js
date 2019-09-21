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
let AppMapTooltip = (function() {
  "use strict";

  let init = function() {
    Dispatcher.bind("show-tooltip", function(payload) {
      AppMapInfo.showTooltip(payload.x, payload.y, payload.title);
    });
    Dispatcher.bind("hide-tooltip", function(payload) {
      AppMapTooltip.hideTooltip();
    });
    Dispatcher.bind("show-map-tooltip", function(payload) {
      AppMapTooltip.showGeometryTooltip(payload.geometry, payload.tooltip);
    });
  };

  /**
   * Shows the tooltip on the map
   * @param {OL/Geometry} geometry
   * @param {string} title
   */
  let showGeometryTooltip = function(geometry, title) {
    debugger;
    if (!title) {
      hideTooltip();
      return;
    }
    let labelPoint = AppMap.getLabelPoint(geometry);
    let pixel = AppMap.getPixelFromCoordinate(labelPoint);
    showTooltip(pixel[0], pixel[1], title);
  };

  let showTooltip = function(x, y, title) {
    let tooltip = $("#map-tooltip");
    let tooltipTitle = $("#map-tooltip__title");
    tooltipTitle.html(title);
    tooltip.css({ top: x, left: y });
    tooltip.show();
  };

  let hideTooltip = function() {
    let toolTip = $("#map-tooltip");
    let toolTipTitle = $("#map-tooltip__title");
    toolTipTitle.html("");
    toolTip.css({ top: 0, left: 0 });
    toolTip.hide();
  };

  return {
    hideTooltip: hideTooltip,
    init: init,
    showGeometryTooltip: showGeometryTooltip,
    showTooltip: showTooltip,
    showGeometryTooltip: showGeometryTooltip
  };
})();
