/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/BaseTypes/Class.js
 */

/**
 * Class: SuperMap.LonLat
 * 此类描绘一对经纬度坐标。
 */
SuperMap.LonLat = SuperMap.Class({

    /** 
     * APIProperty: lon
     * {Float} X轴坐标。
     */
    lon: 0.0,
    
    /** 
     * APIProperty: lat
     * {Float} Y轴坐标。
     */
    lat: 0.0,

    /**
     * Constructor: SuperMap.LonLat
     * 创建一个新的地图位置，如：
     * (start code)
     *  var lonLat = new SuperMap.LonLat(30,45);
     *  (end) 
     * 	 
     * Parameters:
     * lon - {Number} 地图单位上的X轴坐标，如果地图是地理投影，则此值是经度，否则，此值是地图地理位置的x坐标。 
     * lat - {Number} 地图单位上的Y轴坐标，如果地图是地理投影，则此值是纬度，否则，此值是地图地理位置的y坐标。
     */
    initialize: function(lon, lat) {
        this.lon = SuperMap.Util.toFloat(lon);
        this.lat = SuperMap.Util.toFloat(lat);
    },
    
    /**
     * Method: toString
     * Return a readable string version of the lonlat
     *
     * Returns:
     * {String} String representation of SuperMap.LonLat object. 
     *           (e.g. <i>"lon=5,lat=42"</i>)
     */
    toString:function() {
        return ("lon=" + this.lon + ",lat=" + this.lat);
    },

    /** 
     * APIMethod: toShortString
     * 
     * Returns:
     * {String} 返回处理后的经纬度字符串 
     *         (e.g. <i>"5, 42"</i>)
     */
    toShortString:function() {
        return (this.lon + ", " + this.lat);
    },

    /** 
     * APIMethod: clone
     * 
     * Returns:
     * {<SuperMap.LonLat>} 克隆LonLat对象 
     */
    clone:function() {
        return new SuperMap.LonLat(this.lon, this.lat);
    },

    /** 
     * APIMethod: add
     * 
     * Parameters:
     * lon - {Float}
     * lat - {Float}
     * 
     * Returns:
     * {<SuperMap.LonLat>} 返回一个新的LonLat对象，此对象的经纬度是由传入的经纬度与当前的经纬度相加所得。
     */
    add:function(lon, lat) {
        if ( (lon == null) || (lat == null) ) {
            return null;
        }
        return new SuperMap.LonLat(this.lon + SuperMap.Util.toFloat(lon), 
                                     this.lat + SuperMap.Util.toFloat(lat));
    },

    /** 
     * APIMethod: equals
     * 
     * Parameters:
     * ll - {<SuperMap.LonLat>} 
     * 
     * Returns:
     * {Boolean} 如果LonLat对象的经纬度和传入的经纬度一致则返回true,不一致或传入的ll为NULL则返回false.
     */
    equals:function(ll) {
        var equals = false;
        if (ll != null) {
            equals = ((this.lon == ll.lon && this.lat == ll.lat) ||
                      (isNaN(this.lon) && isNaN(this.lat) && isNaN(ll.lon) && isNaN(ll.lat)));
        }
        return equals;
    },

    /**
     * APIMethod: transform
     * 经纬度对象的投影转换。
     *
     * Parameters: 
     * source - {<SuperMap.Projection>} 源投影 
     * dest   - {<SuperMap.Projection>} 目标投影 
     *
     * Returns:
     * {<SuperMap.LonLat>} 返回LonLat。
     */
    transform: function(source, dest) {
        var point = SuperMap.Projection.transform(
            {'x': this.lon, 'y': this.lat}, source, dest);
        this.lon = point.x;
        this.lat = point.y;
        return this;
    },
    
    /**
     * APIMethod: wrapDateLine
     * 
     * Parameters:
     * maxExtent - {<SuperMap.Bounds>} 最大边界的范围
     * 
     * Returns:
     * {<SuperMap.LonLat>} 克隆当前的经纬度。
     */
    wrapDateLine: function(maxExtent) {    

        var newLonLat = this.clone();
    
        if (maxExtent) {
            //shift right?
            while (newLonLat.lon < maxExtent.left) {
                newLonLat.lon +=  maxExtent.getWidth();
            }    
           
            //shift left?
            while (newLonLat.lon > maxExtent.right) {
                newLonLat.lon -= maxExtent.getWidth();
            }    
        }
                
        return newLonLat;
    },

    CLASS_NAME: "SuperMap.LonLat"
});

/** 
 * Function: fromString
 * Alternative constructor that builds a new <SuperMap.LonLat> from a 
 *     parameter string
 * 
 * Parameters:
 * str - {String} Comma-separated Lon,Lat coordinate string. 
 *                 (e.g. <i>"5,40"</i>)
 * 
 * Returns:
 * {<SuperMap.LonLat>} New <SuperMap.LonLat> object built from the 
 *                       passed-in String.
 */
SuperMap.LonLat.fromString = function(str) {
    var pair = str.split(",");
    return new SuperMap.LonLat(pair[0], pair[1]);
};

/** 
 * Function: fromArray
 * Alternative constructor that builds a new <SuperMap.LonLat> from an 
 *     array of two numbers that represent lon- and lat-values.
 * 
 * Parameters:
 * arr - {Array(Float)} Array of lon/lat values (e.g. [5,-42])
 * 
 * Returns:
 * {<SuperMap.LonLat>} New <SuperMap.LonLat> object built from the 
 *                       passed-in array.
 */
SuperMap.LonLat.fromArray = function(arr) {
    var gotArr = SuperMap.Util.isArray(arr),
        lon = gotArr && arr[0],
        lat = gotArr && arr[1];
    return new SuperMap.LonLat(lon, lat);
};
