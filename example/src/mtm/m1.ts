import orm from '../../orm';
import {DbType, JsType, RelationshipType} from "dp-orm/dist/common/models/field-types";
import M2 from "./m2";

@orm.Entity()
export default class M1 {
  @orm.Attribute({type: DbType.autoincrement, columnName: 'idM1', isPrimaryKey: true})
  id: number;

  @orm.Attribute({ type: JsType.string })
  infoA: string;

  @orm.Attribute({ type: { with: 'm2', type: RelationshipType.manyToMany } })
  rel: M2[];

}
