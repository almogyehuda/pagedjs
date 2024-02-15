"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
/**
 * BreakToken
 * @class
 */
var BreakToken = /*#__PURE__*/function () {
  function BreakToken(node, overflowArray) {
    (0, _classCallCheck2["default"])(this, BreakToken);
    this.node = node;
    this.overflow = overflowArray || [];
    this.finished = false;
    this.breakNeededAt = [];
  }
  (0, _createClass2["default"])(BreakToken, [{
    key: "equals",
    value: function equals(otherBreakToken) {
      if (this.node !== otherBreakToken.node) {
        return false;
      }
      if (otherBreakToken.overflow.length !== this.overflow.length) {
        return false;
      }
      for (var index in this.overflow) {
        if (!this.overflow[index].equals(otherBreakToken.overflow[index])) {
          return false;
        }
      }
      var otherQueue = otherBreakToken.getForcedBreakQueue();
      for (var _index in this.breakNeededAt) {
        if (!this.breakNeededAt[_index].isEqualNode(otherQueue[_index])) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: "setFinished",
    value: function setFinished() {
      this.finished = true;
    }
  }, {
    key: "isFinished",
    value: function isFinished() {
      return this.finished;
    }
  }, {
    key: "addNeedsBreak",
    value: function addNeedsBreak(needsBreak) {
      this.breakNeededAt.push(needsBreak);
    }
  }, {
    key: "getNextNeedsBreak",
    value: function getNextNeedsBreak() {
      return this.breakNeededAt.shift();
    }
  }, {
    key: "getForcedBreakQueue",
    value: function getForcedBreakQueue() {
      return this.breakNeededAt;
    }
  }, {
    key: "setForcedBreakQueue",
    value: function setForcedBreakQueue(queue) {
      return this.breakNeededAt = queue;
    }
  }]);
  return BreakToken;
}();
var _default = BreakToken;
exports["default"] = _default;