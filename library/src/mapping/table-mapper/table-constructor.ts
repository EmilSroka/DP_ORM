import { Tables } from '../../main/metadata-containers/tables';
import { Relationships } from '../../main/metadata-containers/relationships';
import { Column, TableSchema } from '../../common/models/database-schema';

export class TableConstructor {
  private tableNameToForeignKeyColumns: Map<string, Column[]> = new Map();

  constructor(private tables: Tables, private relationships: Relationships) {}

  getDatabaseScheme(): TableSchema[] {
    const tablesNames = this.getTableMapsNamesInCreationOrder();
    const tableSchemas = tablesNames.map(this.toTableSchema);
    return [];
  }

  getTableMapsNamesInCreationOrder(): string[] {
    const result: string[] = this.tables
      .getNames()
      .filter((tableName) => !this.relationships.hasForeignKey(tableName));

    const queue = [...result];

    // BFS for dependencies
    while (queue.length > 0) {
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

  toTableSchema(tableName: string): TableSchema {
    // TODO
    // 1. get TableMap
    // 2. create TableSchema with name from TableMap
    // 3. iterate over columns:
    //    crete Column based on ColumnMap and insert into scheme
    //    -> columnName = name
    //    -> isNullable, isUnique and isPrimaryKey are identical
    //    -> when ColumnMap has type other then RelationshipFieldType - copy
    //    -> when ColumnMap has type of RelationshipFieldType don't insert column into scheme. instead:
    //       -> when of type MtoM -> just skip
    //       -> when of type 1to1
    //          -> make deep copy of primary columns
    //          -> set them as foreign key to current table
    //          -> insert into array in tableNameToForeignKeyColumns (RelationshipFieldType.with as a key)
    //          ! handle case when entry don't exist yet
    //       -> when of type 1toM
    //          -> make deep copy of primary columns
    //          -> set them as foreign key to current table
    //          -> set isPrimaryKey to false (only different to 1to1 - DRY)
    //          -> insert into array in tableNameToForeignKeyColumns (RelationshipFieldType.with as a key)
    //          ! handle case when entry don't exist yet
    // 4. check, if exist entry in tableNameToForeignKeyColumns. When exists, insert columns into scheme
    //    -> when column of given exist already, change name to foreignKeyI, where I ist just number starting from 1
    // 5. if there aren't primary key columns, then one should be created:
    //    -> name = idI (where I ist just number starting from 1, get first free),
    //    -> type = DbType.autoincrement, isNullable = false, isUnique = true, isPrimaryKey = true

    // ! I think, that good idea is to handle RelationshipFieldType at the end,
    // ! when all primary keys are handled (and taken form tableNameToForeignKeyColumns).
    // ! Also, it's good idea to store temporary all primary columns in array, to just use them when needed.
    // ! The above algorithm is indicative only :P
    return {} as TableSchema;
  }
}
