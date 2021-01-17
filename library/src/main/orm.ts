import { Tables } from './metadata-containers/tables';
import { Relationships } from './metadata-containers/relationships';
import { Database } from '../common/models/database';
import { TableConstructor } from '../mapping/table-mapper/table-constructor';
import { PostgresqlRepository } from '../database/postgresql/database/postgresql-repository';
import {
  Attribute,
  AttributeDecorator,
} from '../configuration/decorators/attribute';
import { Entity, EntityDecorator } from '../configuration/decorators/entity';
import { PersistenceManager } from './persistence-manager';
import { IdentityMap } from './metadata-containers/identity-map';
import { EntityLoader } from '../mapping/load-mapper/entity-loader';

export class ORM {
  private readonly tables: Tables;
  private readonly relationships: Relationships;
  private readonly identityMap: IdentityMap;
  public Attribute: AttributeDecorator;
  public Entity: EntityDecorator;
  public persistenceManager: PersistenceManager;

  constructor(private db: Database) {
    this.tables = new Tables();
    this.relationships = new Relationships();
    this.identityMap = new IdentityMap();
    this.Attribute = Attribute.bind(this, this.tables, this.relationships);
    this.Entity = Entity.bind(this, this.tables);
  }

  async initialize() {
    await this.db.connect();
    const tc = new TableConstructor(this.tables, this.relationships);
    const dbScheme = tc.getDatabaseScheme();
    const actions = dbScheme.map(
      (scheme) => async (repo: PostgresqlRepository) => {
        if (!(await repo.tableExist(scheme.name))) {
          await repo.create(scheme);
        }
        return true;
      },
    );
    await this.db.transaction(actions);
    const entityLoader = new EntityLoader(
      this.tables,
      dbScheme,
      this.identityMap,
    );

    this.persistenceManager = new PersistenceManager(
      this.identityMap,
      dbScheme,
      this.db,
      entityLoader,
    );
  }
}
