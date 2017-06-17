webpackJsonp([4],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	var Infinite = __webpack_require__(1855);


	window.Infinite = Infinite;

/***/ },

/***/ 1855:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	var React = global.React || __webpack_require__(56);

	__webpack_require__(1856);
	var scaleEnum = __webpack_require__(1859);
	var infiniteHelpers = __webpack_require__(1860);
	var _isFinite = __webpack_require__(1865);

	var preloadType = __webpack_require__(1866).preloadType;
	var checkProps = checkProps = __webpack_require__(1867);

	var Infinite = React.createClass({
	  displayName: 'Infinite',

	  propTypes: {
	    children: React.PropTypes.any,

	    handleScroll: React.PropTypes.func,

	    // preloadBatchSize causes updates only to
	    // happen each preloadBatchSize pixels of scrolling.
	    // Set a larger number to cause fewer updates to the
	    // element list.
	    preloadBatchSize: preloadType,
	    // preloadAdditionalHeight determines how much of the
	    // list above and below the container is preloaded even
	    // when it is not currently visible to the user. In the
	    // regular scroll implementation, preloadAdditionalHeight
	    // is equal to the entire height of the list.
	    preloadAdditionalHeight: preloadType, // page to screen ratio

	    // The provided elementHeight can be either
	    //  1. a constant: all elements are the same height
	    //  2. an array containing the height of each element
	    elementHeight: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.arrayOf(React.PropTypes.number)]).isRequired,
	    // This is the total height of the visible window. One
	    // of
	    containerHeight: React.PropTypes.number,
	    useWindowAsScrollContainer: React.PropTypes.bool,

	    displayBottomUpwards: React.PropTypes.bool.isRequired,

	    infiniteLoadBeginEdgeOffset: React.PropTypes.number,
	    onInfiniteLoad: React.PropTypes.func,
	    loadingSpinnerDelegate: React.PropTypes.node,

	    isInfiniteLoading: React.PropTypes.bool,
	    timeScrollStateLastsForAfterUserScrolls: React.PropTypes.number,

	    className: React.PropTypes.string,

	    styles: React.PropTypes.shape({
	      scrollableStyle: React.PropTypes.object
	    }).isRequired
	  },
	  statics: {
	    containerHeightScaleFactor: function containerHeightScaleFactor(factor) {
	      if (!_isFinite(factor)) {
	        throw new Error('The scale factor must be a number.');
	      }
	      return {
	        type: scaleEnum.CONTAINER_HEIGHT_SCALE_FACTOR,
	        amount: factor
	      };
	    }
	  },

	  // Properties currently used but which may be
	  // refactored away in the future.
	  computedProps: {},
	  utils: {},
	  shouldAttachToBottom: false,
	  preservedScrollState: 0,
	  loadingSpinnerHeight: 0,
	  deprecationWarned: false,

	  scrollable: null,
	  topSpacer: null,
	  bottomSpacer: null,
	  smoothScrollingWrapper: null,
	  loadingSpinner: null,

	  getDefaultProps: function getDefaultProps() {
	    return {
	      handleScroll: function handleScroll() {},

	      useWindowAsScrollContainer: false,

	      onInfiniteLoad: function onInfiniteLoad() {},
	      loadingSpinnerDelegate: React.createElement('div', null),

	      displayBottomUpwards: false,

	      isInfiniteLoading: false,
	      timeScrollStateLastsForAfterUserScrolls: 150,

	      className: '',

	      styles: {}
	    };
	  },

	  // automatic adjust to scroll direction
	  // give spinner a ReactCSSTransitionGroup
	  getInitialState: function getInitialState() {
	    var nextInternalState = this.recomputeInternalStateFromProps(this.props);

	    this.computedProps = nextInternalState.computedProps;
	    this.utils = nextInternalState.utils;
	    this.shouldAttachToBottom = this.props.displayBottomUpwards;

	    var state = nextInternalState.newState;
	    state.scrollTimeout = undefined;
	    state.isScrolling = false;

	    return state;
	  },

	  generateComputedProps: function generateComputedProps(props) {
	    // These are extracted so their type definitions do not conflict.
	    var containerHeight = props.containerHeight;
	    var preloadBatchSize = props.preloadBatchSize;
	    var preloadAdditionalHeight = props.preloadAdditionalHeight;

	    var oldProps = _objectWithoutProperties(props, ['containerHeight', 'preloadBatchSize', 'preloadAdditionalHeight']);

	    var newProps = {};
	    containerHeight = typeof containerHeight === 'number' ? containerHeight : 0;
	    newProps.containerHeight = props.useWindowAsScrollContainer ? window.innerHeight : containerHeight;

	    if (oldProps.infiniteLoadBeginBottomOffset !== undefined) {
	      newProps.infiniteLoadBeginEdgeOffset = oldProps.infiniteLoadBeginBottomOffset;
	      if (!this.deprecationWarned) {
	        console.error('Warning: React Infinite\'s infiniteLoadBeginBottomOffset prop\n        has been deprecated as of 0.6.0. Please use infiniteLoadBeginEdgeOffset.\n        Because this is a rather descriptive name, a simple find and replace\n        should suffice.');
	        this.deprecationWarned = true;
	      }
	    }

	    var defaultPreloadBatchSizeScaling = {
	      type: scaleEnum.CONTAINER_HEIGHT_SCALE_FACTOR,
	      amount: 0.5
	    };
	    var batchSize = preloadBatchSize && preloadBatchSize.type ? preloadBatchSize : defaultPreloadBatchSizeScaling;

	    if (typeof preloadBatchSize === 'number') {
	      newProps.preloadBatchSize = preloadBatchSize;
	    } else if (typeof batchSize === 'object' && batchSize.type === scaleEnum.CONTAINER_HEIGHT_SCALE_FACTOR) {
	      newProps.preloadBatchSize = newProps.containerHeight * batchSize.amount;
	    } else {
	      newProps.preloadBatchSize = 0;
	    }

	    var defaultPreloadAdditionalHeightScaling = {
	      type: scaleEnum.CONTAINER_HEIGHT_SCALE_FACTOR,
	      amount: 1
	    };
	    var additionalHeight = preloadAdditionalHeight && preloadAdditionalHeight.type ? preloadAdditionalHeight : defaultPreloadAdditionalHeightScaling;
	    if (typeof preloadAdditionalHeight === 'number') {
	      newProps.preloadAdditionalHeight = preloadAdditionalHeight;
	    } else if (typeof additionalHeight === 'object' && additionalHeight.type === scaleEnum.CONTAINER_HEIGHT_SCALE_FACTOR) {
	      newProps.preloadAdditionalHeight = newProps.containerHeight * additionalHeight.amount;
	    } else {
	      newProps.preloadAdditionalHeight = 0;
	    }

	    return Object.assign(oldProps, newProps);
	  },

	  generateComputedUtilityFunctions: function generateComputedUtilityFunctions(props) {
	    var _this = this;

	    var utilities = {};
	    utilities.getLoadingSpinnerHeight = function () {
	      var loadingSpinnerHeight = 0;
	      if (_this.loadingSpinner) {
	        loadingSpinnerHeight = _this.loadingSpinner.offsetHeight || 0;
	      }
	      return loadingSpinnerHeight;
	    };
	    if (props.useWindowAsScrollContainer) {
	      utilities.subscribeToScrollListener = function () {
	        window.addEventListener('scroll', _this.infiniteHandleScroll);
	      };
	      utilities.unsubscribeFromScrollListener = function () {
	        window.removeEventListener('scroll', _this.infiniteHandleScroll);
	      };
	      utilities.nodeScrollListener = function () {};
	      utilities.getScrollTop = function () {
	        return window.pageYOffset;
	      };
	      utilities.setScrollTop = function (top) {
	        window.scroll(window.pageXOffset, top);
	      };
	      utilities.scrollShouldBeIgnored = function () {
	        return false;
	      };
	      utilities.buildScrollableStyle = function () {
	        return {};
	      };
	    } else {
	      utilities.subscribeToScrollListener = function () {};
	      utilities.unsubscribeFromScrollListener = function () {};
	      utilities.nodeScrollListener = this.infiniteHandleScroll;
	      utilities.getScrollTop = function () {
	        return _this.scrollable ? _this.scrollable.scrollTop : 0;
	      };

	      utilities.setScrollTop = function (top) {
	        if (_this.scrollable) {
	          _this.scrollable.scrollTop = top;
	        }
	      };
	      utilities.scrollShouldBeIgnored = function (event) {
	        return event.target !== _this.scrollable;
	      };

	      utilities.buildScrollableStyle = function () {
	        return Object.assign({}, {
	          height: _this.computedProps.containerHeight,
	          overflowX: 'hidden',
	          overflowY: 'scroll',
	          WebkitOverflowScrolling: 'touch'
	        }, _this.computedProps.styles.scrollableStyle || {});
	      };
	    }
	    return utilities;
	  },

	  recomputeInternalStateFromProps: function recomputeInternalStateFromProps(props) {
	    checkProps(props);
	    var computedProps = this.generateComputedProps(props);
	    var utils = this.generateComputedUtilityFunctions(props);

	    var newState = {};

	    newState.numberOfChildren = React.Children.count(computedProps.children);
	    newState.infiniteComputer = infiniteHelpers.createInfiniteComputer(computedProps.elementHeight, computedProps.children, computedProps.displayBottomUpwards);

	    if (computedProps.isInfiniteLoading !== undefined) {
	      newState.isInfiniteLoading = computedProps.isInfiniteLoading;
	    }

	    newState.preloadBatchSize = computedProps.preloadBatchSize;
	    newState.preloadAdditionalHeight = computedProps.preloadAdditionalHeight;

	    newState = Object.assign(newState, infiniteHelpers.recomputeApertureStateFromOptionsAndScrollTop(newState, utils.getScrollTop()));

	    return {
	      computedProps: computedProps,
	      utils: utils,
	      newState: newState
	    };
	  },

	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    var nextInternalState = this.recomputeInternalStateFromProps(nextProps);

	    this.computedProps = nextInternalState.computedProps;
	    this.utils = nextInternalState.utils;

	    this.setState(nextInternalState.newState);
	  },

	  componentWillUpdate: function componentWillUpdate() {
	    if (this.props.displayBottomUpwards) {
	      this.preservedScrollState = this.utils.getScrollTop() - this.loadingSpinnerHeight;
	    }
	  },

	  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
	    this.loadingSpinnerHeight = this.utils.getLoadingSpinnerHeight();

	    if (this.props.displayBottomUpwards) {
	      var lowestScrollTop = this.getLowestPossibleScrollTop();
	      if (this.shouldAttachToBottom && this.utils.getScrollTop() < lowestScrollTop) {
	        this.utils.setScrollTop(lowestScrollTop);
	      } else if (prevProps.isInfiniteLoading && !this.props.isInfiniteLoading) {
	        this.utils.setScrollTop(this.state.infiniteComputer.getTotalScrollableHeight() - prevState.infiniteComputer.getTotalScrollableHeight() + this.preservedScrollState);
	      }
	    }

	    var hasLoadedMoreChildren = this.state.numberOfChildren !== prevState.numberOfChildren;
	    if (hasLoadedMoreChildren) {
	      var newApertureState = infiniteHelpers.recomputeApertureStateFromOptionsAndScrollTop(this.state, this.utils.getScrollTop());
	      this.setState(newApertureState);
	    }

	    var isMissingVisibleRows = hasLoadedMoreChildren && !this.hasAllVisibleItems() && !this.state.isInfiniteLoading;
	    if (isMissingVisibleRows) {
	      this.onInfiniteLoad();
	    }
	  },

	  componentDidMount: function componentDidMount() {
	    this.utils.subscribeToScrollListener();

	    if (!this.hasAllVisibleItems()) {
	      this.onInfiniteLoad();
	    }

	    if (this.props.displayBottomUpwards) {
	      var lowestScrollTop = this.getLowestPossibleScrollTop();
	      if (this.shouldAttachToBottom && this.utils.getScrollTop() < lowestScrollTop) {
	        this.utils.setScrollTop(lowestScrollTop);
	      }
	    }
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    this.utils.unsubscribeFromScrollListener();
	  },

	  infiniteHandleScroll: function infiniteHandleScroll(e) {
	    if (this.utils.scrollShouldBeIgnored(e)) {
	      return;
	    }
	    this.computedProps.handleScroll(this.scrollable);
	    this.handleScroll(this.utils.getScrollTop());
	  },

	  manageScrollTimeouts: function manageScrollTimeouts() {
	    // Maintains a series of timeouts to set this.state.isScrolling
	    // to be true when the element is scrolling.

	    if (this.state.scrollTimeout) {
	      clearTimeout(this.state.scrollTimeout);
	    }

	    var that = this,
	        scrollTimeout = setTimeout(function () {
	      that.setState({
	        isScrolling: false,
	        scrollTimeout: undefined
	      });
	    }, this.computedProps.timeScrollStateLastsForAfterUserScrolls);

	    this.setState({
	      isScrolling: true,
	      scrollTimeout: scrollTimeout
	    });
	  },

	  getLowestPossibleScrollTop: function getLowestPossibleScrollTop() {
	    return this.state.infiniteComputer.getTotalScrollableHeight() - this.computedProps.containerHeight;
	  },

	  hasAllVisibleItems: function hasAllVisibleItems() {
	    return !(_isFinite(this.computedProps.infiniteLoadBeginEdgeOffset) && this.state.infiniteComputer.getTotalScrollableHeight() < this.computedProps.containerHeight);
	  },

	  passedEdgeForInfiniteScroll: function passedEdgeForInfiniteScroll(scrollTop) {
	    if (this.computedProps.displayBottomUpwards) {
	      return !this.shouldAttachToBottom && scrollTop < this.computedProps.infiniteLoadBeginEdgeOffset;
	    } else {
	      return scrollTop > this.state.infiniteComputer.getTotalScrollableHeight() - this.computedProps.containerHeight - this.computedProps.infiniteLoadBeginEdgeOffset;
	    }
	  },

	  onInfiniteLoad: function onInfiniteLoad() {
	    this.setState({ isInfiniteLoading: true });
	    this.computedProps.onInfiniteLoad();
	  },

	  handleScroll: function handleScroll(scrollTop) {
	    this.shouldAttachToBottom = this.computedProps.displayBottomUpwards && scrollTop >= this.getLowestPossibleScrollTop();

	    this.manageScrollTimeouts();

	    var newApertureState = infiniteHelpers.recomputeApertureStateFromOptionsAndScrollTop(this.state, scrollTop);

	    if (this.passedEdgeForInfiniteScroll(scrollTop) && !this.state.isInfiniteLoading) {
	      this.setState(Object.assign({}, newApertureState));
	      this.onInfiniteLoad();
	    } else {
	      this.setState(newApertureState);
	    }
	  },

	  buildHeightStyle: function buildHeightStyle(height) {
	    return {
	      width: '100%',
	      height: Math.ceil(height)
	    };
	  },

	  render: function render() {
	    var _this2 = this;

	    var displayables;
	    if (this.state.numberOfChildren > 1) {
	      displayables = this.computedProps.children.slice(this.state.displayIndexStart, this.state.displayIndexEnd + 1);
	    } else {
	      displayables = this.computedProps.children;
	    }

	    var infiniteScrollStyles = {};
	    if (this.state.isScrolling) {
	      infiniteScrollStyles.pointerEvents = 'none';
	    }

	    var topSpacerHeight = this.state.infiniteComputer.getTopSpacerHeight(this.state.displayIndexStart),
	        bottomSpacerHeight = this.state.infiniteComputer.getBottomSpacerHeight(this.state.displayIndexEnd);

	    // This asymmetry is due to a reluctance to use CSS to control
	    // the bottom alignment
	    if (this.computedProps.displayBottomUpwards) {
	      var heightDifference = this.computedProps.containerHeight - this.state.infiniteComputer.getTotalScrollableHeight();
	      if (heightDifference > 0) {
	        topSpacerHeight = heightDifference - this.loadingSpinnerHeight;
	      }
	    }

	    var loadingSpinner = this.computedProps.infiniteLoadBeginEdgeOffset === undefined ? null : React.createElement(
	      'div',
	      { ref: function (c) {
	          _this2.loadingSpinner = c;
	        } },
	      this.state.isInfiniteLoading ? this.computedProps.loadingSpinnerDelegate : null
	    );

	    // topSpacer and bottomSpacer take up the amount of space that the
	    // rendered elements would have taken up otherwise
	    return React.createElement(
	      'div',
	      { className: this.computedProps.className,
	        ref: function (c) {
	          _this2.scrollable = c;
	        },
	        style: this.utils.buildScrollableStyle(),
	        onScroll: this.utils.nodeScrollListener },
	      React.createElement(
	        'div',
	        { ref: function (c) {
	            _this2.smoothScrollingWrapper = c;
	          }, style: infiniteScrollStyles },
	        React.createElement('div', { ref: function (c) {
	            _this2.topSpacer = c;
	          },
	          style: this.buildHeightStyle(topSpacerHeight) }),
	        this.computedProps.displayBottomUpwards && loadingSpinner,
	        displayables,
	        !this.computedProps.displayBottomUpwards && loadingSpinner,
	        React.createElement('div', { ref: function (c) {
	            _this2.bottomSpacer = c;
	          },
	          style: this.buildHeightStyle(bottomSpacerHeight) })
	      )
	    );
	  }
	});

	module.exports = Infinite;
	global.Infinite = Infinite;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 1856:
/***/ function(module, exports, __webpack_require__) {

	/*
	  A number of polyfills for native functions are consolidated
	  here. We do this instead of using the libraries directly
	  because Flow is designed to make its type refinements
	  with these native functions.
	 */

	'use strict';

	if (!Object.assign) {
	  Object.assign = __webpack_require__(1857);
	}

	if (!Array.isArray) {
	  Array.isArray = __webpack_require__(1858);
	}

/***/ },

/***/ 1857:
/***/ function(module, exports) {

	/* eslint-disable no-unused-vars */
	'use strict';
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },

/***/ 1858:
/***/ function(module, exports) {

	/**
	 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/** `Object#toString` result references. */
	var arrayTag = '[object Array]',
	    funcTag = '[object Function]';

	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = getNative(Array, 'isArray');

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 equivalents which return 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}

	module.exports = isArray;


/***/ },

/***/ 1859:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  CONTAINER_HEIGHT_SCALE_FACTOR: 'containerHeightScaleFactor'
	};

/***/ },

/***/ 1860:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ConstantInfiniteComputer = __webpack_require__(1861);
	var ArrayInfiniteComputer = __webpack_require__(1863);
	var React = global.React || __webpack_require__(56);

	function createInfiniteComputer(data, children) {
	  var computer;
	  var numberOfChildren = React.Children.count(children);

	  // This should be guaranteed by checkProps
	  if (Array.isArray(data)) {
	    computer = new ArrayInfiniteComputer(data, numberOfChildren);
	  } else {
	    computer = new ConstantInfiniteComputer(data, numberOfChildren);
	  }
	  return computer;
	}

	// Given the scrollTop of the container, computes the state the
	// component should be in. The goal is to abstract all of this
	// from any actual representation in the DOM.
	// The window is the block with any preloadAdditionalHeight
	// added to it.
	function recomputeApertureStateFromOptionsAndScrollTop(_ref, scrollTop) {
	  var preloadBatchSize = _ref.preloadBatchSize;
	  var preloadAdditionalHeight = _ref.preloadAdditionalHeight;
	  var infiniteComputer = _ref.infiniteComputer;
	  return (function () {
	    var blockNumber = preloadBatchSize === 0 ? 0 : Math.floor(scrollTop / preloadBatchSize),
	        blockStart = preloadBatchSize * blockNumber,
	        blockEnd = blockStart + preloadBatchSize,
	        apertureTop = Math.max(0, blockStart - preloadAdditionalHeight),
	        apertureBottom = Math.min(infiniteComputer.getTotalScrollableHeight(), blockEnd + preloadAdditionalHeight);

	    return {
	      displayIndexStart: infiniteComputer.getDisplayIndexStart(apertureTop),
	      displayIndexEnd: infiniteComputer.getDisplayIndexEnd(apertureBottom)
	    };
	  })();
	}

	module.exports = {
	  createInfiniteComputer: createInfiniteComputer,
	  recomputeApertureStateFromOptionsAndScrollTop: recomputeApertureStateFromOptionsAndScrollTop
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 1861:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var InfiniteComputer = __webpack_require__(1862);

	var ConstantInfiniteComputer = (function (_InfiniteComputer) {
	  _inherits(ConstantInfiniteComputer, _InfiniteComputer);

	  function ConstantInfiniteComputer() {
	    _classCallCheck(this, ConstantInfiniteComputer);

	    _get(Object.getPrototypeOf(ConstantInfiniteComputer.prototype), 'constructor', this).apply(this, arguments);
	  }

	  _createClass(ConstantInfiniteComputer, [{
	    key: 'getTotalScrollableHeight',
	    value: function getTotalScrollableHeight() {
	      return this.heightData * this.numberOfChildren;
	    }
	  }, {
	    key: 'getDisplayIndexStart',
	    value: function getDisplayIndexStart(windowTop) {
	      return Math.floor(windowTop / this.heightData);
	    }
	  }, {
	    key: 'getDisplayIndexEnd',
	    value: function getDisplayIndexEnd(windowBottom) {
	      var nonZeroIndex = Math.ceil(windowBottom / this.heightData);
	      if (nonZeroIndex > 0) {
	        return nonZeroIndex - 1;
	      }
	      return nonZeroIndex;
	    }
	  }, {
	    key: 'getTopSpacerHeight',
	    value: function getTopSpacerHeight(displayIndexStart) {
	      return displayIndexStart * this.heightData;
	    }
	  }, {
	    key: 'getBottomSpacerHeight',
	    value: function getBottomSpacerHeight(displayIndexEnd) {
	      var nonZeroIndex = displayIndexEnd + 1;
	      return Math.max(0, (this.numberOfChildren - nonZeroIndex) * this.heightData);
	    }
	  }]);

	  return ConstantInfiniteComputer;
	})(InfiniteComputer);

	module.exports = ConstantInfiniteComputer;

/***/ },

/***/ 1862:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// An infinite computer must be able to do the following things:
	//  1. getTotalScrollableHeight()
	//  2. getDisplayIndexStart()
	//  3. getDisplayIndexEnd()

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var InfiniteComputer = (function () {
	  function InfiniteComputer(heightData, numberOfChildren) {
	    _classCallCheck(this, InfiniteComputer);

	    this.heightData = heightData;
	    this.numberOfChildren = numberOfChildren;
	  }

	  _createClass(InfiniteComputer, [{
	    key: 'getTotalScrollableHeight',
	    value: function getTotalScrollableHeight() {
	      if (process.env.NODE_ENV === 'development') {
	        throw new Error('getTotalScrollableHeight not implemented.');
	      }
	    }

	    /* eslint-disable no-unused-vars */
	  }, {
	    key: 'getDisplayIndexStart',
	    value: function getDisplayIndexStart(windowTop) {
	      /* eslint-enable no-unused-vars */
	      if (process.env.NODE_ENV === 'development') {
	        throw new Error('getDisplayIndexStart not implemented.');
	      }
	    }

	    /* eslint-disable no-unused-vars */
	  }, {
	    key: 'getDisplayIndexEnd',
	    value: function getDisplayIndexEnd(windowBottom) {
	      /* eslint-enable no-unused-vars */
	      if (process.env.NODE_ENV === 'development') {
	        throw new Error('getDisplayIndexEnd not implemented.');
	      }
	    }

	    // These are helper methods, and can be calculated from
	    // the above details.
	    /* eslint-disable no-unused-vars */
	  }, {
	    key: 'getTopSpacerHeight',
	    value: function getTopSpacerHeight(displayIndexStart) {
	      /* eslint-enable no-unused-vars */
	      if (process.env.NODE_ENV === 'development') {
	        throw new Error('getTopSpacerHeight not implemented.');
	      }
	    }

	    /* eslint-disable no-unused-vars */
	  }, {
	    key: 'getBottomSpacerHeight',
	    value: function getBottomSpacerHeight(displayIndexEnd) {
	      /* eslint-enable no-unused-vars */
	      if (process.env.NODE_ENV === 'development') {
	        throw new Error('getBottomSpacerHeight not implemented.');
	      }
	    }
	  }]);

	  return InfiniteComputer;
	})();

	module.exports = InfiniteComputer;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(58)))

/***/ },

/***/ 1863:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var InfiniteComputer = __webpack_require__(1862),
	    bs = __webpack_require__(1864);

	var ArrayInfiniteComputer = (function (_InfiniteComputer) {
	  _inherits(ArrayInfiniteComputer, _InfiniteComputer);

	  function ArrayInfiniteComputer(heightData, numberOfChildren) {
	    _classCallCheck(this, ArrayInfiniteComputer);

	    _get(Object.getPrototypeOf(ArrayInfiniteComputer.prototype), 'constructor', this).call(this, heightData, numberOfChildren);
	    this.prefixHeightData = this.heightData.reduce(function (acc, next) {
	      if (acc.length === 0) {
	        return [next];
	      } else {
	        acc.push(acc[acc.length - 1] + next);
	        return acc;
	      }
	    }, []);
	  }

	  _createClass(ArrayInfiniteComputer, [{
	    key: 'maybeIndexToIndex',
	    value: function maybeIndexToIndex(index) {
	      if (typeof index === 'undefined' || index === null) {
	        return this.prefixHeightData.length - 1;
	      } else {
	        return index;
	      }
	    }
	  }, {
	    key: 'getTotalScrollableHeight',
	    value: function getTotalScrollableHeight() {
	      var length = this.prefixHeightData.length;
	      return length === 0 ? 0 : this.prefixHeightData[length - 1];
	    }
	  }, {
	    key: 'getDisplayIndexStart',
	    value: function getDisplayIndexStart(windowTop) {
	      var foundIndex = bs.binaryIndexSearch(this.prefixHeightData, windowTop, bs.opts.CLOSEST_HIGHER);
	      return this.maybeIndexToIndex(foundIndex);
	    }
	  }, {
	    key: 'getDisplayIndexEnd',
	    value: function getDisplayIndexEnd(windowBottom) {
	      var foundIndex = bs.binaryIndexSearch(this.prefixHeightData, windowBottom, bs.opts.CLOSEST_HIGHER);
	      return this.maybeIndexToIndex(foundIndex);
	    }
	  }, {
	    key: 'getTopSpacerHeight',
	    value: function getTopSpacerHeight(displayIndexStart) {
	      var previous = displayIndexStart - 1;
	      return previous < 0 ? 0 : this.prefixHeightData[previous];
	    }
	  }, {
	    key: 'getBottomSpacerHeight',
	    value: function getBottomSpacerHeight(displayIndexEnd) {
	      if (displayIndexEnd === -1) {
	        return 0;
	      }
	      return this.getTotalScrollableHeight() - this.prefixHeightData[displayIndexEnd];
	    }
	  }]);

	  return ArrayInfiniteComputer;
	})(InfiniteComputer);

	module.exports = ArrayInfiniteComputer;

/***/ },

/***/ 1864:
/***/ function(module, exports) {

	"use strict";

	var opts = {
	  CLOSEST_LOWER: 1,
	  CLOSEST_HIGHER: 2
	};

	var binaryIndexSearch = function binaryIndexSearch(array, /* : Array<number> */
	item, /* : number */
	opt /* : number */) /* : ?number */{
	  var index;

	  var high = array.length - 1,
	      low = 0,
	      middle,
	      middleItem;

	  while (low <= high) {
	    middle = low + Math.floor((high - low) / 2);
	    middleItem = array[middle];

	    if (middleItem === item) {
	      return middle;
	    } else if (middleItem < item) {
	      low = middle + 1;
	    } else if (middleItem > item) {
	      high = middle - 1;
	    }
	  }

	  if (opt === opts.CLOSEST_LOWER && low > 0) {
	    index = low - 1;
	  } else if (opt === opts.CLOSEST_HIGHER && high < array.length - 1) {
	    index = high + 1;
	  }

	  return index;
	};

	module.exports = {
	  binaryIndexSearch: binaryIndexSearch,
	  opts: opts
	};

/***/ },

/***/ 1865:
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsFinite = global.isFinite;

	/**
	 * Checks if `value` is a finite primitive number.
	 *
	 * **Note:** This method is based on [`Number.isFinite`](http://ecma-international.org/ecma-262/6.0/#sec-number.isfinite).
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
	 * @example
	 *
	 * _.isFinite(10);
	 * // => true
	 *
	 * _.isFinite('10');
	 * // => false
	 *
	 * _.isFinite(true);
	 * // => false
	 *
	 * _.isFinite(Object(10));
	 * // => false
	 *
	 * _.isFinite(Infinity);
	 * // => false
	 */
	function isFinite(value) {
	  return typeof value == 'number' && nativeIsFinite(value);
	}

	module.exports = isFinite;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 1866:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var React = global.React || __webpack_require__(56);

	module.exports = {
	  preloadType: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.shape({
	    type: React.PropTypes.oneOf(['containerHeightScaleFactor']).isRequired,
	    amount: React.PropTypes.number.isRequired
	  })])
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 1867:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {// This module provides a centralized place for
	// runtime checking that the props passed to React Infinite
	// make the minimum amount of sense.

	'use strict';

	var React = global.React || __webpack_require__(56);
	var _isFinite = __webpack_require__(1865);

	module.exports = function (props) {
	  var rie = 'Invariant Violation: ';
	  if (!(props.containerHeight || props.useWindowAsScrollContainer)) {
	    throw new Error(rie + 'Either containerHeight or useWindowAsScrollContainer must be provided.');
	  }

	  if (!(_isFinite(props.elementHeight) || Array.isArray(props.elementHeight))) {
	    throw new Error(rie + 'You must provide either a number or an array of numbers as the elementHeight.');
	  }

	  if (Array.isArray(props.elementHeight)) {
	    if (React.Children.count(props.children) !== props.elementHeight.length) {
	      throw new Error(rie + 'There must be as many values provided in the elementHeight prop as there are children.');
	    }
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }

});