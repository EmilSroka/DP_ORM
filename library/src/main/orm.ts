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

export class ORM {
  private readonly tables: Tables;
  private readonly relationships: Relationships;
  public Attribute: AttributeDecorator;
  public Entity: EntityDecorator;

  constructor(private db: Database) {
    this.tables = new Tables();
    this.relationships = new Relationships();
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
    return this.db.transaction(actions);
  }
}
