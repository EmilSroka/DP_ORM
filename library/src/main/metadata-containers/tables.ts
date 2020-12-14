import { TableMap } from '../../common/models/table-map';

export class Tables {
  private tableMaps: TableMap[] = [];
  private nameToTableMap: Map<string, TableMap> = new Map();

  add(element: TableMap): void {
    // TODO
    // should insert element into tableMaps and nameToTableMap
    this.tableMaps.push(element);
    this.nameToTableMap.set(element.tableName,element);
  }

  get(name: string): TableMap {
    // TODO
    // should returns map with given name
    // if not exist -> throw error

    if(this.nameToTableMap.has(name)){
      return this.nameToTableMap.get(name);
    }
    else{
      throw new Error("There is no entry with that name")
    }

  }

  getNames(): string[] {
    // TODO
    // should returns array of names of all tables
    let arrayOfNames: string[] = [];
    for (let [key, value] of this.nameToTableMap) {
      arrayOfNames.push(key);
    }
    return arrayOfNames;
  }
}
