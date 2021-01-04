export interface PostgreSQLConfiguration {
  connection: {
    user: string;
    database: string;
    password: string;
    host: string;
    port?: number;
  };
  create?: CreateDetails;
}

export interface CreateDetails {
  number?: { type: NumericType; precision: number; scale?: number };
  stringMaxSize?: number;
}

export type NumericType = 'float' | 'numeric';
