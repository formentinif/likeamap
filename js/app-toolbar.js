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
let AppToolbar = (function() {
  "use strict";

  var easingTime = 300;
  var currentToolbarItem = "";

  let resetToolsPayloads = [{ eventName: "stop-copy-coordinate" }, { eventName: "clear-layer-info" }];

  let init = function() {
    //eseguo degli aggiustamente in caso di browser mobile
    if (AppStore.isMobile()) {
      $("#menu-toolbar__layer-tree").addClass("mdl-button--mini-fab");
      $("#menu-toolbar__search-tools").addClass("mdl-button--mini-fab");
      $("#menu-toolbar__print-tools").addClass("mdl-button--mini-fab");
      $("#menu-toolbar__share-tools").addClass("mdl-button--mini-fab");
      $("#menu-toolbar__map-tools").addClass("mdl-button--mini-fab");
      $("#menu-toolbar__draw-tools").addClass("mdl-button--mini-fab");
      $("#menu-toolbar__gps-tools").addClass("mdl-button--mini-fab");
      $("#menu-toolbar").height("50px");
      $("#menu-toolbar").css("padding-left", "10px");
      $(".lk-menu-toolbar-bottom button").css("margin-right", "0px");
      easingTime = 0;
    }
    // else {
    //   //definizione degli eventi jquery
    //   dragElement(document.getElementById("info-window"));
    // }

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
      dispatch(payload);
    });
  };

  let addResetToolsEvent = function(event) {
    resetToolsPayloads.push(event);
  };

  let showMenu = function(toolId) {
    $("#menu-panel").animate(
      {
        width: "show"
      },
      {
        duration: easingTime,
        complete: function() {
          if (toolId) {
            $("#" + toolId).show();
          }
        }
      }
    );
  };

  /**
   * Nasconde il pannello del menu
   */
  var hideMenu = function() {
    $("#menu-panel").animate(
      {
        width: "hide"
      },
      easingTime
    );
  };

  var toggleToolbarItem = function(toolId, keepOpen) {
    AppStore.setInfoClickEnabled(true);
    //verifico se il pannello non è già selezionato
    if (currentToolbarItem != toolId) {
      //new tool selected
      currentToolbarItem = toolId;
      resetTools();
      $(".lk-menu-panel-content-item").hide();
      showMenu(toolId);
    } else {
      if ($("#menu-panel").css("display") == "none" || keepOpen) {
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
    hideMenu: hideMenu,
    getCurrentToolbarItem: getCurrentToolbarItem,
    init: init,
    toggleToolbarItem: toggleToolbarItem
  };
})();
