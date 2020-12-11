import { Relationship } from '../main/models/relationships';
import { RelationshipType } from '../common/models/field-types';

export const relationshipsFixture: Relationship[] = [
  { type: RelationshipType.oneToMany, fromTable: 't1', toTable: 't2' },
  { type: RelationshipType.oneToMany, fromTable: 't3', toTable: 't2' },
  { type: RelationshipType.oneToMany, fromTable: 't4', toTable: 't2' },
  { type: RelationshipType.oneToOne, fromTable: 't4', toTable: 't5' },
  { type: RelationshipType.manyToMany, fromTable: 't1', toTable: 't6' },
];

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
