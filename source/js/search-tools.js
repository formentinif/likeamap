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

var LamSearchTools = (function () {
  var isRendered = false;

  var searchResults = [];
  var searchAddressProviderUrl = "";
  var searchAddressProviderField = "";
  var searchHouseNumberProviderUrl = "";
  var searchHouseNumberProviderField = "";
  var searchLayers = [];
  var timeout = 500;
  var timer;
  var searchResultsDiv = "search-tools__search-results";
  var invalidAdrressTerms = [
    "aut",
    "rione",
    "corso",
    "piazzale",
    "piazzetta",
    "passeggiata",
    "strada",
    "largo",
    "galleria",
    "stradello",
    "rtd",
    "via",
    "stradone",
    "parco",
    "piazza",
    "vicolo",
    "viale",
  ];

  var init = function init() {
    Handlebars.registerHelper("hasLayers", function (options) {
      //return searchLayers.length > 0;
      return true;
    });

    //events binding
    /**
     * Shows the search tool, resetting info-results
     */
    LamDispatcher.bind("show-search", function (payload) {
      LamToolbar.toggleToolbarItem("search-tools");
      lamDispatch("clear-layer-info");
      lamDispatch("reset-search");
      setTimeout(function () {
        updateScrollHeight();
      }, 500);
    });

    /**
     * Resets the search info-results
     */
    LamDispatcher.bind("reset-search", function (payload) {
      LamSearchTools.resetSearch();
    });

    LamDispatcher.bind("show-search-items", function (payload) {
      LamSearchTools.showSearchInfoFeatures(payload.features, payload.template);
    });

    LamDispatcher.bind("search-address", function (payload) {
      LamStore.searchAddress(payload.data, "LamStore.processAddress");
    });

    LamDispatcher.bind("show-search-results", function (payload) {
      LamSearchTools.showSearchResults(payload.results);
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

  var render = function (div, provider, providerAddressUrl, providerAddressField, providerHouseNumberUrl, providerHouseNumberField, layers) {
    if (!LamStore.getAppState().modules["search-tools"]) return;
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
        $("#search-tools__select-layers").on("change", function () {
          LamDispatcher.dispatch("clear-layer-info");
          var layerSelected = $("#search-tools__select-layers option:selected").val();
          var layer = searchLayers.filter(function (element) {
            return element.gid == layerSelected;
          });
          if (layer.length) layer = layer[0];
          $("#search-tools__search-layers__label").text(layer.searchFieldLabel || layer.searchField);
          //controllo del form custom
          if (layer.searchCustomEvent) {
            //esecuzione della funzione custom
            LamDispatcher.dispatch(layer.searchCustomEvent);
          } else {
            $("#search-tools__search-layers-custom").hide();
            $("#search-tools__search-layers-standard").show();
          }
          resetSearch();
        });
        $("#search-tools__select-layers").trigger("change");
        break;
    }

    updateScrollHeight();
    $(window).resize(function () {
      updateScrollHeight();
    });

    if (!isRendered) {
      init();
    }

    isRendered = true;
  };

  let resetSearch = function () {
    $("#search-tools__search-layers").val("");
    $("#search-tools__search-address").val("");
    showSearchResults("<p>Inserisci un testo per iniziare la ricerca.</p>");
  };

  /**
   * Helper function to show html results
   * @param {string} html
   */
  let showSearchResults = function (html, htmlMobile) {
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
  var updateScrollHeight = function () {
    var positionMenu = $("#menu-toolbar").offset();
    var positionSearch = $("#" + searchResultsDiv).offset();
    $("#" + searchResultsDiv).height(positionMenu.top - positionSearch.top - 20);
  };

  /**
   * General html code that will be injected in the panel as the main tools
   */
  var templateTopTools = function (layersNum) {
    let template = '<div class="lam-bar">';
    template +=
      '<div id="lam-bar__item-address" class="lam-bar__item lam-is-half lam-bar__item-selected" onclick="LamSearchTools.showSearchAddress(); return false;">';
    template += '<a id="search-tools__button-address" class="" autofocus>Indirizzi</a>';
    template += "</div>";
    if (layersNum) {
      template += '<div id="lam-bar__item-layers" class="lam-bar__item lam-is-half" onclick="LamSearchTools.showSearchLayers(); return false;">';
      template += '<a id="search-tools__button-layers" class="" >Oggetti</a>';
      template += "</div>";
    }
    template += "</div>";
    return template;
  };

  /**
   * General html code that will be injected in order to display the layer tools
   */
  var templateLayersTools = function (searchLayers) {
    let template = '<div id="search-tools__layers" class="lam-card lam-depth-2 lam-hidden" >';
    template += '<select id="search-tools__select-layers" class="lam-select lam-mb-2">';
    //template += '<option class="lam-option" value=""></option>';
    for (var i = 0; i < searchLayers.length; i++) {
      template += '<option class="lam-option" value="' + searchLayers[i].gid + '">' + searchLayers[i].layerName + "</option>";
    }
    template += "</select>";
    template += '<div id="search-tools__search-layers-field" class="" >';
    template += '<label class="lam-label" id="search-tools__search-layers__label" for="search-tools__search-layers">';
    if (searchLayers.length > 0) {
      template += searchLayers[0].searchFieldLabel || searchLayers[0].searchField;
    } else {
      template += "Seleziona un tema...";
    }
    template += "</label>";
    //autocomplete standard for the layer
    template +=
      '<div id="search-tools__search-layers-standard"><input id="search-tools__search-layers" class="lam-input" type="search" onkeyup="LamSearchTools.searchLayersKeyup(event)" placeholder="Ricerca..."></div>';
    //custom form placeholder for thhe layer
    template += '<div id="search-tools__search-layers-custom"></div>';
    template += "</div>";
    template += "</div>";
    return template;
  };

  /**
   * Initialize the panel if Geoserver is selected as default address provider
   */
  var templateSearchWFSGeoserver = function () {
    let template = "";
    //pannello ricerca via
    template += '<h4 class="lam-title">Ricerca</h4>';
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

  /**
   * Switch the address/layers top tools
   */
  var showSearchAddress = function () {
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
  var showSearchLayers = function () {
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

  var searchAddressKeyup = function (ev) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      if ($("#search-tools__search-address").val().length > 2 && searchTermValid($("#search-tools__search-address").val())) {
        LamDispatcher.dispatch("show-loader");
        doSearchAddress(ev);
      }
    }, timeout);
  };

  var searchLayersKeyup = function (ev) {
    clearTimeout(timer);
    timer = setTimeout(function () {
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
  let doSearchAddress = function (ev) {
    if (ev.keyCode == 13) {
      $("#search-tools__search-address").blur();
    }
    let via = $("#search-tools__search-address").val();
    via = via.trim().replace("'", " ");
    let street = "";
    let civico = "";
    if (via.indexOf(",") > -1) {
      let viaArr = via.split(",");
      street = viaArr[0];
      civico = viaArr[1];
    } else {
      let arrTerms = via.split(" ");
      for (let i = 0; i < arrTerms.length; i++) {
        //verifica dei civici e dei barrati
        if (isNaN(arrTerms[i])) {
          if (arrTerms[i].indexOf("/") > -1) {
            civico += arrTerms[i];
          } else {
            street += arrTerms[i] + " ";
          }
        } else {
          civico += arrTerms[i] + " ";
        }
      }
    }

    let arrStreet = street.trim().split(" ");
    //rimozione degli elementi invalidi
    arrStreet = arrStreet.filter(function (item) {
      return invalidAdrressTerms.indexOf(item.toLowerCase()) === -1;
    });

    let url = searchAddressProviderUrl;
    let streetCqlFilter = "";
    for (let i = 0; i < arrStreet.length; i++) {
      if (!streetCqlFilter) {
        streetCqlFilter = "[" + searchAddressProviderField + "]ilike%27%25" + arrStreet[i].trim() + "%25%27";
      } else {
        streetCqlFilter += "%20AND%20[" + searchAddressProviderField + "]ilike%27%25" + arrStreet[i].trim() + "%25%27";
      }
    }
    let civicoCqlFilter = "%20AND%20" + searchHouseNumberProviderField + "%20ILIKE%20%27" + civico.trim() + "%25%27";

    if (!civico) {
      //solo ricerca via
      url += "&cql_filter=" + streetCqlFilter;
    } else {
      //ricerca via e civico
      url = searchHouseNumberProviderUrl + "&cql_filter=" + streetCqlFilter + civicoCqlFilter;
    }
    if (url.toLowerCase().indexOf("srsname") < 0 && LamStore.getAppState().srid) {
      url += "&srsName=EPSG:" + LamStore.getAppState().srid;
    }
    $.ajax({
      dataType: "jsonp",
      url: url + "&format_options=callback:LamSearchTools.parseResponseAddress",
      //jsonpCallback: "LamStore.parseResponse",
      error: function (jqXHR, textStatus, errorThrown) {
        LamDispatcher.dispatch("hide-loader");
        lamDispatch({
          eventName: "log",
          message: "LamSearchTools: unable to complete response",
        });
      },
    });
  };

  let parseResponseAddress = function (data) {

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
    var index = 0;
    data.features.forEach(function (feature) {
      feature.srid = LamMap.getSRIDfromCRSName(data.crs.properties.name);
      feature.tooltip = isPoint ? feature.properties[searchProviderHouseNumberField] : feature.properties[searchProviderAddressField];
      feature.index = index++;
    });
    //defining the right template based on geometry result type
    var template = isPoint
      ? LamTemplates.getTemplate(null, LamStore.getAppState().searchProviderHouseNumberTemplateUrl, LamStore.getAppState().templatesRepositoryUrl)
      : LamTemplates.getTemplate(null, LamStore.getAppState().searchProviderAddressTemplateUrl, LamStore.getAppState().templatesRepositoryUrl);
    let layerGid = isPoint ? LamStore.getAppState().searchProviderHouseNumberLayerGid : LamStore.getAppState().searchProviderAddressLayerGid;
    data.features.forEach(function (feature) {
      feature.layerGid = layerGid;
      feature.featureTemplate = template;
      if (feature.geometry.coordinates) feature.properties.lamCoordinates = feature.geometry.coordinates;
    });
    LamStore.getAppState().currentInfoItems = data;
    lamDispatch({
      eventName: "show-search-items",
      features: data,
      //template: template,
    });
    lamDispatch({
      eventName: "show-info-geometries",
      features: data,
    });
    return;
  };

  /**
   * Start the search in the WFS Geoserver Provider
   * @param {Object} ev key click event result
   */
  var doSearchLayers = function (ev) {
    if (ev.keyCode == 13) {
      $("#search-tools__search-layers").blur();
    }
    var itemStr = $("#search-tools__search-layers").val();
    //ricavo l'elenco dei layer da interrogare
    var currentLayer = $("#search-tools__select-layers option:selected").val();
    if (itemStr.length > 2) {
      showSearchResults("");
      let layer = searchLayers.filter(function (element) {
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
      let srid = layer.srid || LamStore.getAppState().srid;
      if (url.toLowerCase().indexOf("srsname") < 0 && srid) {
        url += "&srsName=EPSG:" + srid;
      }
      itemStr = itemStr.replace("'", " ");

      $.ajax({
        dataType: "jsonp",
        url: url + "&format_options=callback:LamSearchTools.parseResponseLayers",
        cache: false,
        error: function (jqXHR, textStatus, errorThrown) {
          LamDispatcher.dispatch("hide-loader");
          lamDispatch({
            eventName: "log",
            message: "LamSearchTools: unable to complete response",
          });
        },
      });
    }
  };

  let parseResponseLayers = function (data) {
    LamDispatcher.dispatch("hide-loader");
    var currentLayer = $("#search-tools__select-layers option:selected").val();
    let layer = searchLayers.filter(function (element) {
      return element.gid == currentLayer;
    })[0];
    console.log("parse");
    var index = 0;
    let template = LamTemplates.getTemplate(layer.gid, layer.templateUrl, LamStore.getAppState().templatesRepositoryUrl);
    data.features.forEach(function (feature) {
      feature.layerGid = layer.gid;
      feature.srid = LamMap.getSRIDfromCRSName(data.crs.properties.name);
      feature.tooltip = LamTemplates.getLabelFeature(feature.properties, layer.labelField, layer.layerName);
      feature.index = index++;
      feature.featureTemplate = template;
    });
    LamStore.getAppState().currentInfoItems = data;
    if (data.features.length > 0) {
      lamDispatch({
        eventName: "show-search-items",
        features: data,
      });
      lamDispatch({
        eventName: "show-info-geometries",
        features: data,
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
  let showSearchInfoFeatures = function (featureInfoCollection, template) {
    if (!featureInfoCollection) {
      showSearchResults(AppTemplates.getResultEmpty);
      return;
    }
    showSearchResults(LamTemplates.renderInfoFeatures(featureInfoCollection, template), LamTemplates.renderInfoFeaturesMobile(featureInfoCollection));
  };

  var selectLayer = function (layer) {
    $("#search-tools__select-layers").val(layer);
  };

  // var searchTermValid = function (search) {
  //   var invalidTerms = ["via", "viale", "vicolo", "piazza"];
  //   var addressTerms = search.split(" ");
  //   addressTerms = addressTerms.filter(function (element) {
  //     return addressTerms.includes(element.toLowerCase());
  //   });
  //   return addressTerms;
  // };

  var searchTermValid = function (search) {
    var invalidTerms = ["via", "viale", "vicolo", "piazza"];
    return !invalidTerms.includes(search.trim().toLowerCase());
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
    showSearchLayers: showSearchLayers,
    showSearchResults: showSearchResults,
    //zoomToItemWFSGeoserver: zoomToItemWFSGeoserver,
    //zoomToItemLayer: zoomToItemLayer
  };
})();
