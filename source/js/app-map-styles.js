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
 * Classe per la gestione delle funzionalità di info
 */
let AppMapStyles = (function() {
  "use strict";

  let getPreloadStyle = function() {
    let style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 255, 255, 0.1]
      }),
      stroke: new ol.style.Stroke({
        color: [255, 255, 255, 0.1],
        width: 4
      }),
      image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({
          color: [255, 255, 255, 0.1]
        })
      }),
      text: new ol.style.Text({
        text: "",
        scale: 1.7,
        textAlign: "Left",
        textBaseline: "Top",
        fill: new ol.style.Fill({
          color: "#000000"
        }),
        stroke: new ol.style.Stroke({
          color: "#FFFFFF",
          width: 3.5
        })
      })
    });
    return style;
  };

  let getDrawStyle = function() {
    let style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [68, 138, 255, 0.2]
      }),
      stroke: new ol.style.Stroke({
        color: [68, 138, 255, 1],
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: [68, 138, 255, 1]
        })
      }),
      text: new ol.style.Text({
        text: "pippo",
        scale: 1.7,
        textAlign: "Left",
        textBaseline: "Top",
        fill: new ol.style.Fill({
          color: "#000000"
        }),
        stroke: new ol.style.Stroke({
          color: "#FFFFFF",
          width: 3.5
        })
      })
    });
    return style;
  };

  let getSelectionStyle = function() {
    let styleSelection = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 216, 0, 0.2]
      }),
      stroke: new ol.style.Stroke({
        color: [255, 216, 0, 1],
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: [255, 216, 0, 1]
        })
      })
    });
    return styleSelection;
  };

  let getSelectionMaskStyle = function() {
    let style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 216, 0, 0.1]
      }),
      stroke: new ol.style.Stroke({
        color: [255, 216, 0, 0.5],
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: [255, 216, 0, 0.5]
        })
      }),
      text: new ol.style.Text({
        text: "",
        scale: 1.7,
        textAlign: "Left",
        textBaseline: "Top",
        fill: new ol.style.Fill({
          color: "#000000"
        }),
        stroke: new ol.style.Stroke({
          color: "#FFFFFF",
          width: 3.5
        })
      })
    });
    return style;
  };

  let getModifyStyle = function() {
    let style_modify = new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 2,
        color: getCurrentColor(1, [255, 0, 0, 1])
      }),
      fill: new ol.style.Stroke({
        color: getCurrentColor(1, [255, 0, 0, 0.2])
      })
    });
    return style_modify;
  };

  let getInfoStyle = function() {
    let style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [0, 255, 255, 0.2]
      }),
      stroke: new ol.style.Stroke({
        color: [0, 255, 255, 1],
        width: 3
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: [0, 255, 255, 1]
        })
      })
    });
    return style;
  };

  // (function() {
  //   let style = new ol.style.Style({
  //     fill: new ol.style.Fill({
  //       color: getCurrentColor(0.2, [0, 255, 255, 0.2])
  //     }),
  //     stroke: new ol.style.Stroke({
  //       color: getCurrentColor(1, [0, 255, 255, 1]),
  //       width: 2
  //     }),
  //     image: new ol.style.Circle({
  //       radius: 7,
  //       fill: new ol.style.Fill({
  //         color: getCurrentColor(1, [0, 255, 255, 1])
  //       })
  //     }),
  //     text: new ol.style.Text({
  //       text: "",
  //       scale: 1.7,
  //       textAlign: "Left",
  //       textBaseline: "Top",
  //       fill: new ol.style.Fill({
  //         color: "#000000"
  //       }),
  //       stroke: new ol.style.Stroke({
  //         color: "#FFFFFF",
  //         width: 3.5
  //       })
  //     })
  //   });
  //   let styles = [style];
  //   return function(feature, resolution) {
  //     style.getText().setText(feature.get("name"));
  //     return styles;
  //   };

  return {
    getInfoStyle: getInfoStyle,
    getModifyStyle: getModifyStyle,
    getPreloadStyle: getPreloadStyle,
    getSelectionStyle: getSelectionStyle,
    getSelectionMaskStyle: getSelectionMaskStyle,
    getDrawStyle: getDrawStyle
  };
})();
