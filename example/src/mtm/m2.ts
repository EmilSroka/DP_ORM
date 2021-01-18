import orm from '../../orm';
import {DbType, JsType, RelationshipType} from "dp-orm/dist/common/models/field-types";
import M1 from "./m1";

@orm.Entity()
export default class M2 {
  @orm.Attribute({type: DbType.autoincrement, columnName: 'idM2', isPrimaryKey: true})
  id: number;

  @orm.Attribute({ type: JsType.string })
  infoB: string;

  @orm.Attribute({ type: { with: 'm1', type: RelationshipType.manyToMany } })
  rel: M1[];
}
