import { Before, BeforeAll } from '@cucumber/cucumber';
import puppeteer from 'puppeteer/lib/cjs/puppeteer/node-puppeteer-core';
import { CustomWorld } from './world';

const browser = await puppeteer.launch();

BeforeAll(async function() {

  this.page = await this.browser.newPage();
})

Before(async function(this: CustomWorld) {
  this.page =
})
