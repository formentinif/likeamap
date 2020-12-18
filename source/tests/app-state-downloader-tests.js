const store = require("../js/app-store.js").LamStore;
const loader = require("../js/app-loader.js").LamLoader;
const downloader = require("../js/app-state-downloader.js").LamStateDownloader;
const $ = require("../vendor/lib/jquery.js");

let stateUrl = [
  {
    path: "appstate.json",
    appStateUri: "https://mapstest.comune.re.it/maps/mappalimitazionitraffico",
  },
];

downloader.downloadAppStates(stateUrl);

console.log("Completed");
