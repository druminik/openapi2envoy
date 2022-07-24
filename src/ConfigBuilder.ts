import { YAMLSeq, YAMLMap } from 'yaml';
import { Document } from 'yaml';
import yaml from 'yaml';
import { ListenerBuilder } from './ListenerBuilder';
import { RouteBuilder } from './RouteBuilder';
import { ClusterBuilder } from './ClusterBuilder';

export class ConfigBuilder {
  config: Document;
  listenersNode: YAMLSeq;
  listeners: ListenerBuilder[];
  clustersNode: YAMLMap;
  clusters: ClusterBuilder[];
  adminNode: YAMLSeq;
  layeredRuntimeNode: YAMLSeq;

  constructor() {
    this.listenersNode = new YAMLSeq();
    this.clustersNode = new YAMLMap();
    this.adminNode = new YAMLMap();
    this.layeredRuntimeNode = new YAMLMap();

    this.config = new yaml.Document({
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

  addListener(): ListenerBuilder {
    let listener = new ListenerBuilder(this.listenersNode);
    this.listeners.push(listener);
    return listener;
  }

  addCluster(): ClusterBuilder {
    const builder = new ClusterBuilder(this.clustersNode);
    this.clusters.push(builder);
    return builder;
  }

  build(): Document {
    this.listeners.forEach((listener) => {
      listener.build();
    });
    this.clusters.forEach((cluster) => {
      cluster.build();
    });

    this.addAdminNode();
    this.addLayeredRuntimeNode();
    return this.config;
  }
  addLayeredRuntimeNode() {
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
  }

  addAdminNode() {
    this.adminNode.add({
      key: 'address',
      value: { socket_address: { address: '0.0.0.0', port_value: 8001 } }
    });
  }
}
