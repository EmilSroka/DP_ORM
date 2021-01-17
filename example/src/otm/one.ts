import orm from '../../orm';
import {DbType, RelationshipType} from "dp-orm/dist/common/models/field-types";
import Many from "./many";

@orm.Entity()
export default class One {
  @orm.Attribute({type: DbType.autoincrement, columnName: 'idX', isPrimaryKey: true})
  id: number;

  @orm.Attribute({ type: { with: 'Many', type: RelationshipType.oneToMany } })
  rel: Many[];
}
