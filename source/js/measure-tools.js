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

var LamMeasureTools = (function () {
  let isRendered = false;

  let init = function init() {
    LamDispatcher.bind("stop-measure-tool", function (payload) {
      LamMeasureTools.removeInteraction();
    });

    createMeasureTooltip();
    createHelpTooltip();
    vector.setMap(LamMap.getMap());
    isRendered = true;
  };

  let render = function (div) {
    if (!isRendered) {
      init();
    }
  };

  let source = new ol.source.Vector();

  let vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgba(255, 255, 255, 0.2)",
      }),
      stroke: new ol.style.Stroke({
        color: "#0AFF57",
        width: 2,
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: "#0AFF57",
        }),
      }),
    }),
  });

  /**
   * Currently drawn feature.
   * @type {import("../src/ol/Feature.js").default}
   */
  let sketch;

  /**
   * The help tooltip element.
   * @type {HTMLElement}
   */
  let helpTooltipElement;

  /**
   * Overlay to show the help messages.
   * @type {ol.Overlay}
   */
  let helpTooltip;

  /**
   * The measure tooltip element.
   * @type {HTMLElement}
   */
  let measureTooltipElement;

  /**
   * Overlay to show the measurement.
   * @type {ol.Overlay}
   */
  let measureTooltip;

  /**
   * Message to show when the user is drawing a polygon.
   * @type {string}
   */
  let continuePolygonMsg = "Clicca per continuare a disegnare il poligono";

  /**
   * Message to show when the user is drawing a line.
   * @type {string}
   */
  let continueLineMsg = "Clicca per continuare a disegnare la linea";

  let pointerMoveHandlerKey;
  /**
   * Handle pointer move.
   * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
   */
  let pointerMoveHandler = function (evt) {
    if (evt.dragging) {
      return;
    }
    /** @type {string} */
    let helpMsg = "Clicca per iniziare a misurare, doppio click per terminare";

    if (sketch) {
      let geom = sketch.getGeometry();
      if (geom instanceof ol.geom.Polygon) {
        helpMsg = continuePolygonMsg;
      } else if (geom instanceof ol.geom.LineString) {
        helpMsg = continueLineMsg;
      }
    }

    helpTooltipElement.innerHTML = helpMsg;
    helpTooltip.setPosition(evt.coordinate);

    helpTooltipElement.classList.remove("hidden");
  };

  let draw; // global so we can remove it later

  /**
   * Format length output.
   * @param {LineString} line The line.
   * @return {string} The formatted length.
   */
  let formatLength = function (line) {
    let length = ol.sphere.getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + " " + "km";
    } else {
      output = Math.round(length * 100) / 100 + " " + "m";
    }
    return output;
  };

  /**
   * Format area output.
   * @param {Polygon} polygon The polygon.
   * @return {string} Formatted area.
   */
  let formatArea = function (polygon) {
    let area = ol.sphere.getArea(polygon);
    let output;
    if (area > 10000) {
      output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
    } else {
      output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
    }
    return output;
  };

  let startMeasureLength = function () {
    try {
      removeInteraction();
    } catch (error) {}
    addInteraction("LineString");
  };
  let startMeasureArea = function () {
    try {
      removeInteraction();
    } catch (error) {}
    addInteraction("Polygon");
  };

  let removeInteraction = function () {
    LamMap.getMap().removeInteraction(draw);
    $(".ol-tooltip-help").remove();
    ol.Observable.unByKey(pointerMoveHandlerKey);
  };

  function addInteraction(type) {
    pointerMoveHandlerKey = LamMap.getMap().on("pointermove", pointerMoveHandler);

    LamMap.getMap()
      .getViewport()
      .addEventListener("mouseout", function () {
        helpTooltipElement.classList.add("hidden");
      });

    draw = new ol.interaction.Draw({
      source: source,
      type: type,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new ol.style.Stroke({
          color: "rgba(0, 255, 0, 0.5)",
          lineDash: [10, 10],
          width: 2,
        }),
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: "rgba(0, 255, 0, 0.7)",
          }),
          fill: new ol.style.Fill({
            color: "rgba(255, 255, 255, 0.2)",
          }),
        }),
      }),
    });
    LamMap.getMap().addInteraction(draw);

    createMeasureTooltip();
    createHelpTooltip();

    let listener;
    draw.on("drawstart", function (evt) {
      // set sketch
      sketch = evt.feature;

      /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
      let tooltipCoord = evt.coordinate;

      listener = sketch.getGeometry().on("change", function (evt) {
        let geom = evt.target;
        let output;
        if (geom instanceof ol.geom.Polygon) {
          output = formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof ol.geom.LineString) {
          output = formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        measureTooltipElement.innerHTML = output;
        measureTooltip.setPosition(tooltipCoord);
      });
    });

    draw.on("drawend", function () {
      measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
      measureTooltip.setOffset([0, -7]);
      // unset sketch
      sketch = null;
      // unset tooltip so that a new one can be created
      measureTooltipElement = null;
      createMeasureTooltip();
      ol.Observable.unByKey(listener);
    });
  }

  /**
   * Creates a new help tooltip
   */
  let createHelpTooltip = function () {
    try {
      if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
      }
    } catch (error) {}

    helpTooltipElement = document.createElement("div");
    helpTooltipElement.className = "ol-tooltip ol-tooltip-help hidden";
    helpTooltip = new ol.Overlay({
      element: helpTooltipElement,
      offset: [15, 0],
      positioning: "center-left",
    });
    LamMap.getMap().addOverlay(helpTooltip);
  };

  /**
   * Creates a new measure tooltip
   */
  let createMeasureTooltip = function () {
    try {
      if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
      }
    } catch (error) {}

    measureTooltipElement = document.createElement("div");
    measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
    measureTooltip = new ol.Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: "bottom-center",
    });
    LamMap.getMap().addOverlay(measureTooltip);
  };

  let clearMeasures = function () {
    $(".ol-tooltip-static").remove();
    //if (helpTooltipElement) helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    vector.getSource().clear(true);
  };

  return {
    clearMeasures: clearMeasures,
    render: render,
    removeInteraction: removeInteraction,
    startMeasureLength: startMeasureLength,
    startMeasureArea: startMeasureArea,
  };
})();
