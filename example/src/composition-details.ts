import orm from "../orm";
import {JsType, RelationshipType} from "dp-orm/dist/common/models/field-types";
import ExtraDetails from "./extra-details";
import {asEntityClass} from "dp-orm/dist/configuration/decorators/entity";

@orm.Entity()
class CompositionDetails {
  @orm.Attribute({  type: JsType.string })
  description: string;

  @orm.Attribute({ type: {
      type: RelationshipType.oneToOne,
      with: 'ExtraDetails'
    }
  })
  orders: typeof ExtraDetails[];
}

export default asEntityClass(CompositionDetails);