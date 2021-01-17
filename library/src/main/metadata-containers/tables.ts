import { TableMap } from '../../common/models/table-map';

export class Tables {
  private tableMaps: TableMap<any>[] = [];
  private nameToTableMap: Map<string, TableMap<any>> = new Map();

  add(element: TableMap<any>): void {
    this.tableMaps.push(element);
    this.nameToTableMap.set(element.tableName, element);
  }

  get(name: string): TableMap<any> {
    if (!this.nameToTableMap.has(name))
      throw new Error('There is no TableMap with that name');

    return this.nameToTableMap.get(name);
  }

  getNames(): string[] {
    return Array.from(this.nameToTableMap.keys());
  }
}
