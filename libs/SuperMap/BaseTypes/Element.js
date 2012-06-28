/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/BaseTypes.js
 */

/**
 * Namespace: SuperMap.Element
 * SuperMap.Element实现元素的显示，隐藏，删除，取得高度，取得范围等功能
 */
SuperMap.Element = {

    /**
     * APIFunction: visible
     * 
     * Parameters: 
     * element - {DOMElement} 
     * 
     * Returns:
     * {Boolean} 返回元素可见性。
     */
    visible: function(element) {
        return SuperMap.Util.getElement(element).style.display != 'none';
    },

    /**
     * APIFunction: toggle
     * 切换要素可见性
     * 
     * Parameters:
     * element - {DOMElement} 要素，用户可以传入任意数量的元素。
     */
    toggle: function() {
        for (var i=0, len=arguments.length; i<len; i++) {
            var element = SuperMap.Util.getElement(arguments[i]);
            var display = SuperMap.Element.visible(element) ? 'hide' 
                                                              : 'show';
            SuperMap.Element[display](element);
        }
    },


    /**
     * APIFunction: hide
     * *Deprecated*. 已过时。
     * 
     * Parameters:
     * element - {DOMElement} 
     */
    hide: function() {
        for (var i=0, len=arguments.length; i<len; i++) {
            var element = SuperMap.Util.getElement(arguments[i]);
            if (element) {
                element.style.display = 'none';
            }
        }
    },

    /**
     * APIFunction: show
     * *Deprecated*. 已过时。
     * 
     * Parameters:
     * element - {DOMElement} 
     */
    show: function() {
        for (var i=0, len=arguments.length; i<len; i++) {
            var element = SuperMap.Util.getElement(arguments[i]);
            if (element) {
                element.style.display = '';
            }
        }
    },

    /**
     * APIFunction: remove
     * 从DOM元素中移除元素。
     * 
     * Parameters:
     * element - {DOMElement}
     */
    remove: function(element) {
        element = SuperMap.Util.getElement(element);
        element.parentNode.removeChild(element);
    },

    /**
     * APIFunction: getHeight
     *  
     * Parameters:
     * element - {DOMElement}
     * 
     * Returns:
     * {Integer} 返回传入元素的偏移高度
     */
    getHeight: function(element) {
        element = SuperMap.Util.getElement(element);
        return element.offsetHeight;
    },

    /**
     * APIFunction: getDimensions
     * *Deprecated*. 已过时。
     *  
     * Parameters:
     * element - {DOMElement}
     * 
     * Returns:
     * {Object} 返回宽度、高度属性对象。
     */
    getDimensions: function(element) {
        element = SuperMap.Util.getElement(element);
        if (SuperMap.Element.getStyle(element, 'display') != 'none') {
            return {width: element.offsetWidth, height: element.offsetHeight};
        }
    
        // All *Width and *Height properties give 0 on elements with display none,
        // so enable the element temporarily
        var els = element.style;
        var originalVisibility = els.visibility;
        var originalPosition = els.position;
        var originalDisplay = els.display;
        els.visibility = 'hidden';
        els.position = 'absolute';
        els.display = '';
        var originalWidth = element.clientWidth;
        var originalHeight = element.clientHeight;
        els.display = originalDisplay;
        els.position = originalPosition;
        els.visibility = originalVisibility;
        return {width: originalWidth, height: originalHeight};
    },

    /**
     * Function: hasClass
     * Tests if an element has the given CSS class name.
     *
     * Parameters:
     * element - {DOMElement} A DOM element node.
     * name - {String} The CSS class name to search for.
     *
     * Returns:
     * {Boolean} The element has the given class name.
     */
    hasClass: function(element, name) {
        var names = element.className;
        return (!!names && new RegExp("(^|\\s)" + name + "(\\s|$)").test(names));
    },
    
    /**
     * Function: addClass
     * Add a CSS class name to an element.  Safe where element already has
     *     the class name.
     *
     * Parameters:
     * element - {DOMElement} A DOM element node.
     * name - {String} The CSS class name to add.
     *
     * Returns:
     * {DOMElement} The element.
     */
    addClass: function(element, name) {
        if(!SuperMap.Element.hasClass(element, name)) {
            element.className += (element.className ? " " : "") + name;
        }
        return element;
    },

    /**
     * Function: removeClass
     * Remove a CSS class name from an element.  Safe where element does not
     *     have the class name.
     *
     * Parameters:
     * element - {DOMElement} A DOM element node.
     * name - {String} The CSS class name to remove.
     *
     * Returns:
     * {DOMElement} The element.
     */
    removeClass: function(element, name) {
        var names = element.className;
        if(names) {
            element.className = SuperMap.String.trim(
                names.replace(
                    new RegExp("(^|\\s+)" + name + "(\\s+|$)"), " "
                )
            );
        }
        return element;
    },

    /**
     * Function: toggleClass
     * Remove a CSS class name from an element if it exists.  Add the class name
     *     if it doesn't exist.
     *
     * Parameters:
     * element - {DOMElement} A DOM element node.
     * name - {String} The CSS class name to toggle.
     *
     * Returns:
     * {DOMElement} The element.
     */
    toggleClass: function(element, name) {
        if(SuperMap.Element.hasClass(element, name)) {
            SuperMap.Element.removeClass(element, name);
        } else {
            SuperMap.Element.addClass(element, name);
        }
        return element;
    },

    /**
     * APIFunction: getStyle
     * 
     * Parameters:
     * element - {DOMElement}
     * style - {?}
     * 
     * Returns:
     * {?}
     */
    getStyle: function(element, style) {
        element = SuperMap.Util.getElement(element);

        var value = null;
        if (element && element.style) {
            value = element.style[SuperMap.String.camelize(style)];
            if (!value) {
                if (document.defaultView && 
                    document.defaultView.getComputedStyle) {
                    
                    var css = document.defaultView.getComputedStyle(element, null);
                    value = css ? css.getPropertyValue(style) : null;
                } else if (element.currentStyle) {
                    value = element.currentStyle[SuperMap.String.camelize(style)];
                }
            }
        
            var positions = ['left', 'top', 'right', 'bottom'];
            if (window.opera &&
                (SuperMap.Util.indexOf(positions,style) != -1) &&
                (SuperMap.Element.getStyle(element, 'position') == 'static')) { 
                value = 'auto';
            }
        }
    
        return value == 'auto' ? null : value;
    }

};
