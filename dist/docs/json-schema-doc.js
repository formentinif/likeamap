let jsonSchemaDocs = {};

jsonSchemaDocs.settings = {
  search: "",
  json: {},
};

jsonSchemaDocs.refresh = function () {
  let appDiv = $("#app");
  let menuDiv = $("#menu");
  let contentDiv = $("#content");
  menuDiv.html("");
  contentDiv.html("");
  var json = jsonSchemaDocs.settings.json;
  jsonSchemaDocs.AppendTitle(json, contentDiv);
  jsonSchemaDocs.AppendProperties(json.properties, menuDiv, contentDiv);
};

jsonSchemaDocs.bindEvents = function () {
  $("#search").keyup(function () {
    jsonSchemaDocs.settings.search = $(this).val();
    jsonSchemaDocs.refresh();
  });
};

jsonSchemaDocs.AppendTitle = function (json, div) {
  $("#title").text(json["title"]);
};

jsonSchemaDocs.AppendMenuItem = function (tag, title, menu) {
  menu.append("<li><a href='#" + tag + "'><span class='has-text-info'>" + tag + "</span> - " + title + "</a></li>");
};

jsonSchemaDocs.PropertyIsVisible = function (search, value) {
  return value.toLowerCase().includes(search);
};

jsonSchemaDocs.PropertyIsVisibleIterate = function (search, obj) {
  for (const property in obj) {
    if (property.toLowerCase().includes(search)) return true;
    if (obj[property].properties) {
      return jsonSchemaDocs.PropertyIsVisibleIterate(search, obj[property].properties);
    }
  }
  if (obj.title) {
    if (this.PropertyIsVisible(search, obj.title)) return true;
  }
  if (obj.properties) {
    return jsonSchemaDocs.PropertyIsVisibleIterate(search, obj.properties);
  }
  return false;
};

jsonSchemaDocs.ShowExample = function (tag, target, prop) {
  let valore = "'valore'";
  if (prop.type == "bool" || prop.type == "boolean") valore = "true";
  if (prop.enum && prop.enum.length) valore = prop.enum[0];
  let code = $("<pre>", {
    class: "",
  });
  code.html(`<code>{...
${tag}: ${valore}
...}</code>`);
  $("#" + target).append(code);
};

jsonSchemaDocs.AppendProperties = function (properties, menuDiv, contentDiv) {
  for (const property in properties) {
    let main = $("<div>", {
      class: "box",
    });
    if (!this.PropertyIsVisible(this.settings.search, property) && !this.PropertyIsVisibleIterate(this.settings.search, properties[property])) continue;
    $("<a name='" + property + "'>").appendTo(main);
    $("<h3>", {
      class: "is-size-4 has-text-info",
    })
      .text(property)
      .appendTo(main);
    $("<h4>", {
      class: "is-size-5 is-italic",
    })
      .text(properties[property].title)
      .appendTo(main);
    $("<p>", {
      class: "",
    })
      .text(properties[property].description)
      .appendTo(main);
    $("<p>", {
      class: "",
    })
      .html("<strong>Tipo:</strong> " + properties[property].type)
      .appendTo(main);
    if (properties[property].enum) {
      $("<p>", {
        class: "",
      })
        .html("<strong>Valori ammessi:</strong> " + properties[property].enum.join(", "))
        .appendTo(main);
    }
    $("<div>", {
      id: property + "Code",
      class: "has-margin-top-1",
    }).appendTo(main);
    let btnEsempio = $("<button>", {
      class: "button",
    })
      .text("{...}")
      .appendTo(main);
    btnEsempio.click(function () {
      jsonSchemaDocs.ShowExample(property, property + "Code", properties[property]);
      $(this).hide();
    });
    btnEsempio.appendTo(main);

    main.appendTo(contentDiv);
    jsonSchemaDocs.AppendMenuItem(property, properties[property].title, menuDiv);
    if (properties[property].items) {
      jsonSchemaDocs.AppendProperties(properties[property].items.properties, menuDiv, main);
    }
  }
};

jsonSchemaDocs.loadFile = function (file) {
  let doc = fetch(file)
    .then((response) => response.json())
    .then((data) => {
      jsonSchemaDocs.settings.json = data;
      jsonSchemaDocs.refresh();
      jsonSchemaDocs.bindEvents();
    });
};
