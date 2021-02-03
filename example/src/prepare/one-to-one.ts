import ORM from "../../orm";
import {JsType} from "dp-orm/dist/common/models/field-types";

@ORM.Entity()
export class OneToOne {
  @ORM.Attribute({type: JsType.string})
  public info: string;
}
