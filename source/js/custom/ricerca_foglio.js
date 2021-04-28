let RicercaFoglio = {};

RicercaFoglio.Fogli = [];
RicercaFoglio.LayerGid = "g_CATASTO_PARTICELLE";

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
    "https://geoserver.comune.re.it/geoserver/reggiomap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=reggiomap%3ACATASTO_FOGLI&outputFormat=text%2Fjavascript&srsName=EPSG:3857";
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

LamDispatcher.bind("startLoadFoglio", function (payload) {
  debugger;
  RicercaFoglio.startLoadFoglio();
});
