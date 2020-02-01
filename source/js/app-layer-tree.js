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

let LamLayerTree = (function() {
  let treeDiv = "lam-layer-tree";
  let isRendered = false;
  let layerGroupPrefix = "lt";
  //let layerGroupItemPrefix = "lti";
  //let layerGroupItemIconPrefix = "ltic";
  //let layerUriCount = 0;
  //let countRequest = 0;

  let init = function() {
    //events binding
    LamDispatcher.bind("show-layers", function(payload) {
      LamToolbar.toggleToolbarItem(treeDiv);
    });
  };

  let render = function(div, layers) {
    if (div) treeDiv = div;
    if (!isRendered) {
      init();
    }
    let output = "";
    if (!LamStore.getAppState().logoPanelUrl) {
      output += '<h4 class="lam-title">Temi</h4>';
    }
    output += '<div class="layertree">'; //generale
    let index = 0;
    layers.forEach(function(element) {
      output += renderGroup(element, layerGroupPrefix + "_" + index);
      index++;
    });
    //sezione funzioni generali
    output += '<div class="layertree-item-bottom">';
    output +=
      '<button class="lam-btn lam-btn-small lam-btn-floating lam-right lam-depth-1 ripple" alt="Reset dei layer" title="Reset dei layer" onClick="LamDispatcher.dispatch({eventName:\'reset-layers\'})"><i class="lam-icon">' +
      LamResources.svgRefreshMap +
      "</i></button>";
    output += "</div>";
    output += '<div class="layertree-item-bottom lam-scroll-padding"></div>'; //spaziatore
    output += "</div>"; //generale

    jQuery("#" + treeDiv).html(output);

    updateCheckBoxesStates(LamStore.getAppState().layers);
    isRendered = true;
  };

  let renderLayer = function(layer, layerId) {
    let output = "";
    output += formatString('<div id="{0}" class="layertree-layer layertree-layer-border">', layerId);
    output += formatString('<div class="layertree-layer__title">{0}</div>', layer.layerName);
    output += '<div class="layertree-layer__icons">';
    output += formatString(
      '<i title="Mostra/Nascondi layer" id="{2}_c" class="layertree-icon lam-right" onclick="LamDispatcher.dispatch({eventName:\'toggle-layer\',gid:\'{2}\'})">{1}</i>',
      layerId,
      layer.visible ? LamResources.svgCheckbox : LamResources.svgCheckboxOutline,
      layer.gid
    );
    if (!layer.hideLegend) {
      output += formatString(
        '<i title="Informazioni sul layer" class="layertree-icon lam-right" onclick="LamDispatcher.dispatch({ eventName: \'show-legend\', gid: \'{0}\', scaled: true })">{1}</i>',
        layer.gid,
        LamResources.svgInfo
      );
    }

    output += "</div>";
    output += "</div>";
    return output;
  };

  let renderLayerTools = function(groupLayer, groupId) {
    let output = "";
    //--------------
    output += formatString('<div id="" class="layertree-layer">');
    output += formatString('<div class="layertree-layer__title"></div>');
    output += '<div class="layertree-layer__icons">';
    //placeholder
    //output += '<i class="layertree-icon lam-right layertree-icon-empty"></i>';

    output += "</div>";
    output += "</div>";
    return output;
  };

  let renderGroup = function(groupLayer, groupId) {
    let output = "";
    output += '<div class="layertree-item" >';
    output += formatString(
      '<div class="layertree-item__title lam-background {1} {2}">',
      groupId,
      groupLayer.color,
      groupLayer.nestingStyle ? "layertree-item__title--" + groupLayer.nestingStyle : ""
    );
    output += formatString(
      '<i id="{0}_i" class="layertree-item__title-icon {3}" onclick="LamLayerTree.toggleGroup(\'{0}\');">{2}</i>',
      groupId,
      groupLayer.color,
      groupLayer.visible ? LamResources.svgExpandLess : LamResources.svgExpandMore,
      groupLayer.visible ? "lam-plus" : "lam-minus"
    );

    output += "<span class='layertree-item__title-text'>" + groupLayer.layerName + "</span>";

    output += '<div class="layertree-layer__title-icons">';
    output += formatString(
      '<i title="Mostra/Nascondi tutti i layer" id="{0}_c" class="layertree-item__title-icon lam-right" onclick="LamDispatcher.dispatch({eventName:\'toggle-layer-group\',gid:\'{0}\'})">{1}</i>',
      groupLayer.gid,
      LamResources.svgCheckboxOutline //groupLayer.visible ? LamResources.svgCheckbox : LamResources.svgCheckboxOutline
    );
    output += "</div>";

    output += "</div>";

    output += formatString('<div id="{0}_u" class="layertree-item__layers layertree--{1}">', groupId, groupLayer.visible ? "visible" : "hidden");
    if (groupLayer.layers) {
      let index = 0;
      groupLayer.layers.forEach(function(element) {
        switch (element.layerType) {
          case "group":
            output += renderGroup(element, groupId + "_" + index);
            break;
          default:
            output += renderLayer(element, groupId + "_" + index);
            break;
        }
        index++;
      });
    }

    //tools section
    if (groupLayer.layers) {
      let geoLayers = groupLayer.layers.filter(function(el) {
        return el.layerType !== "group";
      });
      if (geoLayers.length) {
        output += renderLayerTools(groupLayer, groupId);
      }
    }
    output += "</div>";
    output += "</div>";
    return output;
  };

  let setCheckVisibility = function(layerGid, visibility) {
    const item = "#" + layerGid + "_c";
    if (visibility) {
      $(item).html(LamResources.svgCheckbox);
      $(item).addClass("lam-checked");
      $(item).removeClass("lam-unchecked");
    } else {
      $(item).html(LamResources.svgCheckboxOutline);
      $(item).removeClass("lam-checked");
      $(item).addClass("lam-unchecked");
    }
  };

  let toggleGroup = function(groupName) {
    const item = "#" + groupName + "_u";
    if ($(item).hasClass("layertree--hidden")) {
      $(item).removeClass("layertree--hidden");
      $(item).addClass("layertree--visible");
    } else {
      $(item).removeClass("layertree--visible");
      $(item).addClass("layertree--hidden");
    }
    const icon = "#" + groupName + "_i";

    if ($(icon).hasClass("lam-plus")) {
      $(icon).removeClass("lam-plus");
      $(icon).addClass("lam-minus");
      $(icon).html(LamResources.svgExpandMore);
      return;
    } else {
      $(icon).removeClass("lam-minus");
      $(icon).addClass("lam-plus");
      $(icon).html(LamResources.svgExpandLess);
      return;
    }
  };

  let formatString = function() {
    let str = arguments[0];
    for (k = 0; k < arguments.length - 1; k++) {
      str = str.replace(new RegExp("\\{" + k + "\\}", "g"), arguments[k + 1]);
    }
    return str;
  };

  /**
   * Sets the initial grouplayer check, based on the children visibility
   */
  let updateCheckBoxesStates = function(layers) {
    layers.forEach(function(groupLayer) {
      if (groupLayer.layerType != "group") return;
      countLayerGroupFatherVisibility(groupLayer);
      if (groupLayer.layers) {
        updateCheckBoxesStates(groupLayer.layers);
      }
    });

    function countLayerGroupFatherVisibility(groupLayer) {
      let layerCount = 0;
      let layerVisibile = 0;
      if (!groupLayer.layers) return;
      groupLayer.layers.forEach(function(layer) {
        if (layer.layerType != "group") {
          layerCount++;
          if (layer.visible) layerVisibile++;
        } else {
          countLayerGroupChildrenVisibility(layer);
        }
      });
      setCheckVisibility(groupLayer.gid, layerVisibile === layerCount);

      function countLayerGroupChildrenVisibility(groupLayer) {
        if (!groupLayer.layers) return;
        groupLayer.layers.forEach(function(layer) {
          if (layer.layerType != "group") {
            layerCount++;
            if (layer.visible) layerVisibile++;
          } else {
            countLayerGroupChildrenVisibility(layer);
          }
        });
      }
    }
  };

  return {
    formatString: formatString,
    render: render,
    init: init,
    setCheckVisibility: setCheckVisibility,
    toggleGroup: toggleGroup,
    updateCheckBoxesStates: updateCheckBoxesStates
  };
})();
