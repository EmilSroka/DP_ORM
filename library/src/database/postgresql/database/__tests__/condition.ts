import {
  columnFixture,
  conditionalOperatorsFixture,
  conditionalOperatorsNames,
  logicalOperatorsFixture,
  logicalOperatorsNames,
} from '../../../../fixtures/condition';

describe('Condition (composite design pattern)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should implement base class for column', () => {
    const { input, output, tested } = columnFixture;
    expect(new (tested as any)(input).toString()).toBe(output);
  });

  it.each(logicalOperatorsNames)(
    'should be implemented for %s logical operator',
    (operator) => {
      const { input, output, tested } = logicalOperatorsFixture[operator];
      for (let i = 0; i < input.length; i++) {
        const result = new (tested as any)(...input[i]).toString();
        expect(output[i].test(result)).toBeTruthy();
      }
    },
  );

  it.each(conditionalOperatorsNames)(
    'should be implemented for %s operator',
    (operator) => {
      const { input, output, tested } = conditionalOperatorsFixture[operator];
      for (let i = 0; i < input.length; i++) {
        const result = new (tested as any)(...input[i]).toString();
        expect(output[i].test(result)).toBeTruthy();
      }
    },
  );
});
