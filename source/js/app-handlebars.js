let LamHandlebars = (function () {
  let init = function init() {
    registerHandlebarsHelpers();
  };

  let registerHandlebarsHelpers = function () {
    Handlebars.registerHelper("ifequals", function (a, b, options) {
      if (a == b) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    Handlebars.registerHelper("ifnotequals", function (a, b, options) {
      if (a != b) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    Handlebars.registerHelper("get_point_x", function (options) {
      try {
        return options.data.root.lamCoordinates[0];
      } catch (error) {
        return "";
      }
    });

    Handlebars.registerHelper("get_point_y", function (options) {
      try {
        return options.data.root.lamCoordinates[1];
      } catch (error) {
        return "";
      }
    });

    Handlebars.registerHelper("get_coordinate_x", function (index, options) {
      try {
        if (index === "undefined") return options.data.lamCoordinates[0];
        return options.data.root.lamCoordinates[index][0];
      } catch (error) {
        return "";
      }
    });

    Handlebars.registerHelper("get_coordinate_y", function (index, options) {
      try {
        if (index === "undefined") return options.data.lamCoordinates[1];
        return options.data.root.lamCoordinates[index][1];
      } catch (error) {
        return "";
      }
    });

    Handlebars.registerHelper("format_url", function (url, label) {
      try {
        if (!url) return "";
        if (url.indexOf("http") !== 0) url = "https://" + url;
        return "<a href='" + url + "' target='_blank'>" + label + "</a>";
      } catch (error) {
        return "";
      }
    });

    Handlebars.registerHelper("phone_link", function (phone) {
      try {
        if (!phone) return "";
        return "<i class='lam-icon-primary lam-icon-info lam-mr-1'>" + LamResources.svgPhone16 + "</i>" + "<a href='tel:" + phone + "'>" + phone + "</a>";
      } catch (error) {
        return "";
      }
    });

    Handlebars.registerHelper("email_link", function (email) {
      try {
        if (!email) return "";
        return "<i class='lam-icon-primary lam-icon-info lam-mr-1'>" + LamResources.svgMail16 + "</i>" + "<a href='mailto:" + email + "'>" + email + "</a>";
      } catch (error) {
        return "";
      }
    });
  };

  return {
    init: init,
    registerHandlebarsHelpers: registerHandlebarsHelpers,
  };
})();
