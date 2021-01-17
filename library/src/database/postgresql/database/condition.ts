import { Condition } from '../model/condition';
import { parseType } from '../../../utils/check';
import { dateToISOType } from '../../../utils/date';

export class Field implements Condition {
  constructor(private name: string) {}

  toString(): string {
    return this.name.toLowerCase();
  }
}

export class Or implements Condition {
  constructor(private leftSide: Condition, private rightSide: Condition) {}

  toString(): string {
    return `(${this.leftSide.toString()} OR ${this.rightSide.toString()})`;
  }
}

export class And implements Condition {
  constructor(private leftSide: Condition, private rightSide: Condition) {}

  toString(): string {
    return `(${this.leftSide.toString()} AND ${this.rightSide.toString()})`;
  }
}

export class Not implements Condition {
  constructor(private condition: Condition) {}

  toString(): string {
    return `(NOT ${this.condition})`;
  }
}

export class In<T extends number | string> implements Condition {
  private set;
  constructor(...set: T[]) {
    this.set = set;
  }

  toString(): string {
    let str = `IN (`;
    this.set.forEach((el, index, arr) => {
      str += `${parseType(el)}${index === arr.length - 1 ? '' : ', '}`;
    });
    str += ')';
    return str;
  }
}

export class Between<T extends number | Date> implements Condition {
  constructor(private type: string, private from: T, private to: T) {}

  toString(): string {
    const dateType = this.from instanceof Date && this.to instanceof Date;
    return `${this.type} BETWEEN ${
      dateType
        ? `${this.type} '${dateToISOType(this.from as Date)}'`
        : this.from
    } AND ${
      dateType ? `${this.type} '${dateToISOType(this.to as Date)}'` : this.to
    }`;
  }
}

export class Equal<T extends number | string> implements Condition {
  constructor(private field: Field, private to: T) {}

  toString(): string {
    return `${this.field} = ${parseType(this.to)}`;
  }
}

export class NotEqual<T extends number | string> implements Condition {
  constructor(private field: Field, private to: T) {}

  toString(): string {
    return `${this.field} <> ${parseType(this.to)}`;
  }
}

export class Greater implements Condition {
  constructor(private field: Field, private to: number) {}

  toString(): string {
    return `${this.field} > ${this.to}`;
  }
}

export class GreaterOrEqual implements Condition {
  constructor(private field: Field, private to: number) {}

  toString(): string {
    return `${this.field} >= ${this.to}`;
  }
}

export class Less implements Condition {
  constructor(private field: Field, private to: number) {}

  toString(): string {
    return `${this.field} < ${this.to}`;
  }
}

export class LessOrEqual implements Condition {
  constructor(private field: Field, private to: number) {}

  toString(): string {
    return `${this.field} <= ${this.to}`;
  }
}

export class Like implements Condition {
  constructor(private field: Field, private pattern: string) {}

  toString(): string {
    return `${this.field} LIKE '${this.pattern}'`;
  }
}
