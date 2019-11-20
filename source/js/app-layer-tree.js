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

var LamLayerTree = (function() {
  let treeDiv = "lam-layer-tree";
  let isRendered = false;
  let layerGroupPrefix = "lt";
  //let layerGroupItemPrefix = "lti";
  //let layerGroupItemIconPrefix = "ltic";
  let layerUriCount = 0;
  let countRequest = 0;

  var init = function(callback) {
    //carico i layer
    countRequest = 0;
    LamStore.getAppState().layers.forEach(function(layer) {
      loadLayersUri(layer, callback);
    });
    if (layerUriCount === 0) {
      //no ajax request sent, loading all json immediately
      render(treeDiv, LamStore.getAppState().layers);
      callback();
    }

    //events binding
    LamDispatcher.bind("show-layers", function(payload) {
      LamToolbar.toggleToolbarItem("lam-layer-tree");
    });
  };

  var loadLayersUri = function(layer, callback) {
    if (layer.layersUri) {
      countRequest++;
      layerUriCount++;
      $.ajax({
        dataType: "json",
        url: layer.layersUri
      })
        .done(function(data) {
          layer.layers = data;
          layer.layers.forEach(function(e) {
            loadLayersUri(e);
          });
        })
        .fail(function(data) {
          lamDispatch({
            eventName: "log",
            message: "Layer Tree: Unable to load layers " + layer.layersUri
          });
        })
        .always(function(data) {
          countRequest--;
          if (countRequest === 0) {
            render(treeDiv, LamStore.getAppState().layers);
            LamStore.setInitialAppState(LamStore.getAppState());
            LamMap.loadConfig(LamStore.getAppState()); //reloading layer state
            callback();
          }
        });
    } else if (layer.layers) {
      layer.layers.forEach(function(e) {
        loadLayersUri(e);
      });
    }
  };

  var render = function(div, layers) {
    var output = "";
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
    output += '<div class="layertree-item">';
    output +=
      '<button class="lam-btn lam-btn-small lam-btn-floating lam-right lam-depth-1 ripple" alt="Reset dei layer" title="Reset dei layer" onClick="LamDispatcher.dispatch({eventName:\'reset-layers\'})"><i class="lam-icon">' +
      LamResources.svgRefreshMap +
      "</i></button>";
    output += "</div>";
    output += '<div class="layertree-item layertree-item-bottom lam-scroll-padding"></div>'; //spaziatore
    output += "</div>"; //generale

    jQuery("#" + div).html(output);
    isRendered = true;
  };

  var renderLayer = function(layer, layerId) {
    let output = "";
    //--------------
    output += formatString('<div id="{0}" class="layertree-layer">', layerId);
    output += formatString('<div class="layertree-layer__title">{0}</div>', layer.layerName);
    output += '<div class="layertree-layer__icons">';
    output += formatString(
      '<i title="Informazioni sul layer" class="layertree-icon lam-right" onclick="LamDispatcher.dispatch({ eventName: \'show-legend\', gid: \'{0}\', scaled: true })">{1}</i>',
      layer.gid,
      LamResources.svgInfo
    );
    output += formatString(
      '<i title="Mostra/Nascondi layer" id="{2}_c" class="layertree-icon lam-right" onclick="LamDispatcher.dispatch({eventName:\'toggle-layer\',gid:\'{2}\'})">{1}</i>',
      layerId,
      layer.visible ? LamResources.svgCheckbox : LamResources.svgCheckboxOutline,
      layer.gid
    );
    output += "</div>";
    output += "</div>";
    return output;
  };

  var renderGroup = function(groupLayer, groupId) {
    let output = "";
    output += '<div class="layertree-item" >';
    output += formatString(
      '<div  class="layertree-item__title lam-background {1} {2}">',
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
    output += "</div>";
    output += "</div>";
    return output;
  };

  var setCheckVisibility = function(layerGid, visibility) {
    const item = "#" + layerGid + "_c";
    if (visibility) {
      $(item).html(LamResources.svgCheckbox);
      $(item).removeClass("lam-checked");
    } else {
      $(item).html(LamResources.svgCheckboxOutline);
      $(item).removeClass("lam-unchecked");
    }
  };

  var toggleCheck = function(layerGid, groupId) {
    const item = "#" + layerGid + "_c";
    if ($(item).hasClass("lam-unchecked")) {
      $(item).removeClass("lam-unchecked");
      $(item).addClass("lam-checked");
      $(item).html(LamResources.svgCheckbox);
      $("#" + groupId).addClass("layertree-layer--selected");
      return;
    }
    if ($(item).hasClass("lam-checked")) {
      $(item).removeClass("lam-checked");
      $(item).addClass("lam-unchecked");
      $(item).html(LamResources.svgCheckboxOutline);
      $("#" + groupId).removeClass("layertree-layer--selected");
      return;
    }
  };

  var toggleGroup = function(groupName) {
    debugger;
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
    var str = arguments[0];
    for (k = 0; k < arguments.length - 1; k++) {
      str = str.replace(new RegExp("\\{" + k + "\\}", "g"), arguments[k + 1]);
    }
    return str;
  };

  let setLayerVisibility = function(layerGid) {
    $("#" + layerGid + "_c");
  };

  return {
    formatString: formatString,
    render: render,
    init: init,
    setCheckVisibility: setCheckVisibility,
    setLayerVisibility: setLayerVisibility,
    toggleCheck: toggleCheck,
    toggleGroup: toggleGroup
  };
})();
