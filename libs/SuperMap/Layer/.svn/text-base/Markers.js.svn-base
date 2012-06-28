/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */


/**
 * @requires SuperMap/Layer.js
 */

/**
 * Class: SuperMap.Layer.Markers
 * 
 * Inherits from:
 *  - <SuperMap.Layer> 
 */
SuperMap.Layer.Markers = SuperMap.Class(SuperMap.Layer, {
    
    /** 
     * APIProperty: isBaseLayer 
     * {Boolean} 标签层不会作为基础层。
     */
    isBaseLayer: false,
    
    /** 
     * APIProperty: markers 
     * {Array(<SuperMap.Marker>)} 内部标签列表。
     */
    markers: null,


    /** 
     * Property: drawn 
     * {Boolean} internal state of drawing. This is a workaround for the fact
     * that the map does not call moveTo with a zoomChanged when the map is
     * first starting up. This lets us catch the case where we have *never*
     * drawn the layer, and draw it even if the zoom hasn't changed.
     */
    drawn: false,
    
    /**
     * Constructor: SuperMap.Layer.Markers 
     * map上创建标签层，在标签层上添加相应的标签。如：
     * (start code)
     * //创建标签图层     
     * var positionLayer = new SuperMap.Layer.Markers("Markers"，{});
     * map.addLayer(Markers);
     * //标签图层上添加标签
     * markers.addMarker(new SuperMap.Marker(new SuperMap.LonLat(0,0),icon));
     * var size = new SuperMap.Size(21,25);
     * var offset = new SuperMap.Pixel(-(size.w/2), -size.h);
     * var icon = new SuperMap.Icon('../img/marker.png',size,offset);
     * (code)
     *      
     * Parameters:
     * name - {String} 
     * options - {Object} 该类及其父类开放的属性。
     */
    initialize: function(name, options) {
        SuperMap.Layer.prototype.initialize.apply(this, arguments);
        this.markers = [];
    },
    
    /**
     * APIMethod: destroy 
     */
    destroy: function() {
        this.clearMarkers();
        this.markers = null;
        SuperMap.Layer.prototype.destroy.apply(this, arguments);
    },

    /**
     * APIMethod: setOpacity
     * 设置标签的不透明度。如：
     * (start code)
     *  var marker = new OpenLayers.Marker(new OpenLayers.LonLat(90,10),icon);
     *  marker.setOpacity(0.2);
     *  (end)
     * 
     * Parameter:
     * opacity - {Float}
     */
    setOpacity: function(opacity) {
        if (opacity != this.opacity) {
            this.opacity = opacity;
            for (var i=0, len=this.markers.length; i<len; i++) {
                this.markers[i].setOpacity(this.opacity);
            }
        }
    },

    /** 
     * Method: moveTo
     *
     * Parameters:
     * bounds - {<SuperMap.Bounds>} 
     * zoomChanged - {Boolean} 
     * dragging - {Boolean} 
     */
    moveTo:function(bounds, zoomChanged, dragging) {
        SuperMap.Layer.prototype.moveTo.apply(this, arguments);

        if (zoomChanged || !this.drawn) {
            for(var i=0, len=this.markers.length; i<len; i++) {
                this.drawMarker(this.markers[i]);
            }
            this.drawn = true;
        }
    },

    /**
     * APIMethod: addMarker
     *
     * Parameters:
     * marker - {<SuperMap.Marker>} 
     */
    addMarker: function(marker) {
        this.markers.push(marker);

        if (this.opacity != null) {
            marker.setOpacity(this.opacity);
        }

        if (this.map && this.map.getExtent()) {
            marker.map = this.map;
            this.drawMarker(marker);
        }
    },

    /**
     * APIMethod: removeMarker
     *
     * Parameters:
     * marker - {<SuperMap.Marker>} 
     */
    removeMarker: function(marker) {
        if (this.markers && this.markers.length) {
            SuperMap.Util.removeItem(this.markers, marker);
            marker.erase();
        }
    },

    /**
     * APIMethod: clearMarkers
     * 清空图层上所有的markers。
     */
    clearMarkers: function() {
        if (this.markers != null) {
            while(this.markers.length > 0) {
                this.removeMarker(this.markers[0]);
            }
        }
    },

    /** 
     * Method: drawMarker
     * Calculate the pixel location for the marker, create it, and 
     *    add it to the layer's div
     *
     * Parameters:
     * marker - {<SuperMap.Marker>} 
     */
    drawMarker: function(marker) {
        var px = this.map.getLayerPxFromLonLat(marker.lonlat);
        if (px == null) {
            marker.display(false);
        } else {
            if (!marker.isDrawn()) {
                var markerImg = marker.draw(px);
                this.div.appendChild(markerImg);
            } else if(marker.icon) {
                marker.icon.moveTo(px);
            }
        }
    },
    
    /** 
     * APIMethod: getDataExtent
     * 计算所有的标签的最大范围。
     * 
     * Returns:
     * {<SuperMap.Bounds>}
     */
    getDataExtent: function () {
        var maxExtent = null;
        
        if ( this.markers && (this.markers.length > 0)) {
            var maxExtent = new SuperMap.Bounds();
            for(var i=0, len=this.markers.length; i<len; i++) {
                var marker = this.markers[i];
                maxExtent.extend(marker.lonlat);
            }
        }

        return maxExtent;
    },

    CLASS_NAME: "SuperMap.Layer.Markers"
});
