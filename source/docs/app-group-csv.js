let appGroupCsv = {};
appGroupCsv.urlAppStateSchemaUrl = "https://cdn.jsdelivr.net/gh/formentinif/likeamap@latest/source/schemas/app-state-schema.json";
appGroupCsv.appStateSchemaJson = {};

appGroupCsv.init = function () {
  appGroupCsv.loadAppStateSchema();
  appGroupCsv.loadApplication();
};

appGroupCsv.loadCsv = function (url) {
  return fetch(url).then((response) => response.text());
};

appGroupCsv.loadAppStateSchema = function () {
  fetch(appGroupCsv.urlAppStateSchemaUrl)
    .then((response) => response.json())
    .then((json) => {
      appGroupCsv.appStateSchemaJson = json;
    })
    .catch((e) => {
      console.log("Non è stato possibile caricare lo scheme dell'app-state.");
    });
};

appGroupCsv.normalizeGid = function (gid) {
  return gid.replace(/\(/g, "").replace(/\)/g, "").replace(/  /g, " ").replace(/-/g, "_").replace(/ /g, "_").replace(/__/g, "_");
};

/**
 * Normalize the properties of a layer, based on the json schema loaded
 * @param {Object} layer
 */
appGroupCsv.normalizeLayer = function (layer) {
  let normalizedLayer = {};
  if (layer.groupLayerName) normalizedLayer.groupLayerName = layer.groupLayerName.trim();
  var layerSchema = appGroupCsv.appStateSchemaJson.layers.items.properties.layers.items.properties;
  for (prop in layerSchema) {
    if (layer[prop]) {
      switch (layerSchema[prop].type) {
        case "integer":
          normalizedLayer[prop] = parseInt(layer[prop].trim());
          break;
        case "number":
          normalizedLayer[prop] = parseFloat(layer[prop].trim());
          break;
        default:
          normalizedLayer[prop] = layer[prop].trim();
          break;
      }
    }
  }
  return normalizedLayer;
};

appGroupCsv.groupFromString = function (groupLayerName, mapTitle) {
  let normalizedGroup = {};
  normalizedGroup.gid = appGroupCsv.normalizeGid(groupLayerName);
  normalizedGroup.layerName = groupLayerName.trim();
  normalizedGroup.layerType = "group";
  if (mapTitle) normalizedGroup.mapTitle = mapTitle.trim();
  return normalizedGroup;
};

/**
 * Takes an array of raw Json Objects and returns the formatted
 * @param {Array} jsonLayersCsv
 */
appGroupCsv.generateLayers = function (jsonLayersCsv) {
  debugger;
  let groupLayers = [];
  let mapLayers = [];
  var layers = [];
  let groupLayersStrings = [...new Set(jsonLayersCsv.map((item) => ({ groupLayerName: item.groupLayerName, mapTitle: item.mapTitle })))];
  let mapTitleStrings = [...new Set(jsonLayersCsv.map((item) => item.mapTitle))];

  groupLayersStrings.forEach((element) => {
    if (
      element.groupLayerName &&
      !groupLayers.filter((group) => {
        return group.mapTitle === element.mapTitle && group.layerName === element.groupLayerName.trim();
      }).length
    ) {
      groupLayers.push(appGroupCsv.groupFromString(element.groupLayerName, element.mapTitle));
    }
  });
  mapTitleStrings.forEach((element) => {
    if (element) mapLayers.push(appGroupCsv.groupFromString(element.trim()));
  });

  //generate layers
  jsonLayersCsv.forEach((element) => {
    let layer = appGroupCsv.normalizeLayer(element);
    layers.push(layer);
  });

  //generate groups
  for (let index = 0; index < groupLayers.length; index++) {
    let group = groupLayers[index];
    group.layers = layers.filter((layer) => {
      return layer.groupLayerName == group.layerName;
    });
  }

  //generate map
  for (let index = 0; index < mapLayers.length; index++) {
    let map = mapLayers[index];
    map.layers = groupLayers.filter((group) => {
      return map.layerName == group.mapTitle;
    });
    map.layers.map((group) => {
      debugger;
      if (!group.nestingStyle) group.nestingStyle = "sub1";
    });
  }
  groupLayers
    .filter((element) => {
      return !element.mapTitle;
    })
    .forEach((element) => {
      mapLayers.push(element);
    });
  debugger;
  return JSON.stringify(mapLayers, undefined, 4);
};

appGroupCsv.loadApplication = function () {
  let app = new Vue({
    el: "#app",
    data: function () {
      return {
        jsonData: [],
        jsonText: "",
        csvText: "",
        csvUrl: "",
      };
    },
    methods: {
      loadCsv: function () {
        appGroupCsv.loadCsv(this.csvUrl).then((text) => {
          this.csvText = text;
          let csvData = appGroupCsv.CSVToArray(text, ";");
          this.jsonData = [];
          for (let index = 1; index < csvData.length; index++) {
            const element = csvData[index];
            let newLayer = {};
            csvData[0].forEach((headerProp, headerIndex) => {
              newLayer[headerProp] = element[headerIndex];
            });
            this.jsonData.push(newLayer);
          }
        });
      },
      generateJson: function () {
        this.jsonText = appGroupCsv.generateLayers(this.jsonData);
      },
    },
  });
  console.log("loaded");
};

// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
appGroupCsv.CSVToArray = function (strData, strDelimiter) {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = strDelimiter || ",";

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    // Delimiters.
    "(\\" +
      strDelimiter +
      "|\\r?\\n|\\r|^)" +
      // Quoted fields.
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      // Standard fields.
      '([^"\\' +
      strDelimiter +
      "\\r\\n]*))",
    "gi"
  );

  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;

  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while ((arrMatches = objPattern.exec(strData))) {
    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([]);
    }

    var strMatchedValue;

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
    } else {
      // We found a non-quoted value.
      strMatchedValue = arrMatches[3];
    }

    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue);
  }

  // Return the parsed data.
  return arrData;
};
