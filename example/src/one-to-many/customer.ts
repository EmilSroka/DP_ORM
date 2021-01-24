import ORM from '../../orm';
import {JsType, RelationshipType} from "dp-orm/dist/common/models/field-types";
import {Order} from "./order";

@ORM.Entity()
export class Customer {
  @ORM.PrimaryKey({type: JsType.number})
  public id: number;

  @ORM.Relationship({type: RelationshipType.oneToMany, with: Order})
  public orders: Order[];
}
