# likeamap
LikeAMap è un visualizzatore di servizi web geografici. Permette la creazione di progetti personalizzati per aggregare servizi web WMS provenienti da fonti differenti.

LikeAMap in base ad un file di configurazione JSON, permette di configurare mappe per la visualizzazione, ricerca e interrogazione di dati geografici.
Lo schema per il file di configurazione è disponibile map/js/app-state-schema.json

Mappa embedded
Per includere la mappa in un div includere:
	JQuery 3+
		
    <link rel="stylesheet" href="css/lam.css" />
	<link rel="stylesheet" href="css/lam-variables.css" /> //(css per colori e impostazioni custom può essere inserito in linea)
    <script src="js/lam-libs.js"></script> //(include openlayers e handlebars)
    <script src="js/lam.js"></script>
	
	//lo script per inizializzare la mappa è il seguente
	<script>
      //LamInit({id del div mappa}, {embedded}, {url dell'appstate}, {url del template mappa});
      LamInit("lam-app", true, null, null);
    </script>

RoadMap




Author  Perspectiva di Formentini Filippo
Licensed Apache License 2.0