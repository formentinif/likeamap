let appStateDashboard = {};

appStateDashboard.layers = [];
//appStateDashboard.templates = [];
appStateDashboard.appStateUrls = [];
appStateDashboard.currentAppStateUrlFetching = 0;

appStateDashboard.loadAppStates = function (appStateUrls) {
  appStateDashboard.appStateUrls = appStateUrls;
  appStateDashboard.loadNextAppState();
};

/**
 * Starts loading a given appstate url
 */
appStateDashboard.loadNextAppState = function () {
  fetch(appStateDashboard.appStateUrls[appStateDashboard.currentAppStateUrlFetching])

appStateDashboard.layers = [];
appStateDashboard.templates = [];
/**
 * Starts loading a given appstate url
 */
appStateDashboard.loadAppState = function (appStateUrl) {
  fetch(appStateUrl)

    .then((response) => {
      return response.json();
    })
    .then((result) => {
      appStateDashboard.loadLamState(result);
    })
    .catch((error) => {
      console.log(error);
    });
};

/**
 * Sets the appstate in LamStore Object and then loads the layers configured as a remote link
 */
appStateDashboard.loadLamState = function (appstate) {
  //normalizing appstate
  LamStore.setAppState(appstate);

  try {
    LamLoader.loadRemoteLayers(appStateDashboard.appStateLoadingComplete);
  } catch (e) {
    alert("Si è verificato un errore nel caricamento dei layer");
    appStateDashboard.appStateLoadingComplete();
  }

  LamLoader.loadRemoteLayers(appStateDashboard.appStateLoadingComplete);

};

/**
 * Complete the loading of an appstate
 */
appStateDashboard.appStateLoadingComplete = function () {
  debugger;
  var layers = LamStore.getLayers();
  layers.map((layer) => {
    layer.mapTitle = LamStore.getAppState().title;
  });
  var templates = LamTemplates.getTemplates();
  templates.map((template) => {
    template.mapTitle = LamStore.getAppState().title;
  });
  appStateDashboard.layers = appStateDashboard.layers.concat(layers);
  appStateDashboard.templates = appStateDashboard.templates.concat(templates);

  var appLayersList = new Vue({
    el: "#layersList",
    data: {
      layers: appStateDashboard.layers,
    },
  });
  console.log("loaded");
};
