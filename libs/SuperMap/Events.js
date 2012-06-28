/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */


/**
 * @requires SuperMap/Util.js
 */

/**
 * Namespace: SuperMap.Event
 * 事件处理函数.
 */
SuperMap.Event = {

    /** 
     * Property: observers 
     * {Object} A hashtable cache of the event observers. Keyed by
     * element._eventCacheID 
     */
    observers: false,
    
    /** 
     * Constant: KEY_BACKSPACE 
     * {int} 
     */
    KEY_BACKSPACE: 8,

    /** 
     * Constant: KEY_TAB 
     * {int} 
     */
    KEY_TAB: 9,

    /** 
     * Constant: KEY_RETURN 
     * {int} 
     */
    KEY_RETURN: 13,

    /** 
     * Constant: KEY_ESC 
     * {int} 
     */
    KEY_ESC: 27,

    /** 
     * Constant: KEY_LEFT 
     * {int} 
     */
    KEY_LEFT: 37,

    /** 
     * Constant: KEY_UP 
     * {int} 
     */
    KEY_UP: 38,

    /** 
     * Constant: KEY_RIGHT 
     * {int} 
     */
    KEY_RIGHT: 39,

    /** 
     * Constant: KEY_DOWN 
     * {int} 
     */
    KEY_DOWN: 40,

    /** 
     * Constant: KEY_DELETE 
     * {int} 
     */
    KEY_DELETE: 46,


    /**
     * Method: element
     * Cross browser event element detection.
     * 
     * Parameters:
     * event - {Event} 
     * 
     * Returns:
     * {DOMElement} The element that caused the event 
     */
    element: function(event) {
        return event.target || event.srcElement;
    },

    /**
     * Method: isSingleTouch
     * Determine whether event was caused by a single touch
     *
     * Parameters:
     * event - {Event}
     *
     * Returns:
     * {Boolean}
     */
    isSingleTouch: function(event) {
        return event.touches && event.touches.length == 1;
    },

    /**
     * Method: isMultiTouch
     * Determine whether event was caused by a multi touch
     *
     * Parameters:
     * event - {Event}
     *
     * Returns:
     * {Boolean}
     */
    isMultiTouch: function(event) {
        return event.touches && event.touches.length > 1;
    },

    /**
     * Method: isLeftClick
     * Determine whether event was caused by a left click. 
     *
     * Parameters:
     * event - {Event} 
     * 
     * Returns:
     * {Boolean}
     */
    isLeftClick: function(event) {
        return (((event.which) && (event.which == 1)) ||
                ((event.button) && (event.button == 1)));
    },

    /**
     * Method: isRightClick
     * Determine whether event was caused by a right mouse click. 
     *
     * Parameters:
     * event - {Event} 
     * 
     * Returns:
     * {Boolean}
     */
     isRightClick: function(event) {
        return (((event.which) && (event.which == 3)) ||
                ((event.button) && (event.button == 2)));
    },
     
    /**
     * Method: stop
     * Stops an event from propagating. 
     *
     * Parameters: 
     * event - {Event} 
     * allowDefault - {Boolean} If true, we stop the event chain but 
     *                               still allow the default browser 
     *                               behaviour (text selection, radio-button 
     *                               clicking, etc)
     *                               Default false
     */
    stop: function(event, allowDefault) {
        
        if (!allowDefault) { 
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }
                
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },

    /** 
     * Method: findElement
     * 
     * Parameters:
     * event - {Event} 
     * tagName - {String} 
     * 
     * Returns:
     * {DOMElement} The first node with the given tagName, starting from the
     * node the event was triggered on and traversing the DOM upwards
     */
    findElement: function(event, tagName) {
        var element = SuperMap.Event.element(event);
        while (element.parentNode && (!element.tagName ||
              (element.tagName.toUpperCase() != tagName.toUpperCase()))){
            element = element.parentNode;
        }
        return element;
    },

    /** 
     * APIMethod: observe
     * 监听事件，注册事件处理方法。
     *
     * Parameters:
     * elementParam - {DOMElement || String} 待监听的DOM对象或者其id标识。
     * name - {String} 监听事件的类别名称。
     * observer - {function} 注册的事件处理方法。
     * useCapture - {Boolean} 是否捕获。
     */
    observe: function(elementParam, name, observer, useCapture) {
        var element = SuperMap.Util.getElement(elementParam);
        useCapture = useCapture || false;

        if (name == 'keypress' &&
           (navigator.appVersion.match(/Konqueror|Safari|KHTML/)
           || element.attachEvent)) {
            name = 'keydown';
        }

        //if observers cache has not yet been created, create it
        if (!this.observers) {
            this.observers = {};
        }

        //if not already assigned, make a new unique cache ID
        if (!element._eventCacheID) {
            var idPrefix = "eventCacheID_";
            if (element.id) {
                idPrefix = element.id + "_" + idPrefix;
            }
            element._eventCacheID = SuperMap.Util.createUniqueID(idPrefix);
        }

        var cacheID = element._eventCacheID;

        //if there is not yet a hash entry for this element, add one
        if (!this.observers[cacheID]) {
            this.observers[cacheID] = [];
        }

        //add a new observer to this element's list
        this.observers[cacheID].push({
            'element': element,
            'name': name,
            'observer': observer,
            'useCapture': useCapture
        });

        //add the actual browser event listener
        if (element.addEventListener) {
            element.addEventListener(name, observer, useCapture);
        } else if (element.attachEvent) {
            element.attachEvent('on' + name, observer);
        }
    },

    /** 
     * Method: stopObservingElement
     * Given the id of an element to stop observing, cycle through the 
     *   element's cached observers, calling stopObserving on each one, 
     *   skipping those entries which can no longer be removed.
     * 
     * parameters:
     * elementParam - {DOMElement || String} 
     */
    stopObservingElement: function(elementParam) {
        var element = SuperMap.Util.getElement(elementParam);
        var cacheID = element._eventCacheID;

        this._removeElementObservers(SuperMap.Event.observers[cacheID]);
    },

    /**
     * Method: _removeElementObservers
     *
     * Parameters:
     * elementObservers - {Array(Object)} Array of (element, name, 
     *                                         observer, usecapture) objects, 
     *                                         taken directly from hashtable
     */
    _removeElementObservers: function(elementObservers) {
        if (elementObservers) {
            for(var i = elementObservers.length-1; i >= 0; i--) {
                var entry = elementObservers[i];
                var args = new Array(entry.element,
                                     entry.name,
                                     entry.observer,
                                     entry.useCapture);
                var removed = SuperMap.Event.stopObserving.apply(this, args);
            }
        }
    },

    /**
     * APIMethod: stopObserving
     * 移除事件监听和注册的事件处理方法。注意：事件的移除和监听相对应，移除时的各属性信息必须监听时
     * 保持一致才能确保事件移除成功。
     * 
     * Parameters:
     * elementParam - {DOMElement || String} 被监听的DOM元素或者其id。
     * name - {String} 需要移除的被监听事件名称。
     * observer - {function} 需要移除的事件处理方法。
     * useCapture - {Boolean} 是否捕获。
     *  
     * Returns:
     * {Boolean} Whether or not the event observer was removed
     */
    stopObserving: function(elementParam, name, observer, useCapture) {
        useCapture = useCapture || false;
    
        var element = SuperMap.Util.getElement(elementParam);
        var cacheID = element._eventCacheID;

        if (name == 'keypress') {
            if ( navigator.appVersion.match(/Konqueror|Safari|KHTML/) || 
                 element.detachEvent) {
              name = 'keydown';
            }
        }

        // find element's entry in this.observers cache and remove it
        var foundEntry = false;
        var elementObservers = SuperMap.Event.observers[cacheID];
        if (elementObservers) {
    
            // find the specific event type in the element's list
            var i=0;
            while(!foundEntry && i < elementObservers.length) {
                var cacheEntry = elementObservers[i];
    
                if ((cacheEntry.name == name) &&
                    (cacheEntry.observer == observer) &&
                    (cacheEntry.useCapture == useCapture)) {
    
                    elementObservers.splice(i, 1);
                    if (elementObservers.length == 0) {
                        delete SuperMap.Event.observers[cacheID];
                    }
                    foundEntry = true;
                    break; 
                }
                i++;           
            }
        }
    
        //actually remove the event listener from browser
        if (foundEntry) {
            if (element.removeEventListener) {
                element.removeEventListener(name, observer, useCapture);
            } else if (element && element.detachEvent) {
                element.detachEvent('on' + name, observer);
            }
        }
        return foundEntry;
    },
    
    /** 
     * Method: unloadCache
     * Cycle through all the element entries in the events cache and call
     *   stopObservingElement on each. 
     */
    unloadCache: function() {
        // check for SuperMap.Event before checking for observers, because
        // SuperMap.Event may be undefined in IE if no map instance was
        // created
        if (SuperMap.Event && SuperMap.Event.observers) {
            for (var cacheID in SuperMap.Event.observers) {
                var elementObservers = SuperMap.Event.observers[cacheID];
                SuperMap.Event._removeElementObservers.apply(this, 
                                                           [elementObservers]);
            }
            SuperMap.Event.observers = false;
        }
    },

    CLASS_NAME: "SuperMap.Event"
};

/* prevent memory leaks in IE */
SuperMap.Event.observe(window, 'unload', SuperMap.Event.unloadCache, false);

// FIXME: Remove this in 3.0. In 3.0, Event.stop will no longer be provided
// by SuperMap.
if (window.Event) {
    SuperMap.Util.applyDefaults(window.Event, SuperMap.Event);
} else {
    var Event = SuperMap.Event;
}

/**
 * Class: SuperMap.Events
 */
SuperMap.Events = SuperMap.Class({

    /** 
     * Constant: BROWSER_EVENTS
     * {Array(String)} 支持的事件。
     */
    BROWSER_EVENTS: [
        "mouseover", "mouseout",
        "mousedown", "mouseup", "mousemove", 
        "click", "dblclick", "rightclick", "dblrightclick",
        "resize", "focus", "blur",
        "touchstart", "touchmove", "touchend"
    ],

    /** 
     * Property: listeners 
     * {Object} Hashtable of Array(Function): events listener functions  
     */
    listeners: null,

    /** 
     * Property: object 
     * {Object}  the code object issuing application events 
     */
    object: null,

    /** 
     * Property: element 
     * {DOMElement}  the DOM element receiving browser events 
     */
    element: null,

    /** 
     * Property: eventTypes 
     * {Array(String)}  list of support application events 
     */
    eventTypes: null,

    /** 
     * Property: eventHandler 
     * {Function}  bound event handler attached to elements 
     */
    eventHandler: null,

    /** 
     * APIProperty: fallThrough 
     * {Boolean} 是否允许事件处理之后向上传递（冒泡），为false的时候阻止事件冒泡。
     */
    fallThrough: null,

    /** 
     * APIProperty: includeXY
     * {Boolean} 判断是否让.xy属性自动创建到浏览器上的鼠标事件，一般设置为false，如果设置为true，鼠标事件将会在事件传递过程中自动产生.xy属性。
     * 可根据事件对象的'evt.object'属性在相关的事件句柄上调用getMousePosition函数，如：
     * (code)
     *  function named(evt) { 
     *        this.xy = this.object.events.getMousePosition(evt) 
     *  }
     * (end)
     * 
     * 这个选项习惯默认为false的原因在于，当创建一个事件对象，其主要目的是管理
     * 在一个div的相对定位的鼠标事件,将其设为true也是有意义的。
     * 
     * 这个选项也可以用来控制是否抵消缓存。如果设为false不抵消，如果设为true，用this.clearMouseCache() 清除缓存偏移（边界元素偏移，元素在页面的位置偏移）。
     * 
     * 
    */
    includeXY: false,      

    /**
     * Method: clearMouseListener
     * A version of <clearMouseCache> that is bound to this instance so that
     *     it can be used with <SuperMap.Event.observe> and
     *     <SuperMap.Event.stopObserving>.
     */
    clearMouseListener: null,

    /**
     * Constructor: SuperMap.Events
     * SuperMap.Events 构造函数。
.
     *
     * Parameters:
     * object - {Object} 当前事件对象被添加到的JS对象
     * element - {DOMElement} 响应浏览器事件的dom元素
     * eventTypes - {Array(String)} 自定义应用事件的数组
     * fallThrough - {Boolean} 是否允许事件处理之后向上传递（冒泡），为false的时候阻止事件冒泡
     * options - {Object} 事件对象选项。
     */
    initialize: function (object, element, eventTypes, fallThrough, options) {
        SuperMap.Util.extend(this, options);
        this.object     = object;
        this.fallThrough = fallThrough;
        this.listeners  = {};

        // keep a bound copy of handleBrowserEvent() so that we can
        // pass the same function to both Event.observe() and .stopObserving()
        this.eventHandler = SuperMap.Function.bindAsEventListener(
            this.handleBrowserEvent, this
        );
        
        // to be used with observe and stopObserving
        this.clearMouseListener = SuperMap.Function.bind(
            this.clearMouseCache, this
        );

        // if eventTypes is specified, create a listeners list for each 
        // custom application event.
        this.eventTypes = [];
        if (eventTypes != null) {
            for (var i=0, len=eventTypes.length; i<len; i++) {
                this.addEventType(eventTypes[i]);
            }
        }
        
        // if a dom element is specified, add a listeners list 
        // for browser events on the element and register them
        if (element != null) {
            this.attachToElement(element);
        }
    },

    /**
     * APIMethod: destroy
     * 移除当前要素element上的所有事件监听和处理。
     */
    destroy: function () {
        if (this.element) {
            SuperMap.Event.stopObservingElement(this.element);
            if(this.element.hasScrollEvent) {
                SuperMap.Event.stopObserving(
                    window, "scroll", this.clearMouseListener
                );
            }
        }
        this.element = null;

        this.listeners = null;
        this.object = null;
        this.eventTypes = null;
        this.fallThrough = null;
        this.eventHandler = null;
    },

    /**
     * APIMethod: addEventType
     * 在此事件对象中添加新的事件类型，如果这个事件类型已经添加过了，则不做任何事情。
     * 
     * Parameters:
     * eventName - {String} 事件名。
     */
    addEventType: function(eventName) {
        if (!this.listeners[eventName]) {
            this.eventTypes.push(eventName);
            this.listeners[eventName] = [];
        }
    },

    /**
     * Method: attachToElement
     *
     * Parameters:
     * element - {HTMLDOMElement} a DOM element to attach browser events to
     */
    attachToElement: function (element) {
        if(this.element) {
            SuperMap.Event.stopObservingElement(this.element);
        }
        this.element = element;
        for (var i=0, len=this.BROWSER_EVENTS.length; i<len; i++) {
            var eventType = this.BROWSER_EVENTS[i];

            // every browser event has a corresponding application event 
            // (whether it's listened for or not).
            this.addEventType(eventType);
            
            // use Prototype to register the event cross-browser
            SuperMap.Event.observe(element, eventType, this.eventHandler);
        }
        // disable dragstart in IE so that mousedown/move/up works normally
        SuperMap.Event.observe(element, "dragstart", SuperMap.Event.stop);
    },
    
    /**
     * APIMethod: on
     * 在一个相同的范围内注册监听器的方法，此方法调用<register>函数，例如:
     *
     * Example use:
     * (code)
     * // register a single listener for the "loadstart" event
     * events.on({"loadstart": loadStartListener});
     *
     * // this is equivalent to the following
     * events.register("loadstart", undefined, loadStartListener);
     *
     * // register multiple listeners to be called with the same `this` object
     * events.on({
     *     "loadstart": loadStartListener,
     *     "loadend": loadEndListener,
     *     scope: object
     * });
     *
     * // this is equivalent to the following
     * events.register("loadstart", object, loadStartListener);
     * events.register("loadend", object, loadEndListener);
     * (end)
     *
     * Parameters:
     *  object - {Object}     
     */
    on: function(object) {
        for(var type in object) {
            if(type != "scope") {
                this.register(type, object.scope, object[type]);
            }
        }
    },

    /**
     * APIMethod: register
     * 在事件对象上注册一个事件。当事件被触发时，'func'函数被调用，假设我们触发一个事件，
     * 指定SuperMap.Bounds作为‘obj’,当事件被触发时，回调函数的上下文作为Bounds对象，
     *
     * Parameters:
     * type - {String} 事件注册者的名字
     * obj - {Object} 对象绑定的回调。如果没有特定的对象，则默认是事件的object属性
     * func - {Function} 回调函数，如果没有特定的回调，则这个函数不做任何事情 
     */
    register: function (type, obj, func) {

        if ( (func != null) && 
             (SuperMap.Util.indexOf(this.eventTypes, type) != -1) ) {

            if (obj == null)  {
                obj = this.object;
            }
            var listeners = this.listeners[type];
            listeners.push( {obj: obj, func: func} );
        }
    },

    /**
     * APIMethod: registerPriority
     * 相同的注册方法，但是在前面增加新的监听者事件查询而代替到方法的结束
     *
     * Parameters:
     * type - {String} 事件注册者的名字
     * obj - {Object} 对象绑定方面的回调。如果没有特定的对象，则默认是事件的object属性
     * func - {Function} 回调函数，如果没有特定的回调，则这个函数不做任何事情  
     */
    registerPriority: function (type, obj, func) {

        if (func != null) {
            if (obj == null)  {
                obj = this.object;
            }
            var listeners = this.listeners[type];
            if (listeners != null) {
                listeners.unshift( {obj: obj, func: func} );
            }
        }
    },
    
    /**
     * APIMethod: un
     * 在一个相同的范围内反注册监听器的方法，此方法调用<unregister>函数，例如:
     *
     * Example use:
     * (code)
     * // unregister a single listener for the "loadstart" event
     * events.un({"loadstart": loadStartListener});
     *
     * // this is equivalent to the following
     * events.unregister("loadstart", undefined, loadStartListener);
     *
     * // unregister multiple listeners with the same `this` object
     * events.un({
     *     "loadstart": loadStartListener,
     *     "loadend": loadEndListener,
     *     scope: object
     * });
     *
     * // this is equivalent to the following
     * events.unregister("loadstart", object, loadStartListener);
     * events.unregister("loadend", object, loadEndListener);
     * (end)
     */
    un: function(object) {
        for(var type in object) {
            if(type != "scope") {
                this.unregister(type, object.scope, object[type]);
            }
        }
    },

    /**
     * APIMethod: unregister
     * 反注册
     * 
     * Parameters:
     * type - {String} 
     * obj - {Object} 默认为this.object。
     * func - {Function} 
     */
    unregister: function (type, obj, func) {
        if (obj == null)  {
            obj = this.object;
        }
        var listeners = this.listeners[type];
        if (listeners != null) {
            for (var i=0, len=listeners.length; i<len; i++) {
                if (listeners[i].obj == obj && listeners[i].func == func) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    },

    /** 
     * Method: remove
     * Remove all listeners for a given event type. If type is not registered,
     *     does nothing.
     *
     * Parameters:
     * type - {String} 
     */
    remove: function(type) {
        if (this.listeners[type] != null) {
            this.listeners[type] = [];
        }
    },

    /**
     * APIMethod: triggerEvent
     * 触发一个特定的注册事件.  
     * 
     * Parameters:
     * type - {String} 触发事件类型。
     * evt - {Event} 事件。
     *
     * Returns:
     * {Boolean} 返回监听对象，如果返回是faler(假)，则停止监听。
     */
    triggerEvent: function (type, evt) {
        var listeners = this.listeners[type];

        // fast path
        if(!listeners || listeners.length == 0) {
            return undefined;
        }

        // prep evt object with object & div references
        if (evt == null) {
            evt = {};
        }
        evt.object = this.object;
        evt.element = this.element;
        if(!evt.type) {
            evt.type = type;
        }
    
        // execute all callbacks registered for specified type
        // get a clone of the listeners array to
        // allow for splicing during callbacks
        listeners = listeners.slice();
        var continueChain;
        for (var i=0, len=listeners.length; i<len; i++) {
            var callback = listeners[i];
            // bind the context to callback.obj
            continueChain = callback.func.apply(callback.obj, [evt]);

            if ((continueChain != undefined) && (continueChain == false)) {
                // if callback returns false, execute no more callbacks.
                break;
            }
        }
        // don't fall through to other DOM elements
        if (!this.fallThrough) {           
            SuperMap.Event.stop(evt, true);
        }
        return continueChain;
    },

    /**
     * Method: handleBrowserEvent
     * Basically just a wrapper to the triggerEvent() function, but takes 
     *     care to set a property 'xy' on the event with the current mouse 
     *     position.
     *
     * Parameters:
     * evt - {Event} 
     */
    handleBrowserEvent: function (evt) {
        var type = evt.type, listeners = this.listeners[type];
        if(!listeners || listeners.length == 0) {
            // noone's listening, bail out
            return;
        }
        // add clientX & clientY to all events - corresponds to average x, y
        var touches = evt.touches;
        if (touches && touches[0]) {
            var x = 0;
            var y = 0;
            var num = touches.length;
            var touch;
            for (var i=0; i<num; ++i) {
                touch = touches[i];
                x += touch.clientX;
                y += touch.clientY;
            }
            evt.clientX = x / num;
            evt.clientY = y / num;
        }
        if (this.includeXY) {
            evt.xy = this.getMousePosition(evt);
        } 
        this.triggerEvent(type, evt);
    },

    /**
     * APIMethod: clearMouseCache
     * 清除鼠标缓存。
     */
    clearMouseCache: function() { 
        this.element.scrolls = null;
        this.element.lefttop = null;
        // SuperMap.Util.pagePosition needs to use
        // element.getBoundingClientRect to correctly calculate the offsets
        // for the iPhone, but once the page is scrolled, getBoundingClientRect
        // returns incorrect offsets. So our best bet is to not invalidate the
        // offsets once we have them, and hope that the page was not scrolled
        // when we did the initial calculation.
        var body = document.body;
        if (body && !((body.scrollTop != 0 || body.scrollLeft != 0) &&
                                    navigator.userAgent.match(/iPhone/i))) {
            this.element.offsets = null;
        }
    },      

    /**
     * Method: getMousePosition
     * 
     * Parameters:
     * evt - {Event} 
     * 
     * Returns:
     * {<SuperMap.Pixel>} The current xy coordinate of the mouse, adjusted
     *                      for offsets
     */
    getMousePosition: function (evt) {
        if (!this.includeXY) {
            this.clearMouseCache();
        } else if (!this.element.hasScrollEvent) {
            SuperMap.Event.observe(window, "scroll", this.clearMouseListener);
            this.element.hasScrollEvent = true;
        }
        
        if (!this.element.scrolls) {
            var viewportElement = SuperMap.Util.getViewportElement();
            this.element.scrolls = [
                viewportElement.scrollLeft,
                viewportElement.scrollTop
            ];
        }

        if (!this.element.lefttop) {
            this.element.lefttop = [
                (document.documentElement.clientLeft || 0),
                (document.documentElement.clientTop  || 0)
            ];
        }
        
        if (!this.element.offsets) {
            this.element.offsets = SuperMap.Util.pagePosition(this.element);
        }

        return new SuperMap.Pixel(
            (evt.clientX + this.element.scrolls[0]) - this.element.offsets[0]
                         - this.element.lefttop[0], 
            (evt.clientY + this.element.scrolls[1]) - this.element.offsets[1]
                         - this.element.lefttop[1]
        ); 
    },

    CLASS_NAME: "SuperMap.Events"
});
