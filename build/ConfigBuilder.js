"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigBuilder = void 0;
var yaml_1 = require("yaml");
var yaml_2 = __importDefault(require("yaml"));
var ListenerBuilder_1 = require("./ListenerBuilder");
var ClusterBuilder_1 = require("./ClusterBuilder");
var ConfigBuilder = /** @class */ (function () {
    function ConfigBuilder() {
        this.listenersNode = new yaml_1.YAMLSeq();
        this.clustersNode = new yaml_1.YAMLMap();
        this.adminNode = new yaml_1.YAMLMap();
        this.layeredRuntimeNode = new yaml_1.YAMLMap();
        this.config = new yaml_2.default.Document({
            static_resources: {
                listeners: this.listenersNode,
                clusters: [this.clustersNode]
            },
            admin: this.adminNode,
            layered_runtime: this.layeredRuntimeNode
        });
        this.listeners = [];
        this.clusters = [];
    }
    ConfigBuilder.prototype.addListener = function () {
        var listener = new ListenerBuilder_1.ListenerBuilder(this.listenersNode);
        this.listeners.push(listener);
        return listener;
    };
    ConfigBuilder.prototype.addCluster = function () {
        var builder = new ClusterBuilder_1.ClusterBuilder(this.clustersNode);
        this.clusters.push(builder);
        return builder;
    };
    ConfigBuilder.prototype.build = function () {
        this.listeners.forEach(function (listener) {
            listener.build();
        });
        this.clusters.forEach(function (cluster) {
            cluster.build();
        });
        this.addAdminNode();
        this.addLayeredRuntimeNode();
        return this.config;
    };
    ConfigBuilder.prototype.addLayeredRuntimeNode = function () {
        this.layeredRuntimeNode.add({
            key: 'layers',
            value: [
                {
                    name: 'static_layer_0',
                    static_layer: {
                        envoy: {
                            resource_limits: {
                                listener: { example_listener_name: { connection_limit: 10000 } }
                            }
                        }
                    }
                }
            ]
        });
    };
    ConfigBuilder.prototype.addAdminNode = function () {
        this.adminNode.add({
            key: 'address',
            value: { socket_address: { address: '0.0.0.0', port_value: 8001 } }
        });
    };
    return ConfigBuilder;
}());
exports.ConfigBuilder = ConfigBuilder;
//# sourceMappingURL=ConfigBuilder.js.map