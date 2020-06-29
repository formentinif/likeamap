let appGroupCsv = {};


appGroupCsv.loadCsv = function(){
	JSC.fetch(url)
  .then(response => response.text())
  .then(text => {
    $("csv-data").val(text)
  })
}