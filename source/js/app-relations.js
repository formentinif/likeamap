var LamRelations = (function () {
  let currentRelation; //relation currently evaluating
  let currentRelationItem; //item on which the relation is evaluated
  let currentPageIndex = 0;
  let currentPageSize = 25;
  let sortAttribute = null;
  let currentTemplate = null;
  let currentRelationTableTemplate = null;
  let currentResults = null;
  let relationHistory = [];

  var init = function init() {
    //events binding
    LamDispatcher.bind("render-relation-table", function (payload) {
      LamRelations.renderRelationTable(payload.pageSize, payload.pageIndex, payload.sortBy);
    });

    LamDispatcher.bind("render-previous-relation", function (payload) {
      LamRelations.showPrevRelation();
    });

    //loading remote relations
    LamStore.loadRemoteRelations();
  };

  var getRelations = function () {
    return LamStore.getAppState().relations;
  };

  var getRelation = function (gid) {
    let relationResult = LamStore.getAppState().relations.filter(function (el) {
      return el.gid == gid;
    });

    return relationResult[0];
  };

  /**
   * Return an object  with properties
   * data
   * template
   */
  var getRelationResults = function () {
    return {
      data: currentResults,
      template: currentTemplate,
    };
  };

  /**
   * Shows the relation from an infobox item
   * @param {string} relationGid
   * @param {int} resultIndex
   */
  var showPrevRelation = function (relationGid, resultIndex) {
    relationHistory.pop();
    showRelationByItem(relationHistory[relationHistory.length - 1].relationGid, relationHistory[relationHistory.length - 1].resultItem);
  };

  /**
   * Shows the relation from an infobox item
   * @param {string} relationGid
   * @param {int} resultIndex
   */
  var showRelation = function (relationGid, resultIndex) {
    relationHistory.push({
      relationGid: relationGid,
      resultItem: LamStore.getCurrentInfoItems().features[resultIndex],
    });
    showRelationByItem(relationGid, LamStore.getCurrentInfoItems().features[resultIndex]);
  };

  /**
   * Shows the relation from a relation's table results
   * @param {string} relationGid
   * @param {int} resultIndex
   */
  var showConcatenatedRelation = function (relationGid, resultIndex) {
    relationHistory.push({
      relationGid: relationGid,
      resultItem: currentResults[resultIndex],
    });
    showRelationByItem(relationGid, currentResults[resultIndex]);
  };

  var showRelationByItem = function (relationGid, resultItem) {
    lamDispatch("show-loader");
    currentRelationItem = resultItem;
    currentRelation = LamRelations.getRelation(relationGid);
    var templateUrl = Handlebars.compile(currentRelation.serviceUrlTemplate);
    var urlService = templateUrl(currentRelationItem.properties);
    $.ajax({
      dataType: "jsonp",
      url: urlService + "&format_options=callback:LamRelations.parseResponseRelation",
      jsonp: true,
      cache: false,
      error: function (jqXHR, textStatus, errorThrown) {
        lamDispatch({
          eventName: "log",
          message: "LamRelations: unable to complete response",
        });
        lamDispatch("hide-loader");
      },
    });
  };

  let parseResponseRelation = function (data) {
    if (data.features) {
      data = data.features;
    }
    if (!Array.isArray(data)) {
      data = [data];
    }
    var template = LamTemplates.getTemplate(currentRelation.gid, currentRelation.templateUrl, LamStore.getAppState().templatesRepositoryUrl);
    currentTemplate = template;
    currentResults = data;
    currentPageIndex = 0;
    currentPageSize = 25;
    sortAttribute = null;

    renderRelationTable();
    lamDispatch("hide-loader");
  };

  let renderRelationTable = function (pageSize, pageIndex, sortBy) {
    //let title = currentRelationItem.toolTip ? currentRelationItem.toolTip + " - " : "" + currentRelation.title;
    var titleCompiled = Handlebars.compile(currentRelation.title);
    let title = titleCompiled(currentRelationItem.properties);

    let body = "";

    if (relationHistory.length > 1) {
      body += "";
      body +=
        "<button type='button' class='lam-btn lam-depth-1 lam-mb-2' onclick=\"lamDispatch({ eventName: 'render-previous-relation'});\" ><i class='lam-icon'>" +
        LamResources.svgChevronLeft16 +
        "</i> Indietro</button>";
    }

    if (pageIndex != null) currentPageIndex = pageIndex;
    if (pageSize) {
      currentPageSize = pageSize;
      if (currentPageSize * currentPageIndex > currentResults.length) currentPageIndex = 0;
    }
    if (sortBy) {
      sortAttribute = sortBy;
      if (sortAttributeIsDescending(sortAttribute)) {
        //Descending
        currentResults.sort(function compare(a, b) {
          let attributeName = LamTables.getNormalizedSortAttribute();
          if (a.properties[attributeName] < b.properties[attributeName]) {
            return 1;
          }
          if (a.properties[attributeName] > b.properties[attributeName]) {
            return -1;
          }
          return 0;
        });
      } else {
        //Ascending
        currentResults.sort(function compare(a, b) {
          if (a.properties[sortAttribute] < b.properties[sortAttribute]) {
            return -1;
          }
          if (a.properties[sortAttribute] > b.properties[sortAttribute]) {
            return 1;
          }
          return 0;
        });
      }
    }
    currentRelationTableTemplate = getRelationTemplate(currentTemplate);
    let propsList = [];
    let currentFeatureCount = currentResults.length;
    let maxIndex = (currentPageIndex + 1) * currentPageSize > currentFeatureCount ? currentFeatureCount : (currentPageIndex + 1) * currentPageSize;
    for (let i = currentPageIndex * currentPageSize; i < maxIndex; i++) {
      var props = currentResults[i].properties ? currentResults[i].properties : currentResults[i];
      props.relationIndex = i;
      propsList.push(props);
    }
    let compiledTemplate = Handlebars.compile(currentRelationTableTemplate);
    body += compiledTemplate(propsList);
    //pulsanti paginazione
    let startIndex = currentPageIndex * currentPageSize + 1;
    body += "<div class='lam-grid lam-no-bg lam-mt-1'>";
    body += "<div class='lam-col'> N° ";
    body += "" + startIndex + "-" + maxIndex + " su " + currentFeatureCount;
    body += "</div>";
    body += "<div class='lam-col'> Mostra ";
    body += "<select class='lam-select-small ' onchange='LamRelations.updatePageSize(this)'>";
    for (let index = 25; index <= 100; index += 25) {
      body += "<option value='" + index + "' " + (index === currentPageSize ? "selected" : "") + ">" + index + "</option>\n";
    }
    body += " </select>";
    body += "</div>";
    body += "<div class='lam-col'>";
    body += " Pag. <select class='lam-select-small ' onchange='LamRelations.updatePageIndex(this)'>";
    for (let index = 1; index <= Math.floor(currentFeatureCount / currentPageSize) + 1; index++) {
      body += "<option value='" + index + "' " + (index === currentPageIndex + 1 ? "selected" : "") + ">" + index + "</option>";
    }
    body += " </select>";

    body += "/" + (Math.floor(currentFeatureCount / currentPageSize) + 1);
    body += "</div>";
    body += "<div class='lam-col'>";
    if (currentPageIndex > 0) {
      body +=
        "<button class='lam-btn lam-btn-small' onclick=\"lamDispatch({ eventName: 'render-relation-table', pageIndex: " +
        (currentPageIndex - 1) +
        ' });"><i class="lam-icon">' +
        LamResources.svgArrowLeft +
        "</i></button>";
    }
    if (propsList.length == currentPageSize) {
      body +=
        "<button class='lam-btn lam-btn-small' onclick=\"lamDispatch({ eventName: 'render-relation-table', pageIndex:" +
        (currentPageIndex + 1) +
        ' });"><i class="lam-icon">' +
        LamResources.svgArrowRight +
        "</i></button>";
    }
    body += "</div>";
    body += "</div>";

    //download
    if (currentResults.length === 0) {
      body += '<div class="lam-warning lam-mb-2 lam-p-2">' + LamResources.risultati_non_trovati + "</div>";
    }
    body +=
      "<div class=' lam-mt-1'><button class='lam-btn lam-right lam-depth-1' onclick='lamDispatch(\"download-relation-results\")'><i class='lam-icon'>" +
      LamResources.svgDownload16 +
      "</i> Scarica CSV</button></div>";
    LamDom.showContent(LamEnums.showContentMode().InfoWindow, title, body);
  };

  let getRelationTemplate = function (template) {
    let attribute = LamTables.getNormalizedSortAttribute();
    let str = "<table class='lam-table'>";
    str += "<tr>";
    for (let i = 0; i < template.fields.length; i++) {
      str += "<th class='" + (template.fields[i].field === attribute ? " lam-sorted " : "") + "' >";
      str +=
        "<i class='lam-pointer ' onclick=\"lamDispatch({ eventName: 'render-relation-table', sortBy: '" +
        (template.fields[i].field === sortAttribute ? template.fields[i].field + " DESC" : template.fields[i].field) +
        "'  }); return false;\">";
      str += template.fields[i].field === attribute && !sortAttributeIsDescending(sortAttribute) ? LamResources.svgExpandLess16 : LamResources.svgExpandMore16;
      str += "</i></a>";
      str += (!template.fields[i].header ? template.fields[i].label : template.fields[i].header) + "</th>";
    }
    str += "</tr>";
    str += "{{#each this}}<tr>";
    for (let i = 0; i < template.fields.length; i++) {
      str += LamTemplates.getFieldTemplate(template.fields[i]);
    }
    str += "</tr>{{/each}}";
    str += "</table>";
    return str;
  };

  let updatePageSize = function (sender) {
    if ($(sender).val()) {
      LamRelations.renderRelationTable(parseInt($(sender).val()), currentPageIndex);
    }
  };
  let updatePageIndex = function (sender) {
    if ($(sender).val()) {
      LamRelations.renderRelationTable(currentPageSize, parseInt($(sender).val()) - 1);
    }
  };

  let sortAttributeIsDescending = function (attribute) {
    return attribute.indexOf(" DESC", attribute.length - " DESC".length) !== -1;
  };

  /**
   * Filters the relations by keeping only the relations given, checking relation gid or autorization
   * This method is only called outside the app
   */
  let allowRelations = function (relationsToKeep) {
    if (LamStore.getAppState()) {
      // let relationsFiltered = LamStore.getAppState().relations.filter(function (relation) {
      //   return relationsToKeep.includes(relation.gid);
      // });
      let relationsFilteredAuth = LamStore.getAppState().relations.filter(function (relation) {
        if (!relation.authorization) return false;
        var arrAuthorization = relation.authorization.split(",");
        return relationsToKeep.some((r) => arrAuthorization.includes(r));
      });
      //LamStore.getAppState().relations = [...new Set([...relationsFiltered, ...relationsFilteredAuth])];
      LamStore.getAppState().relations = relationsFilteredAuth;
    } else {
      setTimeout(function () {
        LamRelations.allowRelations(relationsToKeep);
      }, 3000);
    }
  };

  return {
    allowRelations: allowRelations,
    init: init,
    getRelations: getRelations,
    getRelation: getRelation,
    getRelationResults: getRelationResults,
    getRelationTemplate: getRelationTemplate,
    parseResponseRelation: parseResponseRelation,
    renderRelationTable: renderRelationTable,
    showConcatenatedRelation: showConcatenatedRelation,
    showRelation: showRelation,
    showPrevRelation: showPrevRelation,
    updatePageSize: updatePageSize,
    updatePageIndex: updatePageIndex,
  };
})();
