/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/Control.js
 */

/**
 * Class: SuperMap.Control.LayerSwitcher
 * 图层选择控件类。
 * 用于控制地图中的图层可见性。
 *
 * Inherits from:
 *  - <SuperMap.Control>
 */
SuperMap.Control.LayerSwitcher = SuperMap.Class(SuperMap.Control, {

    /**  
     * Property: layerStates 
     * {Array(Object)} Basically a copy of the "state" of the map's layers 
     *     the last time the control was drawn. We have this in order to avoid
     *     unnecessarily redrawing the control.
     */
    layerStates: null,

    /**
     * Property: layersDiv
     * {DOMElement} 
     */
    layersDiv: null,
    
    /** 
     * Property: baseLayersDiv
     * {DOMElement}
     */
    baseLayersDiv: null,

    /** 
     * Property: baseLayers
     * {Array(<SuperMap.Layer>)}
     */
    baseLayers: null,
    
    
    /** 
     * Property: dataLbl
     * {DOMElement} 
     */
    dataLbl: null,
    
    /** 
     * Property: dataLayersDiv
     * {DOMElement} 
     */
    dataLayersDiv: null,

    /** 
     * Property: dataLayers
     * {Array(<SuperMap.Layer>)} 
     */
    dataLayers: null,


    /** 
     * Property: minimizeDiv
     * {DOMElement} 
     */
    minimizeDiv: null,

    /** 
     * Property: maximizeDiv
     * {DOMElement} 
     */
    maximizeDiv: null,
    
    /**
     * APIProperty: ascending
     * {Boolean} 图层显示顺序，默认false, 降序排列，叠加层显示在上面，底图显示在下面。
     */
    ascending: false,
    
    /**
     * Constructor: SuperMap.Control.LayerSwitcher
     * 图层转换控件类
     *
     * Parameters:
     * options - {Object} 设置该类开放的属性。
     */
    initialize: function(options) {      
        var imgLocation, img;

        SuperMap.Control.LayerSwitcher.prototype.loadContents = function() {
            SuperMap.Event.observe(this.div, "mouseup", 
                    SuperMap.Function.bindAsEventListener(this.mouseUp, this));
            SuperMap.Event.observe(this.div, "click",    this.ignoreEvent);
            SuperMap.Event.observe(this.div, "mousedown",
                    SuperMap.Function.bindAsEventListener(this.mouseDown, this));
            SuperMap.Event.observe(this.div, "dblclick", this.ignoreEvent);

            // 图层列表div       
            this.layersDiv = document.createElement("div");
            this.layersDiv.id = this.id + "_layersDiv";
            SuperMap.Element.addClass(this.layersDiv, "layersDiv");

            this.baseLbl = document.createElement("div");
            this.baseLbl.innerHTML = SuperMap.i18n("Base Layer");
            SuperMap.Element.addClass(this.baseLbl, "baseLbl");

            this.baseLayersDiv = document.createElement("div");
            SuperMap.Element.addClass(this.baseLayersDiv, "baseLayersDiv");

            this.dataLbl = document.createElement("div");
            this.dataLbl.innerHTML = SuperMap.i18n("Overlays");
            SuperMap.Element.addClass(this.dataLbl, "dataLbl");

            this.dataLayersDiv = document.createElement("div");
            SuperMap.Element.addClass(this.dataLayersDiv, "dataLayersDiv");

            if (this.ascending) {
                this.layersDiv.appendChild(this.baseLbl);
                this.layersDiv.appendChild(this.baseLayersDiv);
                this.layersDiv.appendChild(this.dataLbl);
                this.layersDiv.appendChild(this.dataLayersDiv);
            } else {
                this.layersDiv.appendChild(this.dataLbl);
                this.layersDiv.appendChild(this.dataLayersDiv);
                this.layersDiv.appendChild(this.baseLbl);
                this.layersDiv.appendChild(this.baseLayersDiv);
            }    

            this.div.appendChild(this.layersDiv);

            imgLocation = SuperMap.Util.getImagesLocation();
            var sz = new SuperMap.Size(24,24);        

            // 最大按钮div
            img = imgLocation + 'layer-switcher-maximize.png';
            this.maximizeDiv = SuperMap.Util.createAlphaImageDiv(
                    "SuperMap_Control_MaximizeDiv", 
                    null, 
                    sz, 
                    img,
                    "absolute",
                    "2px");
            SuperMap.Element.addClass(this.maximizeDiv, "maximizeDiv");
            this.maximizeDiv.style.display = "none";
            SuperMap.Event.observe(this.maximizeDiv, "click", 
                    SuperMap.Function.bindAsEventListener(this.maximizeControl, this)
                    );

            this.div.appendChild(this.maximizeDiv);

            // 最小按钮div
            img = imgLocation + 'layer-switcher-minimize.png';
            var sz = new SuperMap.Size(171,24);        
            this.minimizeDiv = SuperMap.Util.createAlphaImageDiv(
                    "SuperMap_Control_MinimizeDiv", 
                    null, 
                    sz, 
                    img, 
                    "absolute");
            var content = document.createElement('span');
            content.innerHTML = SuperMap.i18n("LayerSwitcher");
            content.className = 'layerSwitcherContent';
            this.minimizeDiv.appendChild(content);
            SuperMap.Element.addClass(this.minimizeDiv, "minimizeDiv");
            this.minimizeDiv.style.display = "none";
            SuperMap.Event.observe(this.minimizeDiv, "click", 
                    SuperMap.Function.bindAsEventListener(this.minimizeControl, this)
                    );

            this.div.appendChild(this.minimizeDiv);
        };
        SuperMap.Control.prototype.initialize.apply(this, arguments);
        this.layerStates = [];              
    },

    /**
     * APIMethod: destroy 
     * 销毁该类。
     */    
    destroy: function() {
        
        SuperMap.Event.stopObservingElement(this.div);

        SuperMap.Event.stopObservingElement(this.minimizeDiv);
        SuperMap.Event.stopObservingElement(this.maximizeDiv);

        //clear out layers info and unregister their events 
        this.clearLayersArray("base");
        this.clearLayersArray("data");
        
        this.map.events.un({
            "addlayer": this.redraw,
            "changelayer": this.redraw,
            "removelayer": this.redraw,
            "changebaselayer": this.redraw,
            scope: this
        });
        
        SuperMap.Control.prototype.destroy.apply(this, arguments);
    },

    /** 
     * Method: setMap
     *
     * Properties:
     * map - {<SuperMap.Map>} 
     */
    setMap: function(map) {
        SuperMap.Control.prototype.setMap.apply(this, arguments);

        this.map.events.on({
            "addlayer": this.redraw,
            "changelayer": this.redraw,
            "removelayer": this.redraw,
            "changebaselayer": this.redraw,
            scope: this
        });
    },

    /**
     * Method: draw
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the 
     *     switcher tabs.
     */  
    draw: function() {
        SuperMap.Control.prototype.draw.apply(this);

        // create layout divs
        this.loadContents();

        // set mode to minimize
        if(!this.outsideViewport) {
            this.minimizeControl();
        }

        // populate div with current info
        this.redraw();    

        return this.div;
    },

    /** 
     * Method: clearLayersArray
     * User specifies either "base" or "data". we then clear all the
     *     corresponding listeners, the div, and reinitialize a new array.
     * 
     * Parameters:
     * layersType - {String}  
     */
    clearLayersArray: function(layersType) {
        var layers = this[layersType + "Layers"];
        if (layers) {
            for(var i=0, len=layers.length; i<len ; i++) {
                var layer = layers[i];
                SuperMap.Event.stopObservingElement(layer.inputElem);
                SuperMap.Event.stopObservingElement(layer.labelSpan);
            }
        }
        this[layersType + "LayersDiv"].innerHTML = "";
        this[layersType + "Layers"] = [];
    },


    /**
     * Method: checkRedraw
     * Checks if the layer state has changed since the last redraw() call.
     * 
     * Returns:
     * {Boolean} The layer state changed since the last redraw() call. 
     */
    checkRedraw: function() {
        var redraw = false;
        if ( !this.layerStates.length ||
             (this.map.layers.length != this.layerStates.length) ) {
            redraw = true;
        } else {
            for (var i=0, len=this.layerStates.length; i<len; i++) {
                var layerState = this.layerStates[i];
                var layer = this.map.layers[i];
                if ( (layerState.name != layer.name) || 
                     (layerState.inRange != layer.inRange) || 
                     (layerState.id != layer.id) || 
                     (layerState.visibility != layer.visibility) ) {
                    redraw = true;
                    break;
                }    
            }
        }    
        return redraw;
    },
    
    /** 
     * Method: redraw
     * Goes through and takes the current state of the Map and rebuilds the
     *     control to display that state. Groups base layers into a 
     *     radio-button group and lists each data layer with a checkbox.
     *
     * Returns: 
     * {DOMElement} A reference to the DIV DOMElement containing the control
     */  
    redraw: function() {
        //if the state hasn't changed since last redraw, no need 
        // to do anything. Just return the existing div.
        if (!this.checkRedraw()) { 
            return this.div; 
        } 

        //clear out previous layers 
        this.clearLayersArray("base");
        this.clearLayersArray("data");
        
        var containsOverlays = false;
        var containsBaseLayers = false;
        
        // Save state -- for checking layer if the map state changed.
        // We save this before redrawing, because in the process of redrawing
        // we will trigger more visibility changes, and we want to not redraw
        // and enter an infinite loop.
        var len = this.map.layers.length;
        this.layerStates = new Array(len);
        for (var i=0; i <len; i++) {
            var layer = this.map.layers[i];
            this.layerStates[i] = {
                'name': layer.name, 
                'visibility': layer.visibility,
                'inRange': layer.inRange,
                'id': layer.id
            };
        }    

        var layers = this.map.layers.slice();
        if (!this.ascending) { layers.reverse(); }
        for(var i=0, len=layers.length; i<len; i++) {
            var layer = layers[i];
            var baseLayer = layer.isBaseLayer;

            if (layer.displayInLayerSwitcher) {

                if (baseLayer) {
                    containsBaseLayers = true;
                } else {
                    containsOverlays = true;
                }    

                // only check a baselayer if it is *the* baselayer, check data
                //  layers if they are visible
                var checked = (baseLayer) ? (layer == this.map.baseLayer)
                                          : layer.getVisibility();
    
                // create input element
                var inputElem = document.createElement("input");
                inputElem.id = this.id + "_input_" + layer.name;
                inputElem.name = (baseLayer) ? this.id + "_baseLayers" : layer.name;
                inputElem.type = (baseLayer) ? "radio" : "checkbox";
                inputElem.value = layer.name;
                inputElem.checked = checked;
                inputElem.defaultChecked = checked;

                if (!baseLayer && !layer.inRange) {
                    inputElem.disabled = true;
                }
                var context = {
                    'inputElem': inputElem,
                    'layer': layer,
                    'layerSwitcher': this
                };
                SuperMap.Event.observe(inputElem, "mouseup", 
                    SuperMap.Function.bindAsEventListener(this.onInputClick,
                                                            context)
                );
                
                // create span
                var labelSpan = document.createElement("span");
                SuperMap.Element.addClass(labelSpan, "labelSpan");
                if (!baseLayer && !layer.inRange) {
                    labelSpan.style.color = "gray";
                }
                labelSpan.innerHTML = layer.name;
                labelSpan.style.verticalAlign = (baseLayer) ? "bottom" 
                                                            : "baseline";
                SuperMap.Event.observe(labelSpan, "click", 
                    SuperMap.Function.bindAsEventListener(this.onInputClick,
                                                            context)
                );
                // create line break
                var br = document.createElement("br");
    
                
                var groupArray = (baseLayer) ? this.baseLayers
                                             : this.dataLayers;
                groupArray.push({
                    'layer': layer,
                    'inputElem': inputElem,
                    'labelSpan': labelSpan
                });
                                                     
    
                var groupDiv = (baseLayer) ? this.baseLayersDiv
                                           : this.dataLayersDiv;
                groupDiv.appendChild(inputElem);
                groupDiv.appendChild(labelSpan);
                groupDiv.appendChild(br);
            }
        }

        // if no overlays, dont display the overlay label
        this.dataLbl.style.display = (containsOverlays) ? "" : "none";        
        
        // if no baselayers, dont display the baselayer label
        this.baseLbl.style.display = (containsBaseLayers) ? "" : "none";        

        return this.div;
    },

    /** 
     * Method:
     * A label has been clicked, check or uncheck its corresponding input
     * 
     * Parameters:
     * e - {Event} 
     *
     * Context:  
     *  - {DOMElement} inputElem
     *  - {<SuperMap.Control.LayerSwitcher>} layerSwitcher
     *  - {<SuperMap.Layer>} layer
     */

    onInputClick: function(e) {

        if (!this.inputElem.disabled) {
            if (this.inputElem.type == "radio") {
                this.inputElem.checked = true;
                this.layer.map.setBaseLayer(this.layer);
            } else {
                this.inputElem.checked = !this.inputElem.checked;
                this.layerSwitcher.updateMap();
            }
        }
        SuperMap.Event.stop(e);
    },
    
    /**
     * Method: onLayerClick
     * Need to update the map accordingly whenever user clicks in either of
     *     the layers.
     * 
     * Parameters: 
     * e - {Event} 
     */
    onLayerClick: function(e) {
        this.updateMap();
    },


    /** 
     * Method: updateMap
     * Cycles through the loaded data and base layer input arrays and makes
     *     the necessary calls to the Map object such that that the map's 
     *     visual state corresponds to what the user has selected in 
     *     the control.
     */
    updateMap: function() {

        // set the newly selected base layer        
        for(var i=0, len=this.baseLayers.length; i<len; i++) {
            var layerEntry = this.baseLayers[i];
            if (layerEntry.inputElem.checked) {
                this.map.setBaseLayer(layerEntry.layer, false);
            }
        }

        // set the correct visibilities for the overlays
        for(var i=0, len=this.dataLayers.length; i<len; i++) {
            var layerEntry = this.dataLayers[i];   
            layerEntry.layer.setVisibility(layerEntry.inputElem.checked);
        }

    },

    /** 
     * Method: maximizeControl
     * Set up the labels and divs for the control
     * 
     * Parameters:
     * e - {Event} 
     */
    maximizeControl: function(e) {

        // set the div's width and height to empty values, so
        // the div dimensions can be controlled by CSS
        this.div.style.width = "";
        this.div.style.height = "";
        this.div.style.borderWidth = '3px';

        this.showControls(false);

        if (e != null) {
            SuperMap.Event.stop(e);                                            
        }
    },
    
    /** 
     * Method: minimizeControl
     * Hide all the contents of the control, shrink the size, 
     *     add the maximize icon
     *
     * Parameters:
     * e - {Event} 
     */
    minimizeControl: function(e) {

        // to minimize the control we set its div's width
        // and height to 0px, we cannot just set "display"
        // to "none" because it would hide the maximize
        // div
        this.div.style.width = "0px";
        this.div.style.height = "0px";

        this.div.style.borderWidth = '0px';
        this.showControls(true);

        if (e != null) {
            SuperMap.Event.stop(e);                                            
        }
    },

    /**
     * Method: showControls
     * Hide/Show all LayerSwitcher controls depending on whether we are
     *     minimized or not
     * 
     * Parameters:
     * minimize - {Boolean}
     */
    showControls: function(minimize) {

        this.maximizeDiv.style.display = minimize ? "" : "none";
        this.minimizeDiv.style.display = minimize ? "none" : "";

        this.layersDiv.style.display = minimize ? "none" : "";
    },
    
    /** 
     * Method: loadContents
     * Set up the labels and divs for the control
     */
    loadContents: function() {

        //configure main div

        SuperMap.Event.observe(this.div, "mouseup", 
            SuperMap.Function.bindAsEventListener(this.mouseUp, this));
        SuperMap.Event.observe(this.div, "click",
                      this.ignoreEvent);
        SuperMap.Event.observe(this.div, "mousedown",
            SuperMap.Function.bindAsEventListener(this.mouseDown, this));
        SuperMap.Event.observe(this.div, "dblclick", this.ignoreEvent);

        // layers list div        
        this.layersDiv = document.createElement("div");
        this.layersDiv.id = this.id + "_layersDiv";
        SuperMap.Element.addClass(this.layersDiv, "layersDiv");

        this.baseLbl = document.createElement("div");
        this.baseLbl.innerHTML = SuperMap.i18n("Base Layer");
        SuperMap.Element.addClass(this.baseLbl, "baseLbl");
        
        this.baseLayersDiv = document.createElement("div");
        SuperMap.Element.addClass(this.baseLayersDiv, "baseLayersDiv");

        this.dataLbl = document.createElement("div");
        this.dataLbl.innerHTML = SuperMap.i18n("Overlays");
        SuperMap.Element.addClass(this.dataLbl, "dataLbl");
        
        this.dataLayersDiv = document.createElement("div");
        SuperMap.Element.addClass(this.dataLayersDiv, "dataLayersDiv");

        if (this.ascending) {
            this.layersDiv.appendChild(this.baseLbl);
            this.layersDiv.appendChild(this.baseLayersDiv);
            this.layersDiv.appendChild(this.dataLbl);
            this.layersDiv.appendChild(this.dataLayersDiv);
        } else {
            this.layersDiv.appendChild(this.dataLbl);
            this.layersDiv.appendChild(this.dataLayersDiv);
            this.layersDiv.appendChild(this.baseLbl);
            this.layersDiv.appendChild(this.baseLayersDiv);
        }    
 
        this.div.appendChild(this.layersDiv);

        var imgLocation = SuperMap.Util.getImagesLocation();
        var sz = new SuperMap.Size(18,18);        

        // maximize button div
        var img = imgLocation + 'layer-switcher-maximize.png';
        this.maximizeDiv = SuperMap.Util.createAlphaImageDiv(
                                    "SuperMap_Control_MaximizeDiv", 
                                    null, 
                                    sz, 
                                    img, 
                                    "absolute");
        SuperMap.Element.addClass(this.maximizeDiv, "maximizeDiv");
        this.maximizeDiv.style.display = "none";
        SuperMap.Event.observe(this.maximizeDiv, "click", 
            SuperMap.Function.bindAsEventListener(this.maximizeControl, this)
        );
        
        this.div.appendChild(this.maximizeDiv);

        // minimize button div
        var img = imgLocation + 'layer-switcher-minimize.png';
        var sz = new SuperMap.Size(18,18);        
        this.minimizeDiv = SuperMap.Util.createAlphaImageDiv(
                                    "SuperMap_Control_MinimizeDiv", 
                                    null, 
                                    sz, 
                                    img, 
                                    "absolute");
        SuperMap.Element.addClass(this.minimizeDiv, "minimizeDiv");
        this.minimizeDiv.style.display = "none";
        SuperMap.Event.observe(this.minimizeDiv, "click", 
            SuperMap.Function.bindAsEventListener(this.minimizeControl, this)
        );

        this.div.appendChild(this.minimizeDiv);
    },
    
    /** 
     * Method: ignoreEvent
     * 
     * Parameters:
     * evt - {Event} 
     */
    ignoreEvent: function(evt) {
        SuperMap.Event.stop(evt);
    },

    /** 
     * Method: mouseDown
     * Register a local 'mouseDown' flag so that we'll know whether or not
     *     to ignore a mouseUp event
     * 
     * Parameters:
     * evt - {Event}
     */
    mouseDown: function(evt) {
        this.isMouseDown = true;
        this.ignoreEvent(evt);
    },

    /** 
     * Method: mouseUp
     * If the 'isMouseDown' flag has been set, that means that the drag was 
     *     started from within the LayerSwitcher control, and thus we can 
     *     ignore the mouseup. Otherwise, let the Event continue.
     *  
     * Parameters:
     * evt - {Event} 
     */
    mouseUp: function(evt) {
        if (this.isMouseDown) {
            this.isMouseDown = false;
            this.ignoreEvent(evt);
        }
    },

    CLASS_NAME: "SuperMap.Control.LayerSwitcher"
});
