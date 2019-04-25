/*
Copyright 2015-2017 Perspectiva di Formentini Filippo

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Copyright 2015-2017 Perspectiva di Formentini Filippo
Concesso in licenza secondo i termini della Licenza Apache, versione 2.0 (la "Licenza"); è proibito usare questo file se non in conformità alla Licenza. Una copia della Licenza è disponibile all'indirizzo:

http://www.apache.org/licenses/LICENSE-2.0

Se non richiesto dalla legislazione vigente o concordato per iscritto,
il software distribuito nei termini della Licenza è distribuito
"COSÌ COM'È", SENZA GARANZIE O CONDIZIONI DI ALCUN TIPO, esplicite o implicite.
Consultare la Licenza per il testo specifico che regola le autorizzazioni e le limitazioni previste dalla medesima.

*/

var AppTemplates = (function() {
  var templates = [];

  var init = function init() {
    //Ciclo i livelli che non hanno un template
    var tempLayers = AppStore.getAppState().layers;
    const repoTemplatesUrl = AppStore.getAppState().templatesRepositoryUrl;
    for (var i = 0; i < tempLayers.length; i++) {
      var groupLayer = tempLayers[i];
      if (groupLayer.layers) {
        for (var li = 0; li < groupLayer.layers.length; li++) {
          //il layer deve essere selezionabile
          if (groupLayer.layers[li].layer && groupLayer.layers[li].queryable) {
            var found = false;
            for (var ti = 0; ti < templates.length; ti++) {
              if (templates[ti].layer == groupLayer.layers[li].layer) {
                found = true;
                break;
              }
            }
            if (!found) {
              //aggiungo il layer vi ajax
              let urlTemplate = getTemplateUri(groupLayer.layers[li], repoTemplatesUrl);
              $.ajax({
                dataType: "json",
                url: urlTemplate
              })
                .done(function(data) {
                  if (data) {
                    if (data.length) {
                      for (var i = 0; i < data.length; i++) {
                        templates.push(data[i]);
                      }
                    } else {
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
            }
          }
        }
      }
    }
  };

  /**
   * @param {object} layer Oggetto del layer
   * @param {string} repoUrl Url del repository
   */
  var getTemplateUri = function(layer, repoUrl) {
    if (layer && layer.templateUri) {
      if (layer.templateUri.toLowerCase().includes("http")) {
        return layer.templateUri;
      } else {
        return repoTemplatesUrl + "/" + layer.templateUri;
      }
    }
    return repoUrl + "/" + layer.gid + ".json";
  };

  var processTemplate = function(layer, layerGid, props) {
    var result = "";
    for (var i = 0; i < AppTemplates.templates.length; i++) {
      if (AppTemplates.templates[i].layer === layer || AppTemplates.templates[i].layerGid === layerGid) {
        try {
          var hsTemplate = this.generateTemplate(AppTemplates.templates[i]);
          var template = Handlebars.compile(hsTemplate);
          if (Array.isArray(props)) {
            result = template(props[0]);
          } else {
            result = template(props);
          }
          break;
        } catch (e) {
          break;
        }
      }
    }
    return result;
  };

  var standardTemplate = function(props) {
    var body = "<table>";
    for (var propertyName in props) {
      body += "<tr><td>" + propertyName + ":</td><td>" + props[propertyName] + "</td></tr>";
    }
    body += "</table>";
    return body;
  };

  var generateTemplate = function(template) {
    if (template.templateType === "string") {
      return template.templateString;
    }
    var str = "";
    if (template.templateType === "simple") {
      str += "<div class='al-h6'>" + template.title + "</div>";
      str += "<table class='al-table'>";
      for (var i = 0; i < template.fields.length; i++) {
        var field = template.fields[i];
        switch (field.type) {
          case "int":
            str += "<tr><td class='al-strong'>" + field.label + "</td><td>{{{" + field.field + "}}}</td></tr>";
            break;
          case "string":
            str += "<tr><td class='al-strong'>" + field.label + "</td><td>{{{" + field.field + "}}}</td></tr>";
            break;
          case "yesno":
            str += "<tr><td class='al-strong'>" + field.label + "</td>";
            str += "<td>{{#if " + field.field + "}}Sì{{else}}No{{/if}}</td></tr>";
            break;
          case "moreinfo":
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
            break;
        }
      }
      str += "</table>";
    }
    return str;
  };

  return {
    init: init,
    generateTemplate: generateTemplate,
    processTemplate: processTemplate,
    standardTemplate: standardTemplate,
    templates: templates
  };
})();
