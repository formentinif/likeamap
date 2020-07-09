let appStateDashboard = {};
appStateDashboard.layers = [];
appStateDashboard.relations = [];
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
};

/**
 * Complete the loading of an appstate
 */
appStateDashboard.appStateLoadingComplete = function () {
  LamTemplates.init();
  let layers = LamStore.getLayers();
  layers.map((layer) => {
    layer.mapTitle = LamStore.getAppState().title;
  });
  let relations = LamRelations.getRelations();
  relations.map((relation) => {
    relation.mapTitle = LamStore.getAppState().title;
  });
  // let templates = LamTemplates.getTemplates();
  // templates.map((template) => {
  //   template.mapTitle = LamStore.getAppState().title;
  // });
  appStateDashboard.layers = appStateDashboard.layers.concat(layers);
  appStateDashboard.relations = appStateDashboard.relations.concat(relations);
  //appStateDashboard.templates = appStateDashboard.templates.concat(templates);
  appStateDashboard.currentAppStateUrlFetching++;
  if (appStateDashboard.currentAppStateUrlFetching < appStateDashboard.appStateUrls.length) {
    appStateDashboard.loadNextAppState();
  } else {
    appStateDashboard.loadApplication();
  }
};

appStateDashboard.loadApplication = function () {
  let appLayersList = new Vue({
    el: "#app",
    data: function () {
      return {
        layers: appStateDashboard.layers,
        relations: appStateDashboard.relations,
        appStateUrls: appStateDashboard.appStateUrls,
        searchLayer: "",
        searchRelation: "",
        mapSelected: "",
        groupSelected: "",
        itemTypeSelected: "layers",
      };
    },
    computed: {
      layersFiltered: function () {
        let layersFiltered = this.layers;
        if (this.searchLayer) {
          let filter = this.searchLayer.toLowerCase();
          layersFiltered = layersFiltered.filter(function (element) {
            return element.layerName.toLowerCase().indexOf(filter) >= 0;
          });
        }
        if (this.mapSelected) {
          let filter = this.mapSelected.toLowerCase();
          layersFiltered = layersFiltered.filter(function (element) {
            return element.mapTitle.toLowerCase().indexOf(filter) >= 0;
          });
        }
        if (this.groupSelected) {
          let filter = this.groupSelected.toLowerCase();
          layersFiltered = layersFiltered.filter(function (element) {
            if (element.gid.toLowerCase() === filter && element.layerType == "group") return true; //element is a group
            if (!element.groupGid) return false; //element is not in a group
            return element.groupGid.toLowerCase().indexOf(filter) >= 0;
          });
        }
        return layersFiltered;
      },
      relationsFiltered: function () {
        let relationsFiltered = this.relations;
        if (this.searchRelation) {
          let filter = this.searchRelation.toLowerCase();
          relationsFiltered = relationsFiltered.filter(function (element) {
            return element.title.toLowerCase().indexOf(filter) >= 0;
          });
        }
        if (this.mapSelected) {
          let filter = this.mapSelected.toLowerCase();
          relationsFiltered = relationsFiltered.filter(function (element) {
            return element.mapTitle.toLowerCase().indexOf(filter) >= 0;
          });
        }
        return relationsFiltered;
      },
      layersMaps: function () {
        return [...new Set(this.layers.map((item) => item.mapTitle))];
      },
      groupLayers: function () {
        let layersFiltered = this.layers.filter((element) => {
          return element.layerType == "group";
        });
        if (this.mapSelected) {
          let filter = this.mapSelected.toLowerCase();
          layersFiltered = layersFiltered.filter(function (element) {
            return element.mapTitle.toLowerCase().indexOf(filter) >= 0;
          });
        }
        return layersFiltered;
      },
      appStateUrlsJoined: function () {
        return this.appStateUrls.join(";\n");
      },
    },
    methods: {
      onMapSelected: function (event) {
        this.mapSelected = event.target.value;
      },
      onGroupSelected: function (event) {
        this.groupSelected = event.target.value;
      },
      onItemTypeSelected: function (event) {
        this.itemTypeSelected = event.target.value;
      },
      showCodeLayer: function (event, gid) {
        let layer = this.layers.filter((element) => {
          return element.gid === gid;
        });
        if (layer.length) {
          layer = layer[0];
          let row = document.querySelector("#row_layer_" + layer.gid);
          let code = document.querySelector("#code_layer_" + layer.gid);
          if (code) {
            code.parentNode.removeChild(code);
            event.target.innerText = "Mostra JSON";
          }
          if (row && !code) {
            event.target.innerText = "Nascondi JSON";
            let newRow = document.createElement("tr");
            newRow.setAttribute("id", "code_" + layer.gid);
            let newCell = newRow.insertCell(0);
            newCell.setAttribute("colspan", "100%");
            let newPre = document.createElement("pre");
            let newText = document.createTextNode(JSON.stringify(layer, undefined, 4));
            newCell.appendChild(newPre);
            newPre.appendChild(newText);
            row.after(newRow);
          }
        }
      },
      showCodeRelation: function (event, gid) {
        let layer = this.layers.filter((element) => {
          return element.gid === gid;
        });
        if (layer.length) {
          layer = layer[0];
          let row = document.querySelector("#row_layer_" + layer.gid);
          let code = document.querySelector("#code_layer_" + layer.gid);
          if (code) {
            code.parentNode.removeChild(code);
            event.target.innerText = "Mostra JSON";
          }
          if (row && !code) {
            event.target.innerText = "Nascondi JSON";
            let newRow = document.createElement("tr");
            newRow.setAttribute("id", "code_" + layer.gid);
            let newCell = newRow.insertCell(0);
            newCell.setAttribute("colspan", "100%");
            let newPre = document.createElement("pre");
            let newText = document.createTextNode(JSON.stringify(layer, undefined, 4));
            newCell.appendChild(newPre);
            newPre.appendChild(newText);
            row.after(newRow);
          }
        }
      },
    },
  });
  console.log("loaded");
};
