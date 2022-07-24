const yaml = require('yaml');
const fs = require('fs');

class ListenerBuilder {
  constructor(config) {
    this.config = config;
    this.address;
    this.port;
    
  }

  setAddress(address) {
    this.address = address;
    return this;
  }

  setPort(port) {
    this.port = port;
    return this;
  }

  build(){
    this.config.add({
      address: { socket_address: { address: this.address, port_value: this.port } }
    });
  }

}

class ConfigBuilder {
  constructor() {
    this.config = null;
    this.listenersNode = null;
    this.listeners = [];
  }

  addListener() {
    if (this.config === null) {
      this.listenersNode = new yaml.YAMLSeq();
      this.config = new yaml.Document({
        static_resources: { listeners: this.listenersNode }
      });
    }
    let listener = new ListenerBuilder(this.listenersNode);
    this.listeners.push(listener);
    return listener;
  }

  build() {
    this.listeners.forEach((listener) => {
      listener.build();
    });
    return this.config.toString();
  }
}

class RouteBuilder {
  constructor(cluster) {
    this.prefix;
    this.method;
    this.cluster = cluster;
  }

  build() {
    let doc = new yaml.Document([
      {
        match: {
          prefix: this.prefix,
          headers: [{ name: ':method', exact_match: this.method.toUpperCase() }]
        },
        route: { cluster: this.cluster }
      }
    ]);
    return doc.toString();
  }
}

// Get document, or throw exception on error
try {
  const doc = yaml.parseDocument(
    fs.readFileSync('./resources/petstore.yaml', 'utf8')
  );
  const config = yaml.parseDocument(
    fs.readFileSync('./resources/front-envoy.yaml', 'utf8')
  );

  let configBuilder = new ConfigBuilder();
  let listener = configBuilder
    .addListener()
    .setAddress('0.0.0.0')
    .setPort('8080');
  console.log(configBuilder.build());

  let paths = doc.get('paths');
  paths.items.forEach((path) => {
    let builder = new RouteBuilder('service1');
    builder.prefix = path.key.value;
    path.value.items.forEach((method) => {
      builder.method = method.key.value;
    });
    console.log(builder.build());
  });
} catch (e) {
  console.log(e);
}
