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

let AppTemplates = (function() {
  let templates = [];

  let init = function init() {
    //Ciclo i livelli che non hanno un template
    let tempLayers = AppStore.getAppState().layers;
    const repoTemplatesUrl = AppStore.getAppState().templatesRepositoryUrl;
    const tempRelations = AppStore.getAppState().relations;
    loadLayersTemplates(tempLayers, repoTemplatesUrl);
    loadRelationsTemplates(tempRelations, repoTemplatesUrl);
  };

  let loadLayersTemplates = function(tempLayers, repoTemplatesUrl) {
    for (let i = 0; i < tempLayers.length; i++) {
      let groupLayer = tempLayers[i];
      if (groupLayer.layers) {
        for (let li = 0; li < groupLayer.layers.length; li++) {
          //il layer deve essere selezionabile
          if (!groupLayer.layers[li].layer || !groupLayer.layers[li].queryable) {
            continue;
          }
          let templateUrl = getTemplateUrl(
            groupLayer.layers[li].gid,
            groupLayer.layers[li].templateUrl,
            repoTemplatesUrl
          );
          let template = templates.filter(function(el) {
            return el.templateUrl === templateUrl;
          });
          if (template.length === 0) {
            //aggiungo il layer vi ajax
            loadTemplateAjax(templateUrl);
          }
        }
      }
    }
  };

  let loadRelationsTemplates = function(tempRelations, repoTemplatesUrl) {
    for (let i = 0; i < tempRelations.length; i++) {
      const relation = tempRelations[i];
      let templateUrl = getTemplateUrl(relation.gid, relation.templateUrl, repoTemplatesUrl);
      let template = templates.filter(function(el) {
        return el.templateUrl === templateUrl;
      });
      if (!template.length) {
        //aggiungo il layer vi ajax
        loadTemplateAjax(templateUrl);
      }
    }
  };

  let loadTemplateAjax = function(templateUrl) {
    $.ajax({
      dataType: "json",
      url: templateUrl
    })
      .done(function(data) {
        if (data) {
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
              let thisTemplate = data[i];
              thisTemplate.templateUrl = templateUrl;
              templates.push(thisTemplate);
            }
          } else {
            data.templateUrl = templateUrl;
            templates.push(data);
          }
        }
      })
      .fail(function(data) {
        dispatch({
          eventName: "log",
          message: "AppStore: Unable to load template"
        });
      });
  };

  /**
   * Gets the uri of the template to be loaded by ajax
   * @param {object} layer Oggetto del layer/relation
   * @param {string} repoUrl Url del repository
   */
  let getTemplateUrl = function(gid, templateUrl, repoUrl) {
    if (templateUrl) {
      if (templateUrl.toLowerCase().includes("http://")) {
        return templateUrl;
      } else {
        return repoUrl + "/" + templateUrl;
      }
    }
    return repoUrl + "/" + gid + ".json";
  };

  let getTemplate = function(gid, templateUrl, repoUrl) {
    let templatesFilter = templates.filter(function(el) {
      return el.templateUrl === getTemplateUrl(gid, templateUrl, repoUrl);
    });
    if (templatesFilter.length > 0) {
      return templatesFilter[0];
    }
    return null;
  };

  let processTemplate = function(template, props, layer) {
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
        dispatch({
          eventName: "log",
          message: e
        });
      }
    }
    return result;
  };

  let standardTemplate = function(props, layer) {
    let body = "";
    if (layer) {
      body += "<div class='row lam-feature-heading' ><div class='col s12'>" + layer.layerName;
      if (layer.labelField) {
        body += " - " + getLabelFeature(props, layer.labelField);
      }
      body += "</div></div>";
    }
    for (let propertyName in props) {
      body +=
        "<div class='lam-feature-row row lam-mb-1'>" +
        "<div class='lam-feature-title col s6'>" +
        propertyName +
        ":</div>" +
        "<div class='lam-feature-content col s6'>" +
        (props[propertyName] == null ? "" : props[propertyName]) +
        "</div>" +
        "</div>";
    }
    body += "";
    return body;
  };

  let featureIconsTemplate = function(index) {
    //icons
    let icons =
      "<div class='lam-feature__icons'>" +
      '<i title="Centra sulla mappa" class="fas fa-map-marker-alt fa-lg lam-feature__icon" onclick="Dispatcher.dispatch({ eventName: \'zoom-info-feature\', index: \'' +
      index +
      "' })\"></i>";
    let feature = AppStore.getCurrentInfoItem(index);
    let centroid = AppMap.getLabelPoint(feature.geometry.coordinates);
    let geometryOl = AppMap.convertGeometryToOl(
      {
        coordinates: centroid,
        type: "Point",
        srid: 3857
      },
      AppMapEnums.geometryFormats().GeoJson
    );
    centroid = AppMap.transformGeometrySrid(geometryOl, 3857, 4326);
    icons +=
      //"<a target='_blank' href='https://www.google.com/maps/@?api=1&map_action=map&center=" +
      "<a target='_blank' href='https://www.google.com/maps/search/?api=1&query=" +
      centroid.flatCoordinates[1] +
      "," +
      centroid.flatCoordinates[0] +
      "&'><i title='Apri in Google' class='fab fa-google fa-lg lam-feature__icon'></i></a>";
    //https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=48.857832,2.295226&heading=-45&pitch=38&fov=80
    icons +=
      //"<a target='_blank' href='https://www.google.com/maps/@?api=1&map_action=map&center=" +
      "<a target='_blank' href='https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" +
      centroid.flatCoordinates[1] +
      "," +
      centroid.flatCoordinates[0] +
      "&'><i title='Apri in Google' class='fas fa-street-view fa-lg lam-feature__icon'></i></a>";
    icons += "</div>";
    return icons;
  };

  let relationsTemplate = function(relations, props, index) {
    let result = "";
    if (relations.length > 0) {
      result += '<div class="">';
      relations.map(function(relation) {
        result += '<div class="lam-mb-2 col s12">';
        result +=
          '<a href="#" onclick="AppStore.showRelation(\'' +
          relation.gid +
          "', " +
          index +
          ')">' +
          relation.labelTemplate +
          "</option>"; //' + relation.gid + ' //relation.labelTemplate
        result += "</div>";
      });
      result += "</div>";
    }
    return result;
  };

  let generateTemplate = function(template, layer) {
    if (template.templateType === "string") {
      return template.templateString;
    }
    let str = "";
    if (template.templateType === "simple") {
      str += "<div class='lam-h6'>" + template.title + "</div>";
      str += "<table class='lam-table lam-mb-3'>";
      for (let i = 0; i < template.fields.length; i++) {
        let field = template.fields[i];
        switch (field.type) {
          case "int":
            str += "<tr><td class='lam-strong'>" + field.label + "</td><td>{{{" + field.field + "}}}</td></tr>";
            break;
          case "string":
            str += "<tr><td class='lam-strong'>" + field.label + "</td><td>{{{" + field.field + "}}}</td></tr>";
            break;
          case "yesno":
            str += "<tr><td class='lam-strong'>" + field.label + "</td>";
            str += "<td>{{#if " + field.field + "}}Sì{{else}}No{{/if}}</td></tr>";
            break;
          /*  case "moreinfo":
            str +=
              '<tr><td colspan="2"><a href="#" onclick="dispatch({ eventName: \'more-info\', gid: \'{{' +
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
            str += '<tr><td colspan="2"><a href="{{' + field.field + '}}" target="_blank">' + field.label + "</a></td>";
            break;
        }
      }
      str += "</table>";
    }
    return str;
  };

  let getLabelFeature = function(props, labelName, layerTitle) {
    try {
      let label = props[labelName];
      if (layerTitle) {
        label = layerTitle + " - " + label;
      }
      return label;
    } catch (error) {
      dispatch({ eventName: "log", data: "Unable to compute label field " + labelName });
    }
  };

  /**
   * Render te given collection into HTML format
   * @param {Object} featureInfoCollection GeoJson Collection
   */
  let renderInfoFeatures = function(featureInfoCollection) {
    let body = "";
    //single feature sent
    if (!featureInfoCollection.features) {
      featureInfoCollection = {
        features: featureInfoCollection
      };
    }
    AppStore.getAppState().currentInfoItems = featureInfoCollection;
    let index = 0;
    featureInfoCollection.features.forEach(function(feature) {
      let props = feature.properties ? feature.properties : feature;
      let layer = AppStore.getLayer(feature.layerGid);
      let template = AppTemplates.getTemplate(
        feature.layerGid,
        layer.templateUrl,
        AppStore.getAppState().templatesRepositoryUrl
      );
      let tempBody = AppTemplates.processTemplate(template, props, layer);
      if (!tempBody) {
        tempBody += AppTemplates.standardTemplate(props, layer);
      }
      //sezione relations
      let layerRelations = AppStore.getRelations().filter(function(relation) {
        return $.inArray(feature.layerGid, relation.layerGids) >= 0;
      });
      tempBody += AppTemplates.relationsTemplate(layerRelations, props, index);
      tempBody += AppTemplates.featureIconsTemplate(index);

      body += "<div class='lam-feature z-depth-1 lam-mb-3'>" + tempBody + "</div>";
      index++;
    });
    return body;
  };

  let renderInfoFeaturesMobile = function(featureInfoCollection) {
    let body = "";
    //single feature sent
    if (!featureInfoCollection.features) {
      featureInfoCollection = {
        features: featureInfoCollection
      };
    }

    let index = 0;
    featureInfoCollection.features.forEach(function(feature) {
      let props = feature.properties ? feature.properties : feature;
      let layer = AppStore.getLayer(feature.layerGid);
      let tempBody = "";
      let tooltip = AppTemplates.getLabelFeature(feature.properties, layer.labelField, layer.layerName);
      tempBody += "<div class='z-depth-2 lam-info-tooltip__content'>";
      tempBody += "<div class='row'>";
      tempBody += "<div class='col-12'>";
      tempBody += tooltip;
      tempBody += "</div>";
      tempBody += "<div class='col-12'>";
      tempBody +=
        '<button class="btn-floating btn-small waves-effect waves-light lam-button lam-info-expander" alt="Apri dettagli" title="Apri dettagli" onclick="Dispatcher.dispatch(\'show-mobile-info-results\')">';
      tempBody += "<i class='fas fa-chevron-up'></i>";
      tempBody += "</button>";
      tempBody += "</div>";
      tempBody += "</div>";
      tempBody += "</div>";
      body += tempBody;
      index++;
    });
    return body;
  };

  return {
    init: init,
    generateTemplate: generateTemplate,
    getLabelFeature: getLabelFeature,
    getTemplate: getTemplate,
    getTemplateUrl: getTemplateUrl,
    featureIconsTemplate: featureIconsTemplate,
    processTemplate: processTemplate,
    relationsTemplate: relationsTemplate,
    renderInfoFeatures: renderInfoFeatures,
    renderInfoFeaturesMobile: renderInfoFeaturesMobile,
    standardTemplate: standardTemplate,
    templates: templates
  };
})();
