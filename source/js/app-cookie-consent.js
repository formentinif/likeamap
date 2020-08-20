var LamCookieConsent = (function () {
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

  function setCookieConsent(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function getCookieConsent(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  function eraseCookieConsent(name) {
    setCookieDescription(cookieName, "0", 7);
  }

  function cookieConsent() {
    if (!getCookieConsent("lamCookieDismiss")) {
      document.body.innerHTML +=
        '<div class="lamConsentContainer" id="lamConsentContainer"><div class="cookieTitle"><a>' +
        LamStore.getAppState().cookieConsent.cookieTitle +
        '</a></div><div class="cookieDesc"><p>' +
        LamStore.getAppState().cookieConsent.cookieDesc +
        " " +
        LamStore.getAppState().cookieConsent.cookieLink +
        '</p></div><div class="cookieButton"><a onClick="LamCookieConsent.lamCookieDismiss();">' +
        LamStore.getAppState().cookieConsent.cookieButton +
        "</a></div></div>";
      lamCookieFadeIn("lamConsentContainer");
    }
  }

  function lamCookieDismiss() {
    setCookieConsent("lamCookieDismiss", "1", 7);
    lamCookieFadeOut("lamConsentContainer");
  }

  // window.onload = function () {
  //   cookieConsent();
  // };

  return {
    lamCookieDismiss: lamCookieDismiss,
    cookieConsent: cookieConsent,
  };
})();
