import orm from '../orm';
import {JsType} from "dp-orm/dist/common/models/field-types";
import {asEntityClass} from "dp-orm/dist/configuration/decorators/entity";

@orm.Entity({ tableName: 'orders' })
class Order {
  @orm.Attribute({ type: JsType.number })
  price: number;
}

export default asEntityClass(Order);