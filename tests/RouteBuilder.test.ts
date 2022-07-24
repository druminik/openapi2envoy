import { RouteBuilder } from '../src/RouteBuilder';
import { YAMLSeq } from 'yaml';
import yaml from 'yaml';
var chai = require('chai');
chai.use(require('chai-string'));

var assert = require('chai').assert;

describe('RouteBuilder', function () {
  describe('#build()', function () {
    it('should return match', function () {
      const builder = new RouteBuilder('service1');
      builder.setPrefix('/pets').setMethod('post');
      const result = builder.build();
      const doc = new yaml.Document(result).toString();
      console.log(doc);
      assert.equalIgnoreSpaces(
        `
        match:
          prefix: /pets
          headers:
          - name: :method
            exact_match: POST
        route:
          cluster: service1`,
        doc
      );
    });
  });
});
