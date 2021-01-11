# LikeAMap

LikeAMap è un visualizzatore di servizi web geografici. Permette la creazione di progetti personalizzati per aggregare servizi web WMS provenienti da fonti differenti.

## File di configurazione (AppState)

LikeAMap in base ad un file di configurazione JSON, permette di configurare mappe per la visualizzazione, ricerca e interrogazione di dati geografici.

Lo schema per il file di configurazione è disponibile map/js/app-state-schema.json

## Mappa embedded con Javascript

La mappa può essere emeddata in una pagina tramite javascript.
Sono da includere i seguenti file:
JQuery 3+

```html
<!--css per colori e impostazioni custom può essere inserito in linea-->
<link rel="stylesheet" href="css/lam.css" /> <link rel="stylesheet" href="css/lam-variables.css" />
<!--Librerie di terze parti include openlayers e handlebars-->
<script src="js/lam-libs.js"></script>
<!--Codice di LikeAMap-->
<script src="js/lam.js"></script>
```

Lo script per inizializzare la mappa è il seguente. Passare come paramertri l'url dell'appstate di configurazione o una eventuale mappa custom.

```html
<script>
  //LamInit({id del div mappa}, {url dell'appstate}, {url del template mappa});
  LamInit("lam-app", null, null);
</script>
```

## Mappa embedded con IFRAME

La mappa può essere inclusa tramite un IFRAME impostando l'url della mappa. Aggiungere il parametro querystring _prop-embed=1_ per configurare in automatico alcune proprietà della mappa più adatte alla visualizzazione embedded.

```html
<iframe src="http://localhost:3000/?prop-embed=1" frameborder="0" width="500" height="600"></iframe>
```

## Parametri querystring

L'url della mappa può essere richiamato impostato con i seguenti parametri custom:

**lon** Longitudine iniziale  
**lat** Latitudine iniziale  
**zoom** Zoom iniziale  
**layers** Elenco dei layer separato da virgole con gli identificativi univoci (gid) dei layer che saranno visisibili all'avvio  
**appstate** Url dell'appstate da caricare nella mappa  
**appstatejson** Codice JSON dell'appstate da caricare

Le proprietà dell'appstate possono essere modificate tramite parametri querystring anteponendo il prefisso _prop-_ alla proprietà.

```html
<iframe src="http://localhost:3000/?prop-embed=1&prop-title=Mia Mappa" frameborder="0" width="500" height="600"></iframe>
```

Per l'elenco delle proprietà consultare il file map/js/app-state-schema.json. Sono supportate solo le proprietà di primo livello, non è possibile impostare le proprietà degli oggetti nidificati.

## Template

Il formato dei risultati dell'interrogazione e ricerca può essere personalizzato tramite l'associazione di un template. Il template è un file JSON, il cui schema è definito nella file _./schemas/app-template-schema.json_
L'associazione tra il layer e il relativo schema può essere definita in due modi:

- Tramite la proprietà _templateUrl_ del layer in cui è possibile definire l'URI assoluto del template;
- Se viene definita la proprietà _templatesRepositoryUrl_ a livello di applicazione, sarà caricato il template il cui nome equivale alla proprietà _gid_ del layer (es. /templates/_gid_.json);

Nel caso di **Group Layer** di GeoServer la configurazione dei template richiede alcuni passaggi aggiuntivi:

- Nel layer deve essere compilata la proprietà _groupTemplateUrls_ con l'elenco di tutti gli URI dei template associati ai livelli che compongono il group layer.
- Nei file di configurazione dei singoli template deve essere impostata la proprietà _layer_ con indicato il nome del layer di Geoserver.
  Il template da associare sarà quindi selezionato tramite il nome del layer di Geoserver.
  **Nota:** è supportato un solo nome di layer Geoserver per applicazione. Se due template hanno lo stesso valore nella proprietà _layer_, sarà preso il primo disponibile indipendentemente dall'associazione a livello di layer.

## Icone dei layer

È possibile inserire una icona prima dei titoli dei layer utilizzando le proprietà _iconSvg_ e _iconUrl_ dei layer.

La proprietà _iconUrl_ accetta un URI ad una immagine.

La proprietà _iconSvg_ accetta un codice html svg come da questi esempi:

Cerchio

```html
<circle cx="8" cy="8" r="8" fill="yellow" />
```

Quadrato

```html
<rect width="16" height="16" fill="red" />
```

Rombo

```html
<polygon points="8,0 16,8 8,16 0,8" fill="blue" />
```

Triangolo

```html
<polygon points="0,16 8,0 16,16 " fill="green" />
```

**Nota:** non inserire il tag _svg_ ma solo il codice delle geometrie.

## RoadMap

Marzo 2021 sarà rimosso definitivamente il supporto a IE 11

Author Perspectiva di Formentini Filippo
Licensed Apache License 2.0
