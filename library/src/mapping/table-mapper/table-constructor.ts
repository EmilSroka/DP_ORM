import { Tables } from '../../main/metadata-containers/tables';
import { Relationships } from '../../main/metadata-containers/relationships';

export class TableConstructor {
  constructor(private tables: Tables, private relationships: Relationships) {}

  getTableMapsNamesInCreationOrder(): string[] {
    const result: string[] = this.tables
      .getNames()
      .filter((tableName) => !this.relationships.hasForeignKey(tableName));

    // Clones array
    const queue = Object.assign([], result);

    // BFS for dependencies
    while (queue.length > 0) {
      // Pops first element from the array
      const queueTable = queue.shift();
      this.relationships
        .getAssociatedTablesNames(queueTable)
        .forEach((associatedTableName) => {
          if (!result.includes(associatedTableName)) {
            result.push(associatedTableName);
            queue.push(associatedTableName);
          }
        });
    }
    return result;
  }
}
