let RicercaFoglio = {};

RicercaFoglio.Fogli = [];
RicercaFoglio.LayerGid = "CATASTO_PARTICELLE";

RicercaFoglio.getTemplate = function () {
  let template = "";
  template += '<div id="lam-content" class="ricerca-foglio">';
  template += '<div id="foglio" class="lam-row">';
  template += '<div class="lam-col">Foglio:</div><div class="lam-col"><select id="select-foglio" class="lam-select-small"></select></div>';
  template += "</div>";
  template += '<div id="mappale" class="lam-row">';
  template +=
    '<div class="lam-col"></div><div class="lam-col"><button id="map-tools__measures-start-area" class="lam-btn lam-btn-small lam-ml-0" onclick="RicercaFoglio.clearFoglio()">Annulla</button></div>';
  template += "</div>";
  template += "</div>";
  return template;
};

RicercaFoglio.clearFoglio = function () {
  $("#select-foglio").val("");
  lamDispatch("reset-search");
  lamDispatch("hide-info-window");
  lamDispatch("clear-layer-info");
};

RicercaFoglio.startLoadFoglio = function () {
  debugger;
  lamDispatch("show-loader");
  $("#search-tools__search-layers-custom").html(RicercaFoglio.getTemplate());
  $("#search-tools__search-layers-custom").show();
  $("#search-tools__search-layers-standard").hide();

  $("#select-foglio").change(function () {
    RicercaFoglio.visualizzaFoglio($(this).val());
  });

  const urlFogli =
    "https://geoserver.comune.re.it/geoserver/PUG_2023/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=PUG_2023%3ACATASTO_FOGLI&outputFormat=text%2Fjavascript&srsName=EPSG:3857";
  $.ajax({
    dataType: "jsonp",
    url: urlFogli + "&format_options=callback:RicercaFoglio.loadFoglio",
    error: function (jqXHR, textStatus, errorThrown) {
      lamDispatch("hide-loader");
    },
  });
};

RicercaFoglio.loadFoglio = function (response) {
  lamDispatch("hide-loader");
  RicercaFoglio.Fogli = response;
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

RicercaFoglio.visualizzaFoglio = function (foglio) {
  let features = RicercaFoglio.Fogli.features.filter(function (element) {
    return element.properties["FOGLIO"] == foglio;
  });
  let feature = null;
  if (features.length) {
    feature = features[0];
    feature.layerGid = RicercaFoglio.LayerGid;
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
  let template = LamTemplates.getTemplate(null, "CATASTO_FOGLI.json", LamStore.getAppState().templatesRepositoryUrl);
  lamDispatch({
    eventName: "show-search-items",
    features: features,
    template: template,
  });
};

RicercaFoglio.loadRicercaFoglioOnStartup = function () {
  let nomeLayerCatasto = "CATASTO_FOGLIO";
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
    nuovaOption.text = 'Catasto Fogli';
    nuovaOption.setAttribute('searchCustomEvent', 'startLoadFoglio'); //evento per inviare il layer
    select.appendChild(nuovaOption);
    $("#search-tools__select-layers").trigger("change");
    clearInterval(tentativo); // Ferma il tentativo periodico dopo l'aggiunta dell'opzione
  }, 1000); // Riprova ogni 1000 millisecondi (1 secondo)
};

LamDispatcher.bind("startLoadFoglio", function (payload) {
  RicercaFoglio.startLoadFoglio();
});
