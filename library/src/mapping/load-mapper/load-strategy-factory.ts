import { RelationshipType } from '../../common/models/field-types';
import { LoadStrategy } from './models/load-strategy';
import { OneToOneStrategy } from './one-to-one-strategy';
import { OneToManyStrategy } from './one-to-many-strategy';
import { ManyToManyStrategy } from './many-to-many-strategy';

export type LoadStrategyIdentifier = RelationshipType;

export class LoadStrategyFactory {
  static get(strategy: LoadStrategyIdentifier): LoadStrategy {
    switch (strategy) {
      case RelationshipType.oneToOne:
        return new OneToOneStrategy();
      case RelationshipType.oneToMany:
        return new OneToManyStrategy();
      case RelationshipType.manyToMany:
        return new ManyToManyStrategy();
    }
  }
}
