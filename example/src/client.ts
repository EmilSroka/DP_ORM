import orm from '../orm';
import Order from "./order";
import {DbType, JsType, RelationshipType} from "dp-orm/dist/common/models/field-types";
import {asEntityClass} from "dp-orm/dist/configuration/decorators/entity";

@orm.Entity()
class Client {
  @orm.Attribute({ isPrimaryKey: true, type: DbType.autoincrement, isUnique: true })
  id: number;

  @orm.Attribute({ type: JsType.string, isPrimaryKey: false })
  name: string;

  @orm.Attribute({ type: {
      type: RelationshipType.oneToMany,
      with: 'orders',
    }
  })
  orders: typeof Order[];
}

export default asEntityClass(Client);