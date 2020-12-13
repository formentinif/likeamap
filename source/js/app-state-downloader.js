const jquery = require("../vendor/lib/jquery");

var LamStateDownloader = (function () {
  class AppStateDownload {
    constructor(appStateUri, path) {
      this.appStateUri = appStateUri;
      this.path = path;
    }
  }

  var init = function init() {};
  var appStateDownloadList = [];
  var appStateDownloadCurrent;

  let downloadAppStates = function (appStateDownloads) {
    if (!appStateDownloads.length) return;
    appStateDownloadList = appStateDownloads;
    downloadAppState();
  };

  let downloadAppState = function () {
    if (!appStateDownloadList.length) return;
    appStateDownloadCurrent = appStateDownloadList.pop();
    jquery
      .ajax({
        dataType: "json",
        url: appStateDownloadCurrent.appStateUri,
        cache: false,
      })
      .done(function (appstate) {
        LamStore.setAppState(appstate);
        LamLoader.loadLayersUri(writeAppState);
      })
      .fail(function () {
        downloadAppState();
      });
  };

  let writeAppState = function () {
    var fs = require("fs");
    fs.appendFile(appStateDownloadCurrent.path, JSON.stringify(LamStore.getAppState()), function (err) {
      //if (err) throw err;
      callback();
      console.log("Saved!");
    });
  };

  return {
    downloadAppStates: downloadAppStates,
    downloadAppState: downloadAppState,
  };
})();

exports.LamStateDownloader = LamStateDownloader;
