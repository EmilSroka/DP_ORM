import ORM from '../../orm';
import {JsType} from "dp-orm/dist/common/models/field-types";

@ORM.Entity({tableName: 'client_details'})
export class Details {
  @ORM.Attribute({type: JsType.string})
  public info: string;

  @ORM.Attribute({type: JsType.boolean})
  public premium: boolean;
}
