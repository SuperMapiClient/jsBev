/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for
 * full list of contributors). Published under the Clear BSD license.
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Control.js
 * @requires SuperMap/Geometry/Point.js
 * @requires SuperMap/Projection.js
 */

/**
 * Class: SuperMap.Control.Geolocate
 * 地理定位控件包装了w3c 的geolocation 接口，与map结合使用；在位置改变时可以响应事件。
 *
 * 如果map控件的投影不是 EPSG:4326 或者 EPSG:900913 时需要加载proj4js 库。
 *
 * Inherits from:
 *  - <SuperMap.Control>
 */
SuperMap.Control.Geolocate = SuperMap.Class(SuperMap.Control, {

    /**
     * Constant: EVENT_TYPES
     * 支持的事件类型:
     *  - *locationupdated* 当浏览器返回新的位置时触发。
     *  - *locationfailed* 当地理定位失败时触发。
     *  - *locationuncapable* 当前浏览器不支持地理定位时触发。
     */
    EVENT_TYPES: ["locationupdated", "locationfailed", "locationuncapable"],

    /**
     * Property: geolocation
     * {Object} The geolocation engine, as a property to be possibly mocked.
     */
    geolocation: navigator.geolocation,

    /**
     * APIProperty: bind
     * {Boolean} 地理位置改变时，当前地图的中心点是否变化。默认为true，地图中心点会变化。
     */
    bind: true,

    /**
     * APIProperty: watch
     * {Boolean} 地理位置是否经常更新。默认为false，地理位置不会更新。
     */
    watch: false,

    /**
     * APIProperty: geolocationOptions
     * {Object} 传递给geolocation api 的可选参数。默认不传递任何参数。
     *     参数可参考：<http://dev.w3.org/geo/api/spec-source.html>. 
     */
    geolocationOptions: null,

    /**
     * Constructor: SuperMap.Control.Geolocate
     * 创建新对象。
     *
     */
    initialize: function(options) {
        // concatenate events specific to this control with those from the base
        this.EVENT_TYPES =
            SuperMap.Control.Geolocate.prototype.EVENT_TYPES.concat(
            SuperMap.Control.prototype.EVENT_TYPES
        );
        this.geolocationOptions = {};
        SuperMap.Control.prototype.initialize.apply(this, [options]);
    },

    /**
     * Method: destroy
     */
    destroy: function() {
        this.deactivate();
        SuperMap.Control.prototype.destroy.apply(this, arguments);
    },

    /**
     * Method: activate
     * Activates the control.
     *
     * Returns:
     * {Boolean} The control was effectively activated.
     */
    activate: function () {
        if (!this.geolocation) {
            this.events.triggerEvent("locationuncapable");
            return false;
        }
        if (SuperMap.Control.prototype.activate.apply(this, arguments)) {
            if (this.watch) {
                this.watchId = this.geolocation.watchPosition(
                    SuperMap.Function.bind(this.geolocate, this),
                    SuperMap.Function.bind(this.failure, this),
                    this.geolocationOptions
                );
            } else {
                this.getCurrentLocation();
            }
            return true;
        }
        return false;
    },

    /**
     * Method: deactivate
     * Deactivates the control.
     *
     * Returns:
     * {Boolean} The control was effectively deactivated.
     */
    deactivate: function () {
        if (this.active && this.watchId !== null) {
            this.geolocation.clearWatch(this.watchId);
        }
        return SuperMap.Control.prototype.deactivate.apply(
            this, arguments
        );
    },

    /**
     * Method: geolocate
     * Activates the control.
     *
     */
    geolocate: function (position) {
        var center = new SuperMap.LonLat(
            position.coords.longitude,
            position.coords.latitude
        ).transform(
            new SuperMap.Projection("EPSG:4326"),
            this.map.getProjectionObject()
        );
        if (this.bind) {
            this.map.setCenter(center);
        }
        this.events.triggerEvent("locationupdated", {
            position: position,
            point: new SuperMap.Geometry.Point(
                center.lon, center.lat
            )
        });
    },

    /**
     * APIMethod: getCurrentLocation
     * 获取当前的地理位置。
     *
     * Returns:
     * {Boolean} 当前控件未激活或者watch属性为false时返回false，否则返回true。
     */
    getCurrentLocation: function() {
        if (!this.active || this.watch) {
            return false;
        }
        this.geolocation.getCurrentPosition(
            SuperMap.Function.bind(this.geolocate, this),
            SuperMap.Function.bind(this.failure, this),
            this.geolocationOptions
        );
        return true;
    },

    /**
     * Method: failure
     * method called on browser's geolocation failure
     *
     */
    failure: function (error) {
        this.events.triggerEvent("locationfailed", {error: error});
    },

    CLASS_NAME: "SuperMap.Control.Geolocate"
});
