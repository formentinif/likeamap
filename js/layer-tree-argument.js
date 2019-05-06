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
    var templateTemp = templateGroup();
    var output = templateTemp(layers);
    jQuery("#" + div).html(output);
    isRendered = true;
  };

  var toggleCheck = function(item) {
    if ($("#" + item).hasClass("fa-square")) {
      $("#" + item).removeClass("fa-square");
      $("#" + item).addClass("fa-check-square");
      return;
    }
    if ($("#" + item).hasClass("fa-check-square")) {
      $("#" + item).removeClass("fa-check-square");
      $("#" + item).addClass("fa-square");
      return;
    }
  };

  var toggleGroup = function(item, icon) {
    $('[id*="ltgu"]').each(function() {
      if (this.id === item) {
        $(this).removeClass("layertree-hidden");
        $(this).addClass("layertree-visible");
      } else {
        $(this).removeClass("layertree-visible");
        $(this).addClass("layertree-hidden");
      }
    });

    /*
        if ($("#" + item).hasClass("layertree-hidden")) {
            $("#" + item).removeClass("layertree-hidden");
            $("#" + item).addClass("layertree-visible");

        } else {
            if ($("#" + item).hasClass("layertree-visible")) {
                $("#" + item).removeClass("layertree-visible");
                $("#" + item).addClass("layertree-hidden");

            }
        }
        */
  };

  var templateGroup = function() {
    var template = "";
    template += '<div class="div-30"></div>';
    template += '<div id="layertree" class="layertree">';

    template += '<div class="layertree-argument__groups">';

    template += "{{#each this}}";
    template += '<div class="layertree-argument__group-item" >';
    template +=
      '<a id="ltgm{{@index}}" class="btn-floating btn-large waves-effect waves-light {{color}} fake-link"><i class="fas fa-map" onclick="LayerTree.toggleGroup(\'ltgu{{@index}}\', \'ltgm{{@index}}\');"></i></a>';
    template +=
      '<p class="layertree-argument__group-item-text">{{layerName}}</p>';
    template += "</div>";
    template += "{{/each}}";
    template += "</div>";

    template += '<div id="layers-argument">';
    template += "{{#each this}}";
    template +=
      '<ul id="ltgu{{@index}}" class="layertree-list-group layertree-{{visible visible}}">';
    template += "{{#each layers}}";
    template +=
      '<li class="layertree-list-group-item"><span class="layertree-span layertree-selected">'; //<i class="fa  fa-lg fa-fw layertree-icon "></i>
    template += "<span>{{layerName}}</span>";
    template +=
      '<i title="Informazioni sul layer" class="fas fa-info-circle fa-lg fa-pull-right layertree-icon icon-base-info" onclick="Dispatcher.dispatch({ eventName: \'show-legend\', gid: \'{{gid}}\' })"></i>';
    template +=
      '<i title="Mostra/Nascondi layer" id="lti2{{@../index}}{{@index}}" class="far {{checksquarefa visible}} fa-lg fa-fw layertree-icon fa-pull-right " onclick="LayerTree.toggleCheck(\'lti2{{@../index}}{{@index}}\');Dispatcher.dispatch({eventName:\'toggle-layer\',gid:\'{{gid}}\' })"></i></span>';
    template += "</li>";
    template += "{{/each}}";
    template += "</ul>";
    template += "{{/each}}";
    template += "</div>";

    template += "</div>";

    return Handlebars.compile(template);
  };

  return {
    render: render,

    init: init,
    toggleCheck: toggleCheck,
    toggleGroup: toggleGroup
  };
})();
