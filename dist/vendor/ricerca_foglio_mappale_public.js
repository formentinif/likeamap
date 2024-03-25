let RicercaFoglioMappale = {};

RicercaFoglioMappale.Fogli = [];
RicercaFoglioMappale.Mappali = [];
RicercaFoglioMappale.LayerGid = "CATASTO_PARTICELLE";

RicercaFoglioMappale.getTemplate = function () {
  let template = "";
  template += '<div id="lam-content" class="ricerca-foglio-mappale">';
  template += '<div id="foglio" class="lam-row">';
  template += '<div class="lam-col">Foglio:</div><div class="lam-col"><select id="select-foglio" class="lam-select-small"></select></div>';
  template += "</div>";
  template += '<div id="mappale" class="lam-row">';
  template += '<div class="lam-col">Mappale:</div><div class="lam-col"><select id="select-mappale" class="lam-select-small"></select></div>';
  template += "</div>";
  template += '<div id="mappale" class="lam-row">';
  template +=
    '<div class="lam-col"></div><div class="lam-col"><button id="map-tools__measures-start-area" class="lam-btn lam-btn-small lam-ml-0" onclick="RicercaFoglioMappale.clearMappale()">Annulla</button></div>';
  template += "</div>";
  template += "</div>";
  return template;
};

RicercaFoglioMappale.clearMappale = function () {
  $("#select-mappale").val("");
  $("#select-foglio").val("");
  lamDispatch("reset-search");
  lamDispatch("hide-info-window");
  lamDispatch("clear-layer-info");
};
RicercaFoglioMappale.startLoadFogli = function () {
  lamDispatch("show-loader");
  $("#search-tools__search-layers-custom").html(RicercaFoglioMappale.getTemplate());
  $("#search-tools__search-layers-custom").show();
  $("#search-tools__search-layers-standard").hide();

  $("#select-foglio").change(function () {
    RicercaFoglioMappale.startLoadMappali($(this).val());
  });

  $("#select-mappale").change(function () {
    RicercaFoglioMappale.visualizzaMappale($(this).val());
  });

  const urlFogli =
    "https://geoserver.comune.re.it/geoserver/PUG_2023/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=PUG_2023%3ACATASTO_FOGLI&outputFormat=text%2Fjavascript&srsName=EPSG:3857";
  $.ajax({
    dataType: "jsonp",
    url: urlFogli + "&format_options=callback:RicercaFoglioMappale.loadFogli",
    error: function (jqXHR, textStatus, errorThrown) {
      lamDispatch("hide-loader");
    },
  });
};

RicercaFoglioMappale.loadFogli = function (response) {
  lamDispatch("hide-loader");
  RicercaFoglioMappale.Fogli = response;
  var features = response.features;
  var numFogli = features.map(function (element) {
    return element.properties["FOGLIO"];
  });
  numFogli.sort(function (a, b) {
    return a.toString().localeCompare(b.toString(), undefined, { numeric: true, sensitivity: "base" });
  });
  $("#select-foglio").find("option").remove();
  $("#select-foglio").append($("<option></option>").attr("value", "").text("Seleziona..."));

  numFogli.forEach(function (element) {
    $("#select-foglio").append($("<option></option>").attr("value", element).text(element));
  });
};

RicercaFoglioMappale.startLoadMappali = function (foglio) {
  lamDispatch("clear-layer-info");
  lamDispatch("reset-search");
  lamDispatch("show-loader");
  const urlFogli =
    "https://geoserver.comune.re.it/geoserver/PUG_2023/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=PUG_2023%3ACATASTO_PARTICELLE&outputFormat=text%2Fjavascript&srsName=EPSG:3857";
  $.ajax({
    dataType: "jsonp",
    url: urlFogli + "&format_options=callback:RicercaFoglioMappale.loadMappali" + "&cql_filter=[FOGLIO]=%27" + foglio + "%27",
    error: function (jqXHR, textStatus, errorThrown) {
      lamDispatch("hide-loader");
    },
  });
};

RicercaFoglioMappale.loadMappali = function (response) {
  lamDispatch("show-loader");
  RicercaFoglioMappale.Mappali = response;
  var features = response.features;
  var numFogli = features.map(function (element) {
    return element.properties["MAPPALE"];
  });
  numFogli.sort(function (a, b) {
    return a.toString().localeCompare(b.toString(), undefined, { numeric: true, sensitivity: "base" });
  });
  $("#select-mappale").find("option").remove();
  $("#select-mappale").append($("<option></option>").attr("value", "").text("Seleziona..."));
  numFogli.forEach(function (element) {
    $("#select-mappale").append($("<option></option>").attr("value", element).text(element));
  });
};

RicercaFoglioMappale.visualizzaMappale = function (mappale) {
  let features = RicercaFoglioMappale.Mappali.features.filter(function (element) {
    return element.properties["MAPPALE"] == mappale;
  });
  let feature = null;
  if (features.length) {
    feature = features[0];
    feature.layerGid = RicercaFoglioMappale.LayerGid;
  }
  lamDispatch("hide-info-window");
  lamDispatch("clear-layer-info");
  lamDispatch({
    eventName: "zoom-geometry",
    geometry: feature.geometry,
  });

  lamDispatch({
    eventName: "add-geometry-info-map",
    geometry: feature.geometry,
  });
  lamDispatch({
    eventName: "flash-feature",
    feature: feature,
  });
  let template = LamTemplates.getTemplate(null, "CATASTO_PARTICELLE.json", LamStore.getAppState().templatesRepositoryUrl);
  lamDispatch({
    eventName: "show-search-items",
    features: features,
    template: template,
  });
};

RicercaFoglioMappale.loadRicercaFoglioMappaleOnStartup = function () {
  let nomeLayerCatasto = "CATASTO_PARTICELLE";
  let tentativo = setInterval(function () {
    var select = document.querySelector('#search-tools__select-layers');
    var divRicerca = document.querySelector('#lam-bar__item-layers');
    divRicerca.style.display = "block";
    var labelRicerca = document.querySelector('#search-tools__search-layers__label');
    labelRicerca.textContent = "";
    // Se l'elemento select non è ancora disponibile, riprova
    if (!select) {
      return; // Uscita anticipata per riprovare al prossimo intervallo
    }
    // Se l'elemento select è stato trovato, verifica l'esistenza dell'opzione
    if (Array.from(select.options).some(option => option.value === nomeLayerCatasto)) {
      clearInterval(tentativo); // Ferma il tentativo periodico perché l'elemento è stato trovato e non è necessario aggiungere l'opzione
      return;
    }
    // Se il layer non esiste lo aggiungo
    var nuovaOption = document.createElement('option');
    nuovaOption.value = nomeLayerCatasto;
    nuovaOption.text = 'Catasto Particelle';
    nuovaOption.setAttribute('searchCustomEvent', 'startLoadFogli'); //evento per inviare il layer
    select.appendChild(nuovaOption);
    $("#search-tools__select-layers").trigger("change");
    clearInterval(tentativo); // Ferma il tentativo periodico dopo l'aggiunta dell'opzione
  }, 1000); // Riprova ogni 1000 millisecondi (1 secondo)
};

LamDispatcher.bind("startLoadFogli", function (payload) {
  RicercaFoglioMappale.startLoadFogli();
});
