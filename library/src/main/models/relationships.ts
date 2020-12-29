import { RelationshipType } from '../../common/models/field-types';

export interface Relationship {
  type: RelationshipType;
  fromTableName: string;
  toTableName: string;
}
