/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/REST.js
 */

/**
 * Class: SuperMap.REST.DatasourceConnectionInfo
 * 数据源连接信息类。
 * 该类包含了数据源名称、数据源连接的数据库或文件等相关信息。
 */

SuperMap.REST.DatasourceConnectionInfo = SuperMap.Class({

    /** 
     * APIProperty: alias
     * {String} 数据源别名。  
     */
    alias: null,
    
    /** 
     * APIProperty: connect
     * {Boolean} 数据源是否自动连接数据。   
     */
    connect: null,
    
    /** 
     * APIProperty: dataBase
     * {String} 数据源连接的数据库名。   
     */
    dataBase: null,

    /** 
     * APIProperty: driver
     * {String} 使用 ODBC(Open Database Connectivity，开放数据库互连)的数据库的驱动程序名。    
     */
    driver: null,
    
    /** 
     * APIProperty: engineType
     * {<SuperMap.REST.EngineType>} 数据源连接的引擎类型。     
     */
    engineType: null,
    
    /** 
     * APIProperty: exclusive
     * {Boolean} 是否以独占方式打开数据源。  
     */
    exclusive: null,
    
    /** 
     * APIProperty: OpenLinkTable
     * {Boolean} 是否把数据库中的其他非 SuperMap 数据表作为 LinkTable 打开。   
     */
    OpenLinkTable: null,
    
    /** 
     * APIProperty: password
     * {String} 登录数据源连接的数据库或文件的密码。  
     */
    password: null,
    
    /** 
     * APIProperty: readOnly
     * {Boolean} 是否以只读方式打开数据源。    
     */
    readOnly: null,
    
    /** 
     * APIProperty: server
     * {String} 数据库服务器名或 SDB 文件名。   
     */
    server: null,
    
    /** 
     * APIProperty: user
     * {String} 登录数据库的用户名。   
     */
    user: null,

    /**
     * Constructor: SuperMap.REST.DatasourceConnectionInfo
     * 数据源连接信息类构造函数。
     *
     * Parameters:
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * alias - {String} 数据源别名。
     * connect - {Boolean} 数据源是否自动连接数据。
     * dataBase - {String} 数据源连接的数据库名。
     * driver - {String} 使用 ODBC(Open Database Connectivity，开放数据库互连)的数据库的驱动程序名。 
     * engineType - {<SuperMap.REST.EngineType>} 数据源连接的引擎类型。
     * exclusive - {Boolean} 是否以独占方式打开数据源。
     * OpenLinkTable - {Boolean} 是否把数据库中的其他非 SuperMap 数据表作为 LinkTable 打开。   
     * password - {String} 登录数据源连接的数据库或文件的密码。
     * readOnly - {Boolean} 是否以只读方式打开数据源。
     * server - {String} 数据库服务器名或 SDB 文件名。   
     * user - {String} 登录数据库的用户名。
     */
    initialize: function(options) {
        if (options) {
            SuperMap.Util.extend(this, options);
        }
    },
    
    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。 
     */
    destroy: function() {
        var me = this;
        me.alias = null;
        me.connect = null;
        me.dataBase = null;
        me.driver = null;
        me.engineType = null;
        me.exclusive = null;
        me.OpenLinkTable = null;
        me.password = null;
        me.readOnly = null;
        me.server = null;
        me.user = null;
    },
    
    CLASS_NAME: "SuperMap.REST.DatasourceConnectionInfo"
});