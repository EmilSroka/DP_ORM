import { RelationshipType } from '../../common/models/field-types';
import { SaveStrategy } from './models/save-strategy';
import { OneToOneSaveStrategy } from './one-to-one-strategy';
import { OneToManySaveStrategy } from './one-to-many-strategy';
import { ManyToManySaveStrategy } from './many-to-many-strategy';

export type SaveStrategyIdentifier = RelationshipType;

export class SaveMapperFactory {
  static get(strategy: SaveStrategyIdentifier): SaveStrategy {
    switch (strategy) {
      case RelationshipType.oneToOne:
        return new OneToOneSaveStrategy();
      case RelationshipType.oneToMany:
        return new OneToManySaveStrategy();
      case RelationshipType.manyToMany:
        return new ManyToManySaveStrategy();
    }
  }
}
