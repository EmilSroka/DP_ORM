import { Entity } from '../entity';
import { Tables } from '../../../main/metadata-containers/tables';
import Mock = jest.Mock;

jest.mock('../../../main/metadata-containers/tables', () => {
  return {
    Tables: function () {
      return {
        add: jest.fn(),
      };
    },
  };
});

const tableNameField = '_orm_table_name';

describe('Entity (decorator)', () => {
  let tables: Tables;

  beforeEach(() => {
    tables = new Tables();
    jest.clearAllMocks();
  });

  it(`should set table name in constructor prototype (as ${tableNameField}) as given in configuration`, () => {
    const tableName = 'notAvasdasdbsd';
    const constructor = function Avasdasdbsd() {
      return null;
    };
    const decorator = Entity(tables, { tableName });
    decorator(constructor);
    expect(constructor.prototype[tableNameField]).toBe(tableName);
  });

  it(`should set table name in constructor prototype (as ${tableNameField}) as class name (if no one passed in configuration)`, () => {
    const constructor = function Avasdasdbsd() {
      return null;
    };
    const decorator = Entity(tables);
    decorator(constructor);
    expect(constructor.prototype[tableNameField]).toBe(constructor.name);
  });

  it('should create DataMap and insert into Tables container', () => {
    const constructor = function Avasdasdbsd() {
      return null;
    };
    const decorator = Entity(tables);
    decorator(constructor);
    expect(tables.add).toHaveBeenCalledTimes(1);
    expect((tables.add as Mock).mock.calls[0][0]).toEqual({
      tableName: 'Avasdasdbsd',
      columns: [],
      constructor,
    });
  });
});
