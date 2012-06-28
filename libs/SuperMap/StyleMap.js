/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/BaseTypes/Class.js
 * @requires SuperMap/Style.js
 * @requires SuperMap/Feature/Vector.js
 */
 
/**
 * Class: SuperMap.StyleMap
 */
SuperMap.StyleMap = SuperMap.Class({
    
    /**
     * Property: styles
     * Hash of {<SuperMap.Style>}, keyed by names of well known
     * rendering intents (e.g. "default", "temporary", "select", "delete").
     */
    styles: null,
    
    /**
     * Property: extendDefault
     * {Boolean} if true, every render intent will extend the symbolizers
     * specified for the "default" intent at rendering time. Otherwise, every
     * rendering intent will be treated as a completely independent style.
     */
    extendDefault: true,
    
    /**
     * Constructor: SuperMap.StyleMap
     * 
     * Parameters:
     * style   - {Object} 传入的style参数。
     * options - {Object} 此类开出来的属性。
     */
    initialize: function (style, options) {
        this.styles = {
            "default": new SuperMap.Style(
                SuperMap.Feature.Vector.style["default"]),
            "select": new SuperMap.Style(
                SuperMap.Feature.Vector.style["select"]),
            "temporary": new SuperMap.Style(
                SuperMap.Feature.Vector.style["temporary"]),
            "delete": new SuperMap.Style(
                SuperMap.Feature.Vector.style["delete"])
        };
        
        // take whatever the user passed as style parameter and convert it
        // into parts of stylemap.
        if(style instanceof SuperMap.Style) {
            // user passed a style object
            this.styles["default"] = style;
            this.styles["select"] = style;
            this.styles["temporary"] = style;
            this.styles["delete"] = style;
        } else if(typeof style == "object") {
            for(var key in style) {
                if(style[key] instanceof SuperMap.Style) {
                    // user passed a hash of style objects
                    this.styles[key] = style[key];
                } else if(typeof style[key] == "object") {
                    // user passsed a hash of style hashes
                    this.styles[key] = new SuperMap.Style(style[key]);
                } else {
                    // user passed a style hash (i.e. symbolizer)
                    this.styles["default"] = new SuperMap.Style(style);
                    this.styles["select"] = new SuperMap.Style(style);
                    this.styles["temporary"] = new SuperMap.Style(style);
                    this.styles["delete"] = new SuperMap.Style(style);
                    break;
                }
            }
        }
        SuperMap.Util.extend(this, options);
    },

    /**
     * Method: destroy
     */
    destroy: function() {
        for(var key in this.styles) {
            this.styles[key].destroy();
        }
        this.styles = null;
    },
    
    /**
     * Method: createSymbolizer
     * Creates the symbolizer for a feature for a render intent.
     * 
     * Parameters:
     * feature - {<SuperMap.Feature>} The feature to evaluate the rules
     *           of the intended style against.
     * intent  - {String} The intent determines the symbolizer that will be
     *           used to draw the feature. Well known intents are "default"
     *           (for just drawing the features), "select" (for selected
     *           features) and "temporary" (for drawing features).
     * 
     * Returns:
     * {Object} symbolizer hash
     */
    createSymbolizer: function(feature, intent) {
        if(!feature) {
            feature = new SuperMap.Feature.Vector();
        }
        if(!this.styles[intent]) {
            intent = "default";
        }
        feature.renderIntent = intent;
        var defaultSymbolizer = {};
        if(this.extendDefault && intent != "default") {
            defaultSymbolizer = this.styles["default"].createSymbolizer(feature);
        }
        return SuperMap.Util.extend(defaultSymbolizer,
            this.styles[intent].createSymbolizer(feature));
    },
    
    /**
     * Method: addUniqueValueRules
     * Convenience method to create comparison rules for unique values of a
     * property. The rules will be added to the style object for a specified
     * rendering intent. This method is a shortcut for creating something like
     * the "unique value legends" familiar from well known desktop GIS systems
     * 
     * Parameters:
     * renderIntent - {String} rendering intent to add the rules to
     * property     - {String} values of feature attributes to create the
     *                rules for
     * symbolizers  - {Object} Hash of symbolizers, keyed by the desired
     *                property values 
     * context      - {Object} An optional object with properties that
     *                symbolizers' property values should be evaluated
     *                against. If no context is specified, feature.attributes
     *                will be used
     */
    addUniqueValueRules: function(renderIntent, property, symbolizers, context) {
        var rules = [];
        for (var value in symbolizers) {
            rules.push(new SuperMap.Rule({
                symbolizer: symbolizers[value],
                context: context,
                filter: new SuperMap.Filter.Comparison({
                    type: SuperMap.Filter.Comparison.EQUAL_TO,
                    property: property,
                    value: value
                })
            }));
        }
        this.styles[renderIntent].addRules(rules);
    },

    CLASS_NAME: "SuperMap.StyleMap"
});
