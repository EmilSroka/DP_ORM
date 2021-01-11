import { Condition } from '../database/postgresql/model/condition';
import {
  And,
  Between,
  Equal,
  Field,
  Greater,
  GreaterOrEqual,
  In,
  Less,
  LessOrEqual,
  Like,
  Not,
  NotEqual,
  Or,
} from '../database/postgresql/database/condition';

type Operator = {
  input: any[][];
  output: RegExp[];
  tested: Condition;
};

export const logicalOperatorsNames = ['OR', 'AND', 'NOT'];

export const logicalOperatorsFixture: { [key: string]: Operator } = {
  OR: {
    input: [[{ toString: () => 'leftPart' }, { toString: () => 'rightPart' }]],
    output: [/\( ?leftPart OR rightPart ?\)/],
    tested: Or,
  },
  AND: {
    input: [[{ toString: () => 'leftPart' }, { toString: () => 'rightPart' }]],
    output: [/\( ?leftPart AND rightPart ?\)/],
    tested: And,
  },
  NOT: {
    input: [[{ toString: () => 'condition' }]],
    output: [/\( ?NOT condition ?\)/],
    tested: Not,
  },
};

export const conditionalOperatorsNames = [
  'IN',
  'BETWEEN',
  '=',
  '<>',
  '>',
  '>=',
  '<',
  '<=',
  'LIKE',
];

export const conditionalOperatorsFixture: { [key: string]: Operator } = {
  IN: {
    input: [
      [46, 57],
      ['val1', 'val2'],
    ],
    output: [/IN \(46, ?57\)/, /IN \('val1', ?'val2'\)/],
    tested: In,
  },
  BETWEEN: {
    input: [
      [{ toString: () => 'money' }, 46, 57],
      [
        { toString: () => 'date' },
        new Date(2013, 11, 2),
        new Date(2013, 11, 7),
      ],
    ],
    output: [
      /money BETWEEN 46 AND 57/,
      /date BETWEEN date '2013-12-01' AND date '2013-12-06'/,
    ],
    tested: Between,
  },
  '=': {
    input: [
      [{ toString: () => 'city' }, 'Krakow'],
      [{ toString: () => 'money' }, 32],
    ],
    output: [/city ?= ?'Krakow'/, /money ?= ?32/],
    tested: Equal,
  },
  '<>': {
    input: [
      [{ toString: () => 'city' }, 'Krakow'],
      [{ toString: () => 'money' }, 32],
    ],
    output: [/city ?<> ?'Krakow'/, /money ?<> ?32/],
    tested: NotEqual,
  },
  '>': {
    input: [[{ toString: () => 'money' }, 16]],
    output: [/money ?> ?16/],
    tested: Greater,
  },
  '>=': {
    input: [[{ toString: () => 'money' }, 16]],
    output: [/money ?>= ?16/],
    tested: GreaterOrEqual,
  },
  '<': {
    input: [[{ toString: () => 'money' }, 12]],
    output: [/money ?< ?12/],
    tested: Less,
  },
  '<=': {
    input: [[{ toString: () => 'money' }, 69]],
    output: [/money ?<= ?69/],
    tested: LessOrEqual,
  },
  LIKE: {
    input: [[{ toString: () => 'name' }, 'S%']],
    output: [/name LIKE 'S%'/],
    tested: Like,
  },
};

export const columnFixture = {
  input: 'name',
  output: 'name',
  tested: Field,
};
