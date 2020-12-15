import { Tables } from '../../main/metadata-containers/tables';
import { Relationships } from '../../main/metadata-containers/relationships';

export class TableConstructor {
  constructor(private tables: Tables, private relationships: Relationships) {}

  getTableMapsNamesInCreationOrder(): string[] {
    // TODO
    // should returns array that contains names of TableMaps in creation order
    // ! do changes in Relationships before start this part
    // algorithm:
    // * get tables names that don't have foreign keys (look Relationships) -> starting nodes
    // * add others names (look Relationships) -> BFS algorithm
    return [];
  }
}
