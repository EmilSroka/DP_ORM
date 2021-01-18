import ORM from '../../orm';
import {JsType} from "dp-orm/dist/common/models/field-types";
import {Main} from "./main";

@ORM.Entity()
export class ManyToMany {
  @ORM.PrimaryKey({type: JsType.number})
  public id: number;

  @ORM.Attribute({type: JsType.string})
  public info: string;

  public relationship: Main[];
}
