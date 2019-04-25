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

        Handlebars.registerHelper('visible', function(v1, options) {
            if (v1 === 1) {
                return "visible";
            }
            return "hidden";
        });

        Handlebars.registerHelper('checksquarefa', function(v1, options) {
            if (v1 === 1) {
                return "fa-check-square-o";
            }
            return "fa-square-o";
        });

        Handlebars.registerHelper('minussquarefa', function(v1, options) {
            if (v1 === 1) {
                return "fa-minus-square-o";
            }
            return "fa-plus-square-o";
        });
    }

    var render = function(div, layers) {
        if(!isRendered){
            init();
        }
        var templateTemp = template();
        var output = templateTemp(layers);
        jQuery("#" + div).html(output);
        isRendered = true;
    }


    var toggleCheck = function(item) {
        if ($("#" + item).hasClass("fa-square-o")) {
            $("#" + item).removeClass("fa-square-o");
            $("#" + item).addClass("fa-check-square-o");
            return;
        }
        if ($("#" + item).hasClass("fa-check-square-o")) {
            $("#" + item).removeClass("fa-check-square-o");
            $("#" + item).addClass("fa-square-o");
            return;
        }

    }

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
        if ($("#" + icon).hasClass("fa-plus-square-o")) {
            $("#" + icon).removeClass("fa-plus-square-o");
            $("#" + icon).addClass("fa-minus-square-o");
            return;
        } else {
            if ($("#" + icon).hasClass("fa-minus-square-o")) {
                $("#" + icon).removeClass("fa-minus-square-o");
                $("#" + icon).addClass("fa-plus-square-o");
                return;
            }
        }


    }

    var template = function template() {
        var template = '';
        template += '<h4 class="al-title">Temi</h4>';
        template += '<div id="layertree" class="layertree">';
        template += '<ul class="layertree-list-group">';
        template += '{{#each this}}';
        template += '<li class="layertree-list-group-item" >';
        template += '<span  class="layertree-span layertree-group"><i id="ltgm{{@index}}" class="fa {{minussquarefa visible}} fa-lg fa-fw layertree-icon" onclick="LayerTree.toggleGroup(\'ltgu{{@index}}\', \'ltgm{{@index}}\');"></i>';
        template += '<span>{{layerName}}</span></span>';

        template += '<ul id="ltgu{{@index}}" class="layertree-list-group layertree-{{visible visible}}">';
        template += '{{#each layers}}';
        template += '<li class="layertree-list-group-item"><span class="layertree-span layertree-selected">'; //<i class="fa  fa-lg fa-fw layertree-icon "></i>
        template += '<span>{{layerName}}</span>';
        template += '<i title="Informazioni sul layer" class="fa fa-info-circle fa-lg pull-right layertree-icon icon-base-info" onclick="Dispatcher.dispatch({ eventName: \'show-legend\', gid: \'{{gid}}\' })"></i><i title="Mostra/Nascondi tutti i layer" id="lti2{{@../index}}{{@index}}" class="fa {{checksquarefa visible}} icon-success fa-lg fa-fw layertree-icon pull-right " onclick="LayerTree.toggleCheck(\'lti2{{@../index}}{{@index}}\');Dispatcher.dispatch({eventName:\'toggle-layer\',gid:\'{{gid}}\' })"></i></span>';
        template += '</li>';
        template += '{{/each}}';
        template += '</ul>';
        template += '{{/each}}';
        //sezione funzioni generali
        template += '<li class="layertree-list-group-item"><span class="layertree-span layertree-selected">'; //<i class="fa  fa-lg fa-fw layertree-icon "></i>
        template += '<button class="btn-floating btn-small waves-effect waves-light pull-right" onClick="Dispatcher.dispatch({eventName:\'reset-layers\'})"><i class="material-icons">close</i></button>';
        template += '</li>';

        template += '</ul>';
        template += '</div>';

        return Handlebars.compile(template);
    };


    return {
        render: render,
        template: template,
        init: init,
        toggleCheck: toggleCheck,
        toggleGroup: toggleGroup
    };

}());
