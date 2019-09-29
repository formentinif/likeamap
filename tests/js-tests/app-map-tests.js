QUnit.test("Geometry Type is null", function(assert) {
  assert.ok(AppMap.getGeometryType(1) === AppMap.getGeometryTypes().GeometryNull, "Passed!");
});

QUnit.test("Geometry Type is Point", function(assert) {
  assert.ok(AppMap.getGeometryType([1, 1]) === AppMap.getGeometryTypes().Point, "Passed!");
});

QUnit.test("Geometry Type is Polyline", function(assert) {
  assert.ok(AppMap.getGeometryType([[1, 1], [2, 2], [3, 3]]) === AppMap.getGeometryTypes().Polyline, "Passed!");
});

QUnit.test("Geometry Type is not Polygon", function(assert) {
  assert.ok(AppMap.getGeometryType([[1, 1], [2, 2], [3, 3]]) !== AppMap.getGeometryTypes().Polygon, "Passed!");
});

QUnit.test("Geometry Type is Polygon", function(assert) {
  assert.ok(AppMap.getGeometryType([[1, 1], [2, 2], [3, 3], [1, 1]]) === AppMap.getGeometryTypes().Polygon, "Passed!");
});

QUnit.test("Geometry Type is Multi Polyline", function(assert) {
  assert.ok(AppMap.getGeometryType([[[1, 1], [2, 2], [3, 3]], [[5, 5], [6, 6]]]) === AppMap.getGeometryTypes().MultiPolyline, "Passed!");
});

QUnit.test("Geometry Type is Multi Polygon", function(assert) {
  assert.ok(AppMap.getGeometryType([[[1, 1], [2, 2], [3, 3], [1, 1]], [[5, 5], [6, 6]]]) === AppMap.getGeometryTypes().MultiPolygon, "Passed!");
});

//getLabelPoint
QUnit.test("Label Point", function(assert) {
  assert.ok(JSON.stringify(AppMap.getLabelPoint([1, 1])) === JSON.stringify([1, 1]), "Passed!");
});

QUnit.test("Label Polyline", function(assert) {
  assert.ok(JSON.stringify(AppMap.getLabelPoint([[1, 1], [2, 2], [3, 3]])) === JSON.stringify([2, 2]), "Passed!");
});

QUnit.test("Label Polygon", function(assert) {
  assert.ok(JSON.stringify(AppMap.getLabelPoint([[0, 0], [0, 2], [2, 2], [2, 0], [0, 0]])) === JSON.stringify([1, 1]), "Passed!");
});

QUnit.test("Label Multi Polyline", function(assert) {
  assert.ok(JSON.stringify(AppMap.getLabelPoint([[[1, 1], [2, 2], [3, 3]], [[5, 5], [6, 6]]])) === JSON.stringify([2, 2]), "Passed!");
});

QUnit.test("Label Multi Polygon", function(assert) {
  assert.ok(JSON.stringify(AppMap.getLabelPoint([[[0, 0], [0, 2], [2, 2], [2, 0], [0, 0]], [[5, 5], [6, 6]]])) === JSON.stringify([1, 1]), "Passed!");
});
