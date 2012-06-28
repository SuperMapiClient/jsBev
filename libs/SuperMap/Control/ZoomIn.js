/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Control.js
 */

/**
 * Class: SuperMap.Control.ZoomIn
 * 该类实现按地图的比例尺或分辨率级别放大地图的操作。
 *
 * Inherits from:
 *  - <SuperMap.Control>
 */
SuperMap.Control.ZoomIn = SuperMap.Class(SuperMap.Control, {

    /**
     * Property: type
     * {String} The type of <SuperMap.Control> -- When added to a 
     *     <Control.Panel>, 'type' is used by the panel to determine how to 
     *     handle our events.
     */
    type: SuperMap.Control.TYPE_BUTTON,
    
    /**
     * Method: trigger
     */
    trigger: function(){
        this.map.zoomIn();
    },

    CLASS_NAME: "SuperMap.Control.ZoomIn"
});
