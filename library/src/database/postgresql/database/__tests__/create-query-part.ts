import {
  AbstractCreateQueryPart,
  AutoincrementCreateQueryPart,
  BooleanCreateQueryPart,
  CreateQueryPartFactory,
  DateCreateQueryPart,
  NumberCreateQueryPart,
  StringCreateQueryPart,
} from '../create-query-part';
import { Column } from '../../../../common/models/database-schema';
import {
  createSettingsBaseFixture,
  createSettingsCustomFixture,
  createSettingsCustomOutputsFixture,
  createSettingsOutputsFixture,
  factoryFixture,
  queryBaseInputFixture,
  queryBaseOutputFixture,
  queryForeignKeyInputFixture,
  queryForeignKeyOutputFixture,
} from '../../../../fixtures/create-query-part';
import { CreateDetails } from '../../model/configuration';

describe('Concrete CreateQueryPart', () => {
  jest.clearAllMocks();

  it('should implement getType method that return string representation of type (based on settings)', () => {
    const createQueryParts = [
      BooleanCreateQueryPart,
      NumberCreateQueryPart,
      StringCreateQueryPart,
      DateCreateQueryPart,
      AutoincrementCreateQueryPart,
    ];
    const withDefaultSettings = createQueryParts.map(
      (Constructor) => new Constructor({} as Column, createSettingsBaseFixture),
    );
    const withCustomSettings = createQueryParts.map(
      (Constructor) =>
        new Constructor({} as Column, createSettingsCustomFixture),
    );

    for (let i = 0; i < withDefaultSettings.length; i++) {
      expect(withDefaultSettings[i].getType()).toBe(
        createSettingsOutputsFixture[i],
      );
    }

    for (let i = 0; i < withDefaultSettings.length; i++) {
      expect(withCustomSettings[i].getType()).toBe(
        createSettingsCustomOutputsFixture[i],
      );
    }
  });
});

describe('AbstractCreateQueryPart', () => {
  jest.clearAllMocks();

  it('should implement get method that return string representation of query part for given column', () => {
    const MockClass = class extends AbstractCreateQueryPart {
      constructor(input) {
        super(input, {} as CreateDetails);
      }

      getType(): string {
        return 'type';
      }
    };

    const baseResult = new MockClass(queryBaseInputFixture).getPart();
    const foreignKeyResult = new MockClass(
      queryForeignKeyInputFixture,
    ).getPart();

    {
      const { columnName, parts } = queryBaseOutputFixture;
      for (const part of parts) {
        const regex = RegExp(`${columnName}.*${part}`);
        expect(regex.test(baseResult)).toBeTruthy();
      }
    }
    {
      const { columnName, parts } = queryForeignKeyOutputFixture;
      for (const part of parts) {
        const regex = RegExp(`${columnName}.*${part}`);
        expect(regex.test(foreignKeyResult)).toBeTruthy();
      }
    }
  });
});

describe('CreateQueryPartFactory method get', () => {
  jest.clearAllMocks();

  it('should return proper CreateQueryPart instance based on input', () => {
    const factory = new CreateQueryPartFactory({} as CreateDetails);
    for (const [input, type] of factoryFixture) {
      expect(factory.get(input)).toBeInstanceOf(type);
    }
  });

  it('should pass settings to CreateQueryParts', () => {
    const factory = new CreateQueryPartFactory({
      flag: 'settings',
    } as CreateDetails);
    for (const [input] of factoryFixture) {
      expect((factory.get(input) as any).settings.flag).toEqual('settings');
    }
  });
});
