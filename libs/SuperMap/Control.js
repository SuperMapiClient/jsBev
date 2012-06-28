/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/BaseTypes/Class.js
 */

/**
 * Class: SuperMap.Control
 * 控件类，提供了多种控件，比如比例尺控件，鹰眼控件，缩放条控件等等，
 * 控件影响地图显示和地图操作，在没有指定控件的情况下，地图默认添加 Navigation、PanZoomBar 控件。
 * 也可通过参数options传入的div添加控件到一个外部的div。 
 * 
 * 例如:
 * 下面的示例演示如何在地图上添加多种控件的方法：
 * 
 * > var map = new SuperMap.Map('map', { controls: [] });
 * >
 * > map.addControl(new SuperMap.Control.LayerSwitcher({'ascending':false}));
 * > map.addControl(new SuperMap.Control.MousePosition());
 * > map.addControl(new SuperMap.Control.OverviewMap());
 * > map.addControl(new SuperMap.Control.KeyboardDefaults());
 *
 * 下面的代码片段是一个关于用户如何截获移动鼠标单击显示拖出的边界框的范围简单的例子，如下：
 *
 * > var control = new SuperMap.Control();
 * > SuperMap.Util.extend(control, {
 * >     draw: function () {
 * >         this.box = new SuperMap.Handler.Box( control, 
 * >             {"done": this.notice},
 * >             {keyMask: SuperMap.Handler.MOD_SHIFT});
 * >         this.box.activate();
 * >     },
 * >
 * >     notice: function (bounds) {
 * >     }
 * > }); 
 * > map.addControl(control);
 * 
 */
SuperMap.Control = SuperMap.Class({

    /** 
     * Property: id 
     * {String} 
     */
    id: null,
    
    /** 
     * Property: map 
     * {<SuperMap.Map>} this gets set in the addControl() function in
     * SuperMap.Map 
     */
    map: null,

    /** 
     * APIProperty: div 
     * {DOMElement} 包含控件的要素，如果设为null，则控件放置在地图内部。 
     */
    div: null,

    /** 
     * APIProperty: type 
     * {Number} 控件的类型。 
     */
    type: null, 

    /** 
     * Property: allowSelection
     * {Boolean} By deafault, controls do not allow selection, because
     * it may interfere with map dragging. If this is true, SuperMap
     * will not prevent selection of the control.
     * Default is false.
     */
    allowSelection: false,  

    /** 
     * Property: displayClass 
     * {string}  This property is used for CSS related to the drawing of the
     * Control. 
     */
    displayClass: "",
    
    /**
    * APIProperty: title  
    * {string}  此属性用来在控件上显示一个提示框
    */ 
    title: "",

    /**
     * APIProperty: autoActivate
     * {Boolean} 当控件添加到地图上时激活此控件。默认为false。
     */
    autoActivate: false,

    /** 
     * APIProperty: active 
     * {Boolean} 控件是激活状态（只读），用activate、deactivate可以改变控件的状态。
     */
    active: null,

    /** 
     * Property: handler 
     * {<SuperMap.Handler>} null
     */
    handler: null,

    /**
     * APIProperty: eventListeners
     * {Object} 如果设置为构造函数的一个选项，eventListeners将被SuperMap.Events.on 注册，
     * 对象结构必须是一个监听器对象，具体例子详细参见events.on方法。
     */
    eventListeners: null,

    /** 
     * APIProperty: events
     * {SuperMap.Events} 注册控件特定事件的监听器实例。
     */
    events: null,

    /**
     * Constant: EVENT_TYPES
     * {Array(String)} 支持的事件类型。注册特定事件的监听器，示例如下：
     * (code)
     * control.events.register(type, obj, listener);
     * (end)
     *
     * event对象具备以下属性：
     * 
     * object - {Object} control.events.object的引用。
     * element - {DOMElement} control.events.element的引用（除非被记录否则将是空值）。 
     *
     * 支持的地图事件类型：
     *
     * activate - 控件激活时触发此事件
     * deactivate - 控件失效时触发此事件
     */
    EVENT_TYPES: ["activate", "deactivate"],

    /**
     * Constructor: SuperMap.Control
     * 创建控件，options作为参数传递直接扩展控件.如下面的例子所示：
     * 
     * > var control = new SuperMap.Control({div: myDiv});
     *
     * 重写默认属性值为null的div。
     * 
     * Parameters:
     * options - {Object} 
     */
    initialize: function (options) {
        // We do this before the extend so that instances can override
        // className in options.
        this.displayClass = 
            this.CLASS_NAME.replace("SuperMap.", "ol").replace(/\./g, "");
        
        SuperMap.Util.extend(this, options);
        
        this.events = new SuperMap.Events(this, null, this.EVENT_TYPES);
        if(this.eventListeners instanceof Object) {
            this.events.on(this.eventListeners);
        }
        if (this.id == null) {
            this.id = SuperMap.Util.createUniqueID(this.CLASS_NAME + "_");
        }
    },

    /**
     * Method: destroy
     * The destroy method is used to perform any clean up before the control
     * is dereferenced.  Typically this is where event listeners are removed
     * to prevent memory leaks.
     */
    destroy: function () {
        if(this.events) {
            if(this.eventListeners) {
                this.events.un(this.eventListeners);
            }
            this.events.destroy();
            this.events = null;
        }
        this.eventListeners = null;

        // eliminate circular references
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }
        if(this.handlers) {
            for(var key in this.handlers) {
                if(this.handlers.hasOwnProperty(key) &&
                   typeof this.handlers[key].destroy == "function") {
                    this.handlers[key].destroy();
                }
            }
            this.handlers = null;
        }
        if (this.map) {
            this.map.removeControl(this);
            this.map = null;
        }
        this.div = null;
    },

    /** 
     * Method: setMap
     * Set the map property for the control. This is done through an accessor
     * so that subclasses can override this and take special action once 
     * they have their map variable set. 
     *
     * Parameters:
     * map - {<SuperMap.Map>} 
     */
    setMap: function(map) {
        this.map = map;
        if (this.handler) {
            this.handler.setMap(map);
        }
    },
  
    /**
     * Method: draw
     * The draw method is called when the control is ready to be displayed
     * on the page.  If a div has not been created one is created.  Controls
     * with a visual component will almost always want to override this method 
     * to customize the look of control. 
     *
     * Parameters:
     * px - {<SuperMap.Pixel>} The top-left pixel position of the control
     *      or null.
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the control
     */
    draw: function (px) {
        if (this.div == null) {
            this.div = SuperMap.Util.createDiv(this.id);
            this.div.className = this.displayClass;
            if (!this.allowSelection) {
                this.div.className += " olControlNoSelect";
                this.div.setAttribute("unselectable", "on", 0);
                this.div.onselectstart = SuperMap.Function.False; 
            }    
            if (this.title != "") {
                this.div.title = this.title;
            }
        }
        if (px != null) {
            this.position = px.clone();
        }
        this.moveTo(this.position);
        return this.div;
    },

    /**
     * Method: moveTo
     * Sets the left and top style attributes to the passed in pixel 
     * coordinates.
     *
     * Parameters:
     * px - {<SuperMap.Pixel>}
     */
    moveTo: function (px) {
        if ((px != null) && (this.div != null)) {
            this.div.style.left = px.x + "px";
            this.div.style.top = px.y + "px";
        }
    },

    /**
     * APIMethod: activate
     * 激活控件及其相关的处理事件(handler)，控件失效调用deactivate方法。
     * 
     * Returns:
     * {Boolean}  如果控件成功激活则为true，如果控件已经是激活状态则为false。
     */
    activate: function () {
        if (this.active) {
            return false;
        }
        if (this.handler) {
            this.handler.activate();
        }
        this.active = true;
        if(this.map) {
            SuperMap.Element.addClass(
                this.map.viewPortDiv,
                this.displayClass.replace(/ /g, "") + "Active"
            );
        }
        this.events.triggerEvent("activate");
        return true;
    },
    
    /**
     * APIMethod: deactivate
     * 使控件及其相关的处理事件(handler)失效。
     * 
     * Returns:
     * {Boolean} 如果控件得到有效的停用则为true，如果控件已经是失效停用状态则为false。
     */
    deactivate: function () {
        if (this.active) {
            if (this.handler) {
                this.handler.deactivate();
            }
            this.active = false;
            if(this.map) {
                SuperMap.Element.removeClass(
                    this.map.viewPortDiv,
                    this.displayClass.replace(/ /g, "") + "Active"
                );
            }
            this.events.triggerEvent("deactivate");
            return true;
        }
        return false;
    },

    CLASS_NAME: "SuperMap.Control"
});

/**
 * Constant: SuperMap.Control.TYPE_BUTTON
 */
SuperMap.Control.TYPE_BUTTON = 1;

/**
 * Constant: SuperMap.Control.TYPE_TOGGLE
 */
SuperMap.Control.TYPE_TOGGLE = 2;

/**
 * Constant: SuperMap.Control.TYPE_TOOL
 */
SuperMap.Control.TYPE_TOOL   = 3;
