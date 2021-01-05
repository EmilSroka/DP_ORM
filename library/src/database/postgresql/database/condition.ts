import { Condition } from '../model/condition';

// TODO:
// implement all toString methods
// idea is to use composite design pattern to create condition for SQL queries (query part after WHERE key word)
// for more info check fixtures/condition.ts

export class Field implements Condition {
  constructor(private name: string) {}

  toString(): string {
    return '';
  }
}

export class Or implements Condition {
  constructor(private leftSide: Condition, private rightSide: Condition) {}

  toString(): string {
    return '';
  }
}

export class And implements Condition {
  constructor(private leftSide: Condition, private rightSide: Condition) {}

  toString(): string {
    return '';
  }
}

export class Not implements Condition {
  constructor(private condition: Condition) {}

  toString(): string {
    return '';
  }
}

export class In<T extends number | string> implements Condition {
  constructor(private set: T[]) {}

  toString(): string {
    return '';
  }
}

export class Between<T extends number | Date> implements Condition {
  constructor(private from: T, private to: T) {}

  toString(): string {
    return '';
  }
}

export class Equal<T extends number | string> implements Condition {
  constructor(private field: Field, private to: T) {}

  toString(): string {
    return '';
  }
}

export class NotEqual<T extends number | string> implements Condition {
  constructor(private field: Field, private to: T) {}

  toString(): string {
    return '';
  }
}

export class Greater implements Condition {
  constructor(private field: Field, private to: number) {}

  toString(): string {
    return '';
  }
}

export class GreaterOrEqual implements Condition {
  constructor(private field: Field, private to: number) {}

  toString(): string {
    return '';
  }
}

export class Less implements Condition {
  constructor(private field: Field, private to: number) {}

  toString(): string {
    return '';
  }
}

export class LessOrEqual implements Condition {
  constructor(private field: Field, private to: number) {}

  toString(): string {
    return '';
  }
}

export class Like implements Condition {
  constructor(private field: Field, private pattern: string) {}

  toString(): string {
    return '';
  }
}
