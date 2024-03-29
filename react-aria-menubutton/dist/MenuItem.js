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
var PropTypes = require('prop-types');
var specialAssign = require('./specialAssign');
var withManagerContext = require('./withManagerContext');

var checkedProps = {
    ambManager: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    tag: PropTypes.string,
    text: PropTypes.string,
    value: PropTypes.any
};

var AriaMenuButtonMenuItem = function(_React$Component) {
    _inherits(AriaMenuButtonMenuItem, _React$Component);

    function AriaMenuButtonMenuItem() {
        var _temp, _this, _ret;

        _classCallCheck(this, AriaMenuButtonMenuItem);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.handleKeyDown = function(event) {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            if (_this.props.tag === 'a' && _this.props.href) return;
            event.preventDefault();
            _this.selectItem(event);
        }, _this.selectItem = function(event) {
            // If there's no value, we'll send the child
            var value = typeof _this.props.value !== 'undefined' ? _this.props.value : _this.props.children;
            _this.props.ambManager.handleSelection(value, event);
        }, _this.registerNode = function(node) {
            _this.node = node;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    AriaMenuButtonMenuItem.prototype.componentDidMount = function componentDidMount() {
        this.props.ambManager.addItem({
            node: this.node,
            text: this.props.text
        });
    };

    AriaMenuButtonMenuItem.prototype.render = function render() {
        var menuItemProps = {
            onClick: this.selectItem,
            onKeyDown: this.handleKeyDown,
            role: 'menuitem',
            tabIndex: '-1',
            ref: this.registerNode
        };

        specialAssign(menuItemProps, this.props, checkedProps);

        return React.createElement(this.props.tag, menuItemProps, this.props.children);
    };

    return AriaMenuButtonMenuItem;
}(React.Component);

AriaMenuButtonMenuItem.propTypes = checkedProps;
AriaMenuButtonMenuItem.defaultProps = {
    tag: 'div'
};


module.exports = withManagerContext(AriaMenuButtonMenuItem);