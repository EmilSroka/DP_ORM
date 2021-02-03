import ORM from "../../orm";
import {JsType} from "dp-orm/dist/common/models/field-types";

@ORM.Entity()
export class OneToMany {
  @ORM.PrimaryKey({type: JsType.number})
  public id: number;

  @ORM.Attribute({type: JsType.string})
  public info: string;
}
