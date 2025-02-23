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

var LamAuthTools = (function() {
  var isRendered = false;
  var divName = "";
  var init = function init() {};

  var render = function(div) {
    divName = div;
    jQuery("#" + div).removeClass("lam-hidden");
    if (!isRendered) {
      init();
    }
    var templateTemp = templateLogin();
    var output = templateTemp();
    jQuery("#" + div).html(output);
    //forzo che il contenuto non sia visualizzato
    isRendered = true;
  };

  var templateLogin = function() {
    template = "";
    //pannello ricerca via

    template += '<div id="login-container__access" class="login-container__access">';
    template += '    <form action="#">';
    template += "        <h2>Accedi</h2>";
    template += '      <div class="input-field">';
    template += '        <input class="" type="text" id="login-container__username">';
    template += '        <label class="" for="login-container__username">username</label>';
    template += "    </div>";
    template += '    <div class="input-field">';
    template += '        <input class="" type="password" id="login-container__password">';
    template += '        <label class="" for="login-container__password">password</label>';
    template += "    </div>";
    template += '    <div id="lam-error-message" class="lam-hidden lam-error-login">Autenticazione non riuscita</div>';

    template += '  <button onclick="LamAuthTools.login();return false" class="lam-btn">Accedi</button>';
    template += "  </form>";
    template += "</div>";

    return Handlebars.compile(template);
  };

  var login = function() {
    lamDispatch({
      eventName: "do-login",
      username: $("#login-container__username").val(),
      password: $("#login-container__password").val()
    });
  };

  var hideLogin = function() {
    $("#" + divName).hide();
  };

  var showError = function() {
    $("#lam-error-message").show();
  };

  return {
    login: login,
    init: init,
    hideLogin: hideLogin,
    render: render,
    showError: showError,
    templateLogin: templateLogin
  };
})();
