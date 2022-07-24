import { ListenerBuilder } from '../src/ListenerBuilder';
import { YAMLSeq } from 'yaml';
import yaml from 'yaml';
import { RouteBuilder } from '../src/RouteBuilder';
var chai = require('chai');
chai.use(require('chai-string'));

var assert = require('chai').assert;

describe('ListenerBuilder', function () {
  describe('#build()', function () {
    it('should return address when added', function () {
      const root = new YAMLSeq();
      const listener = new ListenerBuilder(root);
      listener.setAddress('0.0.0.0').setPort(8080);
      listener.addRoute().setPrefix('/pets').setMethod('post');
      const result = listener.build();
      const doc = new yaml.Document(result).toString();
      console.log(doc);
      assert.equalIgnoreSpaces(
        `- address:
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
              `,
        doc
      );
    });
  });
});
