﻿/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */


/**
 * @requires SuperMap/Control.js
 */

/**
 * Class: SuperMap.Control.MousePosition
 * 该控件显示鼠标移动时，所在点的地理坐标。
 *
 * Inherits from:
 *  - <SuperMap.Control>
 */
SuperMap.Control.MousePosition = SuperMap.Class(SuperMap.Control, {
    
    /**
     * APIProperty: autoActivate
     * {Boolean} 指定是否在添加到地图上时自动激活。默认为true，自动激活。
     */
    autoActivate: true,

    /** 
     * Property: element
     * {DOMElement} 
     */
    element: null,
    
    /** 
     * APIProperty: prefix
     * {String} 显示文本的前缀。
     */
    prefix: '',
    
    /** 
     * APIProperty: separator
     * {String} 显示文本的分隔符。
     */
    separator: ', ',
    
    /** 
     * APIProperty: suffix
     * {String} 显示文本的后缀。
     */
    suffix: '',
    
    /** 
     * APIProperty: numDigits
     * {Integer} 地理坐标的精度。默认为5，保留小数点后五位。
     */
    numDigits: 5,
    
    /** 
     * APIProperty: granularity
     * {Integer} 鼠标移动的精度，当鼠标两个位置横坐标或纵坐标之差小于该值时，控件值不刷新。
     */
    granularity: 10,

    /**
     * APIProperty: emptyString 
     * {String} 设置当鼠标移出map控件时，该控件显示的值。
     */
    emptyString: null,
    
    /** 
     * Property: lastXy
     * {<SuperMap.Pixel>}
     */
    lastXy: null,

    /**
     * APIProperty: displayProjection
     * {<SuperMap.Projection>} 设置鼠标位置的需要进行的投影方式。
     */
    displayProjection: null, 
    
    /**
     * Constructor: SuperMap.Control.MousePosition
     * 
     * Parameters:
     * options - {Object} 设置该类开放的属性值。
     */

    /**
     * Method: destroy
     */
     destroy: function() {
         this.deactivate();
         SuperMap.Control.prototype.destroy.apply(this, arguments);
     },

    /**
     * APIMethod: activate
     * 激活该控件。
     */
    activate: function() {
        if (SuperMap.Control.prototype.activate.apply(this, arguments)) {
            this.map.events.register('mousemove', this, this.redraw);
            this.map.events.register('mouseout', this, this.reset);
            this.redraw();
            return true;
        } else {
            return false;
        }
    },
    
    /**
     * APIMethod: deactivate
     * 取消激活该控件。
     */
    deactivate: function() {
        if (SuperMap.Control.prototype.deactivate.apply(this, arguments)) {
            this.map.events.unregister('mousemove', this, this.redraw);
            this.map.events.unregister('mouseout', this, this.reset);
            this.element.innerHTML = "";
            return true;
        } else {
            return false;
        }
    },

    /**
     * Method: draw
     * {DOMElement}
     */    
    draw: function() {
        SuperMap.Control.prototype.draw.apply(this, arguments);

        if (!this.element) {
            this.div.left = "";
            this.div.top = "";
            this.element = this.div;
        }
        
        return this.div;
    },
   
    /**
     * Method: redraw  
     */
    redraw: function(evt) {

        var lonLat;

        if (evt == null) {
            this.reset();
            return;
        } else {
            if (this.lastXy == null ||
                Math.abs(evt.xy.x - this.lastXy.x) > this.granularity ||
                Math.abs(evt.xy.y - this.lastXy.y) > this.granularity)
            {
                this.lastXy = evt.xy;
                return;
            }

            lonLat = this.map.getLonLatFromPixel(evt.xy);
            if (!lonLat) { 
                // map has not yet been properly initialized
                return;
            }    
            if (this.displayProjection) {
                lonLat.transform(this.map.getProjectionObject(), 
                                 this.displayProjection );
            }      
            this.lastXy = evt.xy;
            
        }
        
        var newHtml = this.formatOutput(lonLat);

        if (newHtml != this.element.innerHTML) {
            this.element.innerHTML = newHtml;
        }
    },

    /**
     * Method: reset
     */
    reset: function(evt) {
        if (this.emptyString != null) {
            this.element.innerHTML = this.emptyString;
        }
    },

    /**
     * Method: formatOutput
     * Override to provide custom display output
     *
     * Parameters:
     * lonLat - {<SuperMap.LonLat>} Location to display
     */
    formatOutput: function(lonLat) {
        var digits = parseInt(this.numDigits);
        var newHtml =
            this.prefix +
            lonLat.lon.toFixed(digits) +
            this.separator + 
            lonLat.lat.toFixed(digits) +
            this.suffix;
        return newHtml;
    },

    CLASS_NAME: "SuperMap.Control.MousePosition"
});
