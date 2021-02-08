import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  setDefaultTimeout,
  Status,
} from "@cucumber/cucumber";
import { CustomWorld } from "./world";

setDefaultTimeout(50000);

Before(async function (this: CustomWorld) {
  await this.init();
  await this.cleanup();
});

After(async function (this: CustomWorld, scenario) {
  if (scenario.result.status === Status.FAILED) {
    const screenShotName = scenario.pickle.name.replace(/[\W_]+/g, "-");
    await this.takeScreenshot(screenShotName);
  }

  await this.close();
});


