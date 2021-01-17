import ORM from 'dp-orm';
import {PostgresqlDatabase} from "dp-orm/dist/database/postgresql/database/postgresql-database";

const db = new PostgresqlDatabase({
  connection: {
    user: "",
    password: "",
    host: "",
    port: 5432,
    database: "",
  }
});

const ormInstance = new ORM(db);

export default ormInstance;