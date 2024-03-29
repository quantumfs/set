"use strict";
var __extends = (this && this.__extends) || (function() {
    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({
                    __proto__: []
                }
                instanceof Array && function(d, b) {
                    d.__proto__ = b;
                }) ||
            function(d, b) {
                for (var p in b)
                    if (b.hasOwnProperty(p)) d[p] = b[p];
            };
        return extendStatics(d, b);
    };
    return function(d, b) {
        extendStatics(d, b);

        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", {
    value: true
});
var Util_1 = require("./Util");
var Factory_1 = require("./Factory");
var Container_1 = require("./Container");
var Global_1 = require("./Global");
var Canvas_1 = require("./Canvas");
var DragAndDrop_1 = require("./DragAndDrop");
var Global_2 = require("./Global");
var PointerEvents = require("./PointerEvents");
var STAGE = 'Stage',
    STRING = 'string',
    PX = 'px',
    MOUSEOUT = 'mouseout',
    MOUSELEAVE = 'mouseleave',
    MOUSEOVER = 'mouseover',
    MOUSEENTER = 'mouseenter',
    MOUSEMOVE = 'mousemove',
    MOUSEDOWN = 'mousedown',
    MOUSEUP = 'mouseup',
    POINTERMOVE = 'pointermove',
    POINTERDOWN = 'pointerdown',
    POINTERUP = 'pointerup',
    POINTERCANCEL = 'pointercancel',
    LOSTPOINTERCAPTURE = 'lostpointercapture',
    CONTEXTMENU = 'contextmenu',
    CLICK = 'click',
    DBL_CLICK = 'dblclick',
    TOUCHSTART = 'touchstart',
    TOUCHEND = 'touchend',
    TAP = 'tap',
    DBL_TAP = 'dbltap',
    TOUCHMOVE = 'touchmove',
    WHEEL = 'wheel',
    CONTENT_MOUSEOUT = 'contentMouseout',
    CONTENT_MOUSEOVER = 'contentMouseover',
    CONTENT_MOUSEMOVE = 'contentMousemove',
    CONTENT_MOUSEDOWN = 'contentMousedown',
    CONTENT_MOUSEUP = 'contentMouseup',
    CONTENT_CONTEXTMENU = 'contentContextmenu',
    CONTENT_CLICK = 'contentClick',
    CONTENT_DBL_CLICK = 'contentDblclick',
    CONTENT_TOUCHSTART = 'contentTouchstart',
    CONTENT_TOUCHEND = 'contentTouchend',
    CONTENT_DBL_TAP = 'contentDbltap',
    CONTENT_TAP = 'contentTap',
    CONTENT_TOUCHMOVE = 'contentTouchmove',
    CONTENT_POINTERMOVE = 'contentPointermove',
    CONTENT_POINTERDOWN = 'contentPointerdown',
    CONTENT_POINTERUP = 'contentPointerup',
    CONTENT_WHEEL = 'contentWheel',
    RELATIVE = 'relative',
    KONVA_CONTENT = 'konvajs-content',
    SPACE = ' ',
    UNDERSCORE = '_',
    CONTAINER = 'container',
    MAX_LAYERS_NUMBER = 5,
    EMPTY_STRING = '',
    EVENTS = [
        MOUSEENTER,
        MOUSEDOWN,
        MOUSEMOVE,
        MOUSEUP,
        MOUSEOUT,
        TOUCHSTART,
        TOUCHMOVE,
        TOUCHEND,
        MOUSEOVER,
        WHEEL,
        CONTEXTMENU,
        POINTERDOWN,
        POINTERMOVE,
        POINTERUP,
        POINTERCANCEL,
        LOSTPOINTERCAPTURE
    ],
    eventsLength = EVENTS.length;

function addEvent(ctx, eventName) {
    ctx.content.addEventListener(eventName, function(evt) {
        ctx[UNDERSCORE + eventName](evt);
    }, false);
}
var NO_POINTERS_MESSAGE = "Pointer position is missing and not registered by the stage. Looks like it is outside of the stage container. You can set it manually from event: stage.setPointersPositions(event);";
exports.stages = [];

function checkNoClip(attrs) {
    if (attrs === void 0) {
        attrs = {};
    }
    if (attrs.clipFunc || attrs.clipWidth || attrs.clipHeight) {
        Util_1.Util.warn('Stage does not support clipping. Please use clip for Layers or Groups.');
    }
    return attrs;
}
var Stage = (function(_super) {
    __extends(Stage, _super);

    function Stage(config) {
        var _this = _super.call(this, checkNoClip(config)) || this;
        _this._pointerPositions = [];
        _this._changedPointerPositions = [];
        _this._buildDOM();
        _this._bindContentEvents();
        exports.stages.push(_this);
        _this.on('widthChange.konva heightChange.konva', _this._resizeDOM);
        _this.on('visibleChange.konva', _this._checkVisibility);
        _this.on('clipWidthChange.konva clipHeightChange.konva clipFuncChange.konva', function() {
            checkNoClip(_this.attrs);
        });
        _this._checkVisibility();
        return _this;
    }
    Stage.prototype._validateAdd = function(child) {
        var isLayer = child.getType() === 'Layer';
        var isFastLayer = child.getType() === 'FastLayer';
        var valid = isLayer || isFastLayer;
        if (!valid) {
            Util_1.Util.throw('You may only add layers to the stage.');
        }
    };
    Stage.prototype._checkVisibility = function() {
        var style = this.visible() ? '' : 'none';
        this.content.style.display = style;
    };
    Stage.prototype.setContainer = function(container) {
        if (typeof container === STRING) {
            if (container.charAt(0) === '.') {
                var className = container.slice(1);
                container = document.getElementsByClassName(className)[0];
            } else {
                var id;
                if (container.charAt(0) !== '#') {
                    id = container;
                } else {
                    id = container.slice(1);
                }
                container = document.getElementById(id);
            }
            if (!container) {
                throw 'Can not find container in document with id ' + id;
            }
        }
        this._setAttr(CONTAINER, container);
        if (this.content) {
            if (this.content.parentElement) {
                this.content.parentElement.removeChild(this.content);
            }
            container.appendChild(this.content);
        }
        return this;
    };
    Stage.prototype.shouldDrawHit = function() {
        return true;
    };
    Stage.prototype.clear = function() {
        var layers = this.children,
            len = layers.length,
            n;
        for (n = 0; n < len; n++) {
            layers[n].clear();
        }
        return this;
    };
    Stage.prototype.clone = function(obj) {
        if (!obj) {
            obj = {};
        }
        obj.container = document.createElement('div');
        return Container_1.Container.prototype.clone.call(this, obj);
    };
    Stage.prototype.destroy = function() {
        _super.prototype.destroy.call(this);
        var content = this.content;
        if (content && Util_1.Util._isInDocument(content)) {
            this.container().removeChild(content);
        }
        var index = exports.stages.indexOf(this);
        if (index > -1) {
            exports.stages.splice(index, 1);
        }
        return this;
    };
    Stage.prototype.getPointerPosition = function() {
        var pos = this._pointerPositions[0] || this._changedPointerPositions[0];
        if (!pos) {
            Util_1.Util.warn(NO_POINTERS_MESSAGE);
            return null;
        }
        return {
            x: pos.x,
            y: pos.y
        };
    };
    Stage.prototype._getPointerById = function(id) {
        return this._pointerPositions.find(function(p) {
            return p.id === id;
        });
    };
    Stage.prototype.getPointersPositions = function() {
        return this._pointerPositions;
    };
    Stage.prototype.getStage = function() {
        return this;
    };
    Stage.prototype.getContent = function() {
        return this.content;
    };
    Stage.prototype._toKonvaCanvas = function(config) {
        config = config || {};
        var x = config.x || 0,
            y = config.y || 0,
            canvas = new Canvas_1.SceneCanvas({
                width: config.width || this.width(),
                height: config.height || this.height(),
                pixelRatio: config.pixelRatio || 1
            }),
            _context = canvas.getContext()._context,
            layers = this.children;
        if (x || y) {
            _context.translate(-1 * x, -1 * y);
        }
        layers.each(function(layer) {
            if (!layer.isVisible()) {
                return;
            }
            var layerCanvas = layer._toKonvaCanvas(config);
            _context.drawImage(layerCanvas._canvas, x, y, layerCanvas.getWidth() / layerCanvas.getPixelRatio(), layerCanvas.getHeight() / layerCanvas.getPixelRatio());
        });
        return canvas;
    };
    Stage.prototype.getIntersection = function(pos, selector) {
        if (!pos) {
            return null;
        }
        var layers = this.children,
            len = layers.length,
            end = len - 1,
            n, shape;
        for (n = end; n >= 0; n--) {
            shape = layers[n].getIntersection(pos, selector);
            if (shape) {
                return shape;
            }
        }
        return null;
    };
    Stage.prototype._resizeDOM = function() {
        if (this.content) {
            var width = this.width(),
                height = this.height(),
                layers = this.getChildren(),
                len = layers.length,
                n, layer;
            this.content.style.width = width + PX;
            this.content.style.height = height + PX;
            this.bufferCanvas.setSize(width, height);
            this.bufferHitCanvas.setSize(width, height);
            for (n = 0; n < len; n++) {
                layer = layers[n];
                layer.setSize({
                    width: width,
                    height: height
                });
                layer.draw();
            }
        }
    };
    Stage.prototype.add = function(layer) {
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length; i++) {
                this.add(arguments[i]);
            }
            return this;
        }
        _super.prototype.add.call(this, layer);
        var length = this.children.length;
        if (length > MAX_LAYERS_NUMBER) {
            Util_1.Util.warn('The stage has ' +
                length +
                ' layers. Recommended maximum number of layers is 3-5. Adding more layers into the stage may drop the performance. Rethink your tree structure, you can use Konva.Group.');
        }
        layer._setCanvasSize(this.width(), this.height());
        layer.draw();
        if (Global_1.Konva.isBrowser) {
            this.content.appendChild(layer.canvas._canvas);
        }
        return this;
    };
    Stage.prototype.getParent = function() {
        return null;
    };
    Stage.prototype.getLayer = function() {
        return null;
    };
    Stage.prototype.hasPointerCapture = function(pointerId) {
        return PointerEvents.hasPointerCapture(pointerId, this);
    };
    Stage.prototype.setPointerCapture = function(pointerId) {
        PointerEvents.setPointerCapture(pointerId, this);
    };
    Stage.prototype.releaseCapture = function(pointerId) {
        PointerEvents.releaseCapture(pointerId, this);
    };
    Stage.prototype.getLayers = function() {
        return this.getChildren();
    };
    Stage.prototype._bindContentEvents = function() {
        if (!Global_1.Konva.isBrowser) {
            return;
        }
        for (var n = 0; n < eventsLength; n++) {
            addEvent(this, EVENTS[n]);
        }
    };
    Stage.prototype._mouseenter = function(evt) {
        this.setPointersPositions(evt);
        this._fire(MOUSEENTER, {
            evt: evt,
            target: this,
            currentTarget: this
        });
    };
    Stage.prototype._mouseover = function(evt) {
        this.setPointersPositions(evt);
        this._fire(CONTENT_MOUSEOVER, {
            evt: evt
        });
        this._fire(MOUSEOVER, {
            evt: evt,
            target: this,
            currentTarget: this
        });
    };
    Stage.prototype._mouseout = function(evt) {
        this.setPointersPositions(evt);
        var targetShape = this.targetShape;
        var eventsEnabled = !DragAndDrop_1.DD.isDragging || Global_1.Konva.hitOnDragEnabled;
        if (targetShape && eventsEnabled) {
            targetShape._fireAndBubble(MOUSEOUT, {
                evt: evt
            });
            targetShape._fireAndBubble(MOUSELEAVE, {
                evt: evt
            });
            this._fire(MOUSELEAVE, {
                evt: evt,
                target: this,
                currentTarget: this
            });
            this.targetShape = null;
        } else if (eventsEnabled) {
            this._fire(MOUSELEAVE, {
                evt: evt,
                target: this,
                currentTarget: this
            });
            this._fire(MOUSEOUT, {
                evt: evt,
                target: this,
                currentTarget: this
            });
        }
        this.pointerPos = undefined;
        this._pointerPositions = [];
        this._fire(CONTENT_MOUSEOUT, {
            evt: evt
        });
    };
    Stage.prototype._mousemove = function(evt) {
        if (Global_1.Konva.UA.ieMobile) {
            return this._touchmove(evt);
        }
        this.setPointersPositions(evt);
        var pointerId = Util_1.Util._getFirstPointerId(evt);
        var shape;
        var eventsEnabled = !DragAndDrop_1.DD.isDragging || Global_1.Konva.hitOnDragEnabled;
        if (eventsEnabled) {
            shape = this.getIntersection(this.getPointerPosition());
            if (shape && shape.isListening()) {
                var differentTarget = !this.targetShape || this.targetShape !== shape;
                if (eventsEnabled && differentTarget) {
                    if (this.targetShape) {
                        this.targetShape._fireAndBubble(MOUSEOUT, {
                            evt: evt,
                            pointerId: pointerId
                        }, shape);
                        this.targetShape._fireAndBubble(MOUSELEAVE, {
                            evt: evt,
                            pointerId: pointerId
                        }, shape);
                    }
                    shape._fireAndBubble(MOUSEOVER, {
                        evt: evt,
                        pointerId: pointerId
                    }, this.targetShape);
                    shape._fireAndBubble(MOUSEENTER, {
                        evt: evt,
                        pointerId: pointerId
                    }, this.targetShape);
                    shape._fireAndBubble(MOUSEMOVE, {
                        evt: evt,
                        pointerId: pointerId
                    });
                    this.targetShape = shape;
                } else {
                    shape._fireAndBubble(MOUSEMOVE, {
                        evt: evt,
                        pointerId: pointerId
                    });
                }
            } else {
                if (this.targetShape && eventsEnabled) {
                    this.targetShape._fireAndBubble(MOUSEOUT, {
                        evt: evt,
                        pointerId: pointerId
                    });
                    this.targetShape._fireAndBubble(MOUSELEAVE, {
                        evt: evt,
                        pointerId: pointerId
                    });
                    this._fire(MOUSEOVER, {
                        evt: evt,
                        target: this,
                        currentTarget: this,
                        pointerId: pointerId
                    });
                    this.targetShape = null;
                }
                this._fire(MOUSEMOVE, {
                    evt: evt,
                    target: this,
                    currentTarget: this,
                    pointerId: pointerId
                });
            }
            this._fire(CONTENT_MOUSEMOVE, {
                evt: evt
            });
        }
        if (evt.cancelable) {
            evt.preventDefault();
        }
    };
    Stage.prototype._mousedown = function(evt) {
        if (Global_1.Konva.UA.ieMobile) {
            return this._touchstart(evt);
        }
        this.setPointersPositions(evt);
        var pointerId = Util_1.Util._getFirstPointerId(evt);
        var shape = this.getIntersection(this.getPointerPosition());
        DragAndDrop_1.DD.justDragged = false;
        Global_1.Konva.listenClickTap = true;
        if (shape && shape.isListening()) {
            this.clickStartShape = shape;
            shape._fireAndBubble(MOUSEDOWN, {
                evt: evt,
                pointerId: pointerId
            });
        } else {
            this._fire(MOUSEDOWN, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: pointerId
            });
        }
        this._fire(CONTENT_MOUSEDOWN, {
            evt: evt
        });
    };
    Stage.prototype._mouseup = function(evt) {
        if (Global_1.Konva.UA.ieMobile) {
            return this._touchend(evt);
        }
        this.setPointersPositions(evt);
        var pointerId = Util_1.Util._getFirstPointerId(evt);
        var shape = this.getIntersection(this.getPointerPosition()),
            clickStartShape = this.clickStartShape,
            clickEndShape = this.clickEndShape,
            fireDblClick = false;
        if (Global_1.Konva.inDblClickWindow) {
            fireDblClick = true;
            clearTimeout(this.dblTimeout);
        } else if (!DragAndDrop_1.DD.justDragged) {
            Global_1.Konva.inDblClickWindow = true;
            clearTimeout(this.dblTimeout);
        }
        this.dblTimeout = setTimeout(function() {
            Global_1.Konva.inDblClickWindow = false;
        }, Global_1.Konva.dblClickWindow);
        if (shape && shape.isListening()) {
            this.clickEndShape = shape;
            shape._fireAndBubble(MOUSEUP, {
                evt: evt,
                pointerId: pointerId
            });
            if (Global_1.Konva.listenClickTap &&
                clickStartShape &&
                clickStartShape._id === shape._id) {
                shape._fireAndBubble(CLICK, {
                    evt: evt,
                    pointerId: pointerId
                });
                if (fireDblClick && clickEndShape && clickEndShape === shape) {
                    shape._fireAndBubble(DBL_CLICK, {
                        evt: evt,
                        pointerId: pointerId
                    });
                }
            }
        } else {
            this._fire(MOUSEUP, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: pointerId
            });
            if (Global_1.Konva.listenClickTap) {
                this._fire(CLICK, {
                    evt: evt,
                    target: this,
                    currentTarget: this,
                    pointerId: pointerId
                });
            }
            if (fireDblClick) {
                this._fire(DBL_CLICK, {
                    evt: evt,
                    target: this,
                    currentTarget: this,
                    pointerId: pointerId
                });
            }
        }
        this._fire(CONTENT_MOUSEUP, {
            evt: evt
        });
        if (Global_1.Konva.listenClickTap) {
            this._fire(CONTENT_CLICK, {
                evt: evt
            });
            if (fireDblClick) {
                this._fire(CONTENT_DBL_CLICK, {
                    evt: evt
                });
            }
        }
        Global_1.Konva.listenClickTap = false;
        if (evt.cancelable) {
            evt.preventDefault();
        }
    };
    Stage.prototype._contextmenu = function(evt) {
        this.setPointersPositions(evt);
        var shape = this.getIntersection(this.getPointerPosition());
        if (shape && shape.isListening()) {
            shape._fireAndBubble(CONTEXTMENU, {
                evt: evt
            });
        } else {
            this._fire(CONTEXTMENU, {
                evt: evt,
                target: this,
                currentTarget: this
            });
        }
        this._fire(CONTENT_CONTEXTMENU, {
            evt: evt
        });
    };
    Stage.prototype._touchstart = function(evt) {
        var _this = this;
        this.setPointersPositions(evt);
        var triggeredOnShape = false;
        this._changedPointerPositions.forEach(function(pos) {
            var shape = _this.getIntersection(pos);
            Global_1.Konva.listenClickTap = true;
            DragAndDrop_1.DD.justDragged = false;
            var hasShape = shape && shape.isListening();
            if (!hasShape) {
                return;
            }
            if (Global_1.Konva.captureTouchEventsEnabled) {
                shape.setPointerCapture(pos.id);
            }
            _this.tapStartShape = shape;
            shape._fireAndBubble(TOUCHSTART, {
                evt: evt,
                pointerId: pos.id
            }, _this);
            triggeredOnShape = true;
            if (shape.isListening() && shape.preventDefault() && evt.cancelable) {
                evt.preventDefault();
            }
        });
        if (!triggeredOnShape) {
            this._fire(TOUCHSTART, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id
            });
        }
        this._fire(CONTENT_TOUCHSTART, {
            evt: evt
        });
    };
    Stage.prototype._touchmove = function(evt) {
        var _this = this;
        this.setPointersPositions(evt);
        var eventsEnabled = !DragAndDrop_1.DD.isDragging || Global_1.Konva.hitOnDragEnabled;
        if (eventsEnabled) {
            var triggeredOnShape = false;
            var processedShapesIds = {};
            this._changedPointerPositions.forEach(function(pos) {
                var shape = PointerEvents.getCapturedShape(pos.id) || _this.getIntersection(pos);
                var hasShape = shape && shape.isListening();
                if (!hasShape) {
                    return;
                }
                if (processedShapesIds[shape._id]) {
                    return;
                }
                processedShapesIds[shape._id] = true;
                shape._fireAndBubble(TOUCHMOVE, {
                    evt: evt,
                    pointerId: pos.id
                });
                triggeredOnShape = true;
                if (shape.isListening() && shape.preventDefault() && evt.cancelable) {
                    evt.preventDefault();
                }
            });
            if (!triggeredOnShape) {
                this._fire(TOUCHMOVE, {
                    evt: evt,
                    target: this,
                    currentTarget: this,
                    pointerId: this._changedPointerPositions[0].id
                });
            }
            this._fire(CONTENT_TOUCHMOVE, {
                evt: evt
            });
        }
        if (DragAndDrop_1.DD.isDragging && DragAndDrop_1.DD.node.preventDefault() && evt.cancelable) {
            evt.preventDefault();
        }
    };
    Stage.prototype._touchend = function(evt) {
        var _this = this;
        this.setPointersPositions(evt);
        var clickEndShape = this.clickEndShape,
            fireDblClick = false;
        if (Global_1.Konva.inDblClickWindow) {
            fireDblClick = true;
            clearTimeout(this.dblTimeout);
        } else if (!DragAndDrop_1.DD.justDragged) {
            Global_1.Konva.inDblClickWindow = true;
            clearTimeout(this.dblTimeout);
        }
        this.dblTimeout = setTimeout(function() {
            Global_1.Konva.inDblClickWindow = false;
        }, Global_1.Konva.dblClickWindow);
        var triggeredOnShape = false;
        var processedShapesIds = {};
        var tapTriggered = false;
        var dblTapTriggered = false;
        this._changedPointerPositions.forEach(function(pos) {
            var shape = PointerEvents.getCapturedShape(pos.id) ||
                _this.getIntersection(pos);
            if (shape) {
                shape.releaseCapture(pos.id);
            }
            var hasShape = shape && shape.isListening();
            if (!hasShape) {
                return;
            }
            if (processedShapesIds[shape._id]) {
                return;
            }
            processedShapesIds[shape._id] = true;
            _this.clickEndShape = shape;
            shape._fireAndBubble(TOUCHEND, {
                evt: evt,
                pointerId: pos.id
            });
            triggeredOnShape = true;
            if (Global_1.Konva.listenClickTap && shape === _this.tapStartShape) {
                tapTriggered = true;
                shape._fireAndBubble(TAP, {
                    evt: evt,
                    pointerId: pos.id
                });
                if (fireDblClick && clickEndShape && clickEndShape === shape) {
                    dblTapTriggered = true;
                    shape._fireAndBubble(DBL_TAP, {
                        evt: evt,
                        pointerId: pos.id
                    });
                }
            }
            if (shape.isListening() && shape.preventDefault() && evt.cancelable) {
                evt.preventDefault();
            }
        });
        if (!triggeredOnShape) {
            this._fire(TOUCHEND, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id
            });
        }
        if (Global_1.Konva.listenClickTap && !tapTriggered) {
            this._fire(TAP, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id
            });
        }
        if (fireDblClick && !dblTapTriggered) {
            this._fire(DBL_TAP, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id
            });
        }
        this._fire(CONTENT_TOUCHEND, {
            evt: evt
        });
        if (Global_1.Konva.listenClickTap) {
            this._fire(CONTENT_TAP, {
                evt: evt
            });
            if (fireDblClick) {
                this._fire(CONTENT_DBL_TAP, {
                    evt: evt
                });
            }
        }
        Global_1.Konva.listenClickTap = false;
    };
    Stage.prototype._wheel = function(evt) {
        this.setPointersPositions(evt);
        var shape = this.getIntersection(this.getPointerPosition());
        if (shape && shape.isListening()) {
            shape._fireAndBubble(WHEEL, {
                evt: evt
            });
        } else {
            this._fire(WHEEL, {
                evt: evt,
                target: this,
                currentTarget: this
            });
        }
        this._fire(CONTENT_WHEEL, {
            evt: evt
        });
    };
    Stage.prototype._pointerdown = function(evt) {
        if (!Global_1.Konva._pointerEventsEnabled) {
            return;
        }
        this.setPointersPositions(evt);
        var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
            this.getIntersection(this.getPointerPosition());
        if (shape) {
            shape._fireAndBubble(POINTERDOWN, PointerEvents.createEvent(evt));
        }
    };
    Stage.prototype._pointermove = function(evt) {
        if (!Global_1.Konva._pointerEventsEnabled) {
            return;
        }
        this.setPointersPositions(evt);
        var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
            this.getIntersection(this.getPointerPosition());
        if (shape) {
            shape._fireAndBubble(POINTERMOVE, PointerEvents.createEvent(evt));
        }
    };
    Stage.prototype._pointerup = function(evt) {
        if (!Global_1.Konva._pointerEventsEnabled) {
            return;
        }
        this.setPointersPositions(evt);
        var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
            this.getIntersection(this.getPointerPosition());
        if (shape) {
            shape._fireAndBubble(POINTERUP, PointerEvents.createEvent(evt));
        }
        PointerEvents.releaseCapture(evt.pointerId);
    };
    Stage.prototype._pointercancel = function(evt) {
        if (!Global_1.Konva._pointerEventsEnabled) {
            return;
        }
        this.setPointersPositions(evt);
        var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
            this.getIntersection(this.getPointerPosition());
        if (shape) {
            shape._fireAndBubble(POINTERUP, PointerEvents.createEvent(evt));
        }
        PointerEvents.releaseCapture(evt.pointerId);
    };
    Stage.prototype._lostpointercapture = function(evt) {
        PointerEvents.releaseCapture(evt.pointerId);
    };
    Stage.prototype.setPointersPositions = function(evt) {
        var _this = this;
        var contentPosition = this._getContentPosition(),
            x = null,
            y = null;
        evt = evt ? evt : window.event;
        if (evt.touches !== undefined) {
            this._pointerPositions = [];
            this._changedPointerPositions = [];
            Util_1.Collection.prototype.each.call(evt.touches, function(touch) {
                _this._pointerPositions.push({
                    id: touch.identifier,
                    x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
                    y: (touch.clientY - contentPosition.top) / contentPosition.scaleY
                });
            });
            Util_1.Collection.prototype.each.call(evt.changedTouches || evt.touches, function(touch) {
                _this._changedPointerPositions.push({
                    id: touch.identifier,
                    x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
                    y: (touch.clientY - contentPosition.top) / contentPosition.scaleY
                });
            });
        } else {
            x = (evt.clientX - contentPosition.left) / contentPosition.scaleX;
            y = (evt.clientY - contentPosition.top) / contentPosition.scaleY;
            this.pointerPos = {
                x: x,
                y: y
            };
            this._pointerPositions = [{
                x: x,
                y: y,
                id: Util_1.Util._getFirstPointerId(evt)
            }];
            this._changedPointerPositions = [{
                x: x,
                y: y,
                id: Util_1.Util._getFirstPointerId(evt)
            }];
        }
    };
    Stage.prototype._setPointerPosition = function(evt) {
        Util_1.Util.warn('Method _setPointerPosition is deprecated. Use "stage.setPointersPositions(event)" instead.');
        this.setPointersPositions(evt);
    };
    Stage.prototype._getContentPosition = function() {
        var rect = this.content.getBoundingClientRect ?
            this.content.getBoundingClientRect() :
            {
                top: 0,
                left: 0,
                width: 1000,
                height: 1000
            };
        return {
            top: rect.top,
            left: rect.left,
            scaleX: rect.width / this.content.clientWidth || 1,
            scaleY: rect.height / this.content.clientHeight || 1,
        };
    };
    Stage.prototype._buildDOM = function() {
        this.bufferCanvas = new Canvas_1.SceneCanvas();
        this.bufferHitCanvas = new Canvas_1.HitCanvas({
            pixelRatio: 1
        });
        if (!Global_1.Konva.isBrowser) {
            return;
        }
        var container = this.container();
        if (!container) {
            throw 'Stage has no container. A container is required.';
        }
        container.innerHTML = EMPTY_STRING;
        this.content = document.createElement('div');
        this.content.style.position = RELATIVE;
        this.content.style.userSelect = 'none';
        this.content.className = KONVA_CONTENT;
        this.content.setAttribute('role', 'presentation');
        container.appendChild(this.content);
        this._resizeDOM();
    };
    Stage.prototype.cache = function() {
        Util_1.Util.warn('Cache function is not allowed for stage. You may use cache only for layers, groups and shapes.');
        return this;
    };
    Stage.prototype.clearCache = function() {
        return this;
    };
    Stage.prototype.batchDraw = function() {
        this.children.each(function(layer) {
            layer.batchDraw();
        });
        return this;
    };
    return Stage;
}(Container_1.Container));
exports.Stage = Stage;
Stage.prototype.nodeType = STAGE;
Global_2._registerNode(Stage);
Factory_1.Factory.addGetterSetter(Stage, 'container');