import { Pair, Scalar, YAMLSeq } from 'yaml';

import fs from 'fs';
import yaml from 'yaml';
import { ConfigBuilder } from './ConfigBuilder';
import { RouteBuilder } from './RouteBuilder';

function main() {
  // Get document, or throw exception on error
  try {
    const source = yaml.parseDocument(
      fs.readFileSync('./resources/petstore.yaml', 'utf8')
    );

    const builder = new ConfigBuilder();
    const listener = builder.addListener().setAddress('0.0.0.0').setPort(8080);

    let paths = source.get('paths') as YAMLSeq<Pair<Scalar<String>, YAMLSeq>>;
    paths.items.forEach((path) => {
      let route = listener.addRoute().setPrefix(path.key.value);
      path.value?.items.forEach((method) => {
        route.setMethod((<Pair<Scalar<String>>>method).key.value);
      });
    });

    builder.addCluster().setName('service1');
    const config = builder.build().toString();
    console.log(config);
    const destination = fs.writeFileSync(
      './resources/front-envoy.yaml',
      config
    );
  } catch (e) {
    console.log(e);
  }
}

main();
