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

//Backgroung rotation
var numBg = Math.floor(Math.random() * 6) + 1;
var tempBg = "url(img/logins/login" + numBg + ".jpg)";
$("#login-container").css("background-image", tempBg);

//Global dispatch helper
function dispatch(payload) {
  Dispatcher.dispatch(payload);
}

function appInit() {
  //appstate loader
  //appstate with filename
  var appStateId =
    decodeURIComponent((new RegExp("[?|&]" + "appstate" + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [null, ""])[1].replace(/\+/g, "%20")) || null;

  //appstate json inline with url
  var appStateJson =
    decodeURIComponent((new RegExp("[?|&]" + "appstatejson" + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [null, ""])[1].replace(/\+/g, "%20")) ||
    null;

  if (appStateId) {
    //call with ajax
    $.ajax({
      dataType: "json",
      url: globalShareUrl + appStateId
    })
      .done(function(appState) {
        loadState(appstate);
      })
      .fail(function() {
        //AppStore.mapInit();
        dispatch({
          eventName: "log",
          message: "Share: Impossibile caricare la mappa condivisa"
        });
      });
  } else if (appStateJson) {
    $.ajax({
      dataType: "json",
      url: appStateJson
    })
      .done(function(appstate) {
        loadState(appstate);
      })
      .fail(function() {
        dispatch({
          eventName: "log",
          message: "Share: Impossibile caricare la mappa condivisa"
        });
      });
  } else {
    $.ajax({
      dataType: "json",
      url: "states/app-state.json"
    })
      .done(function(appstate) {
        loadState(appstate);
      })
      .fail(function() {
        dispatch({
          eventName: "log",
          message: "Share: Impossibile caricare la mappa"
        });
      });
  }

  function loadState(appstate) {
    if (appstate.authentication.requireAuthentication) {
      AuthTools.render("login-container");
    }
    AppStore.mapInit(appstate, customFunctions);
  }
}

/*Custom functions*/
function customFunctions() {
  //Right click menu
  var items = [
    {
      text: "Cerca qui",
      classname: "some-style-class",
      callback: reverseGeocoding
    }
  ];
  MainMap.addContextMenu(items);
}

function reverseGeocoding(obj) {
  dispatch({
    eventName: "reverse-geocoding",
    coordinate: obj.coordinate
  });
}

//inizializzazione della mappa
appInit();
