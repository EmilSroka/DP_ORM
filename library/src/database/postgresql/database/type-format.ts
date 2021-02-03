import { PossibleType } from './condition';
import { dateToISOType } from '../../../utils/date';

export function typeFormat(data: PossibleType): string {
  if (typeof data === 'string') return `'${data}'`;
  if (typeof data === 'object') return `date '${dateToISOType(data)}'`;

  return data.toString();
}
