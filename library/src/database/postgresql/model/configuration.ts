export interface PostgreSQLConfiguration {
  connection: {
    user: string;
    database: string;
    password: string;
    host: string;
    port?: number;
  };
}
