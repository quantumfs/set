'use strict';

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = require('prop-types');
var createTapListener = require('teeny-tap');
var specialAssign = require('./specialAssign');
var withManagerContext = require('./withManagerContext');

var checkedProps = {
    ambManager: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
    tag: PropTypes.string
};

var AriaMenuButtonMenu = function(_React$Component) {
    _inherits(AriaMenuButtonMenu, _React$Component);

    function AriaMenuButtonMenu() {
        var _temp, _this, _ret;

        _classCallCheck(this, AriaMenuButtonMenu);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.addTapListener = function() {
            var el = ReactDOM.findDOMNode(_this);
            if (!el) return;
            var doc = el.ownerDocument;
            if (!doc) return;
            _this.tapListener = createTapListener(doc.documentElement, _this.handleTap);
        }, _this.handleTap = function(event) {
            if (ReactDOM.findDOMNode(_this).contains(event.target)) return;
            if (ReactDOM.findDOMNode(_this.props.ambManager.button).contains(event.target)) return;
            _this.props.ambManager.closeMenu();
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    AriaMenuButtonMenu.prototype.componentDidMount = function componentDidMount() {
        this.props.ambManager.menu = this;
    };

    AriaMenuButtonMenu.prototype.componentDidUpdate = function componentDidUpdate() {
        var ambManager = this.props.ambManager;
        if (!ambManager.options.closeOnBlur) return;
        if (ambManager.isOpen && !this.tapListener) {
            this.addTapListener();
        } else if (!ambManager.isOpen && this.tapListener) {
            this.tapListener.remove();
            delete this.tapListener;
        }

        if (!ambManager.isOpen) {
            // Clear the ambManager's items, so they
            // can be reloaded next time this menu opens
            ambManager.clearItems();
        }
    };

    AriaMenuButtonMenu.prototype.componentWillUnmount = function componentWillUnmount() {
        if (this.tapListener) this.tapListener.remove();
        this.props.ambManager.destroy();
    };

    AriaMenuButtonMenu.prototype.render = function render() {
        var props = this.props;
        var ambManager = this.props.ambManager;

        var childrenToRender = function() {
            if (typeof props.children === 'function') {
                return props.children({
                    isOpen: ambManager.isOpen
                });
            }
            if (ambManager.isOpen) return props.children;
            return false;
        }();

        if (!childrenToRender) return false;

        var menuProps = {
            onKeyDown: ambManager.handleMenuKey,
            role: 'menu',
            tabIndex: -1
        };

        if (ambManager.options.closeOnBlur) {
            menuProps.onBlur = ambManager.handleBlur;
        }

        specialAssign(menuProps, props, checkedProps);

        return React.createElement(props.tag, menuProps, childrenToRender);
    };

    return AriaMenuButtonMenu;
}(React.Component);

AriaMenuButtonMenu.propTypes = checkedProps;
AriaMenuButtonMenu.defaultProps = {
    tag: 'div'
};


module.exports = withManagerContext(AriaMenuButtonMenu);