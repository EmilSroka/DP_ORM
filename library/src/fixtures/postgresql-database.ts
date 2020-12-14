export const actionFixture = [
  jest.fn(async () => true),
  jest.fn(async () => true),
  jest.fn(async () => true),
  jest.fn(async () => true),
];

export const actionFailFixture = [
  jest.fn(async () => true),
  jest.fn(async () => true),
  jest.fn(async () => false),
  jest.fn(async () => true),
];

export const actionFailByRejectionFixture = [
  jest.fn(async () => true),
  jest.fn(async () => true),
  jest.fn(async () => Promise.reject()),
  jest.fn(async () => true),
];
