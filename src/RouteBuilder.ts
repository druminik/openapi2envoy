import yaml, { YAMLMap } from 'yaml';
import { YAMLSeq } from 'yaml';
import { Collection } from 'yaml/dist/nodes/Collection';

export class RouteBuilder {
  private _prefix: String;
  private _method: String;
  private _cluster: String;

  constructor(cluster: string) {
    this._cluster = cluster;
    this._prefix = '';
    this._method = '';
  }

  build(): Collection {
    const routeConfig = this.createRoute();
    return routeConfig;
  }

  setMethod(method: String) {
    this._method = method;
    return this;
  }

  setPrefix(prefix: String) {
    this._prefix = prefix;
    return this;
  }

  private createRoute() {
    const routeConfig = new YAMLMap();
    routeConfig.add({
      key: 'match',
      value: {
        prefix: this._prefix,
        headers: [{ name: ':method', exact_match: this._method.toUpperCase() }]
      }
    });
    routeConfig.add({ key: 'route', value: { cluster: this._cluster } });

    return routeConfig;
  }
}
