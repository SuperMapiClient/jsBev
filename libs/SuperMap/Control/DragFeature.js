/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */


/**
 * @requires SuperMap/Control.js
 * @requires SuperMap/Handler/Drag.js
 * @requires SuperMap/Handler/Feature.js
 */

/**
 * Class: SuperMap.Control.DragFeature
 * 使用此类可以通过鼠标拖拽达到移动对象的目的。
 *
 * Inherits From:
 *  - <SuperMap.Control>
 */
SuperMap.Control.DragFeature = SuperMap.Class(SuperMap.Control, {

    /**
     * APIProperty: geometryTypes
     * {Array(String)} 设置该属性可以限制操作对象的类型，例如：若实现只拖拽点要素，可将该属性值设置为
     * ['SuperMap.Geometry.Point']
     */
    geometryTypes: null,
    
    /**
     * APIProperty: onStart
     * {Function} 拖拽开始时执行的方法。该方法传递两个参数：拖拽的矢量要素、鼠标当前位置。
     *
     * Parameters:
     * feature - {<SuperMap.Feature.Vector>} 拖拽的要素。
     * pixel - {<SuperMap.Pixel>} 鼠标当前的位置。
     */
    onStart: function(feature, pixel) {},

    /**
     * APIProperty: onDrag
     * {Function} 矢量要素的每一次移动都会调用该方法。该方法传递两个参数：拖拽的矢量要素、鼠标当前位置。
     *
     * Parameters:
     * feature - {<SuperMap.Feature.Vector>} 拖拽的要素。
     * pixel - {<SuperMap.Pixel>} 鼠标当前的位置。
     */
    onDrag: function(feature, pixel) {},

    /**
     * APIProperty: onComplete
     * {Function} 拖拽完成时都会调用该方法。该方法传递两个参数：拖拽的矢量要素、鼠标当前位置。
     *
     * Parameters:
     * feature - {<SuperMap.Feature.Vector>} 拖拽的要素。
     * pixel - {<SuperMap.Pixel>} 鼠标当前的位置。
     */
    onComplete: function(feature, pixel) {},

    /**
     * APIProperty: onEnter
     * {Function} 当鼠标悬浮在矢量要素上，即将执行拖拽时执行该函数。该函数传递一个参数：准备拖拽的对象。
     *
     * Parameters:
     * feature - {<SuperMap.Feature.Vector>} 准备拖拽的对象。
     */
    onEnter: function(feature) {},

    /**
     * APIProperty: onLeave
     * {Function} 当拖拽执行完毕，鼠标即将离开矢量要素时执行该函数。
     *
     * Parameters:
     * feature - {<SuperMap.Feature.Vector>} 被拖拽的矢量要素。
     */
    onLeave: function(feature) {},

    /**
     * APIProperty: documentDrag
     * {Boolean} 当该属性为true，拖拽要素时，鼠标移动到地图可视区域外依然有效。默认为false。
     */
    documentDrag: false,
    
    /**
     * Property: layer
     * {<SuperMap.Layer.Vector>}
     */
    layer: null,
    
    /**
     * Property: feature
     * {<SuperMap.Feature.Vector>}
     */
    feature: null,

    /**
     * Property: dragCallbacks
     * {Object} The functions that are sent to the drag handler for callback.
     */
    dragCallbacks: {},

    /**
     * Property: featureCallbacks
     * {Object} The functions that are sent to the feature handler for callback.
     */
    featureCallbacks: {},
    
    /**
     * Property: lastPixel
     * {<SuperMap.Pixel>}
     */
    lastPixel: null,

    /**
     * Constructor: SuperMap.Control.DragFeature
     * 构造拖拽控件。
     *
     * Parameters:
     * layer - {<SuperMap.Layer.Vector>} 可执行拖拽操作的矢量图层。
     *
     * options - {Object} 可选参数。包括该类开放的接口。
     */
    initialize: function(layer, options) {
        SuperMap.Control.prototype.initialize.apply(this, [options]);
        this.layer = layer;
        this.handlers = {
            drag: new SuperMap.Handler.Drag(
                this, SuperMap.Util.extend({
                    down: this.downFeature,
                    move: this.moveFeature,
                    up: this.upFeature,
                    out: this.cancel,
                    done: this.doneDragging
                }, this.dragCallbacks), {
                    documentDrag: this.documentDrag
                }
            ),
            feature: new SuperMap.Handler.Feature(
                this, this.layer, SuperMap.Util.extend({
                    // 'click' and 'clickout' callback are for the mobile
                    // support: no 'over' or 'out' in touch based browsers.
                    click: this.clickFeature,
                    clickout: this.clickoutFeature,
                    over: this.overFeature,
                    out: this.outFeature
                }, this.featureCallbacks),
                {geometryTypes: this.geometryTypes}
            )
        };
    },

    /**
     * Method: clickFeature
     * Called when the feature handler detects a click-in on a feature.
     *
     * Parameters:
     * feature - {<SuperMap.Feature.Vector>}
     */
    clickFeature: function(feature) {
        if (this.handlers.feature.touch && !this.over && this.overFeature(feature)) {
            this.handlers.drag.dragstart(this.handlers.feature.evt);
            // to let the events propagate to the feature handler (click callback)
            this.handlers.drag.stopDown = false;
        }
    },

    /**
     * Method: clickoutFeature
     * Called when the feature handler detects a click-out on a feature.
     *
     * Parameters:
     * feature - {<SuperMap.Feature.Vector>}
     */
    clickoutFeature: function(feature) {
        if (this.handlers.feature.touch && this.over) {
            this.outFeature(feature);
            this.handlers.drag.stopDown = true;
        }
    },

    /**
     * APIMethod: destroy
     * 销毁该类，释放引用的资源。
     */
    destroy: function() {
        this.layer = null;
        SuperMap.Control.prototype.destroy.apply(this, []);
    },

    /**
     * APIMethod: activate
     * 激活控件和要素处理程序。
     * 
     * Returns:
     * {Boolean} 操作执行是否成功。
     */
    activate: function() {
        return (this.handlers.feature.activate() &&
                SuperMap.Control.prototype.activate.apply(this, arguments));
    },

    /**
     * APIMethod: deactivate
     * 取消激活控件和要素处理函数。
     * 
     * Returns:
     * {Boolean} 操作执行是否成功。
     */
    deactivate: function() {
        // the return from the handlers is unimportant in this case
        this.handlers.drag.deactivate();
        this.handlers.feature.deactivate();
        this.feature = null;
        this.dragging = false;
        this.lastPixel = null;
        SuperMap.Element.removeClass(
            this.map.viewPortDiv, this.displayClass + "Over"
        );
        return SuperMap.Control.prototype.deactivate.apply(this, arguments);
    },

    /**
     * Method: overFeature
     * Called when the feature handler detects a mouse-over on a feature.
     *     This activates the drag handler.
     *
     * Parameters:
     * feature - {<SuperMap.Feature.Vector>} The selected feature.
     *
     * Returns:
     * {Boolean} Successfully activated the drag handler.
     */
    overFeature: function(feature) {
        var activated = false;
        if(!this.handlers.drag.dragging) {
            this.feature = feature;
            this.handlers.drag.activate();
            activated = true;
            this.over = true;
            SuperMap.Element.addClass(this.map.viewPortDiv, this.displayClass + "Over");
            this.onEnter(feature);
        } else {
            if(this.feature.id == feature.id) {
                this.over = true;
            } else {
                this.over = false;
            }
        }
        return activated;
    },

    /**
     * Method: downFeature
     * Called when the drag handler detects a mouse-down.
     *
     * Parameters:
     * pixel - {<SuperMap.Pixel>} Location of the mouse event.
     */
    downFeature: function(pixel) {
        this.lastPixel = pixel;
        this.onStart(this.feature, pixel);
    },

    /**
     * Method: moveFeature
     * Called when the drag handler detects a mouse-move.  Also calls the
     *     optional onDrag method.
     * 
     * Parameters:
     * pixel - {<SuperMap.Pixel>} Location of the mouse event.
     */
    moveFeature: function(pixel) {
        var res = this.map.getResolution();
        this.feature.geometry.move(res * (pixel.x - this.lastPixel.x),
                                   res * (this.lastPixel.y - pixel.y));
        this.layer.drawFeature(this.feature);
        this.lastPixel = pixel;
        this.onDrag(this.feature, pixel);
    },

    /**
     * Method: upFeature
     * Called when the drag handler detects a mouse-up.
     * 
     * Parameters:
     * pixel - {<SuperMap.Pixel>} Location of the mouse event.
     */
    upFeature: function(pixel) {
        if(!this.over) {
            this.handlers.drag.deactivate();
        }
    },

    /**
     * Method: doneDragging
     * Called when the drag handler is done dragging.
     *
     * Parameters:
     * pixel - {<SuperMap.Pixel>} The last event pixel location.  If this event
     *     came from a mouseout, this may not be in the map viewport.
     */
    doneDragging: function(pixel) {
        this.onComplete(this.feature, pixel);
    },

    /**
     * Method: outFeature
     * Called when the feature handler detects a mouse-out on a feature.
     *
     * Parameters:
     * feature - {<SuperMap.Feature.Vector>} The feature that the mouse left.
     */
    outFeature: function(feature) {
        if(!this.handlers.drag.dragging) {
            this.over = false;
            this.handlers.drag.deactivate();
            SuperMap.Element.removeClass(
                this.map.viewPortDiv, this.displayClass + "Over"
            );
            this.onLeave(feature);
            this.feature = null;
        } else {
            if(this.feature.id == feature.id) {
                this.over = false;
            }
        }
    },
        
    /**
     * Method: cancel
     * Called when the drag handler detects a mouse-out (from the map viewport).
     */
    cancel: function() {
        this.handlers.drag.deactivate();
        this.over = false;
    },

    /**
     * Method: setMap
     * Set the map property for the control and all handlers.
     *
     * Parameters: 
     * map - {<SuperMap.Map>} The control's map.
     */
    setMap: function(map) {
        this.handlers.drag.setMap(map);
        this.handlers.feature.setMap(map);
        SuperMap.Control.prototype.setMap.apply(this, arguments);
    },

    CLASS_NAME: "SuperMap.Control.DragFeature"
});
