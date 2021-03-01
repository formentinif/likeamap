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

    Handlebars.registerHelper("format_date_string_geoserver", function (dateStr) {
      if (!dateStr) return "";
      try {
        let dateArr = dateStr.split(",");
        return dateArr[0];
      } catch (error) {}
      return "";
    });

    Handlebars.registerHelper("format_date_time_string", function (dateStr) {
      if (!dateStr) return "";
      try {
        //TODO LOCALIZE
        let date = new Date(Date.parse(dateStr));
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let yyyy = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        return dd + "/" + mm + "/" + yyyy + " " + hours + ":" + minutes + ":" + seconds;
      } catch (error) {}
      return "";
    });

    Handlebars.registerHelper("format_date_string", function (dateStr) {
      if (!dateStr) return "";
      try {
        //TODO LOCALIZE
        let date = new Date(Date.parse(dateStr));
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let yyyy = date.getFullYear();
        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;
        return dd + "/" + mm + "/" + yyyy;
      } catch (error) {}
      return "";
    });
  };

  return {
    init: init,
    registerHandlebarsHelpers: registerHandlebarsHelpers,
  };
})();
