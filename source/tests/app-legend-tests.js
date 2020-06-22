QUnit.test("Hyperlink https is replaced", function (assert) {
  LamStore.setAppState({
    metaDataReplacementStrings: [
      ["google", "amazon"],
      ["amazon", "microsoft"],
    ],
  });
  let toReplace = "sono https://www.google.it un link";
  let expected = 'sono <a href="https://www.microsoft.it">https://www.microsoft.it</a> un link';
  let replaced = LamLegendTools.formatMetadata(toReplace);
  assert.ok(replaced === expected, "Passed!");
});

QUnit.test("Hyperlink http is replaced", function (assert) {
  LamStore.setAppState({
    metaDataReplacementStrings: [
      ["google", "amazon"],
      ["amazon", "microsoft"],
    ],
  });
  let toReplace = "sono http://www.google.it un link";
  let expected = 'sono <a href="http://www.microsoft.it">http://www.microsoft.it</a> un link';
  let replaced = LamLegendTools.formatMetadata(toReplace);
  assert.ok(replaced === expected, "Passed!");
});

QUnit.test("Metadata is replaced", function (assert) {
  debugger;
  LamStore.setAppState({
    metaDataReplacementStrings: [
      ["descrizione:", "<strong>Descrizione:</strong>"],
      ["referente:", "<strong>Referente:</strong>"],
      ["data aggiornamento:", "<strong>Data aggiornamento:</strong>"],
      ["link opendata:", "<strong>Link opendata:</strong>"],
    ],
  });
  let toReplace = "descrizione: sono una Descrizione:";
  let expected = "<strong>Descrizione:</strong> sono una <strong>Descrizione:</strong>";
  let replaced = LamLegendTools.formatMetadata(toReplace);
  assert.ok(replaced === expected, "Passed!");
});
