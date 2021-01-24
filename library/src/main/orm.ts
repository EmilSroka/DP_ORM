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
import { EntitySave } from '../mapping/save-mapper/entity-save';
import { SaveMapperFactory } from '../mapping/save-mapper/save-mapper-factory';
import { ConfigurationRunner } from '../configuration/configuration-runner';
import {
  Relationship,
  RelationshipDecorator,
} from '../configuration/decorators/relationship';
import {
  PrimaryKey,
  PrimaryKeyDecorator,
} from '../configuration/decorators/primary-key';

export class ORM {
  private readonly tables: Tables;
  private readonly relationships: Relationships;
  private readonly identityMap: IdentityMap;
  private readonly configRunner: ConfigurationRunner;
  public Attribute: AttributeDecorator;
  public Relationship: RelationshipDecorator;
  public PrimaryKey: PrimaryKeyDecorator;
  public Entity: EntityDecorator;
  public persistenceManager: PersistenceManager;

  constructor(private db: Database) {
    this.tables = new Tables();
    this.relationships = new Relationships();
    this.identityMap = new IdentityMap();
    this.configRunner = new ConfigurationRunner();
    this.Attribute = Attribute.bind(this, this.tables);
    this.Relationship = Relationship.bind(
      this,
      this.tables,
      this.relationships,
    );
    this.PrimaryKey = PrimaryKey.bind(this, this.tables);
    this.Entity = Entity.bind(this, this.configRunner, this.tables);
  }

  async initialize() {
    this.configRunner.run();
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
    const entitySaver = new EntitySave(this.tables, dbScheme, this.identityMap);

    this.persistenceManager = new PersistenceManager(
      this.identityMap,
      dbScheme,
      this.db,
      entityLoader,
      entitySaver,
    );

    entitySaver.pm = this.persistenceManager;
  }

  async close() {
    await this.db.disconnect();
  }
}
