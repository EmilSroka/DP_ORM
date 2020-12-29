import { Relationship } from '../main/models/relationships';
import { RelationshipType } from '../common/models/field-types';

export const relationshipOneToManyFixture: Relationship[] = [
  { type: RelationshipType.oneToMany, fromTableName: 't1', toTableName: 't2' },
  { type: RelationshipType.oneToMany, fromTableName: 't3', toTableName: 't2' },
  { type: RelationshipType.oneToMany, fromTableName: 't4', toTableName: 't2' },
];

export const relationshipsManyToManyFixture: Relationship[] = [
  { type: RelationshipType.manyToMany, fromTableName: 't1', toTableName: 't6' },
];

export const relationshipsOneToOneFixture: Relationship[] = [
  { type: RelationshipType.oneToOne, fromTableName: 't4', toTableName: 't5' },
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
