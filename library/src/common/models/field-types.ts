export enum JsType {
  null,
  undefined,
  date,
  number,
  boolean,
  string,
}

export enum RelationshipType {
  oneToOne,
  oneToMany,
  manyToMany,
}

export type JsFieldTypes =
  | JsType.date
  | JsType.number
  | JsType.boolean
  | JsType.string;

export interface RelationshipFieldType {
  type: RelationshipType;
  with: string;
}

export type Field = JsFieldTypes | RelationshipFieldType;
