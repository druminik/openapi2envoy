import { YAMLSeq } from 'yaml';
import yaml from 'yaml';
import { ClusterBuilder } from '../src/ClusterBuilder';
var chai = require('chai');
chai.use(require('chai-string'));

var assert = require('chai').assert;

describe('ClusterBuilder', function () {
  describe('#build()', function () {
    it('should return cluster', function () {
      const root = new YAMLSeq();
      const builder = new ClusterBuilder(root);
      builder.setName('service1');
      const doc = new yaml.Document(builder.build()).toString();

      console.log(doc);
      assert.equalIgnoreSpaces(
        `
        name: service1
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
    `,
        doc
      );
    });
  });
});
