var LamSingleApp = (function () {

    let init = function (
        mapElement,
        layerUrl, options
    ) {
        const map = new Map({
            target: 'lam-app',
            view: new View({
                center: [0, 0],
                zoom: 2,
            }),
        });
        mainMap.addLayer(backgroundLayer);
    }


    let Template = function (node) {
        this.node = node;
        this.parent = node.parentNode;
        this.parent.removeChild(node);
        this.html = node.innerHTML;
    };

    Template.prototype.clone = function clone(scope) {
        return new TemplateClone(this, scope || {});
    };

    let TemplateClone = function (template, scope) {
        this.template = template;
        this.scope = scope;
        this.node = template.node.cloneNode(false);
        this.update();
    };

    TemplateClone.prototype.update = function update(scope) {
        scope = scope || this.scope;
        this.node.innerHTML = this.template.html.replace(/\{\s*(\w+)\s*\}/g, function (all, key) {
            var value = scope[key];
            return (value === undefined) ? "{" + key + "}" : value;
        });
    };

    TemplateClone.prototype.append = function append() {
        this.template.parent.appendChild(this.node);
        return this;
    };



    /*** LAYERS */
    let getLayerOSM = function getLayerOSM() {
        /// <summary>
        /// Restituisce il layer standard di Open Street Map
        /// </summary>
        let osm = new ol.layer.Tile({
            source: new ol.source.OSM({
                crossOrigin: null,
            }),
        });
        osm.gid = defaultLayers.OSM.gid;
        return osm;
    };

    let getLayerOCM = function getLayerOCM(key) {
        /// <summary>
        /// Restituisce il layer standard di Open Cycle Map
        /// </summary>
        let ocm = new ol.layer.Tile({
            source: new ol.source.OSM({
                url: "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=" + key,
                crossOrigin: null,
            }),
        });
        ocm.gid = defaultLayers.OCM.gid;
        return ocm;
    };

    let getLayerOTM = function getLayerOTM(key) {
        /// <summary>
        /// Restituisce il layer standard di Open Cycle Map
        /// </summary>
        let otm = new ol.layer.Tile({
            source: new ol.source.OSM({
                url: "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=" + key,
                crossOrigin: null,
            }),
        });
        otm.gid = defaultLayers.OTM.gid;
        return otm;
    };

    let getLayerOSMG = function () {
        var grayOsmLayer = new ol.layer.Tile({
            source: new ol.source.OSM(),
        });

        grayOsmLayer.on("postrender", function (evt) {
            var background = 125;
            evt.context.globalCompositeOperation = "color";
            // check browser supports globalCompositeOperation
            if (evt.context.globalCompositeOperation == "color") {
                evt.context.fillStyle = "rgba(255,255,255," + 1 + ")";
                evt.context.fillRect(0, 0, evt.context.canvas.width, evt.context.canvas.height);
            }
            evt.context.globalCompositeOperation = "overlay";
            // check browser supports globalCompositeOperation
            if (evt.context.globalCompositeOperation == "overlay") {
                evt.context.fillStyle = "rgb(" + [background, background, background].toString() + ")";
                evt.context.fillRect(0, 0, evt.context.canvas.width, evt.context.canvas.height);
            }
            evt.context.globalCompositeOperation = "source-over";
        });
        return grayOsmLayer;
    };


    return {
        init: init
    };
})();
