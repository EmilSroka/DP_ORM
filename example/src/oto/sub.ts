import orm from '../../orm';
import {JsType} from "dp-orm/dist/common/models/field-types";

@orm.Entity()
export default class Sub {
  @orm.Attribute({ type: JsType.string })
  descriptionWithUpperCase: string;
}
