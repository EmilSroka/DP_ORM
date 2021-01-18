import ORM from '../../orm';
import {DbType, JsType} from "dp-orm/dist/common/models/field-types";

@ORM.Entity()
export class Car {
  @ORM.PrimaryKey({type: JsType.number})
  public id: number;

  @ORM.Attribute({type: JsType.string})
  public name: string;

  @ORM.Attribute({type: DbType.date, isUnique: true})
  public productionDate: Date;
}
