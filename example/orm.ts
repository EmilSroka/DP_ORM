import ORM from 'dp-orm';
import {PostgresqlDatabase} from "dp-orm/dist/database/postgresql/database/postgresql-database";

const db = new PostgresqlDatabase({
  connection: {
    user: "postgres",
    password: "",
    host: "localhost",
    port: 5432,
    database: "postgres",
  }
});

const ormInstance = new ORM(db);

export default ormInstance;