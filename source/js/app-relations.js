var LamRelations = (function() {
  let relationsResults = {};
  let currentRelation; //relation currently evaluating
  var init = function init() {
    //events binding
  };

  var getRelations = function() {
    return LamStore.getAppState().relations;
  };

  var getRelation = function(gid) {
    let relationResult = LamStore.getAppState().relations.filter(function(el) {
      return el.gid == gid;
    });
    return relationResult[0];
  };

  var getRelationResults = function() {
    return relationsResults;
  };

  /**
   * Sets the last relation result.
   * @param {Object} results must have a data attribute with a data array and a template attribute with the template to process
   */
  var setRelationResults = function(results) {
    relationsResults = results;
  };

  var showRelation = function(relationGid, resultIndex) {
    lamDispatch("show-loader");
    var item = LamStore.getCurrentInfoItems().features[resultIndex];
    currentRelation = LamRelations.getRelation(relationGid);
    var templateUrl = Handlebars.compile(currentRelation.serviceUrlTemplate);
    var urlService = templateUrl(item.properties);
    $.ajax({
      dataType: "jsonp",
      url: urlService + "&format_options=callback:LamRelations.parseResponseRelation",
      jsonp: true,
      cache: false,
      error: function(jqXHR, textStatus, errorThrown) {
        lamDispatch({
          eventName: "log",
          message: "LamRelations: unable to complete response"
        });
        lamDispatch("hide-loader");
      }
    });
  };

  let parseResponseRelation = function(data) {
    if (data.features) {
      data = data.features;
    }
    var template = LamTemplates.getTemplate(currentRelation.gid, currentRelation.templateUrl, LamStore.getAppState().templatesRepositoryUrl);
    LamRelations.setRelationResults({ data: data, template: template });
    var title = currentRelation.title;
    var body = "";
    if (!Array.isArray(data)) {
      data = [data];
    }
    let propsList = [];
    for (let i = 0; i < data.length; i++) {
      var props = data[i].properties ? data[i].properties : data[i];
      propsList.push(props);
      if (!template.multipleItems) {
        //single template not active by default
        body += LamTemplates.processTemplate(template, props);
        if (!body) {
          body += LamTemplates.standardTemplate(props);
        }
        if (data.length > 1) {
          body += "<div class='div-10'></div>";
        }
      }
    }

    //single template not active by default
    if (template.multipleItems && propsList.length > 0) {
      body += LamTemplates.processTemplate(template, propsList);
    }
    //download
    body +=
      "<div class=' lam-mt-1'><button class='lam-btn lam-right' onclick='lamDispatch(\"download-relation-results\")'><i class='lam-icon'>" +
      LamResources.svgDownload16 +
      "</i> Scarica CSV</button></div>";
    if (data.length === 0) {
      body += '<div class="lam-warning lam-mb-2 lam-p-2">' + LamResources.risultati_non_trovati + "</div>";
    }
    LamDom.showContent(LamEnums.showContentMode().InfoWindow, title, body);
    lamDispatch("hide-loader");
  };

  return {
    init: init,
    getRelations: getRelations,
    getRelation: getRelation,
    getRelationResults: getRelationResults,
    parseResponseRelation: parseResponseRelation,
    setRelationResults: setRelationResults,
    showRelation: showRelation
  };
})();
