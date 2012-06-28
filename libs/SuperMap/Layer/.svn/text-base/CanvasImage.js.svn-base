/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/
/**
 * @requires SuperMap/Tile.js
 */
 
/**
 * Class: SuperMap.Tile.CanvasImage
 * 瓦片拼接类。
 * 用于管理图层图像拼贴。
 *
 * Inherits from:
 *  - <SuperMap.Tile>
 */
 
SuperMap.Tile.CanvasImage = SuperMap.Class(SuperMap.Tile, {

    /** 
     * Property: url
     * {String} The URL of the image being requested. No default. Filled in by
     * layer.getURL() function. 
     */
    url: null,
    
    /** 
     * Property: newimgtag
     * {String} tile最近请求的image的标签
     */
    newimgtag:null,
    
    /** 
     * Property: canvasType
     * {SuperMap.CanvasLayer.ONECANVASPERLAYER|
     * SuperMap.CanvasLayer.ONECANVASPERTILE} One canvas element per layer or per tile
     */    
    canvasType: null,
    
    /**
     * Property: frame
     * {DOMElement} The canvas element is appended to the frame.  Any gutter on
     * the canvas will be hidden behind the frame. 
     */ 
    frame: null,
    
    /**
     * Property: isLoading
     * {Boolean} Indicates if the tile is currently waiting on a loading image. 
     */ 
    isLoading: false,
    
    /** 
     * Property: canvas
     * {DOMElement} The canvas element on which the image is drawn.
     */
    canvas: null,
    
    /** 
     * Property: lastImage
     * {Image} The last requested image object. This property is used to make sure
     *      that only the recent image is drawn.
     */
    lastImage: null,
    
    /** 
     * Property: lastBounds
     * {<SuperMap.Bounds>} The bounds of the last requested image, needed for 
     *      VirtualCanvasImage.displayImage().
     */
    lastBounds: null,
    
    /**
     * Property: isBackBuffer
     * {Boolean} Is this tile a back buffer tile?
     */
    isBackBuffer: false,
        
    /**
     * Property: backBufferTile
     * {<SuperMap.Tile>} A clone of the tile used to create transition
     *     effects when the tile is moved or changes resolution.
     */
    backBufferTile: null,
    
     /**
     * Property: fadingTimer
     * {Number} 记录fading动画的索引ID
     *
     */
    fadingTimer:null,

    /**
     * Constructor: SuperMap.Tile.CanvasImage
     * 瓦片拼接类。
     * 
     * Parameters:
     * layer - {<SuperMap.Layer>} 瓦片所在的图层。
     * position - {<SuperMap.Pixel>}
     * bounds - {<SuperMap.Bounds>}
     * url - {<String>}
     * size - {<SuperMap.Size>}
     * canvasType - {<SuperMap.CanvasLayer.ONECANVASPERLAYER|SuperMap.CanvasLayer.ONECANVASPERTILE>}
     */   
    initialize: function(layer, position, bounds, url, size, canvasType) {
        var me = this;
        SuperMap.Tile.prototype.initialize.apply(me, arguments);
        me.url = url; //deprecated remove me
        me.canvasType = canvasType;        
        me.events.addEventType("reprojectionProgress");
        me.events.addEventType("filterProgress");
    },

    /** 
     * APIMethod: destroy
     * 解构CanvasImage类，释放资源。
     */
    destroy: function() {
        SuperMap.Tile.prototype.destroy.apply(this, arguments);
        var me = this;
        me.lastImage = null;
        me.canvas = null;
        me.canvasContext = null;
        // clean up the backBufferTile if it exists
        if (me.backBufferTile) {
            me.backBufferTile.destroy();
            me.backBufferTile = null;
            me.layer.events.unregister("loadend", me, me.hideBackBuffer);
        }
    },

    /**
     * Method: clone
     *
     * Parameters:
     * obj - {<SuperMap.Tile.Image>} The tile to be cloned
     *
     * Returns:
     * {<SuperMap.Tile.Image>} An exact clone of this <SuperMap.Tile.CanvasImage>
     */
    clone: function (obj) {
        var me = this;
        if (obj == null) {
            obj = new SuperMap.Tile.CanvasImage(me.layer, 
                                            me.position, 
                                            me.bounds, 
                                            me.url, 
                                            me.size,
                                            me.canvasType);        
        } 
        //pick up properties from superclass
        obj = SuperMap.Tile.prototype.clone.apply(me, [obj]);
        // a new canvas element should be created for the clone
        obj.canvas = null;
        return obj;
    },
    
    /**
     * Method: draw
     * Check that a tile should be drawn, and draw it. Starts a
     * transition if the layer requests one.
     * 
     * Returns:
     * {Boolean} Always returns true.
     */
    draw: function() {
        var me = this;
        if (me.layer != me.layer.map.baseLayer && me.layer.reproject) {
            me.bounds = me.getBoundsFromBaseLayer(me.position);
        }
        var drawTile = SuperMap.Tile.prototype.draw.apply(me, arguments);
        me.startTransition(drawTile);
        if (!drawTile) {
            return;
        }
        if (me.isLoading) {
            // if we're already loading, send 'reload' instead of 'loadstart'.
            me.events.triggerEvent("reload"); 
        } else {
            me.isLoading = true;
            me.events.triggerEvent("loadstart");
        }
        return me.renderTile();  
    },
    
    /**
     * Method: startTransition
     * Creates a backbuffer tile (if it does not exist already)
     * and then displays this tile. 
     * 
     * Parameters:
     * drawTile - {<Boolean>} Should the tile be drawn?
     */
    startTransition: function(drawTile) {
        // <SuperMap.CanvasLayer.> takes care about the transition  
    },
    
    /**
     * Method: renderTile
     * Creates the canvas element and sets the URL.
     * 
     * Returns:
     * {Boolean} Always returns true.
     */
    renderTile: function() {
        var me = this;    
        me.url = me.layer.getURL(me.bounds);
        me.positionImage(); 
        return true;
    },
    
    /**
     * Method: createImage
     * Creates the image and starts loading it.
     */
    createImage: function() {
        //如果在缓存的内存图片可以找到的话，就不再创建图片，直接调用图片的onLoad事件的响应函数
        //不过这里需要注意，制作专题图的时候，需要清除已经缓存的内存图片
        //否则有可能看不到专题图的图片。        
    
        if (this.lastImage !== null && !this.lastImage.complete) {
            // 平移多次时候将不会请求图片，chrome下不能用。 https://bugs.webkit.org/show_bug.cgi?id=35377
            this.lastImage.src = '';
        }            
        
        //先查看内存中是否有保存
        var me = this, image = me.layer.getMemoryImg(me.bounds);        
        me.lastBounds = me.bounds.clone();        
        if (image) {
            //找到就显示
            me.lastImage = image;
            me.layer.drawCanvasTile(image, me.position);
            if(me.firstInView){
                me.setFirstInView();
            }
        } else {
			var key = me.layer.getXYZ(me.bounds);
            if (this.layer.bAPP == false) {
                image = new Image();
                image.firstInView = true;
                me.lastImage = image;
                me.newimgtag = key.x + "_" + key.y + "_" + key.z;
                var context = { 
                    image: image,
                    tile: me,
                    viewRequestID: me.layer.map.viewRequestID,
                    newimgtag: me.newimgtag
                    //bounds: me.bounds.clone()// todo: do we still need the bounds? guess no
                    //urls: this.layer.url.slice() // todo: for retries?
                };
                
                var onLoadFunctionProxy = function() {
					if(this.tile.newimgtag == this.newimgtag){
						this.tile.onLoadFunction(this);    
					}
				};
                var onErrorFunctionProxy = function() {
					this.tile.onErrorFunction(this);
				};
                    
                image.onload = SuperMap.Function.bind(onLoadFunctionProxy, context); 
                image.onerror = SuperMap.Function.bind(onErrorFunctionProxy, context);
                image.src = me.url;
            } else{
                var strX = key.x;
                var strY = key.y;
                //var strZ = me.layer.scales[key.z].toExponential();
                
                if(me.layer.name == "CloudLayer")
                {
                    strZ = key.z;
                } else{
                    strZ = me.layer.scales[key.z].toExponential();
                }

                var canvasImageContext = {
                    tile: me,
                    X: strX,
                    Y: strY,
                    Z: strZ,
                    viewRequestID: me.layer.map.viewRequestID
                };
                
                var saveUrlProxy = function() {
                    this.tile.onLoadsaveUrlFunction(this);
                }
                
                me.newimgtag = strX + "_" + strY + "_" + strZ;
                image = new Image();
                image.firstInView = true;
                me.lastImage = image;
                window.plugins.localstoragemanager.saveurl(me.url,this.layer.name,strX,strY,strZ,
                    function(canvasImageContext){
                        return function(r){
                            canvasImageContext.tile.onLoadsaveUrlFunction(canvasImageContext,r);
                        }
                    }(canvasImageContext),
                    function(e){}
                );   
            }
        }
    },
    
    onLoadsaveUrlFunction:function(canvasImageContext,r) {
        var me = this;
        
        var nowimgtag = r.x+"_"+r.y+"_"+r.z;
        if(me.newimgtag!=nowimgtag){
            return;
        }
        
        var strX = canvasImageContext.X;
        var strY = canvasImageContext.Y;
        var strZ = canvasImageContext.Z;
        
        //var image = new Image();
        //image.firstInView = true;
        //me.lastImage = image;
    
    if(me.lastImage){
        var image = me.lastImage;
    }
    else{
        var image = new Image();
        image.firstInView = true;
        me.lastImage = image;
    }
    
        var context = { 
            image: image,
            tile: me,
            viewRequestID: canvasImageContext.viewRequestID,
            bounds: me.bounds.clone()// todo: do we still need the bounds? guess no
            //urls: this.layer.url.slice() // todo: for retries?
        };  
        var onLoadFunctionProxy = function() {
                this.tile.onLoadFunction(this);    
            };
        var onErrorFunctionProxy = function() {
                this.tile.onErrorFunction(this);
            };
        image.onload = SuperMap.Function.bind(onLoadFunctionProxy, context); 
        image.onerror = SuperMap.Function.bind(onErrorFunctionProxy, context);
        var s = this.layer.sdcardPath + "SuperMap/" + this.layer.name + "/" + strZ + "/" + strX + "_" + strY + ".png";
        
        me.url = s;
        image.src = me.url;
    },
    
    /**
     * Method: positionImage
     * Sets the position and size of the tile's frame and
     * canvas element.
     */
    positionImage: function() {
        var me = this;
        // if the this layer doesn't exist at the point the image is
        // returned, do not attempt to use it for size computation
        if (!me.layer) {
            return;
        }
        me.createImage();
    },
    
    /**
     * Method: onLoadFunction  
     * Called when an image successfully finished loading. Draws the
     * image on the canvas.  图片加载成功后在canvas上进行绘制
     * 
     * Parameters:
     * context - {<Object>} The context from the onload event.
     */
    onLoadFunction: function(context) {
        if ((this.layer === null) ||
                (context.viewRequestID !== this.layer.map.viewRequestID) ||
                (context.image !== this.lastImage)) {
            return;
        }          
        var image = context.image;
        if(context.tile.shouldDraw){
            this.displayImage(image);
        }
        this.layer.addMemoryImg(this.lastBounds, image);
    },
    

    
    /**
     * Method: displayImage
     * Takes care of resizing the canvas and then draws the 
     * canvas.
     * 
     * Parameters:
     * image - {Image/Canvas} The image to display
     */
    displayImage: function(image) {
        var me = this,
            layer = me.layer;
        if (layer.canvasFilter && !image.filtered) {
            // if a filter is set, apply the filter first and
            // then use the result
            me.filter(image);
            return;
        } 
        //绘制图片
        layer.drawCanvasTile(image, me.position);
        //更新图片状态
        me.isLoading = false; 
        me.events.triggerEvent("loadend");
        if(image.firstInView){
            me.setFirstInView();
        }
    },

    /**
     * Method: onErrorFunction
     * Called when an image finished loading, but not successfully. 
     * 
     * Parameters:
     * context - {<Object>} The context from the onload event.
     */    
    onErrorFunction: function(context) {
        var me = this;
        //图片请求失败，就不绘这个tile，防止调用canvasContext.drawImage方法出错。
        if (context.image !== me.lastImage) {
            /* Do not trigger 'loadend' when a new image was request
             * for this tile, because then 'reload' was triggered instead
             * of 'loadstart'.
             * If we would trigger 'loadend' now, Grid would get confused about
             * its 'numLoadingTiles'.
             */
            return;
        }
        //retry? with different url?
        
        me.events.triggerEvent("loadend");
    },
    
    setFirstInView: function(){
        var me = this;
        if(!me.fadingTimer){
            me.fadingTimer = window.setTimeout(SuperMap.Function.bind(me.setNotFirstInView, me),100);
        }
    },
    
    setNotFirstInView: function(){
        var me = this;
        me.lastImage.firstInView = false;
        window.clearTimeout(me.fadingTimer);
        me.fadingTimer = null;
        me.displayImage(me.lastImage);
    },
    /** 
     * Method: show
     * Show the tile. Called in <SuperMap.Tile.showTile()>.
     */
    show: function() {},
    
    /** 
     * Method: hide
     * Hide the tile.  To be implemented by subclasses (but never called).
     */
    hide: function() { },
 
    /** 
     * Method: isTooBigCanvas
     * Used to avoid that the backbuffer canvas gets too big when zooming in very fast.
     * Otherwise drawing the canvas would take too long and lots of memory would be
     * required. 
     */
    isTooBigCanvas: function(size) {
        return size.w > 5000;    
    },
    
    moveTo: function (bounds, position, redraw) {
        if (redraw == null) {
            redraw = true;
        }
        this.bounds = bounds.clone();
        this.position = position.clone();
        //设置不重置canvas    
        this.layer.redrawCanvas = false;
        if (redraw) {
            this.draw();
        }
    },
    CLASS_NAME: "SuperMap.Tile.CanvasImage"
  });  
