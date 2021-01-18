import orm from '../../orm';
import {DbType} from "dp-orm/dist/common/models/field-types";

@orm.Entity()
export default class Many {
  @orm.Attribute({ type: DbType.date })
  info: Date;
}
