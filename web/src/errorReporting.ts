// ABOUTME: Starts Sentry error reporting when a DSN is configured for the build.
// ABOUTME: With no DSN the app runs normally with reporting switched off.
import * as Sentry from '@sentry/react';

export function initErrorReporting(dsn: string | undefined, environment: string): boolean {
  if (!dsn || !dsn.trim()) {
    return false;
  }

  Sentry.init({
    dsn,
    environment,
    tracesSampleRate: 0
  });

  return true;
}
