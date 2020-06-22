let RicercaFoglioMappale = {};

RicercaFoglioMappale.Fogli = [];
RicercaFoglioMappale.Mappali = [];

RicercaFoglioMappale.getTemplate = function () {
  let template = "";
  template += '<div id="lam-content" class="ricerca-foglio-mappale">';
  template += '<div id="foglio" class="lam-row">';
  template += '<div class="lam-col">Fogli:</div><div class="lam-col"><select id="select-foglio" class="lam-select-small"></select></div>';
  template += "</div>";
  template += '<div id="mappale" class="lam-row">';
  template += '<div class="lam-col">Mappali:</div><div class="lam-col"><select id="select-mappale" class="lam-select-small"></select></div>';
  template += "</div>";
  template += "</div>";
  return template;
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
    "https://geoserver.comune.re.it/geoserver/reggiomap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=reggiomap%3ACATASTO_FOGLI&outputFormat=text%2Fjavascript&srsName=EPSG:3857";
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
    return parseInt(element.properties["FOGLIO"]);
  });
  numFogli.sort(function (a, b) {
    return a - b;
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
    "https://geoserver.comune.re.it/geoserver/reggiomap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=reggiomap%3ACATASTO_PARTICELLE&outputFormat=text%2Fjavascript&srsName=EPSG:3857";
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
    return parseInt(element.properties["MAPPALE"]);
  });
  numFogli.sort(function (a, b) {
    return a - b;
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
  }
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
  lamDispatch({
    eventName: "show-search-items",
    features: features,
  });
};

LamDispatcher.bind("startLoadFogli", function (payload) {
  RicercaFoglioMappale.startLoadFogli();
});
