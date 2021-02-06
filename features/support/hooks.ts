import { After, AfterAll, Before, BeforeAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { CustomWorld } from "./world";

setDefaultTimeout(90000)

BeforeAll(async function () {

});

Before(async function(this: CustomWorld) {
  await this.init()
  await this.cleanup()
})

After(async function(this: CustomWorld, scenario){
  await this.cleanup()
  await this.close()
});

AfterAll(async function(this: CustomWorld) {

});
