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
var Container_1 = require("./Container");
var Global_1 = require("./Global");
var Group = (function(_super) {
    __extends(Group, _super);

    function Group() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Group.prototype._validateAdd = function(child) {
        var type = child.getType();
        if (type !== 'Group' && type !== 'Shape') {
            Util_1.Util.throw('You may only add groups and shapes to groups.');
        }
    };
    return Group;
}(Container_1.Container));
exports.Group = Group;
Group.prototype.nodeType = 'Group';
Global_1._registerNode(Group);
Util_1.Collection.mapMethods(Group);