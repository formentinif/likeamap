var LamDom = (function() {
  var init = function init() {
    //events binding
    LamDispatcher.bind("hide-info-window", function(payload) {
      LamDom.hideInfoWindow();
    });

    LamDispatcher.bind("hide-loader", function(payload) {
      LamDom.toggleLoader(false);
    });

    LamDispatcher.bind("show-loader", function(payload) {
      LamDom.toggleLoader(true);
    });
  };

  let hideInfoWindow = function() {
    $("#info-window").hide();
  };

  let toggleLoader = function(visibility) {
    if (visibility) {
      $("#app-loader").removeClass("lam-hidden");
    } else {
      $("#app-loader").addClass("lam-hidden");
    }
  };

  var showAppTools = function() {
    var modules = LamStore.getAppState().modules;
    if (modules) {
      $("#menu-toolbar__layer-tree").toggle(modules["lam-layer-tree"]);
      $("#menu-toolbar__search-tools").toggle(modules["search-tools"]);
      $("#menu-toolbar__print-tools").toggle(modules["print-tools"]);
      $("#menu-toolbar__share-tools").toggle(modules["share-tools"]);
      $("#menu-toolbar__map-tools").toggle(modules["map-tools"]);
      $("#menu-toolbar__draw-tools").toggle(modules["draw-tools"]);
      $("#menu-toolbar__gps-tools").toggle(modules["gps-tools"]);
      if (modules["links-tools"]) $("#menu-toolbar__links-tools").toggle(modules["links-tools"]);
      if (modules["legend-tools"]) $("#menu-toolbar__legend-tools").toggle(modules["legend-tools"]);
    }
  };

  var isMobile = function() {
    return /Mobi/.test(navigator.userAgent);
  };

  /**
   * Dragging helper
   * @param {Object} elmnt
   */
  var dragElement = function(elmnt) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(elmnt.id + "__resize")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "__resize").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  };

  let showContent = function(title, body, bodyMobile, htmlElement) {
    if (!htmlElement) htmlElement = "info-results";
    if (!bodyMobile) bodyMobile = body;
    $("#" + htmlElement + "__content").html(body);
    $("#" + htmlElement + "__title").html(title);
    $("#" + htmlElement + "").show();
    if (!LamDom.isMobile()) {
      LamToolbar.toggleToolbarItem(htmlElement, true);
    } else {
      $("#info-tooltip").show();
      $("#info-tooltip").html(bodyMobile);
    }
  };

  let showContentInfoWindow = function(title, body, bodyMobile, htmlElement) {
    if (!htmlElement) htmlElement = "info-window";
    if (!bodyMobile) bodyMobile = body;
    $("#" + htmlElement + "__content").html(body);
    $("#" + htmlElement + "__title").html(title);
    $("#" + htmlElement + "").show();
  };

  return {
    dragElement: dragElement,
    init: init,
    isMobile: isMobile,
    hideInfoWindow: hideInfoWindow,
    showAppTools: showAppTools,
    showContent: showContent,
    showContentInfoWindow: showContentInfoWindow,
    toggleLoader: toggleLoader
  };
})();
