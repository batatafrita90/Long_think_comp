export interface MockRegistries {
  uploads: Array<Record<string, unknown>>;
  publishedEvents: string[];
  reviewerLogs: string[];
}

export const createMockRegistries = (): MockRegistries => ({
  uploads: [],
  publishedEvents: [],
  reviewerLogs: []
});

export const resetMockRegistries = (registry: MockRegistries): void => {
  registry.uploads.length = 0;
  registry.publishedEvents.length = 0;
  registry.reviewerLogs.length = 0;
};
