import { RelationshipType } from '../../common/models/field-types';

export type RelationshipConfiguration = Relationship | RelationshipManyToMany;

type Relationship = {
  type: RelationshipType.oneToMany | RelationshipType.oneToOne;
  with: any;
  columnName?: string;
};

type RelationshipManyToMany = {
  type: RelationshipType.manyToMany;
  with: {
    class: any;
    field: string;
    columnName?: string;
  };
  columnName?: string;
};

export function isManyToManySetting(
  config: RelationshipConfiguration,
): config is RelationshipManyToMany {
  return (config as RelationshipManyToMany).with.class !== undefined;
}
