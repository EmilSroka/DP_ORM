import orm from '../../orm';
import {JsType, RelationshipType} from "dp-orm/dist/common/models/field-types";
import Sub from "./sub";

@orm.Entity()
export default class Owner {
  @orm.Attribute({type: JsType.number, columnName: 'idl', isPrimaryKey: true})
  id: number;

  @orm.Attribute({ type: { with: 'Sub', type: RelationshipType.oneToOne } })
  descriptionWithUpperCase: Sub;
}
