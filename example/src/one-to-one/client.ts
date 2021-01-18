import ORM from '../../orm';
import {DbType, JsType, RelationshipType} from "dp-orm/dist/common/models/field-types";
import {Details} from "./details";

@ORM.Entity()
export class Client {
  @ORM.PrimaryKey({type: DbType.autoincrement})
  public id: number;

  @ORM.Attribute({type: JsType.string})
  public name: string;

  @ORM.Attribute({type: JsType.boolean})
  public isActive: boolean;

  @ORM.Relationship({type: RelationshipType.oneToOne, with: Details})
  public details: Details;
}
