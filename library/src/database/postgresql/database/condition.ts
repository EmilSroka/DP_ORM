import { Condition } from '../model/condition';
import { typeFormat } from './type-format';

export type PossibleType = string | Date | number | boolean;

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

export class In<T extends PossibleType> implements Condition {
  constructor(private field: Field, private set: T[]) {}

  toString(): string {
    return `${this.field} IN (${this.set.map(typeFormat).join(', ')})`;
  }
}

export class NotIn<T extends PossibleType> implements Condition {
  constructor(private field: Field, private set: T[]) {}

  toString(): string {
    return `${this.field} NOT IN (${this.set.map(typeFormat).join(', ')})`;
  }
}

export class Between<T extends PossibleType> implements Condition {
  constructor(private field: Field, private from: T, private to: T) {}

  toString(): string {
    return `${this.field} BETWEEN ${typeFormat(this.from)} AND ${typeFormat(
      this.to,
    )}`;
  }
}

export class Equal<T extends PossibleType> implements Condition {
  constructor(private field: Field, private to: T) {}

  toString(): string {
    return `${this.field} = ${typeFormat(this.to)}`;
  }
}

export class NotEqual<T extends PossibleType> implements Condition {
  constructor(private field: Field, private to: T) {}

  toString(): string {
    return `${this.field} <> ${typeFormat(this.to)}`;
  }
}

export class Greater<T extends PossibleType> implements Condition {
  constructor(private field: Field, private to: T) {}

  toString(): string {
    return `${this.field} > ${typeFormat(this.to)}`;
  }
}

export class GreaterOrEqual<T extends PossibleType> implements Condition {
  constructor(private field: Field, private to: T) {}

  toString(): string {
    return `${this.field} >= ${typeFormat(this.to)}`;
  }
}

export class Less<T extends PossibleType> implements Condition {
  constructor(private field: Field, private to: number) {}

  toString(): string {
    return `${this.field} < ${typeFormat(this.to)}`;
  }
}

export class LessOrEqual<T extends PossibleType> implements Condition {
  constructor(private field: Field, private to: number) {}

  toString(): string {
    return `${this.field} <= ${typeFormat(this.to)}`;
  }
}

export class Like implements Condition {
  constructor(private field: Field, private pattern: string) {}

  toString(): string {
    return `${this.field} LIKE '${this.pattern}'`;
  }
}
