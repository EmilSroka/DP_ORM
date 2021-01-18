export class IdentityMap {
  map: Map<string, Map<any, any>> = new Map();
  set: Set<any> = new Set();

  add(entity: any, key: any, tableName: string): void {
    if (!this.map.has(tableName)) this.map.set(tableName, new Map());
    if (this.map.get(tableName).has(key)) return;

    this.map.get(tableName).set(key, entity);
    this.set.add(entity);
  }

  has(key: any, tableName: string): boolean {
    return this.map.has(tableName) && this.map.get(tableName).has(key);
  }

  get(key: any, tableName: string): any {
    return this.map.get(tableName).get(key);
  }

  isLoaded(entity: any): boolean {
    return this.set.has(entity);
  }
}
