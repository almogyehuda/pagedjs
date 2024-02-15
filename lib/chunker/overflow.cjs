"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
/**
 * Overflow
 * @class
 */
var Overflow = /*#__PURE__*/function () {
  function Overflow(node, offset, overflowHeight, range) {
    (0, _classCallCheck2["default"])(this, Overflow);
    this.node = node;
    this.offset = offset;
    this.overflowHeight = overflowHeight;
    this.range = range;
  }
  (0, _createClass2["default"])(Overflow, [{
    key: "equals",
    value: function equals(otherOffset) {
      if (!otherOffset) {
        return false;
      }
      if (this["node"] && otherOffset["node"] && this["node"] !== otherOffset["node"]) {
        return false;
      }
      if (this["offset"] && otherOffset["offset"] && this["offset"] !== otherOffset["offset"]) {
        return false;
      }
      return true;
    }
  }]);
  return Overflow;
}();
var _default = Overflow;
exports["default"] = _default;