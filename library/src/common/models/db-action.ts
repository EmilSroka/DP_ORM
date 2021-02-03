import { Repository } from './repository';

export type DBAction = (repository: Repository) => Promise<any>;
