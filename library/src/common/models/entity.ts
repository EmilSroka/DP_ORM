export interface Entity {
  _orm_table_name: string;
}

export interface EntityClass {
  prototype: {
    _orm_table_name: string;
  };
}
