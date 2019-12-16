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

/**
 * Classe per la gestione della toolbar
 */
let LamToolbar = (function() {
  "use strict";

  var easingTime = 300;
  var currentToolbarItem = "";

  let resetToolsPayloads = [{ eventName: "stop-copy-coordinate" }];

  let init = function() {
    //eseguo degli aggiustamente in caso di browser mobile
    if (LamStore.isMobile()) {
      $("#menu-toolbar").css("padding-left", "10px");
      $(".lam-toolbar button").css("margin-right", "0px");
      easingTime = 0;
    } else {
      //definizione degli eventi jquery
      LamStore.dragElement(document.getElementById("info-window"));
    }

    //nascondo il draw per dimensioni piccole
    if ($(window).width() < 640) {
      $("#menu-toolbar__draw-tools").hide();
    }
  };

  /**
   * Resetta tutti i controlli mappa al cambio di menu
   * @return {null} La funzione non restituisce un valore
   */
  let resetTools = function() {
    resetToolsPayloads.forEach(function(payload) {
      lamDispatch(payload);
    });
  };

  let addResetToolsEvent = function(event) {
    resetToolsPayloads.push(event);
  };

  let showMenu = function(toolId) {
    $("#panel").animate(
      {
        width: "show"
      },
      {
        duration: easingTime,
        complete: function() {
          if (toolId) {
            $("#" + toolId).show();
          }
          $("#panel__open").hide();
        }
      }
    );
  };

  /**
   * Nasconde il pannello del menu
   */
  var hideMenu = function() {
    $("#panel").animate(
      {
        width: "hide"
      },
      easingTime,
      function() {
        $("#panel__open").show();
      }
    );
  };

  var toggleToolbarItem = function(toolId, keepOpen) {
    LamStore.setInfoClickEnabled(true);
    //verifico se il pannello non è già selezionato
    if (currentToolbarItem != toolId) {
      //new tool selected
      currentToolbarItem = toolId;
      resetTools();
      $(".lam-panel-content-item").hide();
      $(".lam-panel-content-item").removeClass("lam-visible");
      showMenu(toolId);
    } else {
      if ($("#panel").css("display") == "none" || keepOpen) {
        //actual tool selected but hidden
        showMenu(toolId);
      } else {
        //actual tool selected so it has to be hidden
        currentToolbarItem = null;
        resetTools();
        hideMenu();
        $("#" + toolId).hide();
      }
    }
  };

  let getCurrentToolbarItem = function() {
    return currentToolbarItem;
  };

  return {
    addResetToolsEvent: addResetToolsEvent,
    getCurrentToolbarItem: getCurrentToolbarItem,
    hideMenu: hideMenu,
    init: init,
    showMenu: showMenu,
    toggleToolbarItem: toggleToolbarItem
  };
})();
