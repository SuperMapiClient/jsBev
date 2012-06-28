/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Control.js
 */

/**
 * Class: SuperMap.Control.ZoomToMaxExtent 
 * 该类实现将地图全幅显示的功能。主要配合<SuperMap.Control.Panel> 使用。<SuperMap.Control.PanZoomBar> 
 * 和 <SuperMap.Control.ZoomPanel> 包括这一功能。
 * 
 * Inherits from:
 *  - <SuperMap.Control>
 */
SuperMap.Control.ZoomToMaxExtent = SuperMap.Class(SuperMap.Control, {

    /**
     * Property: type
     * {String} The type of <SuperMap.Control> -- When added to a 
     *     <Control.Panel>, 'type' is used by the panel to determine how to 
     *     handle our events.
     */
    type: SuperMap.Control.TYPE_BUTTON,
    
    /*
     * Method: trigger
     * Do the zoom.
     */
    trigger: function() {
        if (this.map) {
            this.map.zoomToMaxExtent();
        }    
    },

    CLASS_NAME: "SuperMap.Control.ZoomToMaxExtent"
});
