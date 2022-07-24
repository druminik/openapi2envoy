"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteBuilder = void 0;
var yaml_1 = require("yaml");
var RouteBuilder = /** @class */ (function () {
    function RouteBuilder(cluster) {
        this._cluster = cluster;
        this._prefix = '';
        this._method = '';
    }
    RouteBuilder.prototype.build = function () {
        var routeConfig = this.createRoute();
        return routeConfig;
    };
    RouteBuilder.prototype.setMethod = function (method) {
        this._method = method;
        return this;
    };
    RouteBuilder.prototype.setPrefix = function (prefix) {
        this._prefix = prefix;
        return this;
    };
    RouteBuilder.prototype.createRoute = function () {
        var routeConfig = new yaml_1.YAMLMap();
        routeConfig.add({
            key: 'match',
            value: {
                prefix: this._prefix,
                headers: [{ name: ':method', exact_match: this._method.toUpperCase() }]
            }
        });
        routeConfig.add({ key: 'route', value: { cluster: this._cluster } });
        return routeConfig;
    };
    return RouteBuilder;
}());
exports.RouteBuilder = RouteBuilder;
//# sourceMappingURL=RouteBuilder.js.map