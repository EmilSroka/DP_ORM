import { RelationshipType } from '../../common/models/field-types';

export interface Relationship {
  type: RelationshipType;
  fromTable: string;
  toTable: string;
}
