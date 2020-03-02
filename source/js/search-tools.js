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

var LamSearchTools = (function() {
  var isRendered = false;

  var comuni = [];
  var searchResults = [];
  var searchAddressProviderUrl = "";
  var searchAddressProviderField = "";
  var searchHouseNumberProviderUrl = "";
  var searchHouseNumberProviderField = "";
  var searchLayers = [];
  var timeout = 500;
  var timer;
  var searchResultsDiv = "search-tools__search-results";

  var init = function init() {
    Handlebars.registerHelper("hasLayers", function(options) {
      //return searchLayers.length > 0;
      return true;
    });

    //events binding
    /**
     * Shows the search tool, resetting info-results
     */
    LamDispatcher.bind("show-search", function(payload) {
      LamToolbar.toggleToolbarItem("search-tools");
      lamDispatch("clear-layer-info");
      lamDispatch("reset-search");
      setTimeout(function() {
        updateScrollHeight();
      }, 500);
    });

    /**
     * Resets the search info-results
     */
    LamDispatcher.bind("reset-search", function(payload) {
      LamSearchTools.resetSearch();
    });

    LamDispatcher.bind("show-search-items", function(payload) {
      LamSearchTools.showSearchInfoFeatures(payload.features, payload.template);
    });

    LamDispatcher.bind("search-address", function(payload) {
      LamStore.searchAddress(payload.data, "LamStore.processAddress");
    });

    //Carico i template di base
    if (LamStore.getAppState().searchProviderAddressTemplateUrl)
      LamTemplates.loadTemplateAjax(
        LamTemplates.getTemplateUrl(null, LamStore.getAppState().searchProviderAddressTemplateUrl, LamStore.getAppState().templatesRepositoryUrl)
      );
    if (LamStore.getAppState().searchProviderHouseNumberTemplateUrl)
      LamTemplates.loadTemplateAjax(
        LamTemplates.getTemplateUrl(null, LamStore.getAppState().searchProviderHouseNumberTemplateUrl, LamStore.getAppState().templatesRepositoryUrl)
      );

    try {
    } catch (e) {
    } finally {
    }
  };

  var render = function(div, provider, providerAddressUrl, providerAddressField, providerHouseNumberUrl, providerHouseNumberField, layers) {
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
          LamDispatcher.dispatch("clear-layer-info");
          var currentLayer = $("#search-tools__select-layers option:selected").val();
          for (li = 0; li < searchLayers.length; li++) {
            if (searchLayers[li].gid == currentLayer) {
              $("#search-tools__search-layers__label").text(searchLayers[li].searchFieldLabel || searchLayers[li].searchField);
            }
          }
          resetSearch();
        });
        break;
    }

    updateScrollHeight();
    $(window).resize(function() {
      updateScrollHeight();
    });

    if (!isRendered) {
      init();
    }

    isRendered = true;
  };

  let resetSearch = function() {
    $("#search-tools__search-layers").val("");
    $("#search-tools__search-address").val("");
    showSearchResults("<p>Inserisci un testo per iniziare la ricerca.</p>");
  };

  /**
   * Helper function to show html results
   * @param {string} html
   */
  let showSearchResults = function(html, htmlMobile) {
    if (!htmlMobile) htmlMobile = html;
    $("#" + searchResultsDiv).html(html);
    //$("#bottom-info__title-text").html(title);
    $("#bottom-info__title-text").html("Risultati di ricerca");
    $("#bottom-info__content").html(htmlMobile);
    //LamDom.showContent(LamEnums.showContentMode().LeftPanel, "", html, html, "search-tools", searchResultsDiv);
  };

  /**
   * Aggiorna la dimensione dello scroll dei contenuti
   * @return {null} La funzione non restituisce un valore
   */
  var updateScrollHeight = function() {
    var positionMenu = $("#menu-toolbar").offset();
    var positionSearch = $("#" + searchResultsDiv).offset();
    $("#" + searchResultsDiv).height(positionMenu.top - positionSearch.top - 20);
  };

  /**
   * General html code that will be injected in the panel as the main tools
   */
  var templateTopTools = function(layersNum) {
    let template = '<div class="lam-bar">';
    template +=
      '<div id="lam-bar__item-address" class="lam-bar__item lam-is-half lam-bar__item-selected" onclick="LamSearchTools.showSearchAddress(); return false;">';
    template += '<a id="search-tools__button-address" class="" autofocus>Indirizzi</a>';
    template += "</div>";
    if (layersNum) {
      template += '<div id="lam-bar__item-layers" class="lam-bar__item lam-is-half" onclick="LamSearchTools.showSearchLayers(); return false;">';
      template += '<a id="search-tools__button-layers" class="" >Temi</a>';
      template += "</div>";
    }
    template += "</div>";
    return template;
  };

  /**
   * General html code that will be injected in order to display the layer tools
   */
  var templateLayersTools = function(searchLayers) {
    let template = '<div id="search-tools__layers" class="lam-card lam-depth-2 lam-hidden" >';
    template += '<select id="search-tools__select-layers" class="lam-select lam-mb-2">';
    for (var i = 0; i < searchLayers.length; i++) {
      template += '<option class="lam-option" value="' + searchLayers[i].gid + '">' + searchLayers[i].layerName + "</option>";
    }
    template += "</select>";
    template += '<div id="search-tools__search-layers-field" class="lam-grid" >';
    template += '<label class="lam-label" id="search-tools__search-layers__label" for="search-tools__search-layers">';
    if (searchLayers.length > 0) {
      template += searchLayers[0].searchFieldLabel || searchLayers[0].searchField;
    } else {
      template += "Seleziona un tema...";
    }
    template += "</label>";
    template +=
      '<input id="search-tools__search-layers" class="lam-input" type="search" onkeyup="LamSearchTools.searchLayersKeyup(event)" placeholder="Ricerca...">';
    template += "</div>";
    template += "</div>";
    return template;
  };

  /**
   * Initialize the panel if Geoserver is selected as default address provider
   */
  var templateSearchWFSGeoserver = function() {
    let template = "";
    //pannello ricerca via
    if (!LamStore.getAppState().logoPanelUrl) {
      template += '<h4 class="lam-title">Ricerca</h4>';
    }
    template += templateTopTools(searchLayers.length);
    template += '<div id="search-tools__address" class="lam-card lam-depth-2">';
    template += '<div id="search-tools__search-address-field" class="" >';
    template += '<label class="lam-label" id="search-tools__search-address__label" for="search-tools__search-address">Indirizzo</label>';
    template +=
      '<input id="search-tools__search-address" class="lam-input" type="search" onkeyup="LamSearchTools.searchAddressKeyup(event)" placeholder="Via o civico">';
    template += "</div>";
    template += "</div>";
    if (searchLayers.length > 0) {
      template += templateLayersTools(searchLayers);
    }
    template += '<div class="div-10"></div>';
    template += '<div id="' + searchResultsDiv + '" class="lam-card lam-depth-2 lam-scrollable">';
    template += "</div>";
    return Handlebars.compile(template);
  };

  // /**
  //  * Display the list of the WFS Address results in the left panel
  //  * @param {Object} results
  //  */
  // var templateSearchResultsWFSGeoserver = function(results) {
  //   template = '<h5 class="lam-title-h4>Risultati della ricerca</h5>';
  //   template = '<div class="lam-grid lam-grid-1">';
  //   template += "{{#each this}}";
  //   template += '<div class="lam-col">';
  //   template +=
  //     '<i class="lam-icon-primary">' +
  //     LamResources.svgMarker +
  //     '</i><a href="#" class="lam-link" onclick="LamSearchTools.zoomToItemLayer({{{lon}}}, {{{lat}}}, {{@index}}, false);return false">';
  //   template += "{{{display_name}}} ";
  //   template += "{{{display_name2}}} ";
  //   template += "</a>";
  //   template += "</div>";
  //   template += "{{/each}}";
  //   template += "</div>";
  //   return Handlebars.compile(template);
  // };

  // /**
  //  * Display the list of the WFS Layers results in the left panel
  //  * @param {Object} results
  //  */
  // var templateSearchResultsLayers = function(results) {
  //   template = '<div class="lam-grid">';
  //   template += "{{#each this}}";
  //   template += '<div class="lam-col">';
  //   template +=
  //     '<i class="lam-icon-primary">' +
  //     LamResources.svgMarker +
  //     '</i><a href="#" class="lam-link" onclick="LamSearchTools.zoomToItemLayer({{{lon}}}, {{{lat}}}, {{@index}}, true);return false">';
  //   template += "{{{display_name}}}";
  //   template += "</a>";
  //   template += "</div>";
  //   template += "{{/each}}";
  //   template += "</div>";
  //   return Handlebars.compile(template);
  // };

  /**
   * Switch the address/layers top tools
   */
  var showSearchAddress = function() {
    $("#search-tools__label").text("Indirizzo");
    $("#search-tools__address").show();
    $("#search-tools__layers").hide();
    lamDispatch("clear-layer-info");
    lamDispatch("reset-search");
    $("#lam-bar__item-address").addClass("lam-bar__item-selected");
    $("#lam-bar__item-layers").removeClass("lam-bar__item-selected");
    updateScrollHeight();
  };

  /**
   * Switch the address/layers tools
   */
  var showSearchLayers = function() {
    $("#search-tools__button-address").removeClass("lam-background-darken");
    $("#search-tools__label").text("Layers");
    $("#search-tools__address").hide();
    $("#search-tools__layers").show();
    $("#lam-bar__item-address").removeClass("lam-bar__item-selected");
    $("#lam-bar__item-layers").addClass("lam-bar__item-selected");
    lamDispatch("clear-layer-info");
    lamDispatch("reset-search");
    updateScrollHeight();
  };

  // /**
  //  * Zoom the map to the lon-lat given and show the infobox of the given item index
  //  * @param {float} lon
  //  * @param {float} lat
  //  * @param {int} index Item's index in the result array
  //  * @param {boolean} showInfo
  //  */
  // var zoomToItemLayer = function(lon, lat, index, showInfo) {
  //   lamDispatch("clear-layer-info");
  //   if (searchResults[index]) {
  //     lamDispatch({
  //       eventName: "zoom-geometry",
  //       geometry: searchResults[index].item.geometry,
  //       srid: 4326
  //     });
  //     if (showInfo) {
  //       lamDispatch({
  //         eventName: "show-info-items",
  //         features: searchResults[index].item,
  //         element: searchResultsDiv
  //       });
  //     }
  //     let payload = {
  //       eventName: "add-geometry-info-map",
  //       geometry: searchResults[index].item.geometry
  //     };
  //     try {
  //       payload.srid = searchResults[index].item.crs;
  //       if (payload.srid == null) {
  //         payload.srid = 4326;
  //       }
  //     } catch (e) {
  //       payload.srid = 4326;
  //     }
  //     lamDispatch(payload);
  //     lamDispatch("hide-menu-mobile");
  //   } else {
  //     lamDispatch({
  //       eventName: "zoom-lon-lat",
  //       zoom: 18,
  //       lon: parseFloat(lon),
  //       lat: parseFloat(lat),
  //       eventName: "add-wkt-info-map",
  //       wkt: "POINT(" + lon + " " + lat + ")"
  //     });
  //     lamDispatch("hide-menu-mobile");
  //   }
  // };

  var searchAddressKeyup = function(ev) {
    clearTimeout(timer);
    timer = setTimeout(function() {
      if ($("#search-tools__search-address").val().length > 2) {
        LamDispatcher.dispatch("show-loader");
        doSearchAddress(ev);
      }
    }, timeout);
  };

  var searchLayersKeyup = function(ev) {
    clearTimeout(timer);
    timer = setTimeout(function() {
      if ($("#search-tools__search-layers").val().length > 2) {
        LamDispatcher.dispatch("show-loader");
        doSearchLayers(ev);
      }
    }, timeout);
  };

  /**
   * Start the search in the WFS Geoserver Provider
   * @param {Object} ev key click event result
   */
  var doSearchAddress = function(ev) {
    if (ev.keyCode == 13) {
      $("#search-tools__search-address").blur();
    }
    var via = $("#search-tools__search-address").val();
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
    via = via.replace("'", " ");
    $.ajax({
      dataType: "jsonp",
      url: url + "&format_options=callback:LamSearchTools.parseResponseAddress",
      //jsonpCallback: "LamStore.parseResponse",
      error: function(jqXHR, textStatus, errorThrown) {
        LamDispatcher.dispatch("hide-loader");
        lamDispatch({
          eventName: "log",
          message: "LamSearchTools: unable to complete response"
        });
      }
    });
  };

  let parseResponseAddress = function(data) {
    LamDispatcher.dispatch("hide-loader");
    lamDispatch("clear-layer-info");
    if (!data.features.length) {
      showSearchResults(LamTemplates.getResultEmpty());
      return;
    }
    console.log("parse");
    let isPoint = data.features[0].geometry.type.toLowerCase().indexOf("point") >= 0;
    let searchProviderAddressField = LamStore.getAppState().searchProviderAddressField;
    let searchProviderHouseNumberField = LamStore.getAppState().searchProviderHouseNumberField;
    data.features.forEach(function(feature) {
      feature.srid = LamMap.getSRIDfromCRSName(data.crs.properties.name);
      feature.tooltip = isPoint ? feature.properties[searchProviderHouseNumberField] : feature.properties[searchProviderAddressField];
    });
    //defining the right template based on geometry result type
    var template = isPoint
      ? LamTemplates.getTemplate(null, LamStore.getAppState().searchProviderHouseNumberTemplateUrl, LamStore.getAppState().templatesRepositoryUrl)
      : LamTemplates.getTemplate(null, LamStore.getAppState().searchProviderAddressTemplateUrl, LamStore.getAppState().templatesRepositoryUrl);
    lamDispatch({
      eventName: "show-search-items",
      features: data,
      template: template
    });
    lamDispatch({
      eventName: "show-info-geometries",
      features: data
    });

    return;

    // LamDispatcher.dispatch("hide-loader");
    // var results = [];
    // if (data.features.length > 0) {
    //   var toponimi = [];
    //   var results = [];
    //   for (var i = 0; i < data.features.length; i++) {
    //     var currentAddress = data.features[i].properties[searchAddressProviderField];
    //     if (data.features[i].properties[searchHouseNumberProviderField]) {
    //       currentAddress = " " + data.features[i].properties[searchHouseNumberProviderField];
    //     }
    //     if ($.inArray(currentAddress, toponimi) === -1) {
    //       var cent = null;
    //       if (data.features[i].geometry.type != "POINT") {
    //         cent = LamMap.getCentroid(data.features[i].geometry.coordinates);
    //       } else {
    //         cent = data.features[i].geometry.coordinates;
    //       }
    //       var tempItem = {
    //         display_name: data.features[i].properties[searchAddressProviderField],
    //         lon: cent[0],
    //         lat: cent[1],
    //         item: data.features[i]
    //       };
    //       if (searchHouseNumberProviderField) {
    //         tempItem.display_name2 = data.features[i].properties[searchHouseNumberProviderField];
    //       }
    //       results.push(tempItem);
    //       toponimi.push(data.features[i].properties[searchAddressProviderField]);
    //     }
    //   }
    //   searchResults = results.sort(SortByDisplayName);
    //   //renderizzo i risultati
    //   var templateTemp = templateSearchResultsWFSGeoserver();
    //   var output = templateTemp(results);
    //   jQuery("#search-tools__search-results").html(output);
    // } else {
    //   var templateTemp = templateResultEmpty();
    //   var output = templateTemp();
    //   jQuery("#search-tools__search-results").html(output);
    // }
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
    var currentLayer = $("#search-tools__select-layers option:selected").val();
    if (itemStr.length > 2) {
      showSearchResults("");
      let layer = searchLayers.filter(function(element) {
        return element.gid == currentLayer;
      })[0];
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
        url: url + "&format_options=callback:LamSearchTools.parseResponseLayers",
        cache: false,
        error: function(jqXHR, textStatus, errorThrown) {
          LamDispatcher.dispatch("hide-loader");
          lamDispatch({
            eventName: "log",
            message: "LamSearchTools: unable to complete response"
          });
        }
      });
    }
  };

  let parseResponseLayers = function(data) {
    LamDispatcher.dispatch("hide-loader");
    var currentLayer = $("#search-tools__select-layers option:selected").val();
    let layer = searchLayers.filter(function(element) {
      return element.gid == currentLayer;
    })[0];
    console.log("parse");
    data.features.forEach(function(feature) {
      feature.layerGid = layer.gid;
      feature.srid = LamMap.getSRIDfromCRSName(data.crs.properties.name);
      feature.tooltip = LamTemplates.getLabelFeature(feature.properties, layer.labelField, layer.layerName);
    });
    if (data.features.length > 0) {
      lamDispatch({
        eventName: "show-search-items",
        features: data
      });
      lamDispatch({
        eventName: "show-info-geometries",
        features: data
      });
    } else {
      var templateTemp = LamTemplates.getResultEmpty();
      var output = templateTemp();
      showSearchResults(output);
    }
    return;
  };

  /**
   * Show the search results in menu
   * @param {Object} featureInfoCollection GeoJson feature collection
   */
  let showSearchInfoFeatures = function(featureInfoCollection, template) {
    if (!featureInfoCollection) {
      showSearchResults(AppTemplates.getResultEmpty);
      return;
    }
    showSearchResults(LamTemplates.renderInfoFeatures(featureInfoCollection, template), LamTemplates.renderInfoFeaturesMobile(featureInfoCollection));
  };

  var selectLayer = function(layer) {
    $("#search-tools__select-layers").val(layer);
  };

  return {
    render: render,
    init: init,
    doSearchAddress: doSearchAddress,
    doSearchLayers: doSearchLayers,
    parseResponseAddress: parseResponseAddress,
    parseResponseLayers: parseResponseLayers,
    resetSearch: resetSearch,
    searchAddressKeyup: searchAddressKeyup,
    searchLayersKeyup: searchLayersKeyup,
    selectLayer: selectLayer,
    showSearchInfoFeatures: showSearchInfoFeatures,
    showSearchAddress: showSearchAddress,
    showSearchLayers: showSearchLayers
    //zoomToItemWFSGeoserver: zoomToItemWFSGeoserver,
    //zoomToItemLayer: zoomToItemLayer
  };
})();
