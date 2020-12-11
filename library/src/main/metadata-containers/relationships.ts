import { Relationship } from '../models/relationships';
import { RelationshipType } from '../../common/models/field-types';

export class Relationships {
  private toNTables: Set<string> = new Set();
  private detailTables: Set<string> = new Set();
  private relationships: Relationship[] = [];

  get(): Relationship[] {
    return this.relationships;
  }

  getByType(type: RelationshipType): Relationship[] {
    // TODO
    // should returns list of relations of given type
    return [];
  }

  add(relationship: Relationship): void {
    // TODO
    // should add relationship to relationships list
    // if it's 1 to n -> should add toTable to toNTarget set
    // if it's n to n -> should add both tables name to toNTarget set
    // if it's 1 to 1 -> should add toTable to to1Target set
  }

  isDetailTable(tableName: string): boolean {
    // TODO
    // check condition if tableName is in detailTables set
    return true;
  }

  isToNTable(tableName: string): boolean {
    // TODO
    // check condition if tableName is in toNTables set
    return true;
  }
}
