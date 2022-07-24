import { YAMLMap, YAMLSeq } from 'yaml';
import yaml from 'yaml';
import { RouteBuilder } from './RouteBuilder';
import { Collection } from 'yaml/dist/nodes/Collection';

export class ListenerBuilder {
  config: YAMLSeq;
  address: String | undefined;
  port: number | undefined;
  routeBuilders: RouteBuilder[];

  constructor(config: YAMLSeq<unknown>) {
    this.config = config;
    this.address;
    this.port;
    this.routeBuilders = [];
  }

  setAddress(address: string) {
    this.address = address;
    return this;
  }

  setPort(port: number) {
    this.port = port;
    return this;
  }

  addRoute(): RouteBuilder {
    const builder = new RouteBuilder('service1');
    this.routeBuilders.push(builder);
    return builder;
  }

  build(): Collection {
    const filter_chains = this.createFilterChain();
    this.config.add({
      address: {
        socket_address: { address: this.address, port_value: this.port }
      },
      filter_chains
    });

    return this.config;
  }

  private createFilterChain(): YAMLSeq {
    const http_filters = this.createHttpFilters().get('http_filters');
    // const route_config = this.routeBuilder.build().get('route_config');
    const routes = this.createRoutes();
    const filterChain = new YAMLSeq();
    filterChain.add({
      filters: [
        {
          name: 'envoy.filters.network.http_connection_manager',
          typed_config: {
            '@type':
              'type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager',
            codec_type: 'AUTO',
            stat_prefix: 'ingress_http',
            route_config: {
              name: 'local_route',
              virtual_hosts: [
                {
                  name: 'backend',
                  domains: ['*'],
                  routes
                }
              ]
            },
            http_filters
          }
        }
      ]
    });
    return filterChain;
  }
  private createRoutes() {
    const routes = new YAMLSeq();
    this.routeBuilders.forEach((builder) => {
      const route = builder.build();
      routes.add(route);
    });
    return routes;
  }

  private createHttpFilters() {
    const filters = new YAMLMap();
    filters.add({
      key: 'http_filters',
      value: [
        {
          name: 'envoy.filters.http.router',
          typed_config: {
            '@type':
              'type.googleapis.com/envoy.extensions.filters.http.router.v3.Router'
          }
        }
      ]
    });
    return filters;
  }
}
