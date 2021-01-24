import ORM from '../../orm';
import { JsType } from "dp-orm/dist/common/models/field-types";

@ORM.Entity({tableName: 'orders'})
export class Order {
  @ORM.Attribute({type: JsType.string})
  public info: string;

  @ORM.Attribute({type: JsType.number})
  public cost: number;
}
