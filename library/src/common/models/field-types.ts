export enum JsType {
  null,
  undefined,
  number,
  boolean,
  string,
}

export enum RelationshipType {
  oneToOne,
  oneToMany,
  manyToMany,
}

export enum DbType {
  autoincrement,
  date,
}

export type JsFieldTypes = JsType.number | JsType.boolean | JsType.string;

export type DbFieldTypes = DbType.autoincrement | DbType.date;

export interface RelationshipFieldType {
  type: RelationshipType;
  with: string;
}

export type Field = JsFieldTypes | DbFieldTypes | RelationshipFieldType;

export function isRelationshipField(
  field: Field,
): field is RelationshipFieldType {
  return (field as RelationshipFieldType).type != null;
}
