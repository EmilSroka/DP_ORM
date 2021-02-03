export interface Entity {
  _orm_table_name: string;
}

export interface EntityClass {
  prototype: {
    _orm_table_name: string;
  };
}

export function isEntity(target: any): target is Entity {
  return target._orm_table_name != null;
}
