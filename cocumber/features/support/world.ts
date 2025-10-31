import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";
import {
  MockRegistries,
  createMockRegistries,
  resetMockRegistries
} from "./mockers";

export interface ScenarioContext {
  lastUploadId?: string;
  lastQuizRequestId?: string;
  lastResponsePayload?: Record<string, unknown>;
}

export class McqWorld extends World {
  public context: ScenarioContext;
  public registry: MockRegistries;

  constructor(options: IWorldOptions) {
    super(options);
    this.registry = createMockRegistries();
    this.context = this.buildDefaultContext();
  }

  buildDefaultContext(): ScenarioContext {
    return {
      lastUploadId: undefined,
      lastQuizRequestId: undefined,
      lastResponsePayload: undefined
    };
  }

  resetContext(): void {
    resetMockRegistries(this.registry);
    this.context = this.buildDefaultContext();
  }

  captureResponse(payload: Record<string, unknown>): void {
    this.context.lastResponsePayload = payload;
  }
}

setWorldConstructor(McqWorld);
