import orm from "../orm";
import {DbType,  RelationshipType} from "dp-orm/dist/common/models/field-types";
import CompositionCreator from "./composition-creator";
import CompositionDetails from "./composition-details";
import Order from "./order";
import {asEntityClass} from "dp-orm/dist/configuration/decorators/entity";


@orm.Entity()
class Composition {
  @orm.Attribute({ isPrimaryKey: true, type: DbType.autoincrement, isUnique: true })
  id: number;

  @orm.Attribute({ type: {
      type: RelationshipType.oneToOne,
      with: 'CompositionDetails',
    }
  })
  details: typeof CompositionDetails[];

  @orm.Attribute({ type: {
      type: RelationshipType.manyToMany,
      with: 'CompositionCreator'
    }, isUnique: true,
  })
  creators: typeof CompositionCreator[];

  @orm.Attribute({ type: {
      type: RelationshipType.oneToMany,
      with: 'orders'
    }
  })
  orders: typeof Order[];
}

export default asEntityClass(Composition);