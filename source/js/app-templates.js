/*
Copyright 2015-2019 Perspectiva di Formentini Filippo

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Copyright 2015-2019 Perspectiva di Formentini Filippo
Concesso in licenza secondo i termini della Licenza Apache, versione 2.0 (la "Licenza"); è proibito usare questo file se non in conformità alla Licenza. Una copia della Licenza è disponibile all'indirizzo:

http://www.apache.org/licenses/LICENSE-2.0

Se non richiesto dalla legislazione vigente o concordato per iscritto,
il software distribuito nei termini della Licenza è distribuito
"COSÌ COM'È", SENZA GARANZIE O CONDIZIONI DI ALCUN TIPO, esplicite o implicite.
Consultare la Licenza per il testo specifico che regola le autorizzazioni e le limitazioni previste dalla medesima.

*/
/**
 *
 */
let LamTemplates = (function () {
  let templates = [];

  let init = function init() {
    //Ciclo i livelli che non hanno un template
    let tempLayers = LamStore.getAppState().layers;
    const repoTemplatesUrl = LamStore.getAppState().templatesRepositoryUrl;
    const tempRelations = LamStore.getAppState().relations;
    loadLayersTemplates(tempLayers, repoTemplatesUrl);
    loadRelationsTemplates(tempRelations, repoTemplatesUrl);
  };

  /**
   * Load all the layer templates in memory, retrieving by ajax
   * @param {Array} layers Layers array
   * @param {string} repoTemplatesUrl base url of the template repository
   */
  let loadLayersTemplates = function (layers, repoTemplatesUrl) {
    layers.forEach(function (layer) {
      if (layer.queryable || layer.preload || layer.searchable) {
        loadLayerTemplates(layer, repoTemplatesUrl);
      }
      if (layer.layers) loadLayersTemplates(layer.layers, repoTemplatesUrl);
    });
  };

  let loadRelationsTemplates = function (tempRelations, repoTemplatesUrl) {
    for (let i = 0; i < tempRelations.length; i++) {
      const relation = tempRelations[i];
      let templateUrl = getTemplateUrl(relation.gid, relation.templateUrl, repoTemplatesUrl);
      let template = templates.filter(function (el) {
        return el.templateUrl === templateUrl;
      });
      if (!template.length) {
        //aggiungo il layer vi ajax
        loadTemplateAjax(templateUrl);
      }
    }
  };

  /**
   * Load the templates defined for a layer
   * @param {Object} layer
   * @param {string} repoTemplatesUrl base url of the template repository
   */
  let loadLayerTemplates = function (layer, repoTemplatesUrl) {
    //transforming the templateUrl property into an array
    let templateUrlList = [];
    if (layer.templateUrl) templateUrlList.push(layer.templateUrl);
    if (layer.groupTemplateUrls) templateUrlList = templateUrlList.concat(layer.groupTemplateUrls);
    templateUrlList.forEach(function (templateUrl) {
      let templateUrlParsed = getTemplateUrl(layer.gid, templateUrl, repoTemplatesUrl);
      layer.templateUrlParsed = templateUrlParsed;
      let template = templates.filter(function (el) {
        return el.templateUrl === templateUrlParsed;
      });
      if (template.length === 0) {
        //aggiungo il layer via ajax
        loadTemplateAjax(templateUrlParsed);
      }
    });
  };

  /**
   * Add the template json object into the template collection. The template il loaded using ajax.
   * @param {string} templateUrl Absolute url of the template
   */
  let loadTemplateAjax = function (templateUrl) {
    $.ajax({
      dataType: "json",
      url: templateUrl,
      cache: false,
    })
      .done(function (data) {
        if (data) {
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
              let thisTemplate = data[i];
              thisTemplate.templateUrl = templateUrl;
              templates.push(normalizeTemplate(thisTemplate));
            }
          } else {
            data.templateUrl = templateUrl;
            templates.push(normalizeTemplate(data));
          }
        }
      })
      .fail(function (data) {
        lamDispatch({
          eventName: "log",
          message: "LamStore: Unable to load template",
        });
      });
  };

  /**
   * Gets the uri of the template to be loaded by ajax
   * @param {object} layer Oggetto del layer/relation
   * @param {templateUrl} templateUrl Url completo del template. Senza https aggiunge il @repoUrl come prefisso
   * @param {string} repoUrl Url del repository dove sono contenuti i templates
   */
  let getTemplateUrl = function (gid, templateUrl, repoUrl) {
    if (templateUrl) {
      if (templateUrl.toLowerCase().includes("http://") || templateUrl.toLowerCase().includes("https://")) {
        return templateUrl;
      } else {
        return repoUrl + "/" + templateUrl;
      }
    }
    return repoUrl + "/" + gid + ".json";
  };

  let getTemplates = function () {
    return templates;
  };

  let normalizeTemplate = function (template) {
    //multipleitems is default
    if (template.templateType == "table") template.multipleItems = true;
    return template;
  };

  /**
   *
   * @param {string} gid
   * @param {string} templateUrl
   * @param {string} repoUrl
   */
  let getTemplate = function (gid, templateUrl, repoUrl) {
    let templatesFilter = templates.filter(function (el) {
      return el.templateUrl === getTemplateUrl(gid, templateUrl, repoUrl);
    });
    if (templatesFilter.length > 0) {
      return templatesFilter[0];
    }
    return null;
  };

  /**
   * @param {string} featureId FeatureID di goserver. Viene utilizzato nel caso di layer group
   *                                  di geoserver, in quanto non ci sono alternative per identificare 
   *                                  il layer della feature. Generalmente è composta dal nome del layer
   *                                  e da un identificativo univoco
       
   */
  let getTemplateByGeoserverFeatureId = function (featureId) {
    if (!featureId) return null;
    let layerId = featureId.split(".").shift();
    //get the template from
    let template = LamTemplates.getTemplates().find(function (element) {
      return element.layer === layerId;
    });
    return template;
  };

  let processTemplate = function (template, props, layer) {
    let result = "";
    if (template) {
      try {
        let hsTemplate = this.generateTemplate(template, layer);
        let compiledTemplate = Handlebars.compile(hsTemplate);
        if (!template.multipleItems && Array.isArray(props)) {
          result = compiledTemplate(props[0]);
        } else {
          result = compiledTemplate(props);
        }
      } catch (e) {
        lamDispatch({
          eventName: "log",
          message: e,
        });
      }
    }
    return result;
  };

  let standardTemplate = function (props, layer) {
    let body = "";
    if (layer) {
      body += "<div class='lam-grid lam-feature-heading' ><div class='lam-col'>" + (layer.layerName || "");
      if (layer.labelField) {
        body += " - " + getLabelFeature(props, layer.labelField);
      }
      body += "</div></div>";
    }
    for (let propertyName in props) {
      if (propertyName === "lamCoordinates") continue;
      body +=
        "<div class='lam-grid lam-mb-1'>" +
        "<div class='lam-feature-title lam-col'>" +
        propertyName +
        ":</div>" +
        "<div class='lam-feature-content lam-col'>" +
        (props[propertyName] == null ? "" : props[propertyName]) +
        "</div>" +
        "</div>";
    }
    body += "";
    return body;
  };

  let standardTableTemplate = function (props, layer) {
    if (!props) return "";
    let body = "<table class='lam-table' >";
    body += "<tr>";
    for (let propertyName in props) {
      if (propertyName === "lamCoordinates") continue;
      body += "<th>" + propertyName + "</th>";
    }
    body += "</tr>";
    body += "{{#each this}}";
    body += "<tr>";
    for (let propertyName in props) {
      if (propertyName === "lamCoordinates") continue;
      body += "<td>{{" + propertyName + "}}</td>";
    }
    body += "</tr>";
    body += "{{/each}}";
    body += "</table>";
    return body;
  };

  let featureIconsTemplate = function (index) {
    //icons
    let icons =
      "<div class='lam-feature__icons'>" +
      '<i title="Centra sulla mappa" class="lam-feature__icon" onclick="LamDispatcher.dispatch({ eventName: \'zoom-info-feature\', index: \'' +
      index +
      "' })\">" +
      LamResources.svgMarker +
      "</i>";
    let feature = LamMap.convertGeoJsonFeatureToOl(LamStore.getCurrentInfoItem(index));
    feature = LamMap.transform3857(feature, feature.srid);
    let centroid = LamMap.getLabelPoint(LamMap.getGeoJsonGeometryFromGeometry(feature.getGeometry()).coordinates);
    let geometryOl = LamMap.convertGeometryToOl(
      {
        coordinates: centroid,
        type: "Point",
        srid: feature.srid,
      },
      LamEnums.geometryFormats().GeoJson
    );
    centroid = LamMap.transformGeometrySrid(geometryOl, 3857, 4326);
    icons +=
      //"<a target='_blank' href='https://www.google.com/maps/@?api=1&map_action=map&center=" +
      "<a target='_blank' href='https://www.google.com/maps/search/?api=1&query=" +
      centroid.flatCoordinates[1] +
      "," +
      centroid.flatCoordinates[0] +
      "&'><i title='Apri in Google' class='lam-feature__icon'>" +
      LamResources.svgGoogle +
      "</i></a>";
    //https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=48.857832,2.295226&heading=-45&pitch=38&fov=80
    icons +=
      //"<a target='_blank' href='https://www.google.com/maps/@?api=1&map_action=map&center=" +
      "<a target='_blank' href='https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" +
      centroid.flatCoordinates[1] +
      "," +
      centroid.flatCoordinates[0] +
      "&'><i title='Apri in Google Street View' class='lam-feature__icon'>" +
      LamResources.svgStreetView +
      "</i></a>";
    icons += "</div>";
    return icons;
  };

  let relationsTemplate = function (relations, props, index) {
    let result = "";
    if (!relations.length) return "";
    result += '<div class="lam-feature__relations">';
    relations.map(function (relation) {
      result += '<div class="lam-mb-2 col s12">';
      result +=
        '<a href="#" class="lam-link" onclick="LamRelations.showRelation(\'' +
        relation.gid +
        "', " +
        index +
        ')">' +
        '<i class="lam-feature__icon">' +
        LamResources.svgOpen16 +
        "</i>" +
        relation.labelTemplate +
        "</a>";
      result += "</div>";
    });
    result += "</div>";
    return result;
  };

  let chartsTemplate = function (charts, index) {
    let result = "";
    if (!charts.length) return "";
    result += '<div class="lam-feature__charts">';
    charts.map(function (chart) {
      result += '<div class="lam-mb-2 col s12">';
      result +=
        '<a href="#" class="lam-link" onclick="LamCharts.showChart(\'' +
        chart.gid +
        "', " +
        index +
        ')">' +
        '<i class="lam-feature__icon">' +
        LamResources.svgChart16 +
        "</i>" +
        chart.labelTemplate +
        "</a>";
      result += "</div>";
    });
    result += "</div>";
    return result;
  };

  let chartsTemplateButton = function (charts, index) {
    let result = "";
    if (!charts.length) return "";
    charts.map(function (chart) {
      result += '<div class="lam-mb-2 col s12">';
      result +=
        '<a href="#" class="lam-btn lam-btn-small lam-depth-1" onclick="LamCharts.showChart(\'' +
        chart.gid +
        "', " +
        index +
        ')">' +
        '<i class="lam-icon">' +
        LamResources.svgChart16 +
        "</i>" +
        chart.labelTemplate +
        "</a>";
      result += "</div>";
    });

    return result;
  };

  /**
   * Generates the template handlebars code
   * @param {Object} template
   * @param {Object} layer
   */
  let generateTemplate = function (template, layer) {
    //joins the strings if the template is an array
    if (template.templateType === "string") {
      return Array.isArray(template.templateString) ? template.templateString.join("") : template.templateString;
    }
    let str = "";
    switch (template.templateType) {
      case "simple":
        str = getSimpleTemplate(template, layer);
        break;
      case "table":
        str = getTableTemplate(template, layer);
        break;
    }
    return str;
  };

  /**
   * Returns the item's label.
   * @param {Array} props
   * @param {string} labelName Can be a property name or handlebars template
   * @param {string} layerTitle Layer title string
   */
  let getLabelFeature = function (props, labelName, layerTitle) {
    try {
      let label = "";
      if (props[labelName]) {
        label = props[labelName];
        if (layerTitle) {
          label = label === "" ? layerTitle : layerTitle + " - " + label;
        }
      } else {
        //custom template
        let fieldTemplate = Handlebars.compile(labelName);
        label = fieldTemplate(props);
      }
      return label;
    } catch (error) {
      lamDispatch({ eventName: "log", data: "Unable to compute label field " + labelName });
      return "";
    }
  };

  /**
   * Generates the handlebars template for a single feature
   * @param {Object} template
   * @param {Object} layer
   */
  let getSimpleTemplate = function (template, layer) {
    let str = "<div class='lam-grid lam-feature-heading' ><div class='lam-col'>" + template.title + "</div></div>";
    for (let i = 0; i < template.fields.length; i++) {
      str += "<div class='lam-grid lam-mb-1'>";
      let field = template.fields[i];
      switch (field.type) {
        case "int":
          str += "<div class='lam-feature-title lam-col'>" + field.label + ":</div><div class='lam-feature-content lam-col'>{{{" + field.field + "}}}</div>";
          break;
        case "string":
          str += "<div class='lam-feature-title lam-col'>" + field.label + ":</div><div class='lam-feature-content lam-col'>{{{" + field.field + "}}}</div>";
          break;
        case "yesno":
          str +=
            "<div class='lam-feature-title lam-col'>" +
            field.label +
            ":</div><div class='lam-feature-content lam-col'>{{#if " +
            field.field +
            "}}Sì{{else}}No{{/if}}</div>";
          break;
        case "date":
          str +=
            "<div class='lam-feature-title lam-col'>" +
            field.label +
            ":</div><div class='lam-feature-content lam-col'>{{{format_date_string " +
            field.field +
            "}}}</div>";
          break;
        case "datetime":
          str +=
            "<div class='lam-feature-title lam-col'>" +
            field.label +
            ":</div><div class='lam-feature-content lam-col'>{{{format_date_time_string " +
            field.field +
            "}}}</div>";
          break;
        case "date_geoserver":
          str +=
            "<div class='lam-feature-title lam-col'>" +
            field.label +
            ":</div><div class='lam-feature-content lam-col'>{{{format_date_string_geoserver " +
            field.field +
            "}}}</div>";
          break;
        case "file":
          str +=
            "<div class='lam-feature-content lam-col'><a class='lam-link' href='{{{" +
            field.field +
            "}}}' target='_blank'><i class='lam-feature__icon'>" +
            LamResources.svgDownload16 +
            "</i>" +
            field.label +
            "</a></div>";
          break;
        case "file_preview":
          str += "<div class='lam-feature-content lam-col lam-center'>";
          field.field.split(",").forEach(function (element) {
            str += "<a class='lam-link' href='{{{" + element + "}}}' target='_blank'><img class='lam-thumb' src='{{{" + element + "}}}'/></a>";
          });
          str += "</div>";
          break;
        /*  case "moreinfo":
            str +=
              '<tr><td colspan="2"><a href="#" onclick="lamDispatch({ eventName: \'more-info\', gid: \'{{' +
              field.field +
              "}}' , layerGid: '" +
              field.layerGid +
              "', url: '" +
              field.url +
              "' })\">" +
              field.label +
              "</a></td>";
            break;
          */
        case "array":
          str += field.header;
          str += "{{#each " + field.field + "}}";
          str += field.item;
          str += "{{/each}}";
          str += field.footer;
          break;
        case "link":
          str += '<div class="lam-feature-content lam-col">{{{format_url ' + field.field + " '" + field.label + "'}}}</div>";
          break;
        case "phone":
          str += '<div class="lam-feature-content lam-col">{{{phone_link ' + field.field + " }}}</div>";
          break;
        case "email":
          str += '<div class="lam-feature-content lam-col">{{{email_link ' + field.field + " }}}</div>";
          break;
      }
      str += "</div>";
    }
    return str;
  };

  /**
   * Generates the handlebars template for a table
   * @param {Object} template
   * @param {Object} layer
   */
  let getTableTemplate = function (template, layer) {
    let str = "<table class='lam-table'>";
    str += "<tr>";
    for (let i = 0; i < template.fields.length; i++) {
      str += "<th>" + template.fields[i].label + "</th>";
    }
    str += "</tr>";
    str += "{{#each this}}<tr>";
    for (let i = 0; i < template.fields.length; i++) {
      str += "<td>{{" + template.fields[i].field + "}}</td>";
    }
    str += "</tr>{{/each}}";
    str += "</table>";
    return str;
  };

  /**
   * Render te given collection into HTML format
   * @param {Object} featureInfoCollection GeoJson Collection
   */
  let renderInfoFeatures = function (featureInfoCollection, template) {
    let body = "";
    //single feature sent
    if (!featureInfoCollection.features) {
      featureInfoCollection = {
        features: featureInfoCollection,
      };
    }
    LamStore.getAppState().currentInfoItems = featureInfoCollection;
    let index = 0;
    featureInfoCollection.features.forEach(function (feature) {
      let featureTemplate = template;
      let props = feature.properties ? feature.properties : feature;
      //adding the coords as properties
      if (feature.geometry.coordinates) props.lamCoordinates = feature.geometry.coordinates;
      let layer = {};
      if (feature.layerGid) {
        layer = LamStore.getLayer(feature.layerGid);
        if (!featureTemplate) featureTemplate = LamTemplates.getTemplate(feature.layerGid, layer.templateUrl, LamStore.getAppState().templatesRepositoryUrl);
        if (!featureTemplate) {
          featureTemplate = LamTemplates.getTemplateByGeoserverFeatureId(feature.id);
        }
      }

      let tempBody = LamTemplates.processTemplate(featureTemplate, props, layer);
      if (!tempBody) {
        tempBody += LamTemplates.standardTemplate(props, layer);
      }
      //sezione relations
      let layerRelations = LamRelations.getRelations().filter(function (relation) {
        return $.inArray(feature.layerGid, relation.layerGids) >= 0;
      });
      if (layerRelations.length) tempBody += LamTemplates.relationsTemplate(layerRelations, props, index);
      //sezione charts
      let layerCharts = LamCharts.getCharts().filter(function (chart) {
        return $.inArray(feature.layerGid, chart.layerGids) >= 0 && !chart.target;
      });
      if (layerCharts.length) tempBody += LamTemplates.chartsTemplate(layerCharts, index);
      tempBody += LamTemplates.featureIconsTemplate(index);

      body += "<div class='lam-feature lam-depth-1 lam-mb-3'>" + tempBody + "</div>";
      index++;
    });
    return body;
  };

  let renderInfoFeaturesMobile = function (featureInfoCollection) {
    let body = "";
    //single feature sent
    if (!featureInfoCollection.features) {
      featureInfoCollection = {
        features: featureInfoCollection,
      };
    }
    featureInfoCollection.features.forEach(function (feature, index) {
      //let props = feature.properties ? feature.properties : feature;
      //let layer = LamStore.getLayer(feature.layerGid);
      let tempBody = "";
      //let tooltip = LamTemplates.getLabelFeature(feature.properties, layer.labelField, layer.layerName);
      tempBody += "<div class=' lam-bottom-info__content-item'>";
      tempBody += feature.tooltip;
      tempBody += LamTemplates.featureIconsTemplate(index);
      tempBody += "</div>";
      body += tempBody;
      index++;
    });
    return body;
  };

  let getTemplateMetadata = function () {
    return Handlebars.compile("{{ABSTRACT}}");
  };

  var getTemplateEmpty = function (results) {
    var template = "<p></p>";
    return Handlebars.compile(template);
  };

  var getResultEmpty = function (results) {
    var template = "<p>Nessun risultato disponibile</p>";
    return Handlebars.compile(template);
  };

  var getInfoResultEmpty = function (results) {
    var template = "<p>Nessun risultato disponibile nella posizione selezionata</p>";
    return Handlebars.compile(template);
  };

  return {
    init: init,
    generateTemplate: generateTemplate,
    getLabelFeature: getLabelFeature,
    getInfoResultEmpty: getInfoResultEmpty,
    getResultEmpty: getResultEmpty,
    getTemplate: getTemplate,
    getTemplateByGeoserverFeatureId: getTemplateByGeoserverFeatureId,
    getTableTemplate: getTableTemplate,
    getTemplates: getTemplates,
    getTemplateMetadata: getTemplateMetadata,
    getTemplateUrl: getTemplateUrl,
    getTemplateEmpty: getTemplateEmpty,
    featureIconsTemplate: featureIconsTemplate,
    loadTemplateAjax: loadTemplateAjax,
    loadRelationsTemplates: loadRelationsTemplates,
    processTemplate: processTemplate,
    relationsTemplate: relationsTemplate,
    chartsTemplate: chartsTemplate,
    chartsTemplateButton: chartsTemplateButton,
    renderInfoFeatures: renderInfoFeatures,
    renderInfoFeaturesMobile: renderInfoFeaturesMobile,
    standardTemplate: standardTemplate,
    standardTableTemplate: standardTableTemplate,
  };
})();
