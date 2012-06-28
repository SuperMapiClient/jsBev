/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Control.js
 * @requires SuperMap/Handler/Box.js
 */

/**
 * Class: SuperMap.Control.ZoomBox
 * 该类实现在地图上绘制矩形区域，放缩地图的操作。
 *
 * Inherits from:
 *  - <SuperMap.Control>
 */
SuperMap.Control.ZoomBox = SuperMap.Class(SuperMap.Control, {
    /**
     * Property: type
     * {SuperMap.Control.TYPE}
     */
    type: SuperMap.Control.TYPE_TOOL,

    /**
     * APIProperty: out
     * {Boolean} 是否将该控件设置为拉框缩小，默认为false，拉框放大。
     */
    out: false,

    /**
     * Property: alwaysZoom
     * {Boolean} Always zoom in/out, when box drawed 
     */
    alwaysZoom: false,

    /**
     * Method: draw
     */    
    draw: function() {
        this.handler = new SuperMap.Handler.Box( this,
                            {done: this.zoomBox}, {keyMask: this.keyMask} );
    },

    /**
     * Method: zoomBox
     *
     * Parameters:
     * position - {<SuperMap.Bounds>} or {<SuperMap.Pixel>}
     */
    zoomBox: function (position) {
        if (position instanceof SuperMap.Bounds) {
            var bounds;
            if (!this.out) {
                var minXY = this.map.getLonLatFromPixel(
                            new SuperMap.Pixel(position.left, position.bottom));
                var maxXY = this.map.getLonLatFromPixel(
                            new SuperMap.Pixel(position.right, position.top));
                bounds = new SuperMap.Bounds(minXY.lon, minXY.lat,
                                               maxXY.lon, maxXY.lat);
            } else {
                var pixWidth = Math.abs(position.right-position.left);
                var pixHeight = Math.abs(position.top-position.bottom);
                var zoomFactor = Math.min((this.map.size.h / pixHeight),
                    (this.map.size.w / pixWidth));
                var extent = this.map.getExtent();
                var center = this.map.getLonLatFromPixel(
                    position.getCenterPixel());
                var xmin = center.lon - (extent.getWidth()/2)*zoomFactor;
                var xmax = center.lon + (extent.getWidth()/2)*zoomFactor;
                var ymin = center.lat - (extent.getHeight()/2)*zoomFactor;
                var ymax = center.lat + (extent.getHeight()/2)*zoomFactor;
                bounds = new SuperMap.Bounds(xmin, ymin, xmax, ymax);
            }
            // always zoom in/out 
            var lastZoom = this.map.getZoom(); 
            this.map.zoomToExtent(bounds);
            if (lastZoom == this.map.getZoom() && this.alwaysZoom == true){ 
                this.map.zoomTo(lastZoom + (this.out ? -1 : 1)); 
            }
        } else { // it's a pixel
            if (!this.out) {
                this.map.setCenter(this.map.getLonLatFromPixel(position),
                               this.map.getZoom() + 1);
            } else {
                this.map.setCenter(this.map.getLonLatFromPixel(position),
                               this.map.getZoom() - 1);
            }
        }
    },

    CLASS_NAME: "SuperMap.Control.ZoomBox"
});
