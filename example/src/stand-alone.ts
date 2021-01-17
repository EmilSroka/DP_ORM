import orm from '../orm';
import {DbType, JsType} from "dp-orm/dist/common/models/field-types";

@orm.Entity()
export class StandAlone {
  @orm.Attribute({ type: DbType.autoincrement, isPrimaryKey: true }) ttt;
  @orm.Attribute({type: JsType.boolean}) lll;
  @orm.Attribute({type: JsType.number}) num;
}