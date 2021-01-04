import { Column } from '../../../common/models/database-schema';
import { DbType, JsType } from '../../../common/models/field-types';
import { CreateDetails } from '../model/configuration';

export abstract class AbstractCreateQueryPart {
  protected constructor(
    private column: Column,
    protected settings: CreateDetails,
  ) {}

  abstract getType(): string;

  getPart(): string {
    let result = `${this.column.name} ${this.getType()}`;
    if (this.column.isPrimaryKey) result += ' PRIMARY KEY';
    if (!this.column.isNullable) result += ' NOT NULL';
    if (this.column.isUnique) result += ' UNIQUE';
    if (this.column.foreignKey)
      result += ` REFERENCES ${this.column.foreignKey.tableName}(${this.column.foreignKey.columnName})`;

    this.column.type;

    return result;
  }
}

export class AutoincrementCreateQueryPart extends AbstractCreateQueryPart {
  constructor(column: Column, settings: CreateDetails) {
    super(column, settings);
  }

  getType(): string {
    return 'serial';
  }
}

export class DateCreateQueryPart extends AbstractCreateQueryPart {
  constructor(column: Column, settings: CreateDetails) {
    super(column, settings);
  }

  getType(): string {
    return 'date';
  }
}

export class NumberCreateQueryPart extends AbstractCreateQueryPart {
  constructor(column: Column, settings: CreateDetails) {
    super(column, settings);
  }

  getType(): string {
    const { type, precision, scale } = this.settings.number;

    if (type === 'float') {
      return `float(${precision})`;
    } else if (scale) {
      return `numeric(${precision},${scale})`;
    } else {
      return `numeric(${precision})`;
    }
  }
}

export class BooleanCreateQueryPart extends AbstractCreateQueryPart {
  constructor(column: Column, settings: CreateDetails) {
    super(column, settings);
  }

  getType(): string {
    return 'boolean';
  }
}

export class StringCreateQueryPart extends AbstractCreateQueryPart {
  constructor(column: Column, settings: CreateDetails) {
    super(column, settings);
  }

  getType(): string {
    return `char(${this.settings.stringMaxSize})`;
  }
}

export class CreateQueryPartFactory {
  constructor(private settings: CreateDetails) {}

  get(column: Column) {
    switch (column.type) {
      case JsType.boolean:
        return new BooleanCreateQueryPart(column, this.settings);
      case JsType.number:
        return new NumberCreateQueryPart(column, this.settings);
      case JsType.string:
        return new StringCreateQueryPart(column, this.settings);
      case DbType.date:
        return new DateCreateQueryPart(column, this.settings);
      case DbType.autoincrement:
        return new AutoincrementCreateQueryPart(column, this.settings);
    }
  }
}
