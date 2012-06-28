/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */


/**
 * @requires SuperMap/BaseTypes/Class.js
 * @requires SuperMap/Events.js
 * @requires SuperMap/Icon.js
 */

/**
 * Class: SuperMap.Marker
 * 标签覆盖物，对地图上的点进行标准，可以自定义选择标注的图标，需添加到 Markers 图层上显示。
 */
SuperMap.Marker = SuperMap.Class({
    
    /** 
     * Property: icon 
     * {<SuperMap.Icon>} The icon used by this marker.
     */
    icon: null,

    /** 
     * Property: lonlat 
     * {<SuperMap.LonLat>} location of object
     */
    lonlat: null,
    
    /** 
     * Property: events 
     * {<SuperMap.Events>} the event handler.
     */
    events: null,
    
    /** 
     * Property: map 
     * {<SuperMap.Map>} the map this marker is attached to
     */
    map: null,
    
    /** 
     * Constructor: SuperMap.Marker
     * 创建标签。通常通过调用 <SuperMap.Layer.Markers> 将标签添加到指定的标签图层。如：
     * 
     * (code)
     * var markers = new SuperMap.Layer.Markers( "Markers" );
     * map.addLayer(markers);
     *
     * var size = new SuperMap.Size(21,25);
     * var offset = new SuperMap.Pixel(-(size.w/2), -size.h);
     * var icon = new SuperMap.Icon('..img/marker.png', size, offset);
     * markers.addMarker(new SuperMap.Marker(new SuperMap.LonLat(0,0),icon));
     * (end) 
     *     
     * Parameters:
     * lonlat - {<SuperMap.LonLat>} 当前标签的位置
     * icon - {<SuperMap.Icon>}  当前标签的图标
     */
    initialize: function(lonlat, icon) {
        this.lonlat = lonlat;
        
        var newIcon = (icon) ? icon : SuperMap.Marker.defaultIcon();
        if (this.icon == null) {
            this.icon = newIcon;
        } else {
            this.icon.url = newIcon.url;
            this.icon.size = newIcon.size;
            this.icon.offset = newIcon.offset;
            this.icon.calculateOffset = newIcon.calculateOffset;
        }
        this.events = new SuperMap.Events(this, this.icon.imageDiv, null);
    },
    
    /**
     * APIMethod: destroy
     * 清除标签，需要首先移除图层上添加的标签，在标签内不能执行此操作，因为不知道标签连接到哪个图层。
     */
    destroy: function() {
        // erase any drawn features
        this.erase();

        this.map = null;

        this.events.destroy();
        this.events = null;

        if (this.icon != null) {
            this.icon.destroy();
            this.icon = null;
        }
    },
    
    /** 
    * Method: draw
    * Calls draw on the icon, and returns that output.
    * 
    * Parameters:
    * px - {<SuperMap.Pixel>}
    * 
    * Returns:
    * {DOMElement} A new DOM Image with this marker's icon set at the 
    * location passed-in
    */
    draw: function(px) {
        return this.icon.draw(px);
    }, 

    /** 
    * Method: erase
    * Erases any drawn elements for this marker.
    */
    erase: function() {
        if (this.icon != null) {
            this.icon.erase();
        }
    }, 

    /**
    * Method: moveTo
    * Move the marker to the new location.
    *
    * Parameters:
    * px - {<SuperMap.Pixel>} the pixel position to move to
    */
    moveTo: function (px) {
        if ((px != null) && (this.icon != null)) {
            this.icon.moveTo(px);
        }           
        this.lonlat = this.map.getLonLatFromLayerPx(px);
    },

    /**
     * APIMethod: isDrawn
     * 
     * Returns:
     * {Boolean} 标签是否被绘制。
     */
    isDrawn: function() {
        var isDrawn = (this.icon && this.icon.isDrawn());
        return isDrawn;   
    },

    /**
     * Method: onScreen
     *
     * Returns:
     * {Boolean} Whether or not the marker is currently visible on screen.
     */
    onScreen:function() {
        
        var onScreen = false;
        if (this.map) {
            var screenBounds = this.map.getExtent();
            onScreen = screenBounds.containsLonLat(this.lonlat);
        }    
        return onScreen;
    },
    
    /**
     * Method: inflate
     * Englarges the markers icon by the specified ratio.
     *
     * Parameters:
     * inflate - {float} the ratio to enlarge the marker by (passing 2
     *                   will double the size).
     */
    inflate: function(inflate) {
        if (this.icon) {
            var newSize = new SuperMap.Size(this.icon.size.w * inflate,
                                              this.icon.size.h * inflate);
            this.icon.setSize(newSize);
        }        
    },
    
    /** 
     * Method: setOpacity
     * Change the opacity of the marker by changin the opacity of 
     *   its icon
     * 
     * Parameters:
     * opacity - {float}  Specified as fraction (0.4, etc)
     */
    setOpacity: function(opacity) {
        this.icon.setOpacity(opacity);
    },

    /**
     * Method: setUrl
     * Change URL of the Icon Image.
     * 
     * url - {String} 
     */
    setUrl: function(url) {
        this.icon.setUrl(url);
    },    

    /** 
     * Method: display
     * Hide or show the icon
     * 
     * display - {Boolean} 
     */
    display: function(display) {
        this.icon.display(display);
    },

    CLASS_NAME: "SuperMap.Marker"
});


/**
 * Function: defaultIcon
 * Creates a default <SuperMap.Icon>.
 * 
 * Returns:
 * {<SuperMap.Icon>} A default SuperMap.Icon to use for a marker
 */
SuperMap.Marker.defaultIcon = function() {
    var url = SuperMap.Util.getImagesLocation() + "marker.png";
    var size = new SuperMap.Size(21, 25);
    var calculateOffset = function(size) {
                    return new SuperMap.Pixel(-(size.w/2), -size.h);
                 };

    return new SuperMap.Icon(url, size, null, calculateOffset);        
};
    

