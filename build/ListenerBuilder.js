"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenerBuilder = void 0;
var yaml_1 = require("yaml");
var RouteBuilder_1 = require("./RouteBuilder");
var ListenerBuilder = /** @class */ (function () {
    function ListenerBuilder(config) {
        this.config = config;
        this.address;
        this.port;
        this.routeBuilders = [];
    }
    ListenerBuilder.prototype.setAddress = function (address) {
        this.address = address;
        return this;
    };
    ListenerBuilder.prototype.setPort = function (port) {
        this.port = port;
        return this;
    };
    ListenerBuilder.prototype.addRoute = function () {
        var builder = new RouteBuilder_1.RouteBuilder('service1');
        this.routeBuilders.push(builder);
        return builder;
    };
    ListenerBuilder.prototype.build = function () {
        var filter_chains = this.createFilterChain();
        this.config.add({
            address: {
                socket_address: { address: this.address, port_value: this.port }
            },
            filter_chains: filter_chains
        });
        return this.config;
    };
    ListenerBuilder.prototype.createFilterChain = function () {
        var http_filters = this.createHttpFilters().get('http_filters');
        // const route_config = this.routeBuilder.build().get('route_config');
        var routes = this.createRoutes();
        var filterChain = new yaml_1.YAMLSeq();
        filterChain.add({
            filters: [
                {
                    name: 'envoy.filters.network.http_connection_manager',
                    typed_config: {
                        '@type': 'type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager',
                        codec_type: 'AUTO',
                        stat_prefix: 'ingress_http',
                        route_config: {
                            name: 'local_route',
                            virtual_hosts: [
                                {
                                    name: 'backend',
                                    domains: ['*'],
                                    routes: routes
                                }
                            ]
                        },
                        http_filters: http_filters
                    }
                }
            ]
        });
        return filterChain;
    };
    ListenerBuilder.prototype.createRoutes = function () {
        var routes = new yaml_1.YAMLSeq();
        this.routeBuilders.forEach(function (builder) {
            var route = builder.build();
            routes.add(route);
        });
        return routes;
    };
    ListenerBuilder.prototype.createHttpFilters = function () {
        var filters = new yaml_1.YAMLMap();
        filters.add({
            key: 'http_filters',
            value: [
                {
                    name: 'envoy.filters.http.router',
                    typed_config: {
                        '@type': 'type.googleapis.com/envoy.extensions.filters.http.router.v3.Router'
                    }
                }
            ]
        });
        return filters;
    };
    return ListenerBuilder;
}());
exports.ListenerBuilder = ListenerBuilder;
//# sourceMappingURL=ListenerBuilder.js.map