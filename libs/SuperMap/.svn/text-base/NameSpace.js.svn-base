/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/BaseTypes/Class.js
 */

//SuperMap NameSpace
window.SuperMap = {

    VERSION_NUMBER: "Release 6.1.1",

    /**
     * Method: _getScriptLocation
     * Return the path to this script. This is also implemented in
     * SuperMap.js
     *
     * Returns:
     * {String} Path to this script
     */
    _getScriptLocation: (function() {
        //SuperMap-6.1.1-8828
        var r = new RegExp("(^|(.*?\\/))(SuperMap(-(\\d{1}\.)*\\d{1}-\\d{4,})?\.js)(\\?|$)"),
            s = document.getElementsByTagName('script'),
            src, m, l = "";
        for(var i=0, len=s.length; i<len; i++) {
            src = s[i].getAttribute('src');
            if(src) {
                var m = src.match(r);
                if(m) {
                    l = m[1];
                    break;
                }
            }
        }
        return (function() { return l; });
    })()
};

SuperMap.Control = SuperMap.Control || {};

SuperMap.Util = SuperMap.Util || {};

SuperMap.REST = SuperMap.REST || {};

SuperMap.Layer = SuperMap.Layer || {};

SuperMap.Tile = SuperMap.Tile || {};



