var LamRelations = (function() {
  let relationsResults = {};

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
    var relation = LamRelations.getRelation(relationGid);
    var templateUrl = Handlebars.compile(relation.serviceUrlTemplate);
    var urlService = templateUrl(item.properties);

    var template = LamTemplates.getTemplate(relation.gid, relation.templateUrl, LamStore.getAppState().templatesRepositoryUrl);

    $.ajax({
      dataType: "jsonp",
      url: urlService,
      jsonp: true,
      cache: false,
      success: function(data) {
        if (data.features) {
          data = data.features;
        }
        LamRelations.setRelationResults({ data: data, template: template });
        var title = relation.title;
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
          "<div class=' lam-mt-1'><button class='lam-btn lam-small lam-right' onclick='lamDispatch(\"download-relation-results\")'>Scarica CSV</button></div>";
        if (data.length === 0) {
          body += '<div class="lam-warning lam-mb-2 lam-p-2">' + LamResources.risultati_non_trovati + "</div>";
        }
        LamDom.showContentInfoWindow(title, body);
        lamDispatch("hide-loader");
      },
      error: function(jqXHR, textStatus, errorThrown) {
        lamDispatch({
          eventName: "log",
          message: "LamSearchTools: unable to complete response"
        });
        lamDispatch("hide-loader");
      }
    });
  };

  return {
    init: init,
    getRelations: getRelations,
    getRelation: getRelation,
    getRelationResults: getRelationResults,
    setRelationResults: setRelationResults,
    showRelation: showRelation
  };
})();
