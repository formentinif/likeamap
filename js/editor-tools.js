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

var EditorTools = (function() {
    var isRendered = false;
    var jsoneditor = null;
    var init = function init() {
        //carico la tendina dei comuni
        //componentHandler.upgradeElement(document.getElementById('search-tools__gotolonlat'));
        debugger
        //definizione degli eventi jquery
        $("#editor-window").draggable();
        $("#editor-window").resizable();
        // Initialize the editor
        jsoneditor = new JSONEditor(document.getElementById('editor-holder'), {
            // Enable fetching schemas via ajax
            ajax: true,

            // The schema for the editor
            schema: {
                $ref: "js/app-state-schema.json",
                format: "grid"
            },
            startval: AppStore.getAppState()
                // Seed the form with a starting value

        });
        var output = document.getElementById('editor-output');

        // Hook up the submit button to log to the console
        // document.getElementById('submit').addEventListener('click', function() {
        //     var json = jsoneditor.getValue();
        //     output.value = JSON.stringify(json, null, 2);
        // });

        // Hook up the Restore to Default button
        // document.getElementById('restore').addEventListener('click', function() {
        //     jsoneditor.setValue(starting_value);
        // });
        document.getElementById('editor-output').addEventListener('change', function() {
            try {
                debugger
                jsoneditor.setValue(JSON.parse(output.value));
                //payload.eventName = "live-reload";
                //payload.appState = JSON.parse(output.value);
                //Dispatcher.dispatch(payload);
            } catch (e) {
                alert("Impossibile caricare la configurazione inviata")
            }
        });
        // Hook up the validation indicator to update its
        // status whenever the jsoneditor changes
        jsoneditor.on('change', function() {
            // Get an array of errors from the validator
            var errors = jsoneditor.validate();

            // var indicator = document.getElementById('valid_indicator');

            // Not valid
            if (errors.length) {
                // indicator.className = 'label alert';
                // indicator.textContent = 'not valid';
            }
            // Valid
            else {
                // indicator.className = 'label success';
                // indicator.textContent = 'valid';
                var json = jsoneditor.getValue();
                var payload = {};
                payload.eventName = "live-reload";
                payload.appState = jsoneditor.getValue();
                Dispatcher.dispatch(payload);
                output.value = JSON.stringify(json, null, 2);
            }
        });
    }

    var render = function(div) {

        isRendered = true;
    }


    var showEditorWindow = function() {
        $("#editor-window").show();
        jsoneditor.setValue(AppStore.getAppState());
    }

    var hideEditorWindow = function() {
        $("#editor-window").hide();
    }


    return {
        hideEditorWindow: hideEditorWindow,
        init: init,
        render: render,
        showEditorWindow: showEditorWindow
    };

}());
