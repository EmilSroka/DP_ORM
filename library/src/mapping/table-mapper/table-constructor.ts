import { Tables } from '../../main/metadata-containers/tables';
import { Relationships } from '../../main/metadata-containers/relationships';

export class TableConstructor {
  constructor(private tables: Tables, private relationships: Relationships) {}

  getTableMapsNamesInCreationOrder(): string[] {
    let result: string[] = this.tables
      .getNames()
      .filter((tableName) => !this.relationships.hasForeignKey(tableName));

    const tableNamesWithForeignKey: string[] = this.tables
      .getNames()
      .filter((tableName) => this.relationships.hasForeignKey(tableName));

    result = result.concat(tableNamesWithForeignKey);

    tableNamesWithForeignKey.forEach((tableName) => {
      if (this.relationships.hasForeignKey(tableName)) {
        this.relationships
          .getAssociatedTablesNames(tableName)
          .forEach((deepTableName) => {
            result.push(deepTableName);
          });
      }
    });

    return result;
  }
}
