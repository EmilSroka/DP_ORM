import { Relationships } from '../relationships';
import {
  mapFixture,
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

  it('should allow to check if table of given name has foreign key', () => {
    expect(
      relationships.hasForeignKey(relationshipsOneToOneFixture[0].toTableName),
    ).toBeTruthy();
    expect(
      relationships.hasForeignKey(relationshipOneToManyFixture[0].toTableName),
    ).toBeTruthy();
    expect(
      relationships.hasForeignKey(
        relationshipOneToManyFixture[0].fromTableName,
      ),
    ).toBeFalsy();
  });

  it('should allow to get names of tables associated with table of passed name', () => {
    for (const [tableName, associatedTableNames] of Object.entries(
      mapFixture,
    )) {
      expect(relationships.getAssociatedTablesNames(tableName)).toEqual(
        associatedTableNames,
      );
    }
  });
});
