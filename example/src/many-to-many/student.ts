import ORM from '../../orm';
import {JsType, RelationshipType} from "dp-orm/dist/common/models/field-types";
import {Subject} from "./subject";

@ORM.Entity()
export class Student {
  @ORM.PrimaryKey({type: JsType.string})
  public index: string;

  @ORM.Attribute({type: JsType.string})
  public name: string;

  @ORM.Relationship({type: RelationshipType.manyToMany, with: { class: Subject, field: 'students' } })
  public subjects: Subject[];
}
