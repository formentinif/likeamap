/*
Copyright 2015-2019 Perspectiva di Formentini Filippo

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Copyright 2015-2019 Perspectiva di Formentini Filippo
Concesso in licenza secondo i termini della Licenza Apache, versione 2.0 (la "Licenza"); è proibito usare questo file se non in conformità alla Licenza. Una copia della Licenza è disponibile all'indirizzo:

http://www.apache.org/licenses/LICENSE-2.0

Se non richiesto dalla legislazione vigente o concordato per iscritto,
il software distribuito nei termini della Licenza è distribuito
"COSÌ COM'È", SENZA GARANZIE O CONDIZIONI DI ALCUN TIPO, esplicite o implicite.
Consultare la Licenza per il testo specifico che regola le autorizzazioni e le limitazioni previste dalla medesima.

*/

/**
 * Map Eumerations
 */
let LamEnums = (function() {
  "use strict";

  let showContentModeEnum = {
    LeftPanel: 1,
    BottomInfo: 2,
    InfoWindow: 3
  };

  let infoSelectBehaviourEnum = {
    SingleFeature: 1,
    MultipleFeature: 2
  };

  let geometryFormatsEnum = {
    GeoJson: 1,
    OL: 2
  };

  let geometryTypesEnum = {
    GeometryNull: 0,
    Point: 1,
    Polyline: 2,
    Polygon: 3,
    MultiPolyline: 4,
    MultyPolygon: 5
  };

  let geometryFormats = function() {
    return geometryFormatsEnum;
  };

  let geometryTypes = function() {
    return geometryTypesEnum;
  };

  let infoSelectBehaviours = function() {
    return infoSelectBehaviourEnum;
  };

  let showContentMode = function() {
    return showContentModeEnum;
  };

  return {
    showContentMode: showContentMode,
    geometryFormats: geometryFormats,
    geometryTypes: geometryTypes,
    infoSelectBehaviours: infoSelectBehaviours
  };
})();
