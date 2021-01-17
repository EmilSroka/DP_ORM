import orm from "../orm";
import {DbType} from "dp-orm/dist/common/models/field-types";
import {asEntityClass} from "dp-orm/dist/configuration/decorators/entity";


@orm.Entity()
class ExtraDetails {
  @orm.Attribute({  type: DbType.date })
  description: Date;
}

export default asEntityClass(ExtraDetails);