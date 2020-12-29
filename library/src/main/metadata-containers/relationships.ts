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
    return this.relationships.filter(
      (relationship) => relationship.type === type,
    );
  }

  add(relationship: Relationship): void {
    this.relationships.push(relationship);

    if (relationship.type === RelationshipType.manyToMany) return;

    this.tableNamesWithForeignKey.add(relationship.toTableName);
    if (this.tableNameToAssociatedTableNames.has(relationship.fromTableName)) {
      this.tableNameToAssociatedTableNames
        .get(relationship.fromTableName)
        .push(relationship.toTableName);
    } else {
      this.tableNameToAssociatedTableNames.set(relationship.fromTableName, [
        relationship.toTableName,
      ]);
    }
  }

  hasForeignKey(tableName: string): boolean {
    return this.tableNamesWithForeignKey.has(tableName);
  }

  getAssociatedTablesNames(tableName: string): string[] {
    if (this.tableNameToAssociatedTableNames.has(tableName)) {
      return this.tableNameToAssociatedTableNames.get(tableName);
    }
    return [];
  }
}
