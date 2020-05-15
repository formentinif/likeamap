QUnit.test("Nested property is visible", function (assert) {
  let search = "layer";
  let json = {
    type: "type",
    title: "title",
    properties: {
      item1: {},
      item2: {
        properties: {
          layers: "layers",
        },
      },
    },
  };
  assert.ok(jsonSchemaDocs.PropertyIsVisibleIterate(search, json), "Passed!");
});

QUnit.test("First level property are filtered", function (assert) {
  let search = "types";
  let json = {
    type: "type",
    title: "title",
    properties: {
      item1: {},
      item2: {
        properties: {
          layers: "layers",
        },
      },
    },
  };
  assert.ok(!jsonSchemaDocs.PropertyIsVisibleIterate(search, json), "Passed!");
});
