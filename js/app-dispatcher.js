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

//definizione e inizializzazione del Dispatcher
var Dispatcher = (function() {
  var init = function functionName() {
    this.bind("log", function(payload) {
      console.log("log", payload);
    });
    this.bind("show-menu", function(payload) {
      AppStore.showMenu();
    });
    this.bind("hide-menu", function(payload) {
      AppStore.hideMenu();
    });
    this.bind("reset-tools", function(payload) {
      AppStore.resetTools();
    });
    this.bind("stop-copy-coordinate", function(payload) {
      MapTools.stopCopyCoordinate();
    });
    this.bind("clear-layer-info", function(payload) {
      AppMapInfo.clearLayerInfo();
    });
    this.bind("clear-layer-print", function(payload) {
      AppMap.clearLayerPrint();
    });

    this.bind("show-tool", function(payload) {
      if (payload.tool == "layers") {
        AppStore.showMenuContent("layer-tree");
      }
      if (payload.tool.indexOf("print") > -1) {
        AppStore.showMenuContent("print-tools");
      }
      if (payload.tool.indexOf("share") > -1) {
        AppStore.showMenuContent("share-tools");
      }
      if (payload.tool.indexOf("map") > -1) {
        AppStore.showMenuContent("map-tools");
      }
      if (payload.tool.indexOf("draw") > -1) {
        AppStore.showMenuContent("draw-tools");
      }
      if (payload.tool.indexOf("search") > -1) {
        AppStore.showMenuContent("search-tools");
        //verifica dei layers
        if (payload.tool.indexOf("search-layers") > -1) {
          var arrSearch = payload.tool.split(",");
          setTimeout(function() {
            SearchTools.showSearchLayers();
            if (arrSearch.length > 1) {
              SearchTools.selectLayer(arrSearch[1]);
            }
          }, 1000);
        }
      }
    });

    this.bind("show-layers", function(payload) {
      AppStore.showMenuContent("layer-tree");
    });
    this.bind("show-search", function(payload) {
      AppStore.showMenuContent("search-tools");
    });
    this.bind("show-print", function(payload) {
      AppStore.showMenuContent("print-tools");
    });
    this.bind("show-share", function(payload) {
      AppStore.showMenuContent("share-tools");
    });
    this.bind("show-map-tools", function(payload) {
      AppStore.showMenuContent("map-tools");
    });
    this.bind("show-draw-tools", function(payload) {
      AppStore.showMenuContent("draw-tools");
    });
    this.bind("show-editor", function(payload) {
      EditorTools.showEditorWindow();
    });
    this.bind("show-info-item", function(payload) {
      AppStore.showInfoItem(payload.data);
    });
    this.bind("hide-menu-mobile", function(payload) {
      if (AppStore.isMobile()) {
        AppStore.hideMenu();
      }
    });
    this.bind("hide-info-window", function(payload) {
      AppStore.hideInfoWindow();
      AppMapInfo.clearLayerInfo();
    });
    this.bind("hide-editor-window", function(payload) {
      EditorTools.hideEditorWindow();
    });

    this.bind("hide-loader", function(payload) {
      AppStore.toggleLoader(false);
    });
    this.bind("show-loader", function(payload) {
      AppStore.toggleLoader(true);
    });

    this.bind("live-reload", function(payload) {
      AppStore.liveReload(payload.appState);
    });
    this.bind("show-legend", function(payload) {
      AppStore.showLegend(payload.gid, payload.scaled);
    });
    this.bind("search-address", function(payload) {
      AppStore.searchAddress(payload.data, "AppStore.processAddress");
    });
    this.bind("zoom-lon-lat", function(payload) {
      AppMap.goToLonLat(payload.lon, payload.lat, payload.zoom);
    });
    this.bind("zoom-geometry", function(payload) {
      AppMap.goToGeometry(payload.geometry);
    });
    this.bind("add-info-map", function(payload) {
      AppMap.addInfoToMap(payload.wkt);
    });
    this.bind("add-feature-info-map", function(payload) {
      AppMap.addFeatureInfoToMap(payload.geometry, payload.srid);
    });
    this.bind("toggle-layer", function(payload) {
      AppMap.toggleLayer(payload.gid);
      AppStore.toggleLayer(payload.gid);
    });
    this.bind("set-layer-visibility", function(payload) {
      AppMap.setLayerVisibility(payload.gid, payload.visibility);
      AppStore.setLayerVisibility(payload.gid, payload.visibility);
    });
    this.bind("reset-layers", function(payload) {
      AppStore.resetInitialLayers();
    });
    this.bind("print-map", function(payload) {
      AppStore.printMap(payload.paper, payload.orientation, payload.format, payload.template);
    });
    this.bind("create-share-url", function(payload) {
      AppStore.createShareUrl();
    });
    this.bind("show-share-url-query", function(payload) {
      AppStore.createShareUrl();
      ShareTools.setShareUrlQuery(AppStore.writeUrlShare());
    });

    this.bind("start-copy-coordinate", function(payload) {
      AppMap.startCopyCoordinate();
    });

    this.bind("map-click", function(payload) {
      MapTools.addCoordinate(payload.lon, payload.lat);
    });

    this.bind("remove-info", function(payload) {
      AppMapInfo.clearLayerInfo();
    });

    this.bind("add-info-point", function(payload) {
      AppMap.addInfoPoint(payload.lon, payload.lat);
    });

    this.bind("init-map-app", function(payload) {
      appInit();
    });

    this.bind("map-move-end", function(payload) {
      ShareTools.hideUrl();
      ShareTools.setShareUrlQuery(AppStore.writeUrlShare());
    });

    this.bind("map-zoom-end", function(payload) {
      ShareTools.hideUrl();
      ShareTools.setShareUrlQuery(AppStore.writeUrlShare());
    });

    this.bind("show-print-area", function(payload) {
      //ricavo posizione e risoluzione
      //Cerco il centro del rettangolo attuale di stampa o lo metto al centro della mappa
      var printCenter = AppMap.getPrintCenter();
      if (!printCenter) {
        printCenter = AppMap.getMapCenter();
      }
      //setto la risoluzione base a quella della mappa
      var scale = payload.scale;
      var resolution = AppMap.getMapResolution() / 2;
      //se la scala non è nulla setto la risoluzione in base alla Scala
      if (scale) {
        resolution = AppMap.getResolutionForScale(scale, "m");
      } else {
        //setto la scala per la stampa in ui
        PrintTools.setScale(AppMap.getMapScale() / 2);
      }
      var paper = payload.paper;
      var orientation = payload.orientation;
      var printSize = PrintTools.getPrintMapSize(paper, orientation, resolution);

      AppMap.setPrintBox(printCenter[0], printCenter[1], printSize.width, printSize.height);
    });

    this.bind("set-draw", function(payload) {
      AppMap.removeDrawInteraction();
      AppMap.removeDrawDeleteInteraction();
      AppMap.addDrawInteraction(payload.type);
    });

    this.bind("unset-draw", function(payload) {
      AppMap.removeDrawInteraction();
      AppMap.removeDrawDeleteInteraction();
    });

    this.bind("set-draw-delete", function(payload) {
      AppMap.removeDrawInteraction();
      AppMap.removeDrawDeleteInteraction();
      AppMap.addDrawDeleteInteraction(payload.type);
    });

    this.bind("delete-draw", function(payload) {
      AppMap.deleteDrawFeatures(payload.type);
    });

    this.bind("do-login", function(payload) {
      AppStore.doLogin(payload.username, payload.password);
    });

    this.bind("open-url-location", function(payload) {
      AppStore.openUrlTemplate(payload.urlTemplate);
    });

    this.bind("reverse-geocoding", function(payload) {
      //conversione coordinate
      AppMap.getRequestInfo(payload.coordinate, null, false);
    });

    this.bind("show-reverse-geocoding-result", function(payload) {
      //conversione coordinate
      AppStore.showMenuContent("search-tools", true);
      SearchTools.showSearchLayers();
      SearchTools.displayGenericResults(payload.results);
    });

    this.bind("enable-map-info", function(payload) {
      AppStore.setInfoClickEnabled(true);
    });

    this.bind("disable-map-info", function(payload) {
      AppStore.setInfoClickEnabled(false);
    });

    this.bind("log", function(payload) {
      if (console) {
        console.log(payload.str);
      }
      if (payload.showAlert) {
        alert(payload.str);
      }
    });

    this.bind("show-message", function(payload) {
      let message = { title: payload.title, message: payload.message };
      switch (payload.type) {
        case "error":
          $.growl.error(message);
          break;
        case "notice":
          $.growl.notice(message);
          break;
        case "warning":
          $.growl.warning(message);
          break;
        default:
          $.growl(message);
          break;
      }
    });
  };

  var dispatch = function dispatch(payload) {
    if (typeof payload == "string") {
      payload = {
        eventName: payload
      };
    }
    Dispatcher.trigger(payload.eventName, payload);
  };

  return {
    dispatch: dispatch,
    init: init
  };
})();
MicroEvent.mixin(Dispatcher);
Dispatcher.init();
