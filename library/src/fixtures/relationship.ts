import { Relationship } from '../main/models/relationships';
import { RelationshipType } from '../common/models/field-types';

export const relationshipOneToManyFixture: Relationship[] = [
  { type: RelationshipType.oneToMany, fromTable: 't1', toTable: 't2' },
  { type: RelationshipType.oneToMany, fromTable: 't3', toTable: 't2' },
  { type: RelationshipType.oneToMany, fromTable: 't4', toTable: 't2' },
];

export const relationshipsManyToManyFixture: Relationship[] = [
  { type: RelationshipType.manyToMany, fromTable: 't1', toTable: 't6' },
];

export const relationshipsOneToOneFixture: Relationship[] = [
  { type: RelationshipType.oneToOne, fromTable: 't4', toTable: 't5' },
];

export const relationshipsFixture: Relationship[] = [
  ...relationshipOneToManyFixture,
  ...relationshipsManyToManyFixture,
  ...relationshipsOneToOneFixture,
];

export const mapFixture: {
  [key: string]: string[];
} = {
  t1: ['t2'],
  t2: [],
  t3: ['t2'],
  t4: ['t2', 't5'],
  t5: [],
};
