/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Layer.js
 * @requires SuperMap/Projection.js
 */

/**
 * Class: SuperMap.Layer.SphericalMercator
 * 与图层混合提供坐标转换功能，以便与使用球面墨卡托投影的商业API共同工作。
 * 将该图层设置为baseLayer，如果其他图层与baseLayer投影相同时可以与其叠加。
 *
 * 设置sphericalMercator属性为true时，该对象的属性和方法会赋给图层。
 *
 * 更多的投影信息:
 *  - http://spatialreference.org/ref/user/google-projection/
 *
 * Proj4 Text:
 *     +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0
 *     +k=1.0 +units=m +nadgrids=@null +no_defs
 *
 * WKT:
 *     900913=PROJCS["WGS84 / Simple Mercator", GEOGCS["WGS 84",
 *     DATUM["WGS_1984", SPHEROID["WGS_1984", 6378137.0, 298.257223563]], 
 *     PRIMEM["Greenwich", 0.0], UNIT["degree", 0.017453292519943295], 
 *     AXIS["Longitude", EAST], AXIS["Latitude", NORTH]],
 *     PROJECTION["Mercator_1SP_Google"], 
 *     PARAMETER["latitude_of_origin", 0.0], PARAMETER["central_meridian", 0.0], 
 *     PARAMETER["scale_factor", 1.0], PARAMETER["false_easting", 0.0], 
 *     PARAMETER["false_northing", 0.0], UNIT["m", 1.0], AXIS["x", EAST],
 *     AXIS["y", NORTH], AUTHORITY["EPSG","900913"]]
 */
SuperMap.Layer.SphericalMercator = {

    /**
     * Method: getExtent
     * Get the map's extent.
     *
     * Returns:
     * {<SuperMap.Bounds>} The map extent.
     */
    getExtent: function() {
        var extent = null;
        if (this.sphericalMercator) {
            extent = this.map.calculateBounds();
        } else {
            extent = SuperMap.Layer.FixedZoomLevels.prototype.getExtent.apply(this);
        }
        return extent;
    },

    /**
     * Method: getLonLatFromViewPortPx
     * Get a map location from a pixel location
     * 
     * Parameters:
     * viewPortPx - {<SuperMap.Pixel>}
     *
     * Returns:
     *  {<SuperMap.LonLat>} An SuperMap.LonLat which is the passed-in view
     *  port SuperMap.Pixel, translated into lon/lat by map lib
     *  If the map lib is not loaded or not centered, returns null
     */
    getLonLatFromViewPortPx: function (viewPortPx) {
        return SuperMap.Layer.prototype.getLonLatFromViewPortPx.apply(this, arguments);
    },
    
    /**
     * Method: getViewPortPxFromLonLat
     * Get a pixel location from a map location
     *
     * Parameters:
     * lonlat - {<SuperMap.LonLat>}
     *
     * Returns:
     * {<SuperMap.Pixel>} An SuperMap.Pixel which is the passed-in
     * SuperMap.LonLat, translated into view port pixels by map lib
     * If map lib is not loaded or not centered, returns null
     */
    getViewPortPxFromLonLat: function (lonlat) {
        return SuperMap.Layer.prototype.getViewPortPxFromLonLat.apply(this, arguments);
    },

    /** 
     * Method: initMercatorParameters 
     * Set up the mercator parameters on the layer: resolutions,
     *     projection, units.
     */
    initMercatorParameters: function() {
        // set up properties for Mercator - assume EPSG:900913
        this.RESOLUTIONS = [];
        var maxResolution = 156543.03390625;
        for(var zoom=0; zoom<=this.MAX_ZOOM_LEVEL; ++zoom) {
            this.RESOLUTIONS[zoom] = maxResolution / Math.pow(2, zoom);
        }
        this.units = "m";
        this.projection = this.projection || "EPSG:900913";
    },

    /**
     * APIMethod: forwardMercator
     * 在EPSG:4326 时，给定一个经纬度坐标，返回球面墨卡托下的点。
     *
     * Parameters:
     * lon - {float} 
     * lat - {float}
     * 
     * Returns:
     * {<SuperMap.LonLat>} 墨卡托下的坐标。
     */
    forwardMercator: function(lon, lat) {
        var x = lon * 20037508.34 / 180;
        var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);

        y = y * 20037508.34 / 180;
        
        return new SuperMap.LonLat(x, y);
    },

    /**
     * APIMethod: inverseMercator
     * 给定一个球面墨卡托下的x，y坐标，返回EPSG:4326下的点。
     * Given a x,y in Spherical Mercator, return a point in EPSG:4326.
     *
     * Parameters:
     * x - {float} A map x in Spherical Mercator.
     * y - {float} A map y in Spherical Mercator.
     * 
     * Returns:
     * {<SuperMap.LonLat>} EPSG:4326 下的点坐标。
     */
    inverseMercator: function(x, y) {

        var lon = (x / 20037508.34) * 180;
        var lat = (y / 20037508.34) * 180;

        lat = 180/Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
        
        return new SuperMap.LonLat(lon, lat);
    },

    /**
     * Method: projectForward 
     * Given an object with x and y properties in EPSG:4326, modify the x,y
     * properties on the object to be the Spherical Mercator projected
     * coordinates.
     *
     * Parameters:
     * point - {Object} An object with x and y properties. 
     * 
     * Returns:
     * {Object} The point, with the x and y properties transformed to spherical
     * mercator.
     */
    projectForward: function(point) {
        var lonlat = SuperMap.Layer.SphericalMercator.forwardMercator(point.x, point.y);
        point.x = lonlat.lon;
        point.y = lonlat.lat;
        return point;
    },
    
    /**
     * Method: projectInverse
     * Given an object with x and y properties in Spherical Mercator, modify
     * the x,y properties on the object to be the unprojected coordinates.
     *
     * Parameters:
     * point - {Object} An object with x and y properties. 
     * 
     * Returns:
     * {Object} The point, with the x and y properties transformed from
     * spherical mercator to unprojected coordinates..
     */
    projectInverse: function(point) {
        var lonlat = SuperMap.Layer.SphericalMercator.inverseMercator(point.x, point.y);
        point.x = lonlat.lon;
        point.y = lonlat.lat;
        return point;
    }

};

/**
 * Note: Transforms for web mercator <-> EPSG:4326
 * SuperMap recognizes EPSG:3857, EPSG:900913, EPSG:102113 and EPSG:102100.
 * SuperMap originally started referring to EPSG:900913 as web mercator.
 * The EPSG has declared EPSG:3857 to be web mercator.  
 * ArcGIS 10 recognizes the EPSG:3857, EPSG:102113, and EPSG:102100 as 
 * equivalent.  See http://blogs.esri.com/Dev/blogs/arcgisserver/archive/2009/11/20/ArcGIS-Online-moving-to-Google-_2F00_-Bing-tiling-scheme_3A00_-What-does-this-mean-for-you_3F00_.aspx#12084
 */
(function() {
    
    // list of equivalent codes for web mercator
    var codes = ["EPSG:900913", "EPSG:3857", "EPSG:102113", "EPSG:102100"];
    
    var add = SuperMap.Projection.addTransform;
    var merc = SuperMap.Layer.SphericalMercator;
    var same = SuperMap.Projection.nullTransform;
    
    var i, len, code, other, j;
    for (i=0, len=codes.length; i<len; ++i) {
        code = codes[i];
        add("EPSG:4326", code, merc.projectForward);
        add(code, "EPSG:4326", merc.projectInverse);
        for (j=i+1; j<len; ++j) {
            other = codes[j];
            add(code, other, same);
            add(other, code, same);
        }
    }
    
})();
