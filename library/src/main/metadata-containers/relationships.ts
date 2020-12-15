import { Relationship } from '../models/relationships';
import { RelationshipType } from '../../common/models/field-types';

export class Relationships {
  private tableNamesWithForeignKey: Set<string> = new Set<string>();
  private tableNameToAssociatedTableNames: Map<string, string[]> = new Map<
    string,
    // AssociatedTable -> table that has foreign key set to primary key of tableName in map key
    string[]
  >();
  private relationships: Relationship[] = [];

  get(): Relationship[] {
    return this.relationships;
  }

  getByType(type: RelationshipType): Relationship[] {
    // TODO
    // refactor by using filter
    const result: Relationship[] = [];
    this.relationships.forEach((relationship) => {
      if (relationship.type == type) {
        result.push(relationship);
      }
    });
    return result;
  }

  add(relationship: Relationship): void {
    // TODO
    // change behavior to given
    // 1. insert relationship into relationships
    // 2. if it's 1to1 or 1toN then
    // -> insert toTable to tableNamesWithForeignKey
    // -> insert toTable to tableNameToAssociatedTableNames map. Entry key = fromTable
    // edge case: what if key doesn't exist yet ?
  }

  hasForeignKey(tableName: string): boolean {
    // TODO
    // check if tableMap of given name has foreign key
    return false;
  }

  getAssociatedTablesNames(tableName: string): string[] {
    // TODO
    // return proper entry form map
    // edge case -> key doesn't exist -> empty array
    return [];
  }
}
