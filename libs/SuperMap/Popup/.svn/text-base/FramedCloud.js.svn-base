/* Copyright (c) 2006-2012 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the SuperMap distribution or repository for the
 * full text of the license. */

/**
 * @requires SuperMap/Popup/Framed.js
 * @requires SuperMap/Util.js
 * @requires SuperMap/BaseTypes/Bounds.js
 * @requires SuperMap/BaseTypes/Pixel.js
 * @requires SuperMap/BaseTypes/Size.js
 */

/**
 * Class: SuperMap.Popup.FramedCloud
 * 具有指向和边框的浮动弹窗。
 * 
 * Inherits from: 
 *  - <SuperMap.Popup.Framed>
 */
SuperMap.Popup.FramedCloud = 
  SuperMap.Class(SuperMap.Popup.Framed, {

    /** 
     * Property: contentDisplayClass
     * {String} The CSS class of the popup content div.
     */
    contentDisplayClass: "olFramedCloudPopupContent",

    /**
     * APIProperty: autoSize
     * {Boolean} 弹窗大小是否随内容自适应。默认为 true，自适应大小。
     */
    autoSize: true,

    /**
     * APIProperty: panMapIfOutOfView
     * {Boolean} 是否移动地图以确保弹窗显示在窗口内。默认为 true。
     */
    panMapIfOutOfView: true,

    /**
     * Property: imageSize
     * 背景图片大小。
     * {<SuperMap.Size>}
     */
    imageSize: new SuperMap.Size(1276, 736),

    /**
     * Property: isAlphaImage
     * {Boolean} 是否设置图像透明。当前弹窗不支持图像透明，默认为false。
     */
    isAlphaImage: false,

    /** 
     * APIProperty: fixedRelativePosition
     * {Boolean} 是否固定相对位置。默认为false。
     */
    fixedRelativePosition: false,

    /**
     * Property: positionBlocks
     * {Object} Hash of differen position blocks, keyed by relativePosition
     *     two-character code string (ie "tl", "tr", "bl", "br")
     */
    positionBlocks: {
        "tl": {
            'offset': new SuperMap.Pixel(44, 0),
            'padding': new SuperMap.Bounds(0, 32, 0, 1),
            'blocks': [
                { // top-left
                    size: new SuperMap.Size('auto', 'auto'),
                    anchor: new SuperMap.Bounds(0, 51, 22, 0),
                    position: new SuperMap.Pixel(0, 0)
                },
                { //top-right
                    size: new SuperMap.Size(22, 'auto'),
                    anchor: new SuperMap.Bounds(null, 50, 0, 0),
                    position: new SuperMap.Pixel(-1238, 0)
                },
                { //bottom-left
                    size: new SuperMap.Size('auto', 19),
                    anchor: new SuperMap.Bounds(0, 32, 22, null),
                    position: new SuperMap.Pixel(0, -631)
                },
                { //bottom-right
                    size: new SuperMap.Size(22, 18),
                    anchor: new SuperMap.Bounds(null, 32, 0, null),
                    position: new SuperMap.Pixel(-1238, -632)
                },
                { // stem
                    size: new SuperMap.Size(81, 35),
                    anchor: new SuperMap.Bounds(null, 0, 0, null),
                    position: new SuperMap.Pixel(0, -688)
                }
            ]
        },
        "tr": {
            'offset': new SuperMap.Pixel(-45, 0),
            'padding': new SuperMap.Bounds(0, 32, 0, 1),
            'blocks': [
                { // top-left
                    size: new SuperMap.Size('auto', 'auto'),
                    anchor: new SuperMap.Bounds(0, 51, 22, 0),
                    position: new SuperMap.Pixel(0, 0)
                },
                { //top-right
                    size: new SuperMap.Size(22, 'auto'),
                    anchor: new SuperMap.Bounds(null, 50, 0, 0),
                    position: new SuperMap.Pixel(-1238, 0)
                },
                { //bottom-left
                    size: new SuperMap.Size('auto', 19),
                    anchor: new SuperMap.Bounds(0, 32, 22, null),
                    position: new SuperMap.Pixel(0, -631)
                },
                { //bottom-right
                    size: new SuperMap.Size(22, 19),
                    anchor: new SuperMap.Bounds(null, 32, 0, null),
                    position: new SuperMap.Pixel(-1238, -631)
                },
                { // stem
                    size: new SuperMap.Size(81, 35),
                    anchor: new SuperMap.Bounds(0, 0, null, null),
                    position: new SuperMap.Pixel(-215, -687)
                }
            ]
        },
        "bl": {
            'offset': new SuperMap.Pixel(45, 0),
            'padding': new SuperMap.Bounds(0, 1, 0, 32),
            'blocks': [
                { // top-left
                    size: new SuperMap.Size('auto', 'auto'),
                    anchor: new SuperMap.Bounds(0, 21, 22, 32),
                    position: new SuperMap.Pixel(0, 0)
                },
                { //top-right
                    size: new SuperMap.Size(22, 'auto'),
                    anchor: new SuperMap.Bounds(null, 21, 0, 32),
                    position: new SuperMap.Pixel(-1238, 0)
                },
                { //bottom-left
                    size: new SuperMap.Size('auto', 21),
                    anchor: new SuperMap.Bounds(0, 0, 22, null),
                    position: new SuperMap.Pixel(0, -629)
                },
                { //bottom-right
                    size: new SuperMap.Size(22, 21),
                    anchor: new SuperMap.Bounds(null, 0, 0, null),
                    position: new SuperMap.Pixel(-1238, -629)
                },
                { // stem
                    size: new SuperMap.Size(81, 33),
                    anchor: new SuperMap.Bounds(null, null, 0, 0),
                    position: new SuperMap.Pixel(-101, -674)
                }
            ]
        },
        "br": {
            'offset': new SuperMap.Pixel(-44, 0),
            'padding': new SuperMap.Bounds(0, 1, 0, 32),
            'blocks': [
                { // top-left
                    size: new SuperMap.Size('auto', 'auto'),
                    anchor: new SuperMap.Bounds(0, 21, 22, 32),
                    position: new SuperMap.Pixel(0, 0)
                },
                { //top-right
                    size: new SuperMap.Size(22, 'auto'),
                    anchor: new SuperMap.Bounds(null, 21, 0, 32),
                    position: new SuperMap.Pixel(-1238, 0)
                },
                { //bottom-left
                    size: new SuperMap.Size('auto', 21),
                    anchor: new SuperMap.Bounds(0, 0, 22, null),
                    position: new SuperMap.Pixel(0, -629)
                },
                { //bottom-right
                    size: new SuperMap.Size(22, 21),
                    anchor: new SuperMap.Bounds(null, 0, 0, null),
                    position: new SuperMap.Pixel(-1238, -629)
                },
                { // stem
                    size: new SuperMap.Size(81, 33),
                    anchor: new SuperMap.Bounds(0, null, null, 0),
                    position: new SuperMap.Pixel(-311, -674)
                }
            ]
        }
    },

    /**
     * APIProperty: minSize
     * 弹窗内容最小像素值，默认为 (105, 10);
     * {<SuperMap.Size>}
     */
    minSize: new SuperMap.Size(105, 10),

    /**
     * APIProperty: maxSize
     * 弹窗内容最大像素值，默认为 (1200, 660);
     * {<SuperMap.Size>}
     */
    maxSize: new SuperMap.Size(1200, 660),

    /** 
     * Constructor: SuperMap.Popup.FramedCloud
     * 构造函数，初始化一个带箭头指向和边框的浮动弹窗。 
     *
     * Parameters:
     * id - {String} 弹窗的唯一标识ID。
     * lonlat - {<SuperMap.LonLat>} 地图上弹窗显示的位置。
     * contentSize - {<SuperMap.Size>} 弹窗内容的大小。
     * contentHTML - {String} 弹窗内容HTML要素的字符串表达。
     * anchor - 锚点。包含一个大小信息<SuperMap.Size>和偏移信息<SuperMap.Size>的对象。(一般为 
     * <SuperMap.Icon> 类型）。
     * closeBox - {Boolean} 是否显示关闭按钮。
     * closeBoxCallback - {Function} 关闭弹窗触发该回调函数。
     */
    initialize:function(id, lonlat, contentSize, contentHTML, anchor, closeBox, 
                        closeBoxCallback) {

        this.imageSrc = SuperMap.Util.getImagesLocation() + 'cloud-popup-relative.png';
        SuperMap.Popup.Framed.prototype.initialize.apply(this, arguments);
        this.contentDiv.className = this.contentDisplayClass;
    },

    CLASS_NAME: "SuperMap.Popup.FramedCloud"
});
