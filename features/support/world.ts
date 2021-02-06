import { setWorldConstructor } from "@cucumber/cucumber";
import { Browser } from "puppeteer/lib/cjs/puppeteer/common/Browser";
import { Page } from "puppeteer/lib/cjs/puppeteer/common/Page";
import puppeteer from "puppeteer/lib/cjs/puppeteer/node-puppeteer-core";

export class CustomWorld {
  browser: Browser;
  page: Page;

  constructor() {}
}

setWorldConstructor(CustomWorld);
