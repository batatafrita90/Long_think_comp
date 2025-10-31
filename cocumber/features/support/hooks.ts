import { After, Before, setDefaultTimeout } from "@cucumber/cucumber";
import { McqWorld } from "./world";

setDefaultTimeout(60 * 1000);

Before(function (this: McqWorld) {
  this.resetContext();
});

After(function (this: McqWorld) {
  this.resetContext();
});
