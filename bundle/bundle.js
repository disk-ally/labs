'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _rd = require('rd3');

var _rd2 = _interopRequireDefault(_rd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fs = require('fs');
var path = require('path');

/**
 * APP's main class
 */

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    /**
     * Extends React component Constructor and populate
     * the initial states
     * @param props
     */

    function App(props) {
        _classCallCheck(this, App);

        // Declare the first message

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this, props));

        var initialMessage = "loading";

        // Default path (only macOs)
        // TODO: support windows enviroment
        var firstpath = "/users";
        var firstSet = new Set();
        firstSet.add(firstpath);

        // D3 initial Data
        _this.workingTree = [{
            label: 'Disk',
            values: []
        }];

        _this.list = firstSet;

        // set initial states
        _this.state = {
            path: firstpath,
            label: initialMessage,
            progress: initialMessage,
            tree: [{
                label: 'Disk',
                values: []
            }]
        };
        return _this;
    }

    /**
     * Fired by React lifecycle
     */


    _createClass(App, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _this2 = this;

            var intervalTime = 600;
            var limit = 100;

            var working = false;
            var readed = 0;
            var index = void 0;
            var operations = void 0;

            // Create and Interval
            setInterval(function () {
                // Reset the index and operations vars
                index = operations = 0;

                // Check if the last task is working
                if (working == false) {
                    working = true;

                    // Loop the ES6 Set from the first item until the readed index plus operations limit
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = _this2.list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var dir = _step.value;

                            index++;

                            // Check if the item must be analysed
                            if (index >= readed) {

                                // Check if the operations count is less then the operations limit
                                if (operations < limit) {

                                    // Use try, some directories may contain permission issues or moved since the queue
                                    try {
                                        _this2.readDir(dir);
                                    } catch (e) {
                                        console.log(e);
                                    }

                                    operations++;
                                    readed++;
                                } else {
                                    // Update DOM labels with react
                                    _this2.state.progress = readed + " From " + _this2.list.size;
                                    _this2.state.label = dir;
                                    _this2.setState({ tree: _this2.workingTree });

                                    //The operations limit was reached, wait until the next interval
                                    working = false;
                                    break;
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                }
            }, intervalTime);
        }

        /**
         * Read the dir and append the file to an internal ES6 Set
         * @param dir
         */

    }, {
        key: 'readDir',
        value: function readDir(dir) {
            var size = 0;
            var fileList = fs.readdirSync(dir);
            if (fileList.length != 0) {
                for (var i = 0; i < fileList.length; i++) {
                    var fileName = fileList[i];
                    var fileDir = path.join(dir, fileName);
                    var stat = fs.statSync(fileDir);

                    if (stat) {
                        if (stat.isDirectory()) {
                            this.list = this.list.add(fileDir);
                        } else {
                            if (stat['size'] / 1000000.0 > 100) {
                                this.workingTree[0].values.push({ x: fileName, y: stat['size'] });
                            }
                        }
                    }
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(BarChart, {
                    width: 800,
                    height: 400,
                    data: this.state.tree
                }),
                _react2.default.createElement(
                    'h1',
                    null,
                    this.state.progress
                ),
                _react2.default.createElement(
                    'h4',
                    null,
                    this.state.label
                )
            );
        }
    }]);

    return App;
}(_react2.default.Component);

/**
 * RD3 Bar chart component
 */


var BarChart = function (_ReactD3$BarChart) {
    _inherits(BarChart, _ReactD3$BarChart);

    function BarChart(props) {
        _classCallCheck(this, BarChart);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(BarChart).call(this, props));
    }

    return BarChart;
}(_rd2.default.BarChart);

(0, _reactDom.render)(_react2.default.createElement(App, null), document.getElementById('content'));

