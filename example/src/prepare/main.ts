import ORM from "../../orm";
import {JsType, RelationshipType} from "dp-orm/dist/common/models/field-types";
import {OneToOne} from "./one-to-one";
import {OneToMany} from "./one-to-many";
import {ManyToMany} from "./many-to-many";

@ORM.Entity()
export class Main {
  @ORM.PrimaryKey({type: JsType.number})
  public id: number;

  @ORM.Attribute({type: JsType.string})
  public info: string;

  @ORM.Relationship({type: RelationshipType.oneToOne, with: OneToOne})
  public oto: OneToOne;

  @ORM.Relationship({type: RelationshipType.oneToMany, with: OneToMany})
  public otm: OneToMany[];

  @ORM.Relationship({type: RelationshipType.manyToMany, with: { class: ManyToMany, field: 'relationship' } })
  public mtm: ManyToMany[];
}