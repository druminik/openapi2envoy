"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterBuilder = void 0;
var yaml_1 = require("yaml");
var ClusterBuilder = /** @class */ (function () {
    function ClusterBuilder(root) {
        this.config = root;
        this.name = '';
    }
    ClusterBuilder.prototype.setName = function (name) {
        this.name = name;
        return this;
    };
    ClusterBuilder.prototype.build = function () {
        var config = this.config;
        config.add({ key: 'name', value: this.name });
        config.add({ key: 'type', value: 'STRICT_DNS' });
        config.add(new yaml_1.Pair('lb_policy', 'ROUND_ROBIN'));
        config.add({
            key: 'load_assignment',
            value: {
                cluster_name: this.name,
                endpoints: [
                    {
                        lb_endpoints: [
                            {
                                endpoint: {
                                    address: {
                                        socket_address: { address: this.name, port_value: 8000 }
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        });
        return this.config;
    };
    return ClusterBuilder;
}());
exports.ClusterBuilder = ClusterBuilder;
//# sourceMappingURL=ClusterBuilder.js.map