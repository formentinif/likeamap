let jsonSchemaDocs = {};
jsonSchemaDocs.processHtml = function (json) {
  let appDiv = $("#app");
  let menuDiv = $("#menu");
  let contentDiv = $("#content");
  jsonSchemaDocs.AppendTitle(json, contentDiv);
  jsonSchemaDocs.AppendProperties(json.properties.properties, menuDiv, contentDiv);
};

jsonSchemaDocs.AppendTitle = function (json, div) {
  $("<div>", {
    class: "title",
  })
    .text(json["title"])
    .appendTo(div);
};

jsonSchemaDocs.AppendMenuItem = function (tag, title, menu) {
  menu.append("<li><a href='#" + tag + "'>" + title + "</a></li>");
};

jsonSchemaDocs.AppendProperties = function (properties, menuDiv, contentDiv) {
  for (const property in properties) {
    let main = $("<div>", {
      class: "box",
    });
    $("<h3>", {
      class: "title is-3 has-text-info",
    })
      .text(property)
      .appendTo(main);
    $("<h4>", {
      class: "subtitle is-5 is-italic",
    })
      .text(properties[property].title)
      .appendTo(main);

    $("<a name='" + property + "'>").appendTo(main);
    $("<p>", {
      class: "",
    })
      .text(properties[property].description)
      .appendTo(main);
    $("<p>", {
      class: "",
    })
      .text(properties[property].type)
      .appendTo(main);
    main.appendTo(contentDiv);

    jsonSchemaDocs.AppendMenuItem(property, properties[property].title, menuDiv);
  }
};

jsonSchemaDocs.loadFile = function (file) {
  let doc = fetch()
    .then((response) => response.json())
    .then((data) => {
      jsonSchemaDocs.processHtml(data);
    });
};
