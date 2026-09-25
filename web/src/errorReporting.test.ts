// ABOUTME: Tests the decision to start error reporting and what it is configured with.
// ABOUTME: The Sentry client is stubbed; only our own gating logic is under test.
import * as Sentry from '@sentry/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { initErrorReporting } from './errorReporting';

vi.mock('@sentry/react', () => ({ init: vi.fn() }));

beforeEach(() => {
  vi.mocked(Sentry.init).mockClear();
});

test('stays off when no dsn is configured', () => {
  expect(initErrorReporting(undefined, 'production')).toBe(false);
  expect(Sentry.init).not.toHaveBeenCalled();
});

test('stays off when the dsn is blank', () => {
  expect(initErrorReporting('   ', 'production')).toBe(false);
  expect(Sentry.init).not.toHaveBeenCalled();
});

test('starts and reports the environment when a dsn is configured', () => {
  expect(initErrorReporting('https://key@example.test/1', 'production')).toBe(true);
  expect(Sentry.init).toHaveBeenCalledWith(
    expect.objectContaining({ dsn: 'https://key@example.test/1', environment: 'production' })
  );
});
