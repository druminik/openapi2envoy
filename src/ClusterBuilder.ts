import { Pair, YAMLMap, YAMLSeq } from 'yaml';
import { Collection } from 'yaml/dist/nodes/Collection';
import { NodeBase } from 'yaml/dist/nodes/Node';

export class ClusterBuilder {
  name: String;
  config: Collection;

  constructor(root: Collection) {
    this.config = root;
    this.name = '';
  }

  setName(name: String): ClusterBuilder {
    this.name = name;
    return this;
  }

  build() {
    const config = this.config;
    config.add({ key: 'name', value: this.name });
    config.add({ key: 'type', value: 'STRICT_DNS' });

    config.add(new Pair('lb_policy', 'ROUND_ROBIN'));
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
  }
}
