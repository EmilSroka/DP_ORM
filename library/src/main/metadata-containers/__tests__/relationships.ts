import { Relationships } from '../relationships';
import {
  relationshipOneToManyFixture,
  relationshipsFixture,
  relationshipsManyToManyFixture,
  relationshipsOneToOneFixture,
} from '../../../fixtures/relationship';
import { RelationshipType } from '../../../common/models/field-types';

describe('Relationships (container)', () => {
  let relationships: Relationships;

  beforeEach(() => {
    relationships = new Relationships();
    relationshipsFixture.forEach((relationship) => {
      relationships.add(relationship);
    });
  });

  it('should allow to get all relationships', () => {
    expect(relationships.get()).toEqual(relationshipsFixture);
  });

  it('should allow to get all relationships of given type', () => {
    expect(relationships.getByType(RelationshipType.oneToMany)).toEqual(
      relationshipOneToManyFixture,
    );
    expect(relationships.getByType(RelationshipType.oneToOne)).toEqual(
      relationshipsOneToOneFixture,
    );
    expect(relationships.getByType(RelationshipType.manyToMany)).toEqual(
      relationshipsManyToManyFixture,
    );
  });

  it('should allow to check if table of given name is a detail table (target in one to one relationship)', () => {
    expect(
      relationships.isDetailTable(relationshipsOneToOneFixture[0].toTable),
    ).toBeTruthy();
    expect(
      relationships.isDetailTable(relationshipsOneToOneFixture[0].fromTable),
    ).toBeFalsy();
  });

  it('should allow to check if table of given name is in n relationship', () => {
    expect(
      relationships.isToNTable(relationshipsManyToManyFixture[0].toTable),
    ).toBeTruthy();
    expect(
      relationships.isDetailTable(relationshipsManyToManyFixture[0].fromTable),
    ).toBeTruthy();
    expect(
      relationships.isDetailTable(relationshipOneToManyFixture[2].fromTable),
    ).toBeFalsy();
    expect(
      relationships.isDetailTable(relationshipOneToManyFixture[2].toTable),
    ).toBeTruthy();
    expect(
      relationships.isDetailTable(relationshipsOneToOneFixture[0].toTable),
    ).toBeFalsy();
  });
});
