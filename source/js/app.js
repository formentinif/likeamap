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

//Backgroung rotation
var numBg = Math.floor(Math.random() * 6) + 1;
var tempBg = "url(img/logins/login" + numBg + ".jpg)";
$("#login-container").css("background-image", tempBg);

//Global dispatch helper
function lamDispatch(payload) {
  LamDispatcher.dispatch(payload);
}

/**
 * Init map function
 * @param {string} mapDiv Target Id of the div where the map will be rendered in. Default is lam-app
 * @param {*} appStateUrl Url of the appstate. Appstate given in the url will have priority over this. Otherwise states/app-state.json will be used
 * @param {*} mapTemplateUrl Url of the map template to load.
 */
function LamInit(mapDiv, appStateUrl, mapTemplateUrl) {
  LamLoader.lamInit(mapDiv, appStateUrl, mapTemplateUrl);
}

function reverseGeocoding(obj) {
  lamDispatch({
    eventName: "reverse-geocoding",
    coordinate: obj.coordinate
  });
}
