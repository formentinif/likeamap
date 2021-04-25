var LamCharts = (function () {
  let currentChart; //relation currently evaluating
  let currentChartItem; //item on which the chart is evaluated
  let currentResults = null;
  var init = function init() {
    //loading remote charts
    LamStore.loadRemoteCharts();
  };

  var getCharts = function () {
    return LamStore.getAppState().charts;
  };

  var getChart = function (gid) {
    let chartResult = LamStore.getAppState().charts.filter(function (el) {
      return el.gid == gid;
    });
    return chartResult[0];
  };

  var showChart = function (chartGid, resultIndex) {
    lamDispatch("show-loader");
    if (typeof resultIndex === "undefined" || resultIndex < 0) {
      currentChartItem = {};
      currentChartItem.properties = {};
    } else {
      currentChartItem = LamStore.getCurrentInfoItems().features[resultIndex];
    }
    currentChart = LamCharts.getChart(chartGid);
    var templateUrl = Handlebars.compile(currentChart.serviceUrlTemplate);
    var urlService = templateUrl(currentChartItem.properties);
    $.ajax({
      dataType: "jsonp",
      url: urlService + "&format_options=callback:LamCharts.parseResponseChart",
      jsonp: true,
      cache: false,
      error: function (jqXHR, textStatus, errorThrown) {
        lamDispatch({
          eventName: "log",
          message: "LamCharts: unable to complete response",
        });
        lamDispatch("hide-loader");
      },
    });
  };

  let parseResponseChart = function (data) {
    if (data.features) {
      data = data.features;
    }
    if (!Array.isArray(data)) {
      data = [data];
    }
    currentResults = data;
    var titleCompiled = Handlebars.compile(currentChart.title);
    let title = titleCompiled(currentChartItem.properties);
    let body = "<canvas id='lam-chart-canvas'></canvas>";
    //mostro il contenuto per avere renderizzato prima il canvas da riempire
    LamDom.showContent(LamEnums.showContentMode().InfoWindow, title, body);
    //renderizzo il grafico
    renderChart(getChartData());
    lamDispatch("hide-loader");
  };

  let renderChart = function (chartData, options) {
    if (!options) {
      options = {
        responsive: true,
        legend: {
          position: "top",
        },
        title: {
          display: false,
          text: "",
        },
      };
      switch (currentChart.chartType) {
        case "bubble":
        case "pie":
          break;
        case "horizontalBar":
          options.scales = {
            xAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          };
          break;
        default:
          options.scales = {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          };
          break;
      }
    }
    var ctx = document.getElementById("lam-chart-canvas").getContext("2d");
    window.myBar = new Chart(ctx, {
      type: currentChart.chartType ? currentChart.chartType : "bar",
      data: chartData,
      options: options,
    });
  };

  let getChartData = function () {
    let chartConfig = {};
    chartConfig.datasets = [];
    //sorting values
    currentResults.sort((a, b) =>
      a.properties[currentChart.sortField] > b.properties[currentChart.sortField]
        ? 1
        : b.properties[currentChart.sortField] > a.properties[currentChart.sortField]
        ? -1
        : 0
    );
    if (!Array.isArray(currentChart.labelField)) {
      let labelCompiled = Handlebars.compile(currentChart.labelField);
      chartConfig.labels = currentResults.map(function (element) {
        return labelCompiled(element.properties);
      });
    } else {
      chartConfig.labels = [];
      currentChart.labelField.forEach(function (label) {
        let labelCompiled = Handlebars.compile(label);
        chartConfig.labels.push(labelCompiled(currentResults[0].properties));
      });
    }

    currentChart.datasets.forEach(function (element) {
      if (!Array.isArray(element.valueField)) {
        let dataSet = datasetFactoryCreate(element);
        dataSet.data = currentResults.map(function (item) {
          return getDatasetValue(element.valueField, item);
        });
        chartConfig.datasets.push(dataSet);
      } else {
        currentResults.forEach(function (item) {
          let dataSet = datasetFactoryCreate(element, item);
          dataSet.data = [];
          element.valueField.forEach(function (itemSerieValue) {
            dataSet.data.push(getDatasetValue(itemSerieValue, item));
          });
          chartConfig.datasets.push(dataSet);
        });
      }
    });
    return chartConfig;
  };

  let datasetFactoryCreate = function (datasetConfig) {
    let dataSet = {};
    if (datasetConfig.title) dataSet.label = datasetConfig.title;
    if (datasetConfig.backgroundColor) {
      dataSet.backgroundColor = [];
      if (!Array.isArray(datasetConfig.backgroundColor)) {
        dataSet.backgroundColor = "rgba(" + datasetConfig.backgroundColor + ")";
      } else {
        datasetConfig.backgroundColor.forEach(function (background) {
          dataSet.backgroundColor.push("rgba(" + background + ")");
        });
      }
    }
    if (datasetConfig.borderColor) dataSet.borderColor = "rgba(" + datasetConfig.borderColor + ")";
    if (datasetConfig.borderWidth) dataSet.borderWidth = datasetConfig.borderWidth;
    return dataSet;
  };

  let getDatasetValue = function (field, item) {
    if (field.indexOf("=") === 0) {
      var functionTemplate = field.replace("=", "");
      var functionCompiled = Handlebars.compile(functionTemplate);
      let itemFunction = functionCompiled(item.properties);
      try {
        let val = eval(itemFunction);
        return val;
      } catch (e) {
        lamDispatch({
          eventName: "log",
          message: "LamCharts: non è stato possibile calcolare il dato per " + itemFunction,
        });
        return 0;
      }
    }
    return item.properties[field];
  };

  return {
    getChart: getChart,
    getCharts: getCharts,
    showChart: showChart,
    init: init,
    parseResponseChart: parseResponseChart,
    renderChart: renderChart,
  };
})();
