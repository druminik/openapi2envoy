const yaml = require('js-yaml');
const fs = require('fs');

// Get document, or throw exception on error
try {
  const doc = yaml.load(fs.readFileSync('./resources/petstore.yaml', 'utf8'));
  const config = yaml.load(fs.readFileSync('./resources/front-envoy.yaml', 'utf8'));
  
  
  const route = getRouteElement(config);
  const paths = doc.paths;
  for (var pathName in paths) {
    if (Object.prototype.hasOwnProperty.call(paths, pathName)) {
      processPath(route, pathName, paths[pathName]);
    }
  }

} catch (e) {
  console.log(e);
}

function processPath(route, pathName, path) {
  console.log(pathName);
}

function getRouteElement(config){
  config.static_resources.listeners[0].filter_chains[0].filters[0].typed_config.route_config.virtual_hosts[0].routes
}

