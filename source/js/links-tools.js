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

let LamLinksTools = (function() {
  let isRendered = false;

  let init = function init() {
    //events binding
    LamDispatcher.bind("show-links", function(payload) {
      let templateTemp = templateLink();
      let output = "<ul class='lam-group-list lam-no-padding'>";
      LamStore.getLinks().forEach(function(link) {
        output += "<li>";
        if (link.links && link.links.length) {
          //is grouped
          output += renderGroupLink(link);
        } else {
          output += templateTemp(link);
        }
        output += "</li>";
      });
      output += "</ul>";
      if (LamStore.getAppState().openLinksInInfoWindow) {
        LamDom.showContent(LamEnums.showContentMode().InfoWindow, "Links", output);
      } else {
        LamDom.showContent(LamEnums.showContentMode().LeftPanel, "Links", output);
      }
    });

    //terms links load

    let templateTerms = templateTermsLinks();
    output = templateTerms(LamStore.getTermsLinks());
    $("#app-terms-links").html(output);
  };

  let render = function(div) {
    if (!isRendered) {
      init();
    }
    isRendered = true;
  };

  let renderGroupLink = function(link) {
    let templateTemp = templateLink();
    let output = "";
    if (link.title) {
      output += "<h5 class='lam-group-list__sub-title'>";
      if (link.url) {
        output += "<a class='lam-link' href='" + link.url + "'>" + link.title + "</a>";
      } else {
        output += link.title;
      }
      output += "</h5>";
    }
    output += "<ul class='lam-group-list'>";
    link.links.forEach(function(subLink) {
      output += "<li>";
      if (subLink.links && subLink.links.length) {
        //is grouped
        output += renderGroupLink(subLink);
      } else {
        output += templateTemp(subLink);
      }
      output += "</li>";
    });
    output += "</ul>";
    return output;
  };

  let templateLink = function() {
    let template = "<a class='lam-link' href='{{url}}' target='_blank'>{{title}} <i class='lam-feature__icon'>" + LamResources.svgOpen16 + "</i></a>";
    return Handlebars.compile(template);
  };

  let templateTermsLinks = function() {
    //pannello ricerca via
    let template = "{{#each this}}";
    template += "<a class='lam-link' href='{{url}}' target='_blank'>{{title}}</a>";
    template += "{{/each}}";

    return Handlebars.compile(template);
  };

  return {
    init: init,
    render: render,
    templateLink: templateLink,
    templateTermsLinks: templateTermsLinks
  };
})();
