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

//aggiornamento background
var numBg = Math.floor(Math.random() * 6) + 1;
var tempBg = "url(img/logins/login" + numBg + ".jpg)";
$("#login-container").css("background-image", tempBg);

function touchHandler(event) {
  var touch = event.changedTouches[0];

  var simulatedEvent = document.createEvent("MouseEvent");
  simulatedEvent.initMouseEvent({
      touchstart: "mousedown",
      touchmove: "mousemove",
      touchend: "mouseup"
    }[event.type], true, true, window, 1,
    touch.screenX, touch.screenY,
    touch.clientX, touch.clientY, false,
    false, false, false, 0, null);

  touch.target.dispatchEvent(simulatedEvent);
  event.preventDefault();
}

//funzione globale per utilizzare il dispatch
function dispatch(payload) {
  Dispatcher.dispatch(payload);
}

function appInit() {
  //carico l'appstate
  var appStateId = decodeURIComponent((new RegExp('[?|&]' + 'appstate' + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
  var appStateJson = decodeURIComponent((new RegExp('[?|&]' + 'appstatejson' + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
  if (appStateId || appStateJson) {
    if (appStateId) {
      $.ajax({
        dataType: "json",
        url: globalShareUrl + appStateId,
      }).done(function(appstate) {
        if (appstate.authentication.requireAuthentication) {
          AuthTools.render('login-container');
        }
        AppStore.mapInit(appstate, customFunctions);
      }).fail(function() {
        //AppStore.mapInit();
        dispatch({
          eventName: "log",
          message: "Share: Impossibile caricare la mappa condivisa"
        });
      });
    }
    if (appStateJson) {
      $.ajax({
        dataType: "json",
        url: appStateJson,
      }).done(function(appstate) {
        if (appstate.authentication.requireAuthentication) {
          AuthTools.render('login-container');
        }
        AppStore.mapInit(appstate, customFunctions);
      }).fail(function() {
        //AppStore.mapInit();
        dispatch({
          eventName: "log",
          message: "Share: Impossibile caricare la mappa condivisa"
        });
      });
    }
    // var share = function() {
    //     var deferred = Q.defer();
    //     $.get("/api/share/" + appStateId, "", deferred.resolve);
    //     return deferred.promise;
    // }
    //
    // share().then(function(appstate) {
    //     debugger
    //     mapInit(appstate);
    // }).fail(function() {
    //   debugger
    //     mapInit();
    //     alert("Impossibile caricare la mappa condivisa.");
    // });
  } else {
    $.ajax({
      dataType: "json",
      url: "app-state.json",
    }).done(function(appstate) {

      //dispatch("init-map-app");
      if (appstate.authentication.requireAuthentication) {
        AuthTools.render('login-container');
      }
      AppStore.mapInit(appstate, customFunctions);
    }).fail(function() {
      dispatch({
        eventName: "log",
        message: "Share: Impossibile caricare la mappa"
      });
    });
  }
}

function customFunctions() {
  //creo il menu contestuale
  var items = [{
      text: 'Cerca qui',
      classname: 'some-style-class', // add some CSS rules
      //callback: center // `center` is your callback function
      callback: reverseGeocoding
    },
    {
      text: 'Aree metanizzate',
      classname: 'some-style-class', // you can add this icon with a CSS class
      // instead of `icon` property (see next line)
      //icon: 'img/marker.png', // this can be relative or absolute
      callback: areeMetanizzate
    },
    //'-' // this is a separator
  ];

  MainMap.addContextMenu(items);

}

function areeMetanizzate() {
  dispatch({
    "eventName": "open-url-location",
    "urlTemplate": "http://media.perspectiva.it/reggioemilia/web/areemetanizzate.aspx?lat={{lat}}&lon={{lon}}&type=ll&token={{token}}"
  })
}

function reverseGeocoding(obj) {
  dispatch({
    "eventName": "reverse-geocoding",
    "coordinate": obj.coordinate
  })
}

//inizializzazione della mappa
appInit();
