"use strict";
exports.__esModule = true;
var yaml_1 = require("yaml");
var fs_1 = require("fs");
var ListenerBuilder = /** @class */ (function () {
    function ListenerBuilder(config) {
        this.config = config;
        this.address;
        this.port;
    }
    ListenerBuilder.prototype.setAddress = function (address) {
        this.address = address;
        return this;
    };
    ListenerBuilder.prototype.setPort = function (port) {
        this.port = port;
        return this;
    };
    ListenerBuilder.prototype.build = function () {
        this.config.add({
            address: {
                socket_address: { address: this.address, port_value: this.port }
            }
        });
    };
    return ListenerBuilder;
}());
var ConfigBuilder = /** @class */ (function () {
    function ConfigBuilder() {
        this.listenersNode = new yaml_1["default"].YAMLSeq();
        this.config = new yaml_1["default"].Document({
            static_resources: { listeners: this.listenersNode }
        });
        this.listeners = [];
    }
    ConfigBuilder.prototype.addListener = function () {
        var listener = new ListenerBuilder(this.listenersNode);
        this.listeners.push(listener);
        return listener;
    };
    ConfigBuilder.prototype.build = function () {
        this.listeners.forEach(function (listener) {
            listener.build();
        });
        return this.config.toString();
    };
    return ConfigBuilder;
}());
var RouteBuilder = /** @class */ (function () {
    function RouteBuilder(cluster) {
        this._cluster = cluster;
        this._prefix = '';
        this._method = '';
    }
    RouteBuilder.prototype.build = function () {
        var doc = new yaml_1["default"].Document([
            {
                match: {
                    prefix: this.prefix,
                    headers: [{ name: ':method', exact_match: this.method.toUpperCase() }]
                },
                route: { cluster: this.cluster }
            }
        ]);
        return doc.toString();
    };
    Object.defineProperty(RouteBuilder.prototype, "prefix", {
        get: function () {
            return this._prefix;
        },
        set: function (value) {
            this._prefix = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RouteBuilder.prototype, "cluster", {
        get: function () {
            return this._cluster;
        },
        set: function (value) {
            this._cluster = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RouteBuilder.prototype, "method", {
        get: function () {
            return this._method;
        },
        set: function (value) {
            this._method = value;
        },
        enumerable: false,
        configurable: true
    });
    return RouteBuilder;
}());
// Get document, or throw exception on error
try {
    console.log("Hello World");
    var doc = yaml_1["default"].parseDocument(fs_1["default"].readFileSync('./resources/petstore.yaml', 'utf8'));
    var config = yaml_1["default"].parseDocument(fs_1["default"].readFileSync('./resources/front-envoy.yaml', 'utf8'));
    var configBuilder = new ConfigBuilder();
    var listener = configBuilder
        .addListener()
        .setAddress('0.0.0.0')
        .setPort('8080');
    console.log(configBuilder.build());
    var paths = doc.get('paths');
    paths.items.forEach(function (path) {
        var builder = new RouteBuilder('service1');
        // builder.prefix = path.key.value;
        // path.value.items.forEach((method: { key: { value: String } }) => {
        //   builder.method = method.key.value;
        // });
        console.log(builder.build());
    });
}
catch (e) {
    console.log(e);
}
