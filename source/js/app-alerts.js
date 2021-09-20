var LamAlerts = (function () {
  let autoincrement = 0;
  let containerId = "lam-alerts-container";
  let init = function () {
    var container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
  };

  let showMessage = function (title, text, level, options) {
    let container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);

    var lamAlert = document.createElement("div");
    lamAlert.id = ++autoincrement;
    lamAlert.id = "lam-alert-" + lamAlert.id;
    lamAlert.className = "lam-alert";

    if (title) {
      var h4 = document.createElement("h4");
      h4.className = "lam-alert-title";
      h4.innerHTML = title;
      lamAlert.appendChild(h4);
    }

    if (text) {
      var p = document.createElement("p");
      p.className = "lam-alert-text";
      p.innerHTML = text;
      lamAlert.appendChild(p);
    }

    lamAlert.hide = function () {
      lamAlert.className += " lam-alert-fade-out";
      lamAlert.addEventListener("animationend", remove, false);
    };

    function remove() {
      document.getElementById(containerId).removeChild(lamAlert);
    }

    if (level) {
      lamAlert.className += " lam-alert-" + level;
    }

    if (options) {
      if (options.icon) {
        var img = document.createElement("img");
        img.src = options.icon;
        img.className = "lam-alert-icon";
        lamAlert.appendChild(img);
      }
      if (typeof options.callback === "function") {
        lamAlert.addEventListener("click", options.callback);
      }
      if (options.timeout) {
        setTimeout(lamAlert.hide, options.timeout);
      }
    }

    lamAlert.addEventListener("click", remove);
    document.getElementById(containerId).appendChild(lamAlert);
    return lamAlert;
  };

  function hideMessage(alertId) {
    document.getElementById(containerId).removeChild(document.getElementById(alertId));
  }

  return {
    init: init,
    showMessage: showMessage,
    hideMessage: hideMessage,
  };
})();
