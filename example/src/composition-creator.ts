import orm from "../orm";
import {DbType, RelationshipType} from "dp-orm/dist/common/models/field-types";
import {asEntityClass} from "dp-orm/dist/configuration/decorators/entity";
import Composition from "./composition";

@orm.Entity()
class CompositionCreator {
  @orm.Attribute({ isPrimaryKey: true, type: DbType.autoincrement, isUnique: true })
  id: number;

  @orm.Attribute({ isNullable: false, isUnique: true, type: DbType.autoincrement })
  name: string;

  @orm.Attribute({ type: {
      type: RelationshipType.manyToMany,
      with: 'Composition'
    }, isUnique: true,
  })
  Composition: typeof Composition[];
}

export default asEntityClass(CompositionCreator);