"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var yaml_1 = __importDefault(require("yaml"));
var ConfigBuilder_1 = require("./ConfigBuilder");
function main() {
    // Get document, or throw exception on error
    try {
        var source = yaml_1.default.parseDocument(fs_1.default.readFileSync('./resources/petstore.yaml', 'utf8'));
        var builder = new ConfigBuilder_1.ConfigBuilder();
        var listener_1 = builder.addListener().setAddress('0.0.0.0').setPort(8080);
        var paths = source.get('paths');
        paths.items.forEach(function (path) {
            var _a;
            var route = listener_1.addRoute().setPrefix(path.key.value);
            (_a = path.value) === null || _a === void 0 ? void 0 : _a.items.forEach(function (method) {
                route.setMethod(method.key.value);
            });
        });
        builder.addCluster().setName('service1');
        var config = builder.build().toString();
        console.log(config);
        var destination = fs_1.default.writeFileSync('./resources/front-envoy.yaml', config);
    }
    catch (e) {
        console.log(e);
    }
}
main();
//# sourceMappingURL=app.js.map