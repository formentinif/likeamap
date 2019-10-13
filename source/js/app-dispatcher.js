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
      AppToolbar.showMenu();
    });

    this.bind("hide-menu", function(payload) {
      AppToolbar.hideMenu();
    });

    this.bind("reset-tools", function(payload) {
      AppToolbar.resetTools();
    });

    this.bind("stop-copy-coordinate", function(payload) {
      MapTools.stopCopyCoordinate();
    });

    this.bind("clear-layer-info", function(payload) {
      AppMapInfo.clearLayerInfo();
      AppMapTooltip.hideMapTooltip();
    });

    // this.bind("show-tool", function(payload) {
    //   if (payload.tool == "layers") {
    //     AppToolbar.toggleToolbarItem("layer-tree");
    //   }
    //   if (payload.tool.indexOf("print") > -1) {
    //     AppToolbar.toggleToolbarItem("print-tools");
    //   }
    //   if (payload.tool.indexOf("share") > -1) {
    //     AppToolbar.toggleToolbarItem("share-tools");
    //   }
    //   if (payload.tool.indexOf("map") > -1) {
    //     AppToolbar.toggleToolbarItem("map-tools");
    //   }
    //   if (payload.tool.indexOf("draw") > -1) {
    //     AppToolbar.toggleToolbarItem("draw-tools");
    //   }
    //   if (payload.tool.indexOf("search") > -1) {
    //     AppToolbar.toggleToolbarItem("search-tools");
    //     //verifica dei layers
    //     if (payload.tool.indexOf("search-layers") > -1) {
    //       var arrSearch = payload.tool.split(",");
    //       setTimeout(function() {
    //         SearchTools.showSearchLayers();
    //         if (arrSearch.length > 1) {
    //           SearchTools.selectLayer(arrSearch[1]);
    //         }
    //       }, 1000);
    //     }
    //   }
    // });

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
      let geometryOl = AppMap.convertGeometryToOl(payload.geometry, AppMapEnums.geometryFormats().GeoJson);
      AppMap.goToGeometry(geometryOl);
    });

    this.bind("zoom-info-feature", function(payload) {
      try {
        let feature = AppStore.getCurrentInfoItems().features[payload.index];
        let layer = AppStore.getLayer(feature.layerGid);
        let featureOl = AppMap.convertGeoJsonFeatureToOl(feature);
        featureOl = AppMap.transform3857(featureOl, feature.srid);
        AppMap.goToGeometry(featureOl.getGeometry());
        let tooltip = AppTemplates.getLabelFeature(feature.properties, layer.labelField, layer.layerName);
        if (tooltip) {
          dispatch({ eventName: "show-map-tooltip", geometry: featureOl.getGeometry().getCoordinates(), tooltip: tooltip });
        }
        dispatch({
          eventName: "set-layer-visibility",
          gid: feature.layerGid,
          visibility: 1
        });
        dispatch({
          eventName: "flash-feature",
          feature: feature
        });
      } catch (error) {
        dispatch({ eventName: "log", message: error });
      }
    });

    this.bind("add-wkt-info-map", function(payload) {
      AppMapInfo.addWktInfoToMap(payload.wkt);
    });

    this.bind("add-feature-info-map", function(payload) {
      AppMapInfo.addFeatureInfoToMap(payload.geometry);
    });

    this.bind("toggle-layer", function(payload) {
      AppMap.toggleLayer(payload.gid);
      AppStore.toggleLayer(payload.gid);
    });

    this.bind("set-layer-visibility", function(payload) {
      debugger;
      AppMap.setLayerVisibility(payload.gid, payload.visibility);
      AppStore.setLayerVisibility(payload.gid, payload.visibility);
    });

    this.bind("reset-layers", function(payload) {
      AppStore.resetInitialLayers();
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
      let geometryOl = new ol.geom.Point([payload.lon, payload.lat]);
      let featureOl = new ol.Feature({
        geometry: geometryOl
      });
      featureOl.srid = 4326;
      AppMapInfo.addFeatureInfoToMap(featureOl);
    });

    this.bind("init-map-app", function(payload) {
      appInit();
    });

    this.bind("map-move-end", function(payload) {
      ShareTools.hideUrl();
      ShareTools.setShareUrlQuery(ShareTools.writeUrlShare());
    });

    this.bind("map-zoom-end", function(payload) {
      ShareTools.hideUrl();
      ShareTools.setShareUrlQuery(ShareTools.writeUrlShare());
    });

    this.bind("map-zoom-in", function(payload) {
      AppMap.zoomIn();
    });

    this.bind("map-zoom-out", function(payload) {
      AppMap.zoomOut();
    });

    this.bind("map-browser-location", function(payload) {
      AppMap.goToBrowserLocation();
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
      AppToolbar.toggleToolbarItem("search-tools", true);
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
      let msg = {
        html: "",
        classes: ""
      };
      if (payload.message) {
        msg.html += "<div>" + payload.message + "<div>";
      }
      switch (payload.type) {
        case "error":
          msg.classes = "lam-error";
          M.toast(msg);
          break;
        case "info":
          msg.classes = "lam-info";
          M.toast(msg);
          break;
        case "warning":
          msg.classes = "lam-warning";
          M.toast(msg);
          break;
        case "notice":
          msg.classes = "lam-secondary";
          M.toast(msg);
          break;

        default:
          M.toast(msg);
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
