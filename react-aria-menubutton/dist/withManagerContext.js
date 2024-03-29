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
var getDisplayName = require('react-display-name').default;
var ManagerContext = require('./ManagerContext');
var specialAssign = require('./specialAssign');

function withManagerContext(WrappedComponent) {
    var _class, _temp;

    return _temp = _class = function(_React$Component) {
        _inherits(_class, _React$Component);

        function _class() {
            _classCallCheck(this, _class);

            return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
        }

        _class.prototype.render = function render() {
            var _this2 = this;

            return React.createElement(ManagerContext.Consumer, null, function(ambManager) {
                var wrappedProps = {};
                specialAssign(wrappedProps, _this2.props);
                specialAssign(wrappedProps, {
                    ambManager: ambManager
                });
                return React.createElement(WrappedComponent, wrappedProps, _this2.props.children);
            });
        };

        return _class;
    }(React.Component), _class.displayName = 'withManagerContext(' + getDisplayName(WrappedComponent) + ')', _temp;
}

module.exports = withManagerContext;