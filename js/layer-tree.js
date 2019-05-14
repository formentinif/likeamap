/*
Copyright 2015-2017 Perspectiva di Formentini Filippo

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Copyright 2015-2017 Perspectiva di Formentini Filippo
Concesso in licenza secondo i termini della Licenza Apache, versione 2.0 (la "Licenza"); è proibito usare questo file se non in conformità alla Licenza. Una copia della Licenza è disponibile all'indirizzo:

http://www.apache.org/licenses/LICENSE-2.0

Se non richiesto dalla legislazione vigente o concordato per iscritto,
il software distribuito nei termini della Licenza è distribuito
"COSÌ COM'È", SENZA GARANZIE O CONDIZIONI DI ALCUN TIPO, esplicite o implicite.
Consultare la Licenza per il testo specifico che regola le autorizzazioni e le limitazioni previste dalla medesima.

*/

var LayerTree = (function() {
  var isRendered = false;
  var layerGroupItemPrefix = "ltgi";
  var layerGroupItemIconPrefix = "ltgic";
  var init = function init() {
    Handlebars.registerHelper("visible", function(v1, options) {
      if (v1 === 1) {
        return "visible";
      }
      return "hidden";
    });

    Handlebars.registerHelper("checksquarefa", function(v1, options) {
      if (v1 === 1) {
        return "fa-check-square";
      }
      return "fa-square";
    });

    Handlebars.registerHelper("minussquarefa", function(v1, options) {
      if (v1 === 1) {
        return "fa-minus-square";
      }
      return "fa-plus-square";
    });
  };

  var render = function(div, layers) {
    if (!isRendered) {
      init();
    }
    var templateTemp = template();
    var output = templateTemp(layers);
    jQuery("#" + div).html(output);
    isRendered = true;
  };

  var toggleCheck = function(item) {
    if ($("#" + layerGroupItemIconPrefix + item).hasClass("fa-square")) {
      $("#" + layerGroupItemIconPrefix + item).removeClass("fa-square");
      $("#" + layerGroupItemIconPrefix + item).addClass("fa-check-square");
      $("#" + layerGroupItemPrefix + item).addClass(
        "layertree-layers__item-selected"
      );
      return;
    }
    if ($("#" + layerGroupItemIconPrefix + item).hasClass("fa-check-square")) {
      $("#" + layerGroupItemIconPrefix + item).removeClass("fa-check-square");
      $("#" + layerGroupItemIconPrefix + item).addClass("fa-square");
      $("#" + layerGroupItemPrefix + item).removeClass(
        "layertree-layers__item-selected"
      );
      return;
    }
  };

  var toggleGroup = function(item, icon) {
    if ($("#" + item).hasClass("layertree-hidden")) {
      $("#" + item).removeClass("layertree-hidden");
      $("#" + item).addClass("layertree-visible");
    } else {
      if ($("#" + item).hasClass("layertree-visible")) {
        $("#" + item).removeClass("layertree-visible");
        $("#" + item).addClass("layertree-hidden");
      }
    }
    if ($("#" + icon).hasClass("fa-plus-square")) {
      $("#" + icon).removeClass("fa-plus-square");
      $("#" + icon).addClass("fa-minus-square");
      return;
    } else {
      if ($("#" + icon).hasClass("fa-minus-square")) {
        $("#" + icon).removeClass("fa-minus-square");
        $("#" + icon).addClass("fa-plus-square");
        return;
      }
    }
  };

  var template = function template() {
    var template = "";
    if (!AppStore.getAppState().logoPanelUrl) {
      template += '<h4 class="lk-title">Temi</h4>';
    }
    template += '<div class="layertree-list">';
    template += "{{#each this}}";
    template += '<div class="layertree-list-group__item" >';

    template +=
      '<div  class="layertree-group {{#if color}}{{color}}{{/if}}"><i id="ltgm{{@index}}" class="fas {{minussquarefa visible}} fa-fw lk-pointer" onclick="LayerTree.toggleGroup(\'ltgu{{@index}}\', \'ltgm{{@index}}\');"></i>';
    template += "<span>{{layerName}}</span></div>";

    template +=
      '<div id="ltgu{{@index}}" class="layertree-layers layertree-{{visible visible}}">';
    template += "{{#each layers}}";
    //--------------
    template +=
      '<div id="' +
      layerGroupItemPrefix +
      '{{@../index}}{{@index}}" class="layertree-layers__item " ' +
      //"onclick=\"LayerTree.toggleCheck('{{@../index}}{{@index}}');Dispatcher.dispatch({eventName:'toggle-layer',gid:'{{gid}}' })\"" +
      ">";
    template +=
      '<div class="layertree-layers__item__title">{{layerName}}</div>';
    template += '<div class="layertree-layers__item__icons">';
    template +=
      '<i title="Informazioni sul layer" class="fas fa-info-circle fa-lg fa-pull-right layertree-icon icon-base-info" onclick="Dispatcher.dispatch({ eventName: \'show-legend\', gid: \'{{gid}}\' })"></i>';
    template +=
      '<i title="Mostra/Nascondi layer" id="' +
      layerGroupItemIconPrefix +
      "{{@../index}}{{@index}}\" class=\"far {{checksquarefa visible}} fa-lg fa-fw layertree-icon icon-base-info fa-pull-right \" onclick=\"LayerTree.toggleCheck('{{@../index}}{{@index}}');Dispatcher.dispatch({eventName:'toggle-layer',gid:'{{gid}}' })\"></i>";
    template += "</div>";

    template += "</div>";
    //--------------
    template += "{{/each}}";

    template += "</div>";
    template += "</div>";
    template += "{{/each}}";

    //sezione funzioni generali
    template += '<div class="layertree-list-group-item">';
    template +=
      '<button class="btn-floating btn-small waves-effect waves-light right" alt="Reset dei layer" title="Reset dei layer" onClick="Dispatcher.dispatch({eventName:\'reset-layers\'})"><i class="material-icons">close</i></button>';
    template += "</div>";

    template += "</div>";
    template += "</div>";

    return Handlebars.compile(template);
  };

  return {
    render: render,
    template: template,
    init: init,
    toggleCheck: toggleCheck,
    toggleGroup: toggleGroup
  };
})();
