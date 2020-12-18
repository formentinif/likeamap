var https = require("https");
var fs = require("fs");
let appStateCurrent = {};
let countRequest = 0;
let layerUriCount = 0;

class AppStateDownload {
  constructor(uri, fileName) {
    this.uri = uri;
    this.fileName = fileName;
  }
}

var appStateDownloadList = [];
var appStateDownloadCurrent;

let downloadAppStates = function (appStateDownloads) {
  if (!appStateDownloads.length) return;
  appStateDownloadList = appStateDownloads;
  downloadAppState();
};

let downloadAppState = function () {
  countRequest = 0;
  layerUriCount = 0;

  if (!appStateDownloadList.length) {
    console.log("Ending procedure");
    return;
  }
  appStateDownloadCurrent = appStateDownloadList.pop();

  https
    .get(appStateDownloadCurrent.uri, (resp) => {
      let data = "";

      resp.on("data", (chunk) => {
        data += chunk;
      });

      resp.on("end", () => {
        appStateCurrent = JSON.parse(data);
        appStateCurrent.layers.forEach(function (layer) {
          loadLayersUri(layer, writeAppState);
        });
        if (layerUriCount === 0) {
          //no ajax request sent, loading all json immediately
          writeAppState();
        }
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
};

let loadLayersUri = function (layer, callback) {
  if (layer.layersUri) {
    countRequest++;
    layerUriCount++;
    https
      .get(layer.layersUri, (resp) => {
        let data = "";

        resp.on("data", (chunk) => {
          data += chunk;
        });

        resp.on("end", () => {
          countRequest--;
          layer.layers = JSON.parse(data);
          layer.layers.forEach(function (e) {
            loadLayersUri(e, callback);
          });
          //console.log(countRequest);
          if (countRequest == 0) {
            callback();
          }
        });
      })
      .on("error", (err) => {
        console.log("Error: " + err.message);
      });
  } else if (layer.layers) {
    layer.layers.forEach(function (layer) {
      loadLayersUri(layer, callback);
    });
  }
};

let writeAppState = function () {
  fs.writeFile(appStateDownloadCurrent.fileName, JSON.stringify(appStateCurrent), function (err) {
    //if (err) throw err;
    downloadAppState();
    console.log("Saved!");
  });
};

//usage example
let stateUrl = [
  // {
  //   fileName: "appstatetraffico.json",
  //   uri: "https://mapstest.comune.re.it/maps/mappalimitazionitraffico/states/app-state.json",
  // },
  {
    fileName: "states\\app-state.json",
    uri: "https://mapstest.comune.re.it/maps/reggiomap/states/app-state.json",
  },
];
//running
downloadAppStates(stateUrl);
