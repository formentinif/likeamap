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

var AuthTools = (function() {
  var isRendered = false;
  var divName = "";
  var init = function init() {

  }

  var render = function(div) {
    divName = div;
    jQuery("#" + div).removeClass("al-hidden");
    if (!isRendered) {
      init();
    }
    var templateTemp = templateLogin();
    var output = templateTemp();
    jQuery("#" + div).html(output);
    //forzo che il contenuto non sia visualizzato
    isRendered = true;
  }

  var templateLogin = function() {
    template = '';
    //pannello ricerca via

    template += '<div id="login-container__access">';
    template += '    <form action="#">';
    template += '        <h2>Accedi</h2>';
    template += '      <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">';
    template += '        <input class="mdl-textfield__input" type="text" id="login-container__username">';
    template += '        <label class="mdl-textfield__label" for="login-container__username">username</label>';
    template += '    </div>';
    template += '    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">';
    template += '        <input class="mdl-textfield__input" type="password" id="login-container__password">';
    template += '        <label class="mdl-textfield__label" for="login-container__password">password</label>';
    template += '    </div>';
    template += '    <div id="al-error-message" class="al-hidden al-error">Autenticazione non riuscita</div>';

    //template += '    <div class="mdl-textfield mdl-js-textfield">';
    //template += '        <select id="login-container__role" class="mdl-textfield__input">';
    //template += '            <option value="1">Consultazione</option>';
    //template += '            <option value="2">Progettazione</option>';
    //template += '      </select>';
    //template += '  </div>';
    template += '  <button onclick="AuthTools.login();return false" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">Accedi</button>';
    template += '  </form>';
    template += '</div>';

    return Handlebars.compile(template);

  }


  var templateEmpty = function(results) {
    var template = '<p></p>';
    return Handlebars.compile(template);
  }

  var login = function() {
    //if($("#login-container__role").val() == "2"){
    //  window.location.replace("/www");
    //}
    dispatch({
      eventName: "do-login",
      username: $("#login-container__username").val(),
      password: $("#login-container__password").val()
    });
  }

  var hideLogin = function() {
    $('#' + divName).hide();
  }

  var showError = function() {
    $("#al-error-message").show();
  }

  return {
    login: login,
    init: init,
    hideLogin: hideLogin,
    render: render,
    showError: showError,
    templateLogin: templateLogin,
  };

}());
