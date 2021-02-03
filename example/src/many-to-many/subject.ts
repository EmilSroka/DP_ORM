import ORM from '../../orm';
import {JsType} from "dp-orm/dist/common/models/field-types";
import {Student} from "./student";

@ORM.Entity()
export class Subject {
  @ORM.PrimaryKey({type: JsType.number})
  public code: number;

  @ORM.Attribute({type: JsType.string, isNullable: false})
  public shortName: string;

  public students: Student[];
}
