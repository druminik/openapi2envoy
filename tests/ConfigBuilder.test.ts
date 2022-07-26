import yaml from 'yaml';
import { ConfigBuilder } from '../src/ConfigBuilder';

var chai = require('chai');
chai.use(require('chai-string'));

var assert = require('chai').assert;

describe('ConfigBuilder', function () {
  describe('#build()', function () {
    it('should return configuration', function () {
      const builder = new ConfigBuilder();
      const listener = builder
        .addListener()
        .setAddress('0.0.0.0')
        .setPort(8080);
      listener.addRoute().setPrefix('/pets').setMethod('post');
      builder.addCluster().setName('service1');
      const doc = builder.build().toString();
      console.log(doc);
      assert.equalIgnoreSpaces(
        `static_resources:
          listeners:
          - address:
              socket_address:
                address: 0.0.0.0
                port_value: 8080
            filter_chains:
            - filters:
              - name: envoy.filters.network.http_connection_manager
                typed_config:
                  "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
                  codec_type: AUTO
                  stat_prefix: ingress_http
                  route_config:
                    name: local_route
                    virtual_hosts:
                    - name: backend
                      domains:
                      - "*"
                      routes:
                      - match:
                        prefix: /pets
                        headers:
                        - name: :method
                          exact_match: POST
                        route:
                          cluster: service1
                  http_filters:
                  - name: envoy.filters.http.router
                    typed_config:
                      "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router
            clusters:
            - name: service1
              type: STRICT_DNS
              lb_policy: ROUND_ROBIN
              load_assignment:
                cluster_name: service1
                endpoints:
                - lb_endpoints:
                  - endpoint:
                      address:
                        socket_address:
                          address: service1
                          port_value: 8000
          admin:
            address:
              socket_address:
                address: 0.0.0.0
                port_value: 8001
          layered_runtime:
            layers:
            - name: static_layer_0
              static_layer:
                envoy:
                  resource_limits:
                    listener:
                      example_listener_name:
                        connection_limit: 10000                          
              `,
        doc
      );
    });
  });
});
