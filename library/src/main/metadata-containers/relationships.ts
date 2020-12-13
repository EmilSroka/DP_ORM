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
    // should add relationship to relationships list
    // if it's 1 to n -> should add toTable to toNTarget set
    // if it's n to n -> should add both tables name to toNTarget set
    // if it's 1 to 1 -> should add toTable to to1Target set
    this.relationships.push(relationship);
    if (relationship.type == RelationshipType.oneToOne) {
      this.detailTables.add(relationship.toTable);
    } else if (relationship.type == RelationshipType.oneToMany) {
      this.toNTables.add(relationship.toTable);
    } else if (relationship.type == RelationshipType.manyToMany){
      this.toNTables.add(relationship.toTable);
      this.detailTables.add(relationship.fromTable);
    }
  }

  isDetailTable(tableName: string): boolean {
    return this.detailTables.has(tableName);
  }

  isToNTable(tableName: string): boolean {
    return this.toNTables.has(tableName);
  }
}