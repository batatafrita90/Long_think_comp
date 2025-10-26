import '@testing-library/jest-dom';

process.env.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
process.env.NEXT_PUBLIC_METRICS_SERVICE_URL = process.env.NEXT_PUBLIC_METRICS_SERVICE_URL ?? process.env.NEXT_PUBLIC_API_URL;
process.env.NEXT_PUBLIC_SESSION_SERVICE_URL = process.env.NEXT_PUBLIC_SESSION_SERVICE_URL ?? process.env.NEXT_PUBLIC_API_URL;

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof global.ResizeObserver === 'undefined') {
  // @ts-ignore
  global.ResizeObserver = MockResizeObserver;
}
