import { TableMap } from '../../common/models/table-map';

export class Tables {
  private tableMaps: TableMap[] = [];
  private nameToTableMap: Map<string, TableMap> = new Map();

  add(element: TableMap): void {
    // TODO
    // should insert element into tableMaps and nameToTableMap
  }

  get(name: string): TableMap {
    // TODO
    // should returns map with given name
    // if not exist -> throw error
    return {} as TableMap;
  }

  getNames(): string[] {
    // TODO
    // should returns array of names of all tables
    return [];
  }
}
