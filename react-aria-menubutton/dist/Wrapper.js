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
var createManager = require('./createManager');
var ManagerContext = require('./ManagerContext');
var specialAssign = require('./specialAssign');

var checkedProps = {
    children: PropTypes.node.isRequired,
    onMenuToggle: PropTypes.func,
    onSelection: PropTypes.func,
    closeOnSelection: PropTypes.bool,
    closeOnBlur: PropTypes.bool,
    tag: PropTypes.string
};

var AriaMenuButtonWrapper = function(_React$Component) {
    _inherits(AriaMenuButtonWrapper, _React$Component);

    function AriaMenuButtonWrapper(props) {
        _classCallCheck(this, AriaMenuButtonWrapper);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.manager = createManager({
            onMenuToggle: _this.props.onMenuToggle,
            onSelection: _this.props.onSelection,
            closeOnSelection: _this.props.closeOnSelection,
            closeOnBlur: _this.props.closeOnBlur,
            id: _this.props.id
        });
        return _this;
    }

    AriaMenuButtonWrapper.prototype.render = function render() {
        var wrapperProps = {};
        specialAssign(wrapperProps, this.props, checkedProps);

        return React.createElement(ManagerContext.Provider, {
            value: this.manager
        }, React.createElement(this.props.tag, wrapperProps, this.props.children));
    };

    return AriaMenuButtonWrapper;
}(React.Component);

AriaMenuButtonWrapper.propTypes = checkedProps;
AriaMenuButtonWrapper.defaultProps = {
    tag: 'div'
};


module.exports = AriaMenuButtonWrapper;