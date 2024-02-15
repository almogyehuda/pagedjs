"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _utils = require("../utils/utils.cjs");
var _dom = require("../utils/dom.cjs");
var _breaktoken = _interopRequireDefault(require("./breaktoken.cjs"));
var _renderresult = _interopRequireDefault(require("./renderresult.cjs"));
var _eventEmitter = _interopRequireDefault(require("event-emitter"));
var _hook = _interopRequireDefault(require("../utils/hook.cjs"));
var _overflow = _interopRequireDefault(require("./overflow.cjs"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var MAX_CHARS_PER_BREAK = 1500;

/**
 * Layout
 * @class
 */
var Layout = /*#__PURE__*/function () {
  function Layout(element, hooks, options) {
    var _this$element$offsetP;
    (0, _classCallCheck2["default"])(this, Layout);
    this.element = element;
    this.bounds = this.element.getBoundingClientRect();
    this.parentBounds = ((_this$element$offsetP = this.element.offsetParent) === null || _this$element$offsetP === void 0 ? void 0 : _this$element$offsetP.getBoundingClientRect()) || {
      left: 0
    };
    var gap = parseFloat(window.getComputedStyle(this.element).columnGap);
    if (gap) {
      var leftMargin = this.bounds.left - this.parentBounds.left;
      this.gap = gap - leftMargin;
    } else {
      this.gap = 0;
    }
    if (hooks) {
      this.hooks = hooks;
    } else {
      this.hooks = {};
      this.hooks.onPageLayout = new _hook["default"]();
      this.hooks.layout = new _hook["default"]();
      this.hooks.renderNode = new _hook["default"]();
      this.hooks.layoutNode = new _hook["default"]();
      this.hooks.getOverflow = new _hook["default"]();
      this.hooks.beforeOverflow = new _hook["default"]();
      this.hooks.onOverflow = new _hook["default"]();
      this.hooks.afterOverflowRemoved = new _hook["default"]();
      this.hooks.afterOverflowAdded = new _hook["default"]();
      this.hooks.onBreakToken = new _hook["default"]();
      this.hooks.beforeRenderResult = new _hook["default"]();
    }
    this.settings = options || {};
    this.maxChars = this.settings.maxChars || MAX_CHARS_PER_BREAK;
    this.forceRenderBreak = false;
  }
  (0, _createClass2["default"])(Layout, [{
    key: "renderTo",
    value: function () {
      var _renderTo = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(wrapper, source, breakToken) {
        var prevPage,
          bounds,
          start,
          firstDivisible,
          walker,
          node,
          done,
          next,
          forcedBreakQueue,
          prevBreakToken,
          newBreakToken,
          hasRenderedContent,
          named,
          page,
          imgs,
          shallow,
          _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              prevPage = _args.length > 3 && _args[3] !== undefined ? _args[3] : null;
              bounds = _args.length > 4 && _args[4] !== undefined ? _args[4] : this.bounds;
              start = this.getStart(source, breakToken);
              firstDivisible = source;
              while (firstDivisible.children.length == 1) {
                firstDivisible = firstDivisible.children[0];
              }
              walker = (0, _dom.walk)(start, source);
              forcedBreakQueue = [];
              prevBreakToken = breakToken || new _breaktoken["default"](start);
              this.hooks && this.hooks.onPageLayout.trigger(wrapper, prevBreakToken, this);

              // Add overflow, and check that it doesn't have overflow itself.
              this.addOverflowToPage(wrapper, breakToken, prevPage);

              // Footnotes may change the bounds.
              bounds = this.element.getBoundingClientRect();
              newBreakToken = this.findBreakToken(wrapper, source, bounds, prevBreakToken, start);
              if (!prevBreakToken.isFinished()) {
                _context.next = 15;
                break;
              }
              if (newBreakToken) {
                newBreakToken.setFinished();
              }
              return _context.abrupt("return", new _renderresult["default"](newBreakToken));
            case 15:
              hasRenderedContent = !!wrapper.childNodes.length;
              if (prevBreakToken) {
                forcedBreakQueue = prevBreakToken.getForcedBreakQueue();
              }
            case 17:
              if (!(!done && !newBreakToken)) {
                _context.next = 43;
                break;
              }
              next = walker.next();
              node = next.value;
              done = next.done;
              if (node) {
                this.hooks && this.hooks.layoutNode.trigger(node);

                // Footnotes may change the bounds.
                bounds = this.element.getBoundingClientRect();

                // Check if the rendered element has a break set
                // Remember the node but don't apply the break until we have laid
                // out the rest of any parent content - this lets a table or divs
                // side by side still add content to this page before we start a new
                // one.
                if (this.shouldBreak(node) && hasRenderedContent) {
                  forcedBreakQueue.push(node);
                }
                if (!forcedBreakQueue.length && node.dataset && node.dataset.page) {
                  named = node.dataset.page;
                  page = this.element.closest(".pagedjs_page");
                  page.classList.add("pagejs_named_page");
                  page.classList.add("pagedjs_" + named + "_page");
                  if (!node.dataset.splitFrom) {
                    page.classList.add("pagedjs_" + named + "_first_page");
                  }
                }
              }

              // Check whether we have overflow when we've completed laying out a top
              // level element. This lets it have multiple children overflowing and
              // allows us to move all of the overflows onto the next page together.
              if (!(forcedBreakQueue.length || !node || !node.parentElement || node.parentElement == firstDivisible)) {
                _context.next = 36;
                break;
              }
              this.hooks && this.hooks.layout.trigger(wrapper, this);
              imgs = wrapper.querySelectorAll("img");
              if (!imgs.length) {
                _context.next = 28;
                break;
              }
              _context.next = 28;
              return this.waitForImages(imgs);
            case 28:
              newBreakToken = this.findBreakToken(wrapper, source, bounds, prevBreakToken, node);
              if (newBreakToken && node === undefined) {
                // We have run out of content. Do add the overflow to a new page but
                // don't repeat the whole thing again.
                newBreakToken.setFinished();
              }
              if (forcedBreakQueue.length) {
                if (newBreakToken) {
                  newBreakToken.setForcedBreakQueue(forcedBreakQueue);
                } else {
                  newBreakToken = this.breakAt(forcedBreakQueue.shift(), 0, forcedBreakQueue);
                }
              }
              if (!(newBreakToken && newBreakToken.equals(prevBreakToken))) {
                _context.next = 34;
                break;
              }
              this.failed = true;
              return _context.abrupt("return", new _renderresult["default"](undefined, "Unable to layout item: " + node));
            case 34:
              if (!(!node || newBreakToken)) {
                _context.next = 36;
                break;
              }
              return _context.abrupt("return", new _renderresult["default"](newBreakToken));
            case 36:
              // Should the Node be a shallow or deep clone?
              shallow = (0, _dom.isContainer)(node);
              this.append(node, wrapper, breakToken, shallow);
              bounds = this.element.getBoundingClientRect();

              // Check whether layout has content yet.
              if (!hasRenderedContent) {
                hasRenderedContent = (0, _dom.hasContent)(node);
              }

              // Skip to the next node if a deep clone was rendered.
              if (!shallow) {
                walker = (0, _dom.walk)((0, _dom.nodeAfter)(node, source), source);
              }
              _context.next = 17;
              break;
            case 43:
              this.hooks && this.hooks.beforeRenderResult.trigger(newBreakToken, wrapper, this);
              return _context.abrupt("return", new _renderresult["default"](newBreakToken));
            case 45:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function renderTo(_x, _x2, _x3) {
        return _renderTo.apply(this, arguments);
      }
      return renderTo;
    }()
  }, {
    key: "breakAt",
    value: function breakAt(node) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var forcedBreakQueue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var newBreakToken = new _breaktoken["default"](node, offset, forcedBreakQueue);
      var breakHooks = this.hooks.onBreakToken.triggerSync(newBreakToken, undefined, node, this);
      breakHooks.forEach(function (newToken) {
        if (typeof newToken != "undefined") {
          newBreakToken = newToken;
        }
      });
      return newBreakToken;
    }
  }, {
    key: "shouldBreak",
    value: function shouldBreak(node, limiter) {
      var previousNode = (0, _dom.nodeBefore)(node, limiter);
      var parentNode = node.parentNode;
      var parentBreakBefore = (0, _dom.needsBreakBefore)(node) && parentNode && !previousNode && (0, _dom.needsBreakBefore)(parentNode);
      var doubleBreakBefore;
      if (parentBreakBefore) {
        doubleBreakBefore = node.dataset.breakBefore === parentNode.dataset.breakBefore;
      }
      return !doubleBreakBefore && (0, _dom.needsBreakBefore)(node) || (0, _dom.needsPreviousBreakAfter)(node) || (0, _dom.needsPageBreak)(node, previousNode);
    }
  }, {
    key: "forceBreak",
    value: function forceBreak() {
      this.forceRenderBreak = true;
    }
  }, {
    key: "getStart",
    value: function getStart(source, breakToken) {
      var start;
      var node = breakToken && breakToken.node;
      var finished = breakToken && breakToken.finished;
      if (node) {
        start = node;
      } else {
        start = source.firstChild;
      }
      return finished ? undefined : start;
    }

    /**
     * Merge items from source into dest which don't yet exist in dest.
     *
     * @param {element} dest
     *   A destination DOM node tree.
     * @param {element} source
     *   A source DOM node tree.
     *
     * @returns {void}
     */
  }, {
    key: "addOverflowNodes",
    value: function addOverflowNodes(dest, source) {
      var _this = this;
      // Since we are modifying source as we go, we need to remember what
      Array.from(source.childNodes).forEach(function (item) {
        if ((0, _dom.isText)(item)) {
          // If we get to a text node, we assume for now an earlier element
          // would have prevented duplication.
          dest.append(item);
        } else {
          var match = (0, _dom.findElement)(item, dest);
          if (match) {
            _this.addOverflowNodes(match, item);
          } else {
            dest.appendChild(item);
          }
        }
      });
    }

    /**
     * Add overflow to new page.
     *
     * @param {element} dest
     *   The page content being built.
     * @param {breakToken} breakToken
     *   The current break cotent.
     * @param {element} alreadyRendered
     *   The content that has already been rendered.
     *
     * @returns {void}
     */
  }, {
    key: "addOverflowToPage",
    value: function addOverflowToPage(dest, breakToken, alreadyRendered) {
      var _this2 = this;
      if (!breakToken || !breakToken.overflow.length) {
        return;
      }
      var fragment;
      breakToken.overflow.forEach(function (overflow) {
        // A handy way to dump the contents of a fragment.
        // console.log([].map.call(overflow.content.children, e => e.outerHTML).join('\n'));

        fragment = (0, _dom.rebuildTree)(overflow.node, fragment, alreadyRendered);
        // Find the parent to which overflow.content should be added.
        // Overflow.content can be a much shallower start than
        // overflow.node, if the range end was outside of the range
        // start part of the tree. For this reason, we use a match against
        // the parent element of overflow.content if it exists, or fall back
        // to overflow.node's parent element.
        var addTo = overflow.ancestor ? (0, _dom.findElement)(overflow.ancestor, fragment) : fragment;
        _this2.addOverflowNodes(addTo, overflow.content);
      });

      // Record refs.
      Array.from(fragment.querySelectorAll('[data-ref]')).forEach(function (ref) {
        var refId = ref.dataset['ref'];
        if (!dest.querySelector("[data-ref='".concat(refId, "']"))) {
          if (!dest.indexOfRefs) {
            dest.indexOfRefs = {};
          }
          dest.indexOfRefs[refId] = ref;
        }
      });
      dest.appendChild(fragment);
      this.hooks && this.hooks.afterOverflowAdded.trigger(dest);
    }

    /**
     * Add text to new page.
     *
     * @param {element} node
     *   The node being appended to the destination.
     * @param {element} dest
     *   The destination to which content is being added.
     * @param {breakToken} breakToken
     *   The current breakToken.
     * @param {bool} shallow
     *	 Whether to do a shallow copy of the node.
     * @param {bool} rebuild
     *   Whether to rebuild parents.
     *
     * @returns {ChildNode}
     *   The cloned node.
     */
  }, {
    key: "append",
    value: function append(node, dest, breakToken) {
      var shallow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var rebuild = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
      var clone = (0, _dom.cloneNode)(node, !shallow);
      if (node.parentNode && (0, _dom.isElement)(node.parentNode)) {
        var parent = (0, _dom.findElement)(node.parentNode, dest);
        // Rebuild chain
        if (parent) {
          parent.appendChild(clone);
        } else if (rebuild) {
          var fragment = (0, _dom.rebuildTree)(node.parentElement);
          parent = (0, _dom.findElement)(node.parentNode, fragment);
          parent.appendChild(clone);
          dest.appendChild(fragment);
        } else {
          dest.appendChild(clone);
        }
      } else {
        dest.appendChild(clone);
      }
      if (clone.dataset && clone.dataset.ref) {
        if (!dest.indexOfRefs) {
          dest.indexOfRefs = {};
        }
        dest.indexOfRefs[clone.dataset.ref] = clone;
      }
      var nodeHooks = this.hooks.renderNode.triggerSync(clone, node, this);
      nodeHooks.forEach(function (newNode) {
        if (typeof newNode != "undefined") {
          clone = newNode;
        }
      });
      return clone;
    }
  }, {
    key: "rebuildTableFromBreakToken",
    value: function rebuildTableFromBreakToken(breakToken, dest) {
      if (!breakToken || !breakToken.node) {
        return;
      }
      var node = breakToken.node;
      var td = (0, _dom.isElement)(node) ? node.closest("td") : node.parentElement.closest("td");
      if (td) {
        var rendered = (0, _dom.findElement)(td, dest, true);
        if (!rendered) {
          return;
        }
        while (td = td.nextElementSibling) {
          this.append(td, dest, null, true);
        }
      }
    }
  }, {
    key: "waitForImages",
    value: function () {
      var _waitForImages = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(imgs) {
        var _this3 = this;
        var results;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              results = Array.from(imgs).map( /*#__PURE__*/function () {
                var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(img) {
                  return _regenerator["default"].wrap(function _callee2$(_context2) {
                    while (1) switch (_context2.prev = _context2.next) {
                      case 0:
                        return _context2.abrupt("return", _this3.awaitImageLoaded(img));
                      case 1:
                      case "end":
                        return _context2.stop();
                    }
                  }, _callee2);
                }));
                return function (_x5) {
                  return _ref.apply(this, arguments);
                };
              }());
              _context3.next = 3;
              return Promise.all(results);
            case 3:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function waitForImages(_x4) {
        return _waitForImages.apply(this, arguments);
      }
      return waitForImages;
    }()
  }, {
    key: "awaitImageLoaded",
    value: function () {
      var _awaitImageLoaded = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(image) {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt("return", new Promise(function (resolve) {
                if (image.complete !== true) {
                  image.onload = function () {
                    var _window$getComputedSt = window.getComputedStyle(image),
                      width = _window$getComputedSt.width,
                      height = _window$getComputedSt.height;
                    resolve(width, height);
                  };
                  image.onerror = function (e) {
                    var _window$getComputedSt2 = window.getComputedStyle(image),
                      width = _window$getComputedSt2.width,
                      height = _window$getComputedSt2.height;
                    resolve(width, height, e);
                  };
                } else {
                  var _window$getComputedSt3 = window.getComputedStyle(image),
                    width = _window$getComputedSt3.width,
                    height = _window$getComputedSt3.height;
                  resolve(width, height);
                }
              }));
            case 1:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function awaitImageLoaded(_x6) {
        return _awaitImageLoaded.apply(this, arguments);
      }
      return awaitImageLoaded;
    }()
  }, {
    key: "avoidBreakInside",
    value: function avoidBreakInside(node, limiter) {
      var breakNode;
      while (node.parentNode) {
        if (node === limiter) {
          break;
        }
        if (window.getComputedStyle(node)["break-inside"] === "avoid") {
          breakNode = node;
          break;
        }
        node = node.parentNode;
      }
      return breakNode;
    }
  }, {
    key: "createOverflow",
    value: function createOverflow(overflow, rendered, source) {
      var container = overflow.startContainer;
      var offset = overflow.startOffset;
      var node, renderedNode, parent, index, temp;
      if ((0, _dom.isElement)(container)) {
        if (container.nodeName == "INPUT") {
          temp = container;
        } else {
          // Offset can be incorrect in tables spanning multiple pages.
          // To reproduce, fill a specification composite "prepared by" field
          // with a ton of lorem ipsum.
          temp = (0, _dom.child)(container, offset) || (0, _dom.child)(container, 0);
        }
        if ((0, _dom.isElement)(temp)) {
          renderedNode = (0, _dom.findElement)(temp, rendered);
          if (!renderedNode) {
            // Find closest element with data-ref
            var prevNode = (0, _dom.prevValidNode)(temp);
            if (!(0, _dom.isElement)(prevNode)) {
              prevNode = prevNode.parentElement;
            }
            renderedNode = (0, _dom.findElement)(prevNode, rendered);
            // Check if temp is the last rendered node at its level.
            if (!temp.nextSibling) {
              // We need to ensure that the previous sibling of temp is fully rendered.
              var renderedNodeFromSource = (0, _dom.findElement)(renderedNode, source);
              var walker = document.createTreeWalker(renderedNodeFromSource, NodeFilter.SHOW_ELEMENT);
              var lastChildOfRenderedNodeFromSource = walker.lastChild();
              var lastChildOfRenderedNodeMatchingFromRendered = (0, _dom.findElement)(lastChildOfRenderedNodeFromSource, rendered);
              // Check if we found that the last child in source
              if (!lastChildOfRenderedNodeMatchingFromRendered) {
                // Pending content to be rendered before virtual break token
                return;
              }
              // Otherwise we will return a break token as per below
            }
            // renderedNode is actually the last unbroken box that does not overflow.
            // Break Token is therefore the next sibling of renderedNode within source node.
            node = (0, _dom.findElement)(renderedNode, source).nextSibling;
            offset = 0;
          } else {
            node = (0, _dom.findElement)(renderedNode, source);
            offset = 0;
          }
        } else {
          renderedNode = (0, _dom.findElement)(container, rendered);
          if (!renderedNode) {
            renderedNode = (0, _dom.findElement)((0, _dom.prevValidNode)(container), rendered);
          }
          parent = (0, _dom.findElement)(renderedNode, source);
          index = (0, _dom.indexOfTextNode)(temp, parent);
          // No seperatation for the first textNode of an element
          if (index === 0) {
            node = parent;
            offset = 0;
          } else {
            node = (0, _dom.child)(parent, index);
            offset = 0;
          }
        }
      } else {
        renderedNode = (0, _dom.findElement)(container.parentNode, rendered);
        if (!renderedNode) {
          renderedNode = (0, _dom.findElement)((0, _dom.prevValidNode)(container.parentNode), rendered);
        }
        parent = (0, _dom.findElement)(renderedNode, source);
        index = (0, _dom.indexOfTextNode)(container, parent);
        if (index === -1) {
          return;
        }
        node = (0, _dom.child)(parent, index);
        offset += node.textContent.indexOf(container.textContent);
      }
      if (!node) {
        // console.log(isElement(container), child(container, offset), temp);
        return;
      }
      return new _overflow["default"](node, offset, overflow.getBoundingClientRect().height, overflow);
    }
  }, {
    key: "lastChildCheck",
    value: function lastChildCheck(parentElement, rootElement) {
      if (parentElement.childElementCount) {
        this.lastChildCheck(parentElement.lastElementChild, rootElement);
      }
      var refId = parentElement.dataset['ref'];
      if (['TR', 'math', 'P'].indexOf(parentElement.tagName) > -1 && parentElement.textContent.trim() == '') {
        parentElement.parentNode.removeChild(parentElement);
      } else if (refId && !rootElement.indexOfRefs[refId]) {
        rootElement.indexOfRefs[refId] = parentElement;
      }
    }
  }, {
    key: "processOverflowResult",
    value: function processOverflowResult(ranges, rendered, source, bounds, prevBreakToken, node, extract) {
      var _this4 = this;
      var breakToken, breakLetter;
      ranges.forEach(function (overflowRange) {
        var _overflow$node;
        var overflowHooks = _this4.hooks.onOverflow.triggerSync(overflowRange, rendered, bounds, _this4);
        overflowHooks.forEach(function (newOverflow) {
          if (typeof newOverflow != "undefined") {
            overflowRange = newOverflow;
          }
        });
        var overflow = _this4.createOverflow(overflowRange, rendered, source);
        if (!breakToken) {
          breakToken = new _breaktoken["default"](node, [overflow]);
        } else {
          breakToken.overflow.push(overflow);
        }

        // breakToken is nullable
        var breakHooks = _this4.hooks.onBreakToken.triggerSync(breakToken, overflowRange, rendered, _this4);
        breakHooks.forEach(function (newToken) {
          if (typeof newToken != "undefined") {
            breakToken = newToken;
          }
        });

        // Stop removal if we are in a loop
        if (breakToken.equals(prevBreakToken)) {
          return;
        }
        if (overflow !== null && overflow !== void 0 && overflow.node && overflow !== null && overflow !== void 0 && overflow.offset && overflow !== null && overflow !== void 0 && (_overflow$node = overflow.node) !== null && _overflow$node !== void 0 && _overflow$node.textContent) {
          breakLetter = overflow.node.textContent.charAt(overflow.offset);
        } else {
          breakLetter = undefined;
        }
        if (overflow !== null && overflow !== void 0 && overflow.node && extract) {
          overflow.ancestor = (0, _dom.findElement)(overflow.range.commonAncestorContainer, source);
          overflow.content = _this4.removeOverflow(overflowRange, breakLetter);
        }
      });

      // For each overflow that is removed, see if we have an empty td that can be removed.
      // Also check that the data-ref is set so we get all the split-froms and tos. If a copy
      // of a node wasn't shallow, the indexOfRefs entry won't be there yet.
      ranges.forEach(function (overflowRange) {
        _this4.lastChildCheck(rendered, rendered);
      });

      // And then see if the last element has been completely removed and not split.
      if (rendered.indexOfRefs && extract && breakToken.overflow.length) {
        var firstOverflow = breakToken.overflow[0];
        if (firstOverflow !== null && firstOverflow !== void 0 && firstOverflow.node && firstOverflow.content) {
          // Remove data-refs in the overflow from the index.
          Array.from(firstOverflow.content.querySelectorAll('[data-ref]')).forEach(function (ref) {
            var refId = ref.dataset['ref'];
            if (!rendered.querySelector("[data-ref='".concat(refId, "']"))) {
              delete rendered.indexOfRefs[refId];
            }
          });
        }
      }
      breakToken.overflow.forEach(function (overflow) {
        _this4.hooks && _this4.hooks.afterOverflowRemoved.trigger(overflow.content, rendered, _this4);
      });
      return breakToken;
    }
  }, {
    key: "findBreakToken",
    value: function findBreakToken(rendered, source) {
      var bounds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.bounds;
      var prevBreakToken = arguments.length > 3 ? arguments[3] : undefined;
      var node = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var extract = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
      var breakToken;
      var overflowResult = this.getOverflow(rendered, bounds, source);
      if (overflowResult) {
        breakToken = this.processOverflowResult(overflowResult, rendered, source, bounds, prevBreakToken, node, extract);

        // Hooks (eg footnotes) might alter the flow in response to the above removal of overflow,
        // potentially resulting in more reflow.
        var secondOverflow = this.getOverflow(rendered, bounds, source);
        if (secondOverflow && secondOverflow.length && extract) {
          var secondToken = this.processOverflowResult(secondOverflow, rendered, source, bounds, prevBreakToken, node, extract);
          if (!secondToken.equals(breakToken)) {
            // Prepend.
            breakToken.overflow = secondToken.overflow.concat(breakToken.overflow);
          }
        }
      }
      return breakToken;
    }

    /**
     * Does the element exceed the bounds?
     *
     * @param {element} element
     *   The element being constrained.
     * @param {array} bounds
     *   The bounding element.
     *
     * @returns {bool}
     *   Whether the element is within bounds.
     */
  }, {
    key: "hasOverflow",
    value: function hasOverflow(element) {
      var bounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.bounds;
      var constrainingElement = element && element.parentNode; // this gets the element, instead of the wrapper for the width workaround
      if (constrainingElement.classList.contains("pagedjs_page_content")) {
        constrainingElement = element;
      }
      var _element$getBoundingC = element.getBoundingClientRect(),
        width = _element$getBoundingC.width,
        height = _element$getBoundingC.height;
      var scrollWidth = constrainingElement ? constrainingElement.scrollWidth : 0;
      var scrollHeight = constrainingElement ? constrainingElement.scrollHeight : 0;
      return Math.max(Math.ceil(width), scrollWidth) > Math.ceil(bounds.width) || Math.max(Math.ceil(height), scrollHeight) > Math.ceil(bounds.height);
    }

    /**
     * Returns the first child that overflows the bounds.
     *
     * There may be no children that overflow (the height might be extended
     * by a sibling). In this case, this function returns NULL.
     *
     * @param {node} node
     *   The parent node of the children we are searching.
     * @param {array} bounds
     *   The bounds of the page area.
     * @returns {ChildNode | null | undefined}
     *   The first overflowing child within the node.
     */
  }, {
    key: "firstOverflowingChild",
    value: function firstOverflowingChild(node, bounds) {
      var bLeft = Math.ceil(bounds.left);
      var bRight = Math.floor(bounds.right);
      var bTop = Math.ceil(bounds.top);
      var bBottom = Math.floor(bounds.bottom);
      var _iterator = _createForOfIteratorHelper(node.childNodes),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _child = _step.value;
          if (_child.tagName == "COLGROUP") {
            continue;
          }
          var pos = (0, _utils.getBoundingClientRect)(_child);
          var bottomMargin = 0;
          if ((0, _dom.isElement)(_child)) {
            var styles = window.getComputedStyle(_child);
            bottomMargin = parseInt(styles["margin-bottom"]);
          }
          var left = Math.ceil(pos.left);
          var right = Math.floor(pos.right);
          var top = Math.ceil(pos.top);
          var bottom = Math.floor(pos.bottom + bottomMargin);
          if (!(pos.height + bottomMargin)) {
            continue;
          }
          if (left < bLeft || right > bRight || top < bTop || bottom > bBottom) {
            return _child;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "startOfOverflow",
    value: function startOfOverflow(node, bounds) {
      var childNode,
        done = false;
      var prev;
      var anyOverflowFound = false;
      do {
        prev = node;
        do {
          childNode = this.firstOverflowingChild(node, bounds);
          if (childNode) {
            anyOverflowFound = true;
          } else {
            // The overflow isn't caused by children. It could be caused by:
            // * a sibling div / td / element with height that stretches this
            //   element
            // * margin / padding on this element
            // In the former case, we want to ignore this node and take the
            // sibling. In the later case, we want to move this node.
            var intrinsicBottom = 0,
              intrinsicRight = 0;
            if ((0, _dom.isElement)(node)) {
              var styles = window.getComputedStyle(node);
              if (node.childNodes.length) {
                var lastChild = node.childNodes[node.childNodes.length - 1];
                var childBounds = (0, _utils.getBoundingClientRect)(lastChild);
                intrinsicRight = childBounds.right;
                intrinsicBottom = childBounds.bottom;
              } else {
                // Has no children so should have no height, all other things
                // being equal.
                var _childBounds = (0, _utils.getBoundingClientRect)(node);
                intrinsicRight = (0, _utils.getBoundingClientRect)(node).right;
                intrinsicBottom = (0, _utils.getBoundingClientRect)(node).top;
                var intrinsicLeft = (0, _utils.getBoundingClientRect)(node).x;

                // Check for possible Chromium bug case.
                if (intrinsicBottom < bounds.bottom && intrinsicLeft > bounds.x + bounds.width) {
                  done = true;
                }
              }
              intrinsicRight += parseInt(styles["paddingRight"]) + parseInt(styles["marginRight"]);
              intrinsicBottom += parseInt(styles["paddingBottom"]) + parseInt(styles["marginBottom"]);
            } else {
              var _childBounds2 = (0, _utils.getBoundingClientRect)(node);
              intrinsicRight = (0, _utils.getBoundingClientRect)(node).right;
              intrinsicBottom = (0, _utils.getBoundingClientRect)(node).bottom;
            }
            if (intrinsicBottom <= bounds.bottom && intrinsicRight <= bounds.right) {
              node = node.nextElementSibling;
            } else {
              // Node is causing the overflow via padding and margin or text content.
              done = true;
            }
          }
        } while (node && !childNode && !done);
        if (node) {
          node = childNode;
        }
      } while (node && !done);
      return [prev, anyOverflowFound];
    }
  }, {
    key: "rowspanNeedsBreakAt",
    value: function rowspanNeedsBreakAt(tableRow, rendered) {
      if (tableRow.nodeName !== 'TR') {
        return;
      }
      var table = (0, _dom.parentOf)(tableRow, "TABLE", rendered);
      if (!table) {
        return;
      }
      var rowspan = table.querySelector("[colspan]");
      if (!rowspan) {
        return;
      }
      var columnCount = 0;
      for (var _i = 0, _Array$from = Array.from(table.rows[0].cells); _i < _Array$from.length; _i++) {
        var cell = _Array$from[_i];
        columnCount += parseInt(cell.getAttribute("colspan") || "1");
      }
      if (tableRow.cells.length !== columnCount) {
        var previousRow = tableRow;
        var previousRowColumnCount;
        while (previousRow !== null) {
          previousRowColumnCount = 0;
          for (var _i2 = 0, _Array$from2 = Array.from(previousRow.cells); _i2 < _Array$from2.length; _i2++) {
            var _cell = _Array$from2[_i2];
            previousRowColumnCount += parseInt(_cell.getAttribute("colspan") || "1");
          }
          if (previousRowColumnCount === columnCount) {
            break;
          }
          previousRow = previousRow.previousElementSibling;
        }
        if (previousRowColumnCount === columnCount) {
          return previousRow;
        }
      }
    }
  }, {
    key: "getOverflow",
    value: function getOverflow(rendered, bounds, source) {
      this.hooks && this.hooks.getOverflow.trigger(rendered, bounds, source, this);
      return this.findOverflow(rendered, bounds, source);
    }
  }, {
    key: "findOverflow",
    value: function findOverflow(rendered, bounds, source) {
      if (!this.hasOverflow(rendered, bounds)) {
        return;
      }
      var start = bounds.left;
      var end = bounds.right;
      var vStart = bounds.top;
      var vEnd = bounds.bottom;
      var range, anyOverflowFound;

      // Find the deepest element that is the first in set of siblings with
      // overflow. There may be others. We just take the first we find and
      // are called again to check for additional instances.
      var node = rendered,
        prev,
        startRemainder;
      while ((0, _dom.isText)(node)) {
        node = node.nextElementSibling;
      }
      var _this$startOfOverflow = this.startOfOverflow(node, bounds);
      var _this$startOfOverflow2 = (0, _slicedToArray2["default"])(_this$startOfOverflow, 2);
      prev = _this$startOfOverflow2[0];
      anyOverflowFound = _this$startOfOverflow2[1];
      if (!anyOverflowFound) {
        return;
      }

      // The node we finished on may be within something asking not to have its
      // contents split. It - or a parent - may also have to be split because
      // the content is just too big for the page.
      // Resolve those requirements, deciding on a node that will be split in
      // the following way:
      // 1) Prefer the smallest node we can (start with the one we ended on).
      //    While going back up the ancestors, use an ancestor instead if it
      //    has siblings that will be rendered below this one. (For columns
      //    or TD side by side, we want to do separate overflows).
      // 2) Take the shallowest parent asking not to be split that will fit
      //    within a page.
      // 3) If that resulting node doesn't fit on this page, it is the start
      //    of the overflow. If it does fit, following siblings start the range.
      // The range runs to the end of the list of siblings of the resulting
      // node. This may not be the end of where we rendered because we render
      // until the top level element is completed, so that if there is a
      // container that has multiple children laid out side by side and more
      // than one of them overflow, all the overflow gets handled correctly.
      // In this case, this function will get called multiple times, returning
      // each piece of overflow until nothing overflows the page anymore
      // (the caller does the removal of the overflow before calling us again).
      // Lastly, as we go back up the tree, we need to look for parents (or
      // the original node) having siblings that extend the overflow. They
      // should be included in this range.

      var check = startRemainder = node = prev,
        rangeEndNode = check,
        lastcheck = check;
      var mustSplit = false;
      var siblingRangeStart, siblingRangeEnd, container;
      var checkIsFirstChild = false,
        rowCandidate;

      // Check whether we have a td with overflow or divs laid out side by side.
      // If we do and it's within content that can be or must be split, remove
      // the overflow as our first range, and take the remaining content after
      // this TR / set of side by side divs as a second range.
      do {
        if ((0, _dom.isElement)(check)) {
          var checkBounds = (0, _utils.getBoundingClientRect)(check);
          if (checkBounds.height > bounds.height) {
            mustSplit = true;
          }
          var styles = window.getComputedStyle(check);
          if (this.avoidBreakInside(check, rendered)) {
            var rowspanNeedsBreakAt = this.rowspanNeedsBreakAt(check, rendered);
            if (rowspanNeedsBreakAt) {
              // No question - break earlier.
              siblingRangeEnd = undefined;
              prev = rowspanNeedsBreakAt;
              break;
            }

            // If there is a TD with overflow and it is within a break-inside:
            // avoid, we take the whole container, provided that it will fit
            // on a page by itself. The normal handling below will take care
            // of that.
            if (!mustSplit) {
              siblingRangeStart = siblingRangeEnd = undefined;
              prev = check;
            }
            if (!rowCandidate) {
              rowCandidate = check;
            }
          }
          if (check.nextElementSibling) {
            // This is messy. Two siblings might be side by side for a number of reasons:
            // - TD in a TR (what we're seeking to detect so we get the overflow from other TDs too)
            // - Divs side by side in a grid (we'd also like to capture overflow here but reflow might be
            //   complicated ala the next case.
            // - Footnotes or other content with a fixed height parent making overflow push out to the side
            //   (best to treat all overflow as one).
            var siblingBounds = (0, _utils.getBoundingClientRect)(check.nextElementSibling);
            var parentHeight = check.parentElement.style.height;
            var cStyle = check.currentStyle || getComputedStyle(check, "");
            if (!parentHeight && siblingBounds.top == checkBounds.top && siblingBounds.left != checkBounds.left && cStyle.display !== "inline") {
              siblingRangeStart = prev;
              siblingRangeEnd = check.lastChild;
              container = check;

              // Get the columns widths and make them attributes so removal of
              // overflow doesn't do strange things.
              check.parentElement.childNodes.forEach(function (childNode) {
                if (!(0, _dom.isText)(childNode)) {
                  childNode.width = getComputedStyle(childNode).width;
                }
              });

              // Might be removing all the content?
              checkIsFirstChild = check.parentElement.firstChild === check;
            }
          }
          if (Array.from(check.classList).filter(function (value) {
            return ['region-content', 'pagedjs_page_content'].includes(value);
          }).length) {
            break;
          }
        }
        lastcheck = check;
        check = check.parentElement;
      } while (check && check !== rendered);
      var offset;
      if (siblingRangeEnd) {
        var ranges = [],
          origSiblingRangeEnd = siblingRangeEnd;

        // Reset to take next row / equivalent as overflow too.
        startRemainder = origSiblingRangeEnd.parentElement.parentElement.nextElementSibling;

        // Get the overflow for all siblings at once.
        do {
          offset = 0;
          if ((0, _dom.isText)(siblingRangeStart) && siblingRangeStart.textContent.trim().length) {
            offset = this.textBreak(siblingRangeStart, start, end, vStart, vEnd);
          }

          // Is a whole row being removed?
          // Ignore newlines when deciding this.
          if (checkIsFirstChild && !siblingRangeStart.textContent.substring(0, offset).trim().length && rowCandidate !== undefined) {
            startRemainder = container = rowCandidate;
            siblingRangeStart = undefined;
          } else {
            // Set the start of the range and record on node or the previous element
            // that overflow was moved.
            range = document.createRange();
            if (offset) {
              range.setStart(siblingRangeStart, offset);
            } else {
              range.selectNode(siblingRangeStart);
            }

            // Additional nodes may have been added that will overflow further beyond
            // node. Include them in the range.
            range.setEndAfter(siblingRangeEnd || siblingRangeStart);
            ranges.push(range);
            do {
              container = container.nextElementSibling;
              if (container) {
                var _this$startOfOverflow3 = this.startOfOverflow(container, bounds);
                var _this$startOfOverflow4 = (0, _slicedToArray2["default"])(_this$startOfOverflow3, 1);
                siblingRangeStart = _this$startOfOverflow4[0];
                siblingRangeEnd = container.lastChild;
              }
            } while (container && !siblingRangeStart);
          }
        } while (container && siblingRangeStart);
        if (startRemainder) {
          // Everything including and after node is overflow.
          range = document.createRange();
          range.selectNode(startRemainder);
          range.setEndAfter(rendered.childNodes[rendered.childNodes.length - 1]);
          ranges.push(range);
        }
        return ranges;
      }
      node = check = prev;
      do {
        if ((0, _dom.isElement)(check)) {
          var _checkBounds = (0, _utils.getBoundingClientRect)(check);
          if (_checkBounds.bottom > bounds.bottom) {
            mustSplit = true;
          }

          // @todo
          // If this element is the header or the first non-header row in a
          // table, treat the table as having an implicit break-inside: avoid
          // tag so avoid leaving the header all by itself.
          var _styles = window.getComputedStyle(check);
          if (this.avoidBreakInside(check, rendered) && !mustSplit) {
            node = check;
          } else if (check.nextElementSibling) {
            var _checkBounds2 = (0, _utils.getBoundingClientRect)(check);
            var _siblingBounds = (0, _utils.getBoundingClientRect)(check.nextElementSibling);
            var _parentHeight = check.parentElement.style.height;
            var _cStyle = check.currentStyle || getComputedStyle(check, "");
            // Possibilities here:
            // - Two table TD elements: We want the content in the table data
            //   including and after the selected node.
            // - Two divs side by side (flex / grid ): We want the content
            //   including and after the selected node.
            // - Two or more elements (eg spans) with text that overflows.
            //   This time we want all subsequent children of the parent (the
            //   portion of the node and its siblings).
            // We are assuming here that sibling content is level.
            if (!_parentHeight && _siblingBounds.top == _checkBounds2.top && _siblingBounds.left != _checkBounds2.left && _cStyle.display !== "inline") {
              // I didn't want to use the node name to distinguish the above
              // cases but haven't found a better way.
              if (["TD", "TH", "DIV"].indexOf(check.nodeName) == -1) {
                node = check.parentElement;
              } else {
                node = lastcheck;
              }
            }
          }
          var classes = check.getAttribute("class");
          if (classes && classes.includes("region-content")) {
            break;
          }
        }
        lastcheck = check;
        check = check.parentElement;
      } while (check && check !== rendered);

      // Set the start of the range. This will either be node itself or some
      // text within it if node is a text node and some of its content doesn't
      // overflow.

      if ((0, _dom.isText)(node) && node.textContent.trim().length) {
        offset = this.textBreak(node, start, end, vStart, vEnd);
      }

      /**
       * To get the content restored in the right order, we need to add overflow
       *  to the array in the correct order. If there was overflow removed from
       *  after this element, it needs to be added back before that previously
       *  removed overflow.
       */
      var rangeEndElement = rangeEndNode.previousElementSibling || rangeEndNode.parentElement;
      rangeEndElement.dataset.overflow_after = true;

      // Set the start of the range and record on node or the previous element
      // that overflow was moved.
      range = document.createRange();
      if (offset) {
        range.setStart(node, offset);
      } else {
        range.selectNode(node);
      }

      // Additional nodes may have been added that will overflow further beyond
      // node. Include them in the range.
      range.setEndAfter(rendered.lastChild);
      return [range];
    }
  }, {
    key: "findEndToken",
    value: function findEndToken(rendered, source) {
      if (rendered.childNodes.length === 0) {
        return;
      }
      var lastChild = rendered.lastChild;
      var lastNodeIndex;
      while (lastChild && lastChild.lastChild) {
        if (!(0, _dom.validNode)(lastChild)) {
          // Only get elements with refs
          lastChild = lastChild.previousSibling;
        } else if (!(0, _dom.validNode)(lastChild.lastChild)) {
          // Deal with invalid dom items
          lastChild = (0, _dom.prevValidNode)(lastChild.lastChild);
          break;
        } else {
          lastChild = lastChild.lastChild;
        }
      }
      if ((0, _dom.isText)(lastChild)) {
        if (lastChild.parentNode.dataset.ref) {
          lastNodeIndex = (0, _dom.indexOf)(lastChild);
          lastChild = lastChild.parentNode;
        } else {
          lastChild = lastChild.previousSibling;
        }
      }
      var original = (0, _dom.findElement)(lastChild, source);
      if (lastNodeIndex) {
        original = original.childNodes[lastNodeIndex];
      }
      var after = (0, _dom.nodeAfter)(original);
      return this.breakAt(after);
    }
  }, {
    key: "textBreak",
    value: function textBreak(node, start, end, vStart, vEnd) {
      var wordwalker = (0, _dom.words)(node);
      var left = 0;
      var right = 0;
      var top = 0;
      var bottom = 0;
      var word, next, done, pos;
      var offset;
      var marginBottom = 0;

      // Margin bottom is needed when the node is in a block level element
      // such as a table, grid or flex, where margins don't collapse.
      // Temporarily add data-split-to as this may change margins too
      // (It always does in current code but let's not assume that).
      var parentElement;
      var immediateParent = parentElement = node.parentElement;
      immediateParent.setAttribute('data-split-to', 'foo');
      var parentStyle = window.getComputedStyle(parentElement);
      while (parentElement && !parentElement.classList.contains('pagedjs_page_content') && !parentElement.classList.contains('pagedjs_footnote_area')) {
        var style = window.getComputedStyle(parentElement);
        if (style['display'] !== 'block') {
          marginBottom = parseInt(parentStyle['margin-bottom']);
          break;
        }
        parentElement = parentElement.parentElement;
      }
      while (!done) {
        next = wordwalker.next();
        word = next.value;
        done = next.done;
        if (!word) {
          break;
        }
        pos = (0, _utils.getBoundingClientRect)(word);
        left = Math.floor(pos.left);
        right = Math.floor(pos.right);
        top = pos.top;
        bottom = pos.bottom;
        if (left >= end || top >= vEnd - marginBottom) {
          offset = word.startOffset;
          break;
        }

        // The bounds won't be exceeded so we need >= rather than >.
        // Also below for the letters.
        if (right >= end || bottom >= vEnd - marginBottom) {
          var letterwalker = (0, _dom.letters)(word);
          var letter = void 0,
            nextLetter = void 0,
            doneLetter = void 0;
          while (!doneLetter) {
            // Note that the letter walker continues to walk beyond the end of the word, until the end of the
            // text node.
            nextLetter = letterwalker.next();
            letter = nextLetter.value;
            doneLetter = nextLetter.done;
            if (!letter) {
              break;
            }
            pos = (0, _utils.getBoundingClientRect)(letter);
            right = pos.right;
            bottom = pos.bottom;
            if (right >= end || bottom >= vEnd - marginBottom) {
              offset = letter.startOffset;
              done = true;
              break;
            }
          }
        }
      }

      // Don't remove the data-split-to so that subsequent checks for overflow don't see overflow
      // where it has already been dealt with.
      // immediateParent.removeAttribute('data-split-to');

      // Don't get tricked into doing a split by whitespace at the start of a string.
      if (node.textContent.substring(0, offset).trim() == '') {
        return 0;
      }
      return offset;
    }
  }, {
    key: "removeOverflow",
    value: function removeOverflow(overflow, breakLetter) {
      var startContainer = overflow.startContainer;
      var extracted = overflow.extractContents();
      this.hyphenateAtBreak(startContainer, breakLetter);
      return extracted;
    }
  }, {
    key: "hyphenateAtBreak",
    value: function hyphenateAtBreak(startContainer, breakLetter) {
      if ((0, _dom.isText)(startContainer)) {
        var startText = startContainer.textContent;
        var prevLetter = startText[startText.length - 1];

        // Add a hyphen if previous character is a letter or soft hyphen
        if (breakLetter && /^\w|\u00AD$/.test(prevLetter) && /^\w|\u00AD$/.test(breakLetter) || !breakLetter && /^\w|\u00AD$/.test(prevLetter)) {
          startContainer.parentNode.classList.add("pagedjs_hyphen");
          startContainer.textContent += this.settings.hyphenGlyph || "\u2011";
        }
      }
    }
  }, {
    key: "equalTokens",
    value: function equalTokens(a, b) {
      if (!a || !b) {
        return false;
      }
      if (a["node"] && b["node"] && a["node"] !== b["node"]) {
        return false;
      }
      if (a["offset"] && b["offset"] && a["offset"] !== b["offset"]) {
        return false;
      }
      return true;
    }
  }]);
  return Layout;
}();
(0, _eventEmitter["default"])(Layout.prototype);
var _default = Layout;
exports["default"] = _default;