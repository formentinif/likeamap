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
var LamDispatcher = (function() {
  var init = function functionName() {
    this.bind("log", function(payload) {
      console.log("log", payload);
    });

    this.bind("show-menu", function(payload) {
      LamToolbar.showMenu();
    });

    this.bind("hide-menu", function(payload) {
      LamToolbar.hideMenu();
    });

    this.bind("reset-tools", function(payload) {
      LamToolbar.resetTools();
    });

    this.bind("stop-copy-coordinate", function(payload) {
      LamMapTools.stopCopyCoordinate();
    });

    this.bind("clear-layer-info", function(payload) {
      LamMapInfo.clearLayerInfo();
      LamMapTooltip.hideMapTooltip();
    });

    // this.bind("show-tool", function(payload) {
    //   if (payload.tool == "layers") {
    //     LamToolbar.toggleToolbarItem("lam-layer-tree");
    //   }
    //   if (payload.tool.indexOf("print") > -1) {
    //     LamToolbar.toggleToolbarItem("print-tools");
    //   }
    //   if (payload.tool.indexOf("share") > -1) {
    //     LamToolbar.toggleToolbarItem("share-tools");
    //   }
    //   if (payload.tool.indexOf("map") > -1) {
    //     LamToolbar.toggleToolbarItem("map-tools");
    //   }
    //   if (payload.tool.indexOf("draw") > -1) {
    //     LamToolbar.toggleToolbarItem("draw-tools");
    //   }
    //   if (payload.tool.indexOf("search") > -1) {
    //     LamToolbar.toggleToolbarItem("search-tools");
    //     //verifica dei layers
    //     if (payload.tool.indexOf("search-layers") > -1) {
    //       var arrSearch = payload.tool.split(",");
    //       setTimeout(function() {
    //         LamSearchTools.showSearchLayers();
    //         if (arrSearch.length > 1) {
    //           LamSearchTools.selectLayer(arrSearch[1]);
    //         }
    //       }, 1000);
    //     }
    //   }
    // });

    this.bind("hide-menu-mobile", function(payload) {
      if (LamStore.isMobile()) {
        LamStore.hideMenu();
      }
    });

    this.bind("hide-info-window", function(payload) {
      LamStore.hideInfoWindow();
      LamMapInfo.clearLayerInfo();
    });

    this.bind("hide-editor-window", function(payload) {
      EditorTools.hideEditorWindow();
    });

    this.bind("hide-loader", function(payload) {
      LamStore.toggleLoader(false);
    });

    this.bind("show-loader", function(payload) {
      LamStore.toggleLoader(true);
    });

    this.bind("live-reload", function(payload) {
      LamStore.liveReload(payload.appState);
    });

    this.bind("show-legend", function(payload) {
      LamStore.showLegend(payload.gid, payload.scaled);
    });

    this.bind("search-address", function(payload) {
      LamStore.searchAddress(payload.data, "LamStore.processAddress");
    });

    this.bind("zoom-lon-lat", function(payload) {
      LamMap.goToLonLat(payload.lon, payload.lat, payload.zoom);
    });

    this.bind("zoom-geometry", function(payload) {
      let geometryOl = LamMap.convertGeometryToOl(payload.geometry, LamMapEnums.geometryFormats().GeoJson);
      LamMap.goToGeometry(geometryOl, payload.srid);
    });

    this.bind("zoom-info-feature", function(payload) {
      try {
        let feature = LamStore.getCurrentInfoItems().features[payload.index];
        let layer = LamStore.getLayer(feature.layerGid);
        let featureOl = LamMap.convertGeoJsonFeatureToOl(feature);
        featureOl = LamMap.transform3857(featureOl, feature.srid);
        LamMap.goToGeometry(featureOl.getGeometry());
        let tooltip = LamTemplates.getLabelFeature(feature.properties, layer.labelField, layer.layerName);
        if (tooltip) {
          lamDispatch({ eventName: "show-map-tooltip", geometry: featureOl.getGeometry().getCoordinates(), tooltip: tooltip });
        }
        lamDispatch({
          eventName: "set-layer-visibility",
          gid: feature.layerGid,
          visibility: 1
        });
        lamDispatch({
          eventName: "flash-feature",
          feature: feature
        });
      } catch (error) {
        lamDispatch({ eventName: "log", message: error });
      }
    });

    this.bind("add-wkt-info-map", function(payload) {
      LamMapInfo.addWktInfoToMap(payload.wkt);
    });

    this.bind("add-geometry-info-map", function(payload) {
      let geometryOl = LamMap.convertGeometryToOl(payload.geometry, LamMapEnums.geometryFormats().GeoJson);
      LamMapInfo.addGeometryInfoToMap(geometryOl, payload.srid);
    });

    this.bind("toggle-layer", function(payload) {
      LamMap.toggleLayer(payload.gid);
      LamStore.toggleLayer(payload.gid);
    });

    this.bind("set-layer-visibility", function(payload) {
      LamMap.setLayerVisibility(payload.gid, payload.visibility);
      LamStore.setLayerVisibility(payload.gid, payload.visibility);
    });

    this.bind("reset-layers", function(payload) {
      LamStore.resetInitialLayers();
    });

    this.bind("start-copy-coordinate", function(payload) {
      LamMap.startCopyCoordinate();
    });

    this.bind("map-click", function(payload) {
      LamMapTools.addCoordinate(payload.lon, payload.lat);
    });

    this.bind("remove-info", function(payload) {
      LamMapInfo.clearLayerInfo();
    });

    this.bind("add-info-point", function(payload) {
      let geometryOl = new ol.geom.Point([payload.lon, payload.lat]);
      let featureOl = new ol.Feature({
        geometry: geometryOl
      });
      featureOl.srid = 4326;
      LamMapInfo.addFeatureInfoToMap(featureOl);
    });

    this.bind("init-map-app", function(payload) {
      LamInit(payload.mapDiv, payload.appStateUrl, payload.mapTemplateUrl);
    });

    this.bind("map-move-end", function(payload) {
      LamShareTools.hideUrl();
      LamShareTools.setShareUrlQuery(LamShareTools.writeUrlShare());
    });

    this.bind("map-zoom-end", function(payload) {
      LamShareTools.hideUrl();
      LamShareTools.setShareUrlQuery(LamShareTools.writeUrlShare());
    });

    this.bind("map-zoom-in", function(payload) {
      LamMap.zoomIn();
    });

    this.bind("map-zoom-out", function(payload) {
      LamMap.zoomOut();
    });

    this.bind("map-browser-location", function(payload) {
      LamMap.goToBrowserLocation();
    });

    this.bind("do-login", function(payload) {
      LamStore.doLogin(payload.username, payload.password);
    });

    this.bind("open-url-location", function(payload) {
      LamStore.openUrlTemplate(payload.urlTemplate);
    });

    this.bind("reverse-geocoding", function(payload) {
      //conversione coordinate
      LamMap.getRequestInfo(payload.coordinate, null, false);
    });

    this.bind("show-reverse-geocoding-result", function(payload) {
      //conversione coordinate
      LamToolbar.toggleToolbarItem("search-tools", true);
      LamSearchTools.showSearchLayers();
      LamSearchTools.displayGenericResults(payload.results);
    });

    this.bind("enable-map-info", function(payload) {
      LamStore.setInfoClickEnabled(true);
    });

    this.bind("disable-map-info", function(payload) {
      LamStore.setInfoClickEnabled(false);
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

  var dispatch = function lamDispatch(payload) {
    if (typeof payload == "string") {
      payload = {
        eventName: payload
      };
    }
    LamDispatcher.trigger(payload.eventName, payload);
  };

  return {
    dispatch: dispatch,
    init: init
  };
})();

MicroEvent.mixin(LamDispatcher);
LamDispatcher.init();
