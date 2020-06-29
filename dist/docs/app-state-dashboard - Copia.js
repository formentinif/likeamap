let appStateDashboard = {};

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
