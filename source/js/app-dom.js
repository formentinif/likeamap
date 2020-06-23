var LamDom = (function () {
  var init = function init() {
    //events binding
    LamDispatcher.bind("hide-info-window", function (payload) {
      LamDom.hideInfoWindow();
    });

    LamDispatcher.bind("hide-loader", function (payload) {
      LamDom.toggleLoader(false);
    });

    LamDispatcher.bind("show-loader", function (payload) {
      LamDom.toggleLoader(true);
    });

    LamDispatcher.bind("show-bottom-info", function (payload) {
      $("#bottom-info").show();
    });

    LamDispatcher.bind("hide-bottom-info", function (payload) {
      $("#bottom-info").hide();
    });
  };

  let hideInfoWindow = function () {
    $("#info-window").hide();
  };

  /**
   * Sets the loader visibility
   * @param {boolean} visibility
   */
  let toggleLoader = function (visibility) {
    if (visibility) {
      $("#app-loader").removeClass("lam-hidden");
    } else {
      $("#app-loader").addClass("lam-hidden");
    }
  };

  var showAppTools = function () {
    var modules = LamStore.getAppState().modules;
    if (modules) {
      setvisibility("#menu-toolbar__layer-tree", modules["layer-tree"]);
      setvisibility("#menu-toolbar__search-tools", modules["search-tools"]);
      setvisibility("#menu-toolbar__print-tools", modules["print-tools"]);
      setvisibility("#menu-toolbar__share-tools", modules["share-tools"]);
      setvisibility("#menu-toolbar__map-tools", modules["map-tools"]);
      setvisibility("#menu-toolbar__draw-tools", modules["draw-tools"]);
      setvisibility("#menu-toolbar__gps-tools", modules["gps-tools"]);
      if (modules["links-tools"]) setvisibility("#menu-toolbar__links-tools", modules["links-tools"]);
      if (modules["legend-tools"]) setvisibility("#menu-toolbar__legend-tools", modules["legend-tools"]);
    }
  };

  var isMobile = function () {
    return /Mobi/.test(navigator.userAgent);
  };

  /**
   * Dragging helper
   * @param {Object} elmnt
   */
  var dragElement = function (elmnt) {
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

  let showContent = function (contentMode, title, htmlMain, htmlBottomInfo, toolBarItem, elementId) {
    if (!elementId) elementId = "info-results";
    if (!htmlBottomInfo) htmlBottomInfo = htmlMain;
    if (!toolBarItem) toolBarItem = "info-results";
    let htmlTitle = $("<h4 id='" + elementId + "__title'></h4>")
      .addClass("lam-title")
      .html(title);
    let htmlContent = $("<div id='" + elementId + "__content'></div>")
      .addClass("lam-scroll-padding")
      .html(htmlMain);
    switch (contentMode) {
      case 1: //LeftPanel
        $("#" + elementId + "")
          .html("")
          .append(htmlTitle)
          .append(htmlContent)
          .show();
        LamToolbar.toggleToolbarItem(toolBarItem, true);
        LamDispatcher.dispatch("hide-info-window");
        //LamDispatcher.dispatch("show-menu");
        $("#bottom-info").hide();
        break;
      case 2: //BottomInfo
        if (!elementId) elementId = "info-results";
        $("#" + elementId + "")
          .html("")
          .append(htmlTitle)
          .append(htmlContent)
          .show();
        $("#bottom-info__title-text").html(title);
        $("#bottom-info__content").html(htmlBottomInfo);
        LamToolbar.toggleToolbarItem(toolBarItem, false);
        LamDispatcher.dispatch("hide-info-window");
        LamDispatcher.dispatch("hide-menu");
        $("#bottom-info").show();
        break;
      case 3: //InfoWindow
        //if (!elementId)
        elementId = "info-window";
        LamDispatcher.dispatch("hide-menu");
        $("#bottom-info").hide();
        $("#" + elementId + "__content").html(htmlMain);
        $("#" + elementId + "__title").html(title);
        $("#" + elementId + "").show();
        break;
    }
  };

  /**
   * Wrapper for hide/show jquery
   */
  let setvisibility = function (element, status) {
    if (status) {
      $(element).show();
    } else {
      $(element).hide();
    }
  };

  return {
    dragElement: dragElement,
    init: init,
    isMobile: isMobile,
    hideInfoWindow: hideInfoWindow,
    setvisibility: setvisibility,
    showAppTools: showAppTools,
    showContent: showContent,
    toggleLoader: toggleLoader,
  };
})();
