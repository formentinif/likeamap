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
    try {
      M.AutoInit();
      $('.dropdown-trigger').dropdown();
    } catch (e) {

    } finally {

    }
  }

  var render = function(div, provider, providerAddressUrl, providerAddressField, providerHouseNumberUrl, providerHouseNumberField, layers) {

    searchLayers = layers;
    switch (provider) {
      case "wms_geoserver":
        searchAddressProviderUrl = providerAddressUrl;
        searchAddressProviderField = providerAddressField;
        searchHouseNumberProviderUrl = providerHouseNumberUrl;
        searchHouseNumberProviderField = providerHouseNumberField;

        var templateTemp = templateSearchWMSG();
        var output = templateTemp();
        jQuery("#" + div).html(output);
        break;
      case "nominatim":
      default:
        var templateTemp = templateSearchNM();
        var output = templateTemp();
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
  }

  /**
   * Aggiorna la dimensione dello scroll dei contenuti
   * @return {null} La funzione non restituisce un valore
   */
  var updateScroll = function(offset) {
    var positionMenu = $("#menu-toolbar").offset();
    var positionSearch = $("#search-tools__search-results").offset();
    $("#search-tools__search-results").height(positionMenu.top - positionSearch.top - offset);
  }

  var updateComuniNM = function(comuni) {

    $.each(comuni, function(i, comune) {
      var nomeComune = comune.nomeComune;
      if (nomeComune) {
        nomeComune = nomeComune.replace(/_/g, ' ');
        if (nomeComune.indexOf("Reggio") >= 0) {
          nomeComune = nomeComune.replace("nell Emilia", "nell'Emilia");
        }
      }
      $('#search-tools__comune').append($('<option>', {
        value: comune.istat,
        text: nomeComune
      }));
    });
  }


  var templateMenuString = function() {
    template = '<div class="al-bar">';
    template += '<button id="search-tools__menu" class="dropdown-trigger btn" value="Indirizzo" data-target="search-tools__menu-items">';
    template += '<i class="material-icons">more_vert</i>';
    template += '</button> <span id="search-tools__label">Indirizzo</span>';
    template += '</div>';
    template += '<ul id="search-tools__menu-items" class="dropdown-content" >';
    template += '<li onclick="SearchTools.showSearchAddress(); return false;"><span >Indirizzo</span></li>';
    template += '<li onclick="SearchTools.showSearchLayers(); return false;"><span >Layer</span></li>';
    template += '</ul>';
    return template;
  }

  var templateMenuLayers = function() {
    searchLayers = searchLayers.sort(SortByLayerName);
    var template = '<div id="search-tools__layers" class="al-card z-depth-2" style="display:none;">';
    template += '<select id="search-tools__select-layers" class="input-field">';
    for (var i = 0; i < searchLayers.length; i++) {
      template += '<option value="' + searchLayers[i].layer + '">' + searchLayers[i].layerName + '</option>';
    }
    template += '</select>';
    template += '<div class="div-5"></div>';
    template += '<div id="search-tools__search-layers-field" class="input-field" >';
    template += '<input id="search-tools__search-layers" class="input-field" type="search" onkeyup="SearchTools.searchLayers(event)">';
    template += '<label class="input-field" for="search-tools__search-layers">Layers...</label>';
    template += '</div>';
    template += '</div>';
    return template;
  }

  var templateSearchNM = function() {
    template = '';
    //pannello ricerca via
    template += '<h4 class="al-title">Ricerca</h4>';
    template += templateMenuString();
    template += '<div id="search-tools__address" class="al-card z-depth-2">';
    template += '<select id="search-tools__comune" class="input-field">';
    template += '</select>';
    template += '<div class="div-5"></div>';
    template += '<div id="search-tools__search-via-field" class="input-field" >';
    template += '<input id="search-tools__search-via" class="input-field" type="search" onkeyup="SearchTools.searchAddressNM(event)">';
    template += '<label class="input-field" for="search-tools__search-via">Via...</label>';
    template += '</div>';
    template += '</div>';
    template += templateMenuLayers();
    template += '<div class="div-10"></div>';
    template += '<div id="search-tools__search-results" class="al-card z-depth-2 al-scrollable">';
    template += '</div>';
    return Handlebars.compile(template);
  }


  var templateSearchWMSG = function() {
    template = '';
    //pannello ricerca via
    template += '<h4 class="al-title">Ricerca</h4>';
    template += templateMenuString();
    template += '<div id="search-tools__address" class="al-card z-depth-2">';
    template += '<div id="search-tools__search-via-field" class="input-field" >';
    template += '<input id="search-tools__search-via" class="input-field" type="search" onkeyup="SearchTools.searchAddressWMSG(event)">';
    template += '<label class="input-field" for="search-tools__search-via">Via...</label>';
    template += '</div>';
    template += '</div>';
    template += templateMenuLayers();
    template += '<div class="div-10"></div>';
    template += '<div id="search-tools__search-results" class="al-card z-depth-2 al-scrollable">';
    template += '</div>';
    return Handlebars.compile(template);
  }

  var templateSearchResultsNM = function(results) {
    template = '<h5>Risultati della ricerca</h5><ul class="mdl-list">';
    template += '{{#each this}}';
    template += '<li class="mdl-list__item">';
    template += '<i class="material-icons md-icon">&#xE55F;</i><a href="#" onclick="SearchTools.zoomToItemNM({{{@index}}});return false">';
    template += '{{{display_name}}}';
    template += "</a>";
    template += "</li>";
    template += '{{/each}}';
    template += "</ul>";
    return Handlebars.compile(template);
  }

  var templateSearchResultsWMSG = function(results) {
    template = '<h5>Risultati della ricerca</h5><ul class="mdl-list">';
    template += '{{#each this}}';
    template += '<li class="mdl-list__item">';
    template += '<i class="material-icons md-icon">&#xE55F;</i><a href="#" onclick="SearchTools.zoomToItemLayer({{{lon}}}, {{{lat}}}, {{@index}});return false">';
    template += '{{{display_name}}} ';
    template += '{{{display_name2}}} ';
    template += "</a>";
    template += "</li>";
    template += '{{/each}}';
    template += "</ul>";
    return Handlebars.compile(template);
  }

  var templateSearchResultsLayers = function(results) {
    template = '<ul class="mdl-list">';
    template += '{{#each this}}';
    template += '<li class="mdl-list__item">';
    template += '<i class="material-icons md-icon">&#xE55F;</i><a href="#" onclick="SearchTools.zoomToItemLayer({{{lon}}}, {{{lat}}}, {{@index}});return false">';
    template += '{{{display_name}}}';
    template += "</a>";
    template += "</li>";
    template += '{{/each}}';
    template += "</ul>";
    return Handlebars.compile(template);
  }

  var templateResultEmpty = function(results) {
    var template = '<p>Nessun risultato disponibile</p>';
    return Handlebars.compile(template);
  }

  var showSearchAddress = function() {
    $("#search-tools__label").text("Indirizzo");
    $("#search-tools__address").show();
    $("#search-tools__layers").hide();
  }

  var showSearchLayers = function() {
    $("#search-tools__label").text("Layers");
    $("#search-tools__address").hide();
    $("#search-tools__layers").show();
  }


  var zoomToItemNM = function(index) {
    var payload = {};
    payload.eventName = "zoom-lon-lat";
    var result = searchResults[index];
    payload.zoom = 18;
    payload.lon = parseFloat(result.lon);
    payload.lat = parseFloat(result.lat);
    dispatch(payload);
    var wkt = "POINT(" + payload.lon + " " + payload.lat + ")";
    payload = {};
    payload.eventName = "add-info-map";
    payload.wkt = wkt;
    dispatch(payload);
    payload = {};
    payload.eventName = "hide-menu-mobile";
    dispatch(payload);
  }

  var zoomToItemWMSG = function(lon, lat) {
    var payload = {};
    payload.eventName = "remove-info";
    payload.wkt = wkt;
    dispatch(payload);
    payload = {};
    payload.eventName = "zoom-lon-lat";
    payload.zoom = 18;
    payload.lon = parseFloat(lon);
    payload.lat = parseFloat(lat);
    dispatch(payload);
    var wkt = "POINT(" + payload.lon + " " + payload.lat + ")";
    payload = {};
    payload.eventName = "add-info-map";
    payload.wkt = wkt;
    dispatch(payload);
    payload = {};
    payload.eventName = "hide-menu-mobile";
    dispatch(payload);

  }

  var zoomToItemLayer = function(lon, lat, index) {
    var payload = {};
    payload.eventName = "remove-info";
    payload.wkt = wkt;
    dispatch(payload);
    if (searchResults[index]) {
      payload = {};
      payload.eventName = "zoom-geometry";
      payload.geometry = searchResults[index].item.geometry;
      dispatch(payload);
      Dispatcher.dispatch({
        eventName: 'show-info-item',
        data: searchResults[index].item
      });
      payload = {};
      payload.eventName = "add-feature-info-map";
      payload.geometry = searchResults[index].item.geometry;
      try {
        payload.srid = searchResults[index].item.crs;
      } catch (e) {
        payload.srid = null;
      }
      dispatch(payload);
      payload = {};
      payload.eventName = "hide-menu-mobile";
      dispatch(payload);

    } else {
      payload = {};
      payload.eventName = "zoom-lon-lat";
      payload.zoom = 18;
      payload.lon = parseFloat(lon);
      payload.lat = parseFloat(lat);
      var wkt = "POINT(" + payload.lon + " " + payload.lat + ")";
      payload = {};
      payload.eventName = "add-info-map";
      payload.wkt = wkt;
      dispatch(payload);
      payload = {};
      payload.eventName = "hide-menu-mobile";
      dispatch(payload);

    }

  }

  var getRegioneFromComuneNM = function(idcomune) {
    return "Emilia-Romagna";
  }

  var searchAddressNM = function(ev) {
    if (ev.keyCode == 13) {
      $("#search-tools__search-via").blur()
    }
    var comune = $("#search-tools__comune option:selected").text();
    var idcomune = $("#search-tools__comune option:selected").val();
    var regione = getRegioneFromComuneNM(idcomune);
    var via = $("#search-tools__search-via").val();

    if (via.length > 3 && comune) {
      via = via.replace("'", " ");
      var url = "http://nominatim.openstreetmap.org/search/IT/" + regione + "/" + comune + "/" + via + "?format=jsonv2&addressdetails=1" + "&";
      console.log(url);
      currentSearchDate = new Date().getTime();
      var searchDate = new Date().getTime();
      $.ajax({
        dataType: "json",
        url: url,
      }).done(function(data) {
        //verifica che la ricerca sia ancora valida
        if (currentSearchDate > searchDate) {
          return;
        }
        var results = [];
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].osm_type == 'way') {
              results.push(data[i]);
            }
          }
          searchResults = results;
          //renderizzo i risultati

          var templateTemp = templateSearchResultsNM();
          var output = templateTemp(results);
          jQuery("#search-tools__search-results").html(output);
        } else {
          var templateTemp = templateResultEmpty();
          var output = templateTemp();
          jQuery("#search-tools__search-results").html(output);
        }

      }).fail(function(data) {
        dispatch({
          eventName: "log",
          message: "SearchTools: unable to bind comuni"
        })
      });
    }
  }


  var searchAddressWMSG = function(ev) {

    if (ev.keyCode == 13) {
      $("#search-tools__search-via").blur()
    }
    var via = $("#search-tools__search-via").val();
    var cql = '';
    var arrTerms = via.split(' ');
    var street = '';
    var civico = '';

    if (via.indexOf(",") > -1) {
      var viaArr = via.split(",");
      street = viaArr[0];
      civico = viaArr[1];
    } else {
      for (var i = 0; i < arrTerms.length; i++) {
        //verifica dei civici e dei barrati
        if (isNaN(arrTerms[i])) {
          if (arrTerms[i].indexOf('/') > -1) {
            civico += arrTerms[i];
          } else if (arrTerms[i].length === 1) {
            civico += arrTerms[i];
          } else {
            street += arrTerms[i] + ' ';
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
      url += "&cql_filter=" + searchAddressProviderField + "%20ilike%20%27%25" + street.trim() + "%25%27%20AND%20" + searchHouseNumberProviderField + "%20ILIKE%20%27" + civico + "%25%27"

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
                if (data.features[i].geometry.type != 'POINT') {
                  cent = centroid(data.features[i].geometry.coordinates);
                } else {
                  cent = data.features[i].geometry.coordinates;
                }

                var tempItem = {
                  display_name: data.features[i].properties[searchAddressProviderField],
                  lon: cent[0],
                  lat: cent[1],
                  item: data.features[i]
                }
                if (searchHouseNumberProviderField) {
                  tempItem.display_name2 = data.features[i].properties[searchHouseNumberProviderField];
                }
                results.push(tempItem);
                toponimi.push(data.features[i].properties[searchAddressProviderField])
              }
            }
            searchResults = results.sort(SortByDisplayName);
            //renderizzo i risultati
            var templateTemp = templateSearchResultsWMSG();
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
  }



  var searchLayers = function(ev) {
    if (ev.keyCode == 13) {
      $("#search-tools__search-layers").blur()
    }
    var itemStr = $("#search-tools__search-layers").val();
    var cql = '';
    //ricavo l'elenco dei layer da interrogare
    currentSearchDate = new Date().getTime();
    var searchDate = new Date().getTime();
    var currentLayer = $("#search-tools__select-layers option:selected").val();

    if (itemStr.length > 2) {
      jQuery("#search-tools__search-results").html("");
      for (li = 0; li < searchLayers.length; li++) {
        if (searchLayers[li].layer == currentLayer) {
          var layer = searchLayers[li];
          var url = layer.mapUri; //https://geoserver.comune.re.it/geoserver/geo_re/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo_re:SIT_ARCHISTRADE&maxFeatures=50&outputFormat=text%2Fjavascript
          url = url.replace("/wms", "/") + "ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layer.layer + "&maxFeatures=50&outputFormat=text%2Fjavascript&cql_filter=[" + layer.searchField + "]ilike%27%25" + itemStr.trim() + "%25%27";
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
                      cent = centroid(data.features[i].geometry.coordinates[0]);
                    } else {
                      cent = centroid(data.features[i].geometry.coordinates);
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
                    resultsIndex.push(data.features[i].properties[layer.searchField])
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
  }

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
            cent = centroid(data[i].geometry.coordinates[0]);
          } else {
            cent = centroid(data[i].geometry.coordinates);
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
          resultsIndex.push(data[i].properties[layer.labelField])
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


  }

  var selectLayer = function(layer){
      $("#search-tools__select-layers").val(layer);
  }

  function SortByDisplayName(a, b) {
    var aName = a.display_name.toLowerCase();
    var bName = b.display_name.toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
  }

  function SortByLayerName(a, b) {
    var aName = a.layerName.toLowerCase();
    var bName = b.layerName.toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
  }

  function centroid(lonlats) {
    var latXTotal = 0;
    var latYTotal = 0;
    var lonDegreesTotal = 0;

    var currentLatLong;
    for (var i = 0; currentLatLong = lonlats[i]; i++) {
      var latDegrees = currentLatLong[1];
      var lonDegrees = currentLatLong[0];

      var latRadians = Math.PI * latDegrees / 180;
      latXTotal += Math.cos(latRadians);
      latYTotal += Math.sin(latRadians);

      lonDegreesTotal += lonDegrees;
    }
    var finalLatRadians = Math.atan2(latYTotal, latXTotal);
    var finalLatDegrees = finalLatRadians * 180 / Math.PI;
    var finalLonDegrees = lonDegreesTotal / lonlats.length;
    return [finalLonDegrees, finalLatDegrees];
  }

  return {
    displayGenericResults: displayGenericResults,
    render: render,
    templateSearchNM: templateSearchNM,
    init: init,
    searchAddressNM: searchAddressNM,
    updateComuniNM: updateComuniNM,
    zoomToItemNM: zoomToItemNM,
    searchAddressWMSG: searchAddressWMSG,
    searchLayers: searchLayers,
    selectLayer: selectLayer,
    showSearchAddress: showSearchAddress,
    showSearchLayers: showSearchLayers,
    zoomToItemWMSG: zoomToItemWMSG,
    zoomToItemLayer: zoomToItemLayer
  };

}());
