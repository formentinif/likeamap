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

var SearchTools = (function() {
  var isRendered = false;

  var comuni = [];
  var searchResults = [];
  var searchAddressProviderUrl = "";
  var searchAddressProviderField = "";
  var searchHouseNumberProviderUrl = "";
  var searchHouseNumberProviderField = "";
  var currentSearchDate = "";
  var searchLayers = [];

  var init = function init() {
    Handlebars.registerHelper("hasLayers", function(options) {
      //return searchLayers.length > 0;
      return true;
    });

    //events binding
    Dispatcher.bind("show-search", function(payload) {
      AppToolbar.toggleToolbarItem("search-tools");
    });

    try {
      M.AutoInit();
      $(".dropdown-trigger").dropdown();
    } catch (e) {
    } finally {
    }
  };

  var render = function(
    div,
    provider,
    providerAddressUrl,
    providerAddressField,
    providerHouseNumberUrl,
    providerHouseNumberField,
    layers
  ) {
    searchLayers = layers;
    switch (provider) {
      case "wms_geoserver":
        searchAddressProviderUrl = providerAddressUrl;
        searchAddressProviderField = providerAddressField;
        searchHouseNumberProviderUrl = providerHouseNumberUrl;
        searchHouseNumberProviderField = providerHouseNumberField;

        var templateTemp = templateSearchWFSGeoserver(searchLayers);
        var output = templateTemp(searchLayers);
        jQuery("#" + div).html(output);
        $("#search-tools__select-layers").on("change", function() {
          var currentLayer = $("#search-tools__select-layers option:selected").val();
          for (li = 0; li < searchLayers.length; li++) {
            if (searchLayers[li].layer == currentLayer) {
              $("#search-tools__search-layers__label").text(searchLayers[li].searchField);
            }
          }
        });
        break;
      case "nominatim":
      default:
        var templateTemp = templateSearchNominatim(searchLayers);
        var output = templateTemp(searchLayers);
        jQuery("#" + div).html(output);
    }

    updateScroll(220);
    $(window).resize(function() {
      updateScroll(20);
    });

    if (!isRendered) {
      init();
    }

    isRendered = true;
  };

  /**
   * Aggiorna la dimensione dello scroll dei contenuti
   * @return {null} La funzione non restituisce un valore
   */
  var updateScroll = function(offset) {
    var positionMenu = $("#menu-toolbar").offset();
    var positionSearch = $("#search-tools__search-results").offset();
    $("#search-tools__search-results").height(positionMenu.top - positionSearch.top - offset);
  };

  var updateComuniNominatim = function(comuni) {
    $.each(comuni, function(i, comune) {
      var nomeComune = comune.nomeComune;
      if (nomeComune) {
        nomeComune = nomeComune.replace(/_/g, " ");
        if (nomeComune.indexOf("Reggio") >= 0) {
          nomeComune = nomeComune.replace("nell Emilia", "nell'Emilia");
        }
      }
      $("#search-tools__comune").append(
        $("<option>", {
          value: comune.istat,
          text: nomeComune
        })
      );
    });
  };

  /**
   * General html code that will be injected in the panel as the main tools
   */
  var templateTopTools = function() {
    let template = '<div class="lk-bar lk-background">';
    template +=
      '<button id="search-tools__menu" class="dropdown-trigger btn" value="Indirizzo" data-target="search-tools__menu-items">';
    template += '<i class="material-icons">more_vert</i>';
    template += '</button> <span id="search-tools__label">Indirizzo</span>';
    template += "</div>";
    template += '<ul id="search-tools__menu-items" class="dropdown-content" >';
    template += '<li onclick="SearchTools.showSearchAddress(); return false;"><span >Indirizzo</span></li>';
    template += "{{#if this.length}}";
    template += '<li onclick="SearchTools.showSearchLayers(); return false;"><span >Layer</span></li>';
    template += "{{/if}}";
    template += "</ul>";
    return template;
  };

  /**
   * General html code that will be injected in order to display the layer tools
   */
  var templateLayersTools = function(searchLayers) {
    let template = '<div id="search-tools__layers" class="lk-card z-depth-2" style="display:none;">';
    template += '<select id="search-tools__select-layers" class="input-field">';
    for (var i = 0; i < searchLayers.length; i++) {
      template += '<option value="' + searchLayers[i].layer + '">' + searchLayers[i].layerName + "</option>";
    }
    template += "</select>";
    template += '<div class="div-5"></div>';
    template += '<div id="search-tools__search-layers-field" class="input-field" >';
    template +=
      '<input id="search-tools__search-layers" class="input-field" type="search" onkeyup="SearchTools.searchLayers(event)">';
    template += '<label class="input-field" id="search-tools__search-layers__label" for="search-tools__search-layers">';
    if (searchLayers.length > 0) {
      template += searchLayers[0].searchField;
    } else {
      template += "Layers...";
    }
    template += "</label>";
    template += "</div>";
    template += "</div>";
    return template;
  };

  /**
   * Initialize the panel if Nominatim is selected as default address provider
   */
  var templateSearchNominatim = function(searchLayers) {
    let template = "";
    //pannello ricerca via
    if (!AppStore.getAppState().logoPanelUrl) {
      template += '<h4 class="lk-title">Ricerca</h4>';
    }
    template += templateTopTools();
    template += '<div id="search-tools__address" class="lk-card z-depth-2">';
    template += '<select id="search-tools__comune" class="input-field">';
    template += "</select>";
    template += '<div class="div-5"></div>';
    template += '<div id="search-tools__search-via-field" class="input-field" >';
    template +=
      '<input id="search-tools__search-via" class="input-field" type="search" onkeyup="SearchTools.doSearchAddressNominatim(event)">';
    template +=
      '<label class="input-field" id="search-tools__search-via__label" for="search-tools__search-via">Via...</label>';
    template += "</div>";
    template += "</div>";
    template += templateLayersTools(searchLayers);
    template += '<div class="div-10"></div>';
    template += '<div id="search-tools__search-results" class="lk-card z-depth-2 lk-scrollable">';
    template += "</div>";
    return Handlebars.compile(template);
  };

  /**
   * Initialize the panel if Geoserver is selected as default address provider
   */
  var templateSearchWFSGeoserver = function() {
    let template = "";
    //pannello ricerca via
    if (!AppStore.getAppState().logoPanelUrl) {
      template += '<h4 class="lk-title">Ricerca</h4>';
    }
    template += templateTopTools();
    template += '<div id="search-tools__address" class="lk-card z-depth-2">';
    template += '<div id="search-tools__search-via-field" class="input-field" >';
    template +=
      '<input id="search-tools__search-via" class="input-field" type="search" onkeyup="SearchTools.doSearchAddressWMSG(event)">';
    template +=
      '<label class="input-field" id="search-tools__search-via__label" for="search-tools__search-via">Via...</label>';
    template += "</div>";
    template += "</div>";
    template += templateLayersTools(searchLayers);
    template += '<div class="div-10"></div>';
    template += '<div id="search-tools__search-results" class="lk-card z-depth-2 lk-scrollable">';
    template += "</div>";
    return Handlebars.compile(template);
  };

  /**
   * Display the list of the nominatim results in the left panel
   * @param {Object} results
   */
  var templateResultsNominatim = function(results) {
    template = '<h5>Risultati della ricerca</h5><ul class="mdl-list">';
    template += "{{#each this}}";
    template += '<li class="mdl-list__item">';
    template +=
      '<i class="material-icons md-icon">&#xE55F;</i><a href="#" onclick="SearchTools.zoomToItemNominatim({{{@index}}});return false">';
    template += "{{{display_name}}}";
    template += "</a>";
    template += "</li>";
    template += "{{/each}}";
    template += "</ul>";
    return Handlebars.compile(template);
  };

  /**
   * Display the list of the WFS Address results in the left panel
   * @param {Object} results
   */
  var templateSearchResultsWFSGeoserver = function(results) {
    template = '<h5>Risultati della ricerca</h5><ul class="mdl-list">';
    template += "{{#each this}}";
    template += '<li class="mdl-list__item">';
    template +=
      '<i class="material-icons md-icon">&#xE55F;</i><a href="#" onclick="SearchTools.zoomToItemLayer({{{lon}}}, {{{lat}}}, {{@index}}, false);return false">';
    template += "{{{display_name}}} ";
    template += "{{{display_name2}}} ";
    template += "</a>";
    template += "</li>";
    template += "{{/each}}";
    template += "</ul>";
    return Handlebars.compile(template);
  };

  /**
   * Display the list of the WFS Layers results in the left panel
   * @param {Object} results
   */
  var templateSearchResultsLayers = function(results) {
    template = '<ul class="mdl-list">';
    template += "{{#each this}}";
    template += '<li class="mdl-list__item">';
    template +=
      '<i class="material-icons md-icon">&#xE55F;</i><a href="#" onclick="SearchTools.zoomToItemLayer({{{lon}}}, {{{lat}}}, {{@index}}, true);return false">';
    template += "{{{display_name}}}";
    template += "</a>";
    template += "</li>";
    template += "{{/each}}";
    template += "</ul>";
    return Handlebars.compile(template);
  };

  var templateResultEmpty = function(results) {
    var template = "<p>Nessun risultato disponibile</p>";
    return Handlebars.compile(template);
  };

  /**
   * Switch the address/layers tools
   */
  var showSearchAddress = function() {
    $("#search-tools__label").text("Indirizzo");
    $("#search-tools__address").show();
    $("#search-tools__layers").hide();
  };

  /**
   * Switch the address/layers tools
   */
  var showSearchLayers = function() {
    $("#search-tools__label").text("Layers");
    $("#search-tools__address").hide();
    $("#search-tools__layers").show();
  };

  /**
   * Zoom the map to the item provided
   * @param {int} index  Item's index in the Nominatim array result
   */
  var zoomToItemNominatim = function(index) {
    let result = searchResults[index];
    dispatch({
      eventName: "zoom-lon-lat",
      zoom: 18,
      lon: parseFloat(result.lon),
      lat: parseFloat(result.lat)
    });
    dispatch({
      eventName: "add-wkt-info-map",
      wkt: "POINT(" + result.lon + " " + result.lat + ")"
    });
    dispatch({ eventName: "hide-menu-mobile" });
  };

  /**
   * Zoom the map to the lon-lat given and add a point to the map
   * @param {float} lon
   * @param {float} lat
   */
  var zoomToItemWFSGeoserver = function(lon, lat) {
    dispatch("remove-info");
    dispatch({
      eventName: "zoom-lon-lat",
      zoom: 18,
      lon: parseFloat(lon),
      lat: parseFloat(lat)
    });
    dispatch({
      eventName: "add-wkt-info-map",
      wkt: "POINT(" + payload.lon + " " + payload.lat + ")"
    });
    dispatch("hide-menu-mobile");
  };

  /**
   * Zoom the map to the lon-lat given and show the infobox of the given item index
   * @param {float} lon
   * @param {float} lat
   * @param {int} index Item's index in the result array
   * @param {boolean} showInfo
   */
  var zoomToItemLayer = function(lon, lat, index, showInfo) {
    dispatch("remove-info");
    if (searchResults[index]) {
      dispatch({
        eventName: "zoom-geometry",
        geometry: searchResults[index].item.geometry
      });
      if (showInfo) {
        dispatch({
          eventName: "show-info-items",
          data: searchResults[index].item
        });
      }
      let payload = {
        eventName: "add-feature-info-map",
        geometry: searchResults[index].item.geometry
      };
      try {
        payload.srid = searchResults[index].item.crs;
      } catch (e) {
        payload.srid = null;
      }
      dispatch(payload);
      dispatch("hide-menu-mobile");
    } else {
      dispatch({
        eventName: "zoom-lon-lat",
        zoom: 18,
        lon: parseFloat(lon),
        lat: parseFloat(lat),
        eventName: "add-wkt-info-map",
        wkt: "POINT(" + lon + " " + lat + ")"
      });
      dispatch("hide-menu-mobile");
    }
  };

  var getRegioneFromComuneNominatim = function(idcomune) {
    return "Emilia-Romagna";
  };

  /**
   * Start the search in the Nominatim Provider
   * @param {Object} ev key click event result
   */
  var doSearchAddressNominatim = function(ev) {
    if (ev.keyCode == 13) {
      $("#search-tools__search-via").blur();
    }
    var comune = $("#search-tools__comune option:selected").text();
    var idcomune = $("#search-tools__comune option:selected").val();
    var regione = getRegioneFromComuneNominatim(idcomune);
    var via = $("#search-tools__search-via").val();

    if (via.length > 3 && comune) {
      via = via.replace("'", " ");
      var url =
        "http://nominatim.openstreetmap.org/search/IT/" +
        regione +
        "/" +
        comune +
        "/" +
        via +
        "?format=jsonv2&addressdetails=1" +
        "&";
      console.log(url);
      currentSearchDate = new Date().getTime();
      var searchDate = new Date().getTime();
      $.ajax({
        dataType: "json",
        url: url
      })
        .done(function(data) {
          //verifica che la ricerca sia ancora valida
          if (currentSearchDate > searchDate) {
            return;
          }
          var results = [];
          if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].osm_type == "way") {
                results.push(data[i]);
              }
            }
            searchResults = results;
            //renderizzo i risultati

            var templateTemp = templateResultsNominatim();
            var output = templateTemp(results);
            jQuery("#search-tools__search-results").html(output);
          } else {
            var templateTemp = templateResultEmpty();
            var output = templateTemp();
            jQuery("#search-tools__search-results").html(output);
          }
        })
        .fail(function(data) {
          dispatch({
            eventName: "log",
            message: "SearchTools: unable to bind comuni"
          });
        });
    }
  };

  /**
   * Start the search in the WFS Geoserver Provider
   * @param {Object} ev key click event result
   */
  var doSearchAddressWMSG = function(ev) {
    if (ev.keyCode == 13) {
      $("#search-tools__search-via").blur();
    }
    var via = $("#search-tools__search-via").val();
    var cql = "";
    var arrTerms = via.split(" ");
    var street = "";
    var civico = "";

    if (via.indexOf(",") > -1) {
      var viaArr = via.split(",");
      street = viaArr[0];
      civico = viaArr[1];
    } else {
      for (var i = 0; i < arrTerms.length; i++) {
        //verifica dei civici e dei barrati
        if (isNaN(arrTerms[i])) {
          if (arrTerms[i].indexOf("/") > -1) {
            civico += arrTerms[i];
          } else if (arrTerms[i].length === 1) {
            civico += arrTerms[i];
          } else {
            street += arrTerms[i] + " ";
          }
        } else {
          if (i === 0) {
            //se ho il primo elemento numerico lo tratto come una via
            street += arrTerms[i];
          } else {
            civico += arrTerms[i];
          }
        }
      }
    }
    var url = searchAddressProviderUrl;
    if (!civico) {
      //solo ricerca via
      url += "&cql_filter=[" + searchAddressProviderField + "]ilike%27%25" + street.trim() + "%25%27";
    } else {
      //ricerca via e civico
      var url = searchHouseNumberProviderUrl;
      url +=
        "&cql_filter=" +
        searchAddressProviderField +
        "%20ilike%20%27%25" +
        street.trim() +
        "%25%27%20AND%20" +
        searchHouseNumberProviderField +
        "%20ILIKE%20%27" +
        civico +
        "%25%27";
    }

    if (via.length > 2) {
      via = via.replace("'", " ");
      currentSearchDate = new Date().getTime();
      var searchDate = new Date().getTime();
      $.ajax({
        dataType: "jsonp",
        url: url,
        jsonp: true,
        jsonpCallback: "parseResponse",
        success: function(data) {
          //verifica che la ricerca sia ancora valida
          if (currentSearchDate > searchDate) {
            return;
          }
          var results = [];
          if (data.features.length > 0) {
            var toponimi = [];
            var results = [];
            for (var i = 0; i < data.features.length; i++) {
              var currentAddress = data.features[i].properties[searchAddressProviderField];
              if (data.features[i].properties[searchHouseNumberProviderField]) {
                currentAddress = " " + data.features[i].properties[searchHouseNumberProviderField];
              }
              if ($.inArray(currentAddress, toponimi) === -1) {
                var cent = null;
                if (data.features[i].geometry.type != "POINT") {
                  cent = AppMap.getCentroid(data.features[i].geometry.coordinates);
                } else {
                  cent = data.features[i].geometry.coordinates;
                }

                var tempItem = {
                  display_name: data.features[i].properties[searchAddressProviderField],
                  lon: cent[0],
                  lat: cent[1],
                  item: data.features[i]
                };
                if (searchHouseNumberProviderField) {
                  tempItem.display_name2 = data.features[i].properties[searchHouseNumberProviderField];
                }
                results.push(tempItem);
                toponimi.push(data.features[i].properties[searchAddressProviderField]);
              }
            }
            searchResults = results.sort(SortByDisplayName);
            //renderizzo i risultati
            var templateTemp = templateSearchResultsWFSGeoserver();
            var output = templateTemp(results);
            jQuery("#search-tools__search-results").html(output);
          } else {
            var templateTemp = templateResultEmpty();
            var output = templateTemp();
            jQuery("#search-tools__search-results").html(output);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          dispatch({
            eventName: "log",
            message: "SearchTools: unable to complete response"
          });
        }
      });
    }
  };

  /**
   * Start the search in the WFS Geoserver Provider
   * @param {Object} ev key click event result
   */
  var doSearchLayers = function(ev) {
    if (ev.keyCode == 13) {
      $("#search-tools__search-layers").blur();
    }
    var itemStr = $("#search-tools__search-layers").val();
    var cql = "";
    //ricavo l'elenco dei layer da interrogare
    currentSearchDate = new Date().getTime();
    var searchDate = new Date().getTime();
    var currentLayer = $("#search-tools__select-layers option:selected").val();

    if (itemStr.length > 2) {
      jQuery("#search-tools__search-results").html("");
      for (li = 0; li < searchLayers.length; li++) {
        if (searchLayers[li].layer == currentLayer) {
          var layer = searchLayers[li];
          var url = layer.mapUri;
          url =
            url.replace("/wms", "/") +
            "ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
            layer.layer +
            "&maxFeatures=50&outputFormat=text%2Fjavascript&cql_filter=[" +
            layer.searchField +
            "]ilike%27%25" +
            itemStr.trim() +
            "%25%27";
          itemStr = itemStr.replace("'", " ");

          $.ajax({
            dataType: "jsonp",
            url: url,
            jsonp: true,
            jsonpCallback: "parseResponse",
            success: function(data) {
              //verifica che la ricerca sia ancora valida
              if (currentSearchDate > searchDate) {
                return;
              }
              var results = [];
              if (data.features.length > 0) {
                var resultsIndex = [];
                var results = [];
                for (var i = 0; i < data.features.length; i++) {
                  if ($.inArray(data.features[i].properties[layer.searchField], resultsIndex) === -1) {
                    var cent = null;
                    if (data.features[i].geometry.coordinates[0][0]) {
                      cent = AppMap.getCentroid(data.features[i].geometry.coordinates[0]);
                    } else {
                      cent = data.features[i].geometry.coordinates;
                    }
                    var item = data.features[i];
                    //salvo il crs della feature
                    item.crs = data.crs;
                    //item.id = currentLayer;
                    results.push({
                      display_name: data.features[i].properties[layer.searchField],
                      lon: cent[0],
                      lat: cent[1],
                      item: item
                    });
                    resultsIndex.push(data.features[i].properties[layer.searchField]);
                  }
                }
                searchResults = results.sort(SortByDisplayName);
                //renderizzo i risultati
                var templateTemp = templateSearchResultsLayers();
                var output = templateTemp(results);
                jQuery("#search-tools__search-results").append(output);
              } else {
                var templateTemp = templateResultEmpty();
                var output = templateTemp();
                jQuery("#search-tools__search-results").html(output);
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
              dispatch({
                eventName: "log",
                message: "SearchTools: unable to complete response"
              });
            }
          });
        }
      }
    }
  };

  /**
   * Mostra dei risultati generici ricavati ad esempio da un reverseGeocoding
   * @param  {object} data Elenco di oggetti
   * @return {null}
   */
  var displayGenericResults = function(data) {
    var results = [];
    if (data.length > 0) {
      var resultsIndex = [];
      var results = [];
      for (var i = 0; i < data.length; i++) {
        //ricavo il layer relativo
        var layer = AppStore.getLayerByName(data[i].id.split(".")[0]);
        if (layer) {
          var cent = null;
          if (data[i].geometry.coordinates[0][0]) {
            cent = AppMap.getCentroid(data[i].geometry.coordinates[0]);
          } else {
            cent = AppMap.getCentroid(data[i].geometry.coordinates);
          }
          var item = data[i];
          //salvo il crs della feature
          item.crs = data.crs;
          //item.id = currentLayer;
          results.push({
            display_name: layer.layerName + "-" + data[i].properties[layer.labelField],
            lon: cent[0],
            lat: cent[1],
            item: item
          });
          resultsIndex.push(data[i].properties[layer.labelField]);
        }
      }
      searchResults = results;
      //renderizzo i risultati
      var templateTemp = templateSearchResultsLayers();
      var output = templateTemp(results);
      jQuery("#search-tools__search-results").html(output);
    } else {
      var templateTemp = templateResultEmpty();
      var output = templateTemp();
      jQuery("#search-tools__search-results").html(output);
    }
  };

  var selectLayer = function(layer) {
    $("#search-tools__select-layers").val(layer);
  };

  function SortByDisplayName(a, b) {
    var aName = a.display_name.toLowerCase();
    var bName = b.display_name.toLowerCase();
    return aName < bName ? -1 : aName > bName ? 1 : 0;
  }

  return {
    displayGenericResults: displayGenericResults,
    render: render,
    templateSearchNominatim: templateSearchNominatim,
    init: init,
    doSearchAddressNominatim: doSearchAddressNominatim,
    updateComuniNominatim: updateComuniNominatim,
    zoomToItemNominatim: zoomToItemNominatim,
    doSearchAddressWMSG: doSearchAddressWMSG,
    dosearchLayers: doSearchLayers,
    selectLayer: selectLayer,
    showSearchAddress: showSearchAddress,
    showSearchLayers: showSearchLayers,
    zoomToItemWFSGeoserver: zoomToItemWFSGeoserver,
    zoomToItemLayer: zoomToItemLayer
  };
})();
