var LamCookieDescription = (function () {
  let cookieName = "lamCookieDescriptionDismiss";

  var init = function init() {
    //events binding
    LamDispatcher.bind("show-lam-description", function (payload) {
      if (LamStore.getAppState().description) {
        LamCookieDescription.eraseCookieDescription();
        LamCookieDescription.cookieDescription();
      }
    });
  };

  function lamCookieFadeIn(elem, display) {
    var el = document.getElementById(elem);
    var ease = 1; //0.02 for fading
    el.style.opacity = 0;
    el.style.display = display || "block";

    (function fade() {
      var val = parseFloat(el.style.opacity);
      if (!((val += ease) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }
  function lamCookieFadeOut(elem) {
    var el = document.getElementById(elem);
    el.style.opacity = 1;

    (function fade() {
      if ((el.style.opacity -= 0.02) < 0) {
        el.style.display = "none";
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }

  function setCookieDescription(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function getCookieDescription(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  function eraseCookieDescription() {
    setCookieDescription(cookieName, "0", 7);
  }

  function cookieDescription() {
    if (getCookieDescription(cookieName) && getCookieDescription(cookieName) != "1") {
      $("<div>", {
        id: "lamDescriptionContainer",
        class: "lamDescriptionContainer",
      }).appendTo("body");

      $("#lamDescriptionContainer").html(
        '<div class="cookieTitle"><a>' +
          LamStore.getAppState().title +
          '</a></div><div class="cookieDesc"><p>' +
          LamStore.getAppState().description +
          " " +
          '<div class="cookieButton"><a onClick="LamCookieDescription.lamCookieDescriptionDismiss();">' +
          "Chiudi" +
          "</a></div>"
      );
      lamCookieFadeIn("lamDescriptionContainer");
    }
  }

  function lamCookieDescriptionDismiss() {
    setCookieDescription(cookieName, "1", 7);
    lamCookieFadeOut("lamDescriptionContainer");
  }

  // window.onload = function () {
  //   cookieDescription();
  // };

  return {
    init: init,
    lamCookieDescriptionDismiss: lamCookieDescriptionDismiss,
    cookieDescription: cookieDescription,
    setCookieDescription: setCookieDescription,
    eraseCookieDescription: eraseCookieDescription,
  };
})();
