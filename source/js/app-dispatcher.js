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

//definizione e inizializzazione del LamDispatcher
var LamDispatcher = (function () {
  var init = function functionName() {
    this.bind("log", function (payload) {
      console.log("log", payload);
    });

    this.bind("show-menu", function (payload) {
      LamToolbar.showMenu();
    });

    this.bind("hide-menu", function (payload) {
      LamToolbar.hideMenu();
    });

    this.bind("reset-tools", function (payload) {
      LamToolbar.resetTools();
    });

    this.bind("hide-menu-mobile", function (payload) {
      if (LamDom.isMobile()) {
        LamStore.hideMenu();
      }
    });

    this.bind("live-reload", function (payload) {
      LamStore.liveReload(payload.appState);
    });

    this.bind("zoom-lon-lat", function (payload) {
      LamMap.goToLonLat(payload.lon, payload.lat, payload.zoom);
    });

    this.bind("zoom-geometry", function (payload) {
      let geometryOl = LamMap.convertGeometryToOl(payload.geometry, LamEnums.geometryFormats().GeoJson);
      LamMap.goToGeometry(geometryOl, payload.srid);
    });

    // this.bind("add-wkt-info-map", function(payload) {
    //   LamMapInfo.addWktInfoToMap(payload.wkt);
    // });

    /**
     * {string} paylod.gid Layer Gid
     */
    this.bind("toggle-layer", function (payload) {
      LamMap.toggleLayer(payload.gid);
      LamStore.toggleLayer(payload.gid);
      LamLayerTree.updateCheckBoxesStates(LamStore.getAppState().layers);
    });

    this.bind("toggle-layer-group", function (payload) {
      LamStore.toggleLayersInGroup(payload.gid);
      LamLayerTree.updateCheckBoxesStates(LamStore.getAppState().layers);
    });

    this.bind("set-layer-visibility", function (payload) {
      LamMap.setLayerVisibility(payload.gid, payload.visibility);
      LamStore.setLayerVisibility(payload.gid, payload.visibility);
    });

    this.bind("reset-layers", function (payload) {
      LamStore.resetInitialLayers();
    });

    this.bind("map-click", function (payload) {
      LamMapTools.addCoordinate(payload.lon, payload.lat);
    });

    this.bind("init-map-app", function (payload) {
      LamInit(payload.mapDiv, payload.appStateUrl, payload.mapTemplateUrl);
    });

    this.bind("map-move-end", function (payload) {
      LamMap.getMoveEndEvents().forEach((element) => {
        LamDispatcher.dispatch(element);
      });
    });

    this.bind("map-zoom-end", function (payload) {
      LamMap.getZoomEndEvents().forEach((element) => {
        LamDispatcher.dispatch(element);
      });
    });

    this.bind("map-zoom-in", function (payload) {
      LamMap.zoomIn();
    });

    this.bind("map-zoom-out", function (payload) {
      LamMap.zoomOut();
    });

    this.bind("map-browser-location", function (payload) {
      LamMap.goToBrowserLocation();
    });

    this.bind("do-login", function (payload) {
      LamStore.doLogin(payload.username, payload.password);
    });

    this.bind("open-url-location", function (payload) {
      LamStore.openUrlTemplate(payload.urlTemplate);
    });

    this.bind("log", function (payload) {
      if (console) {
        console.log(payload.str);
      }
      if (payload.showAlert) {
        alert(payload.str);
      }
    });

    this.bind("show-message", function (payload) {
      LamAlerts.showMessage(payload.title, payload.message, payload.type, { timeout: 3000 });
    });
  };

  var dispatch = function lamDispatch(payload) {
    if (typeof payload == "string") {
      payload = {
        eventName: payload,
      };
    }
    LamDispatcher.trigger(payload.eventName, payload);
  };

  return {
    dispatch: dispatch,
    init: init,
  };
})();

MicroEvent.mixin(LamDispatcher);
LamDispatcher.init();
