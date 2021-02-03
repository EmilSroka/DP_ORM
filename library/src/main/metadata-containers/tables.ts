import { TableMap } from '../../common/models/table-map';

export class Tables {
  private tableMaps: TableMap<any>[] = [];
  private nameToTableMap: Map<string, TableMap<any>> = new Map();

  add(element: TableMap<any>): void {
    if (this.nameToTableMap.has(element.tableName))
      throw new Error(
        'ORM: Table of given name already exists (names ar case insensitive)',
      );

    this.tableMaps.push(element);
    this.nameToTableMap.set(element.tableName, element);
  }

  get(name: string): TableMap<any> {
    if (!this.nameToTableMap.has(name))
      throw new Error('internal ORM: There is no TableMap with given name');

    return this.nameToTableMap.get(name);
  }

  getNames(): string[] {
    return Array.from(this.nameToTableMap.keys());
  }
}
