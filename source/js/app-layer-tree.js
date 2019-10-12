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

var AppLayerTree = (function() {
  let treeDiv = "layer-tree";
  let isRendered = false;
  let layerGroupPrefix = "lt";
  //let layerGroupItemPrefix = "lti";
  //let layerGroupItemIconPrefix = "ltic";
  let layerUriCount = 0;
  let countRequest = 0;

  var init = function(callback) {
    //carico i layer
    countRequest = 0;
    AppStore.getAppState().layers.forEach(function(layer) {
      loadLayersUri(layer, callback);
    });
    if (layerUriCount === 0) {
      //no ajax request sent, loading all json immediately
      render(treeDiv, AppStore.getAppState().layers);
      callback();
    }

    //events binding
    Dispatcher.bind("show-layers", function(payload) {
      AppToolbar.toggleToolbarItem("layer-tree");
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
          dispatch({
            eventName: "log",
            message: "Layer Tree: Unable to load layers " + layer.layersUri
          });
        })
        .always(function(data) {
          countRequest--;
          if (countRequest === 0) {
            render(treeDiv, AppStore.getAppState().layers);
            AppStore.setInitialAppState(AppStore.getAppState());
            AppMap.loadConfig(AppStore.getAppState()); //reloading layer state
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
    if (!AppStore.getAppState().logoPanelUrl) {
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
      '<button class="btn-floating btn-small waves-effect waves-light right lam-button" alt="Reset dei layer" title="Reset dei layer" onClick="Dispatcher.dispatch({eventName:\'reset-layers\'})"><i class="material-icons">close</i></button>';
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
      '<i title="Informazioni sul layer" class="fas fa-info-circle fa-lg fa-pull-right layertree-icon icon-base-info" onclick="Dispatcher.dispatch({ eventName: \'show-legend\', gid: \'{0}\', scaled: true })"></i>',
      layer.gid
    );
    output += formatString(
      '<i title="Mostra/Nascondi layer" id="{0}_c" class="far {1} fa-lg fa-fw layertree-icon icon-base-info fa-pull-right " onclick="AppLayerTree.toggleCheck(\'{0}_c\');Dispatcher.dispatch({eventName:\'toggle-layer\',gid:\'{2}\'})"></i>',
      layerId,
      layer.visible ? "fa-check-square" : "fa-square",
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
      '<div  class="layertree-item__title lam-background {1} {3}"><i id="{0}_i" class="fas {2} fa-fw lam-pointer" onclick="AppLayerTree.toggleGroup(\'{0}\');"></i>',
      groupId,
      groupLayer.color,
      groupLayer.visible ? "fa-minus-square" : "fa-plus-square",
      groupLayer.nestingStyle ? "layertree-item__title--" + groupLayer.nestingStyle : ""
    );
    output += "<span>" + groupLayer.layerName + "</span>";
    output += "</div>";
    output += formatString(
      '<div id="{0}_u" class="layertree-item__layers layertree--{1}">',
      groupId,
      groupLayer.visible ? "visible" : "hidden"
    );
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

  var toggleCheck = function(iconId, groupId) {
    const item = "#" + iconId;
    if ($(item).hasClass("fa-square")) {
      $(item).removeClass("fa-square");
      $(item).addClass("fa-check-square");
      $("#" + groupId).addClass("layertree-layer--selected");
      return;
    }
    if ($(item).hasClass("fa-check-square")) {
      $(item).removeClass("fa-check-square");
      $(item).addClass("fa-square");
      $("#" + groupId).removeClass("layertree-layer--selected");
      return;
    }
  };

  var toggleGroup = function(groupName) {
    const item = "#" + groupName + "_u";
    if ($(item).hasClass("layertree--hidden")) {
      $(item).removeClass("layertree--hidden");
      $(item).addClass("layertree--visible");
    } else {
      if ($(item).hasClass("layertree--visible")) {
        $(item).removeClass("layertree--visible");
        $(item).addClass("layertree--hidden");
      }
    }
    const icon = "#" + groupName + "_i";
    if ($(icon).hasClass("fa-plus-square")) {
      $(icon).removeClass("fa-plus-square");
      $(icon).addClass("fa-minus-square");
      return;
    } else {
      if ($(icon).hasClass("fa-minus-square")) {
        $(icon).removeClass("fa-minus-square");
        $(icon).addClass("fa-plus-square");
        return;
      }
    }
  };

  let formatString = function() {
    var str = arguments[0];
    for (k = 0; k < arguments.length - 1; k++) {
      str = str.replace(new RegExp("\\{" + k + "\\}", "g"), arguments[k + 1]);
    }
    return str;
  };

  return {
    formatString: formatString,
    render: render,
    init: init,
    toggleCheck: toggleCheck,
    toggleGroup: toggleGroup
  };
})();
