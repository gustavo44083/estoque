import { setWorldConstructor } from "@cucumber/cucumber";
import { Connection } from "mysql2";
import fetch, { RequestInit, Response } from "node-fetch";
import { Browser } from "puppeteer/lib/cjs/puppeteer/common/Browser";
import { Page, WaitForOptions } from "puppeteer/lib/cjs/puppeteer/common/Page";
import puppeteer from "puppeteer/lib/cjs/puppeteer/node-puppeteer-core";
import * as mysql from "mysql2";

const defaultParameters = {
  headless: true,
  backend: "http://localhost:3000/api/v1",
  frontend: "http://localhost:8080",
  database: "mysql://root:password@localhost:3306/estoque",
};

export class CustomWorld {
  private parameters: typeof defaultParameters;
  private databaseConnection: Connection;
  browser: Browser;
  page: Page;

  constructor({ parameters }) {
    this.parameters = { ...defaultParameters, ...parameters };
  }

  async init() {
    await this.close();
    this.databaseConnection = mysql.createConnection(this.parameters.database);
    this.browser = await puppeteer.launch({
      headless: this.parameters.headless,
    });
    this.page = await this.browser.newPage();
  }

  async request(
    path: string,
    method: string = "GET",
    data?: any
  ): Promise<Response> {
    let init: RequestInit = { method: method };
    if (data) {
      init = {
        ...init,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
    }

    return fetch(`${this.parameters.backend}${path}`, init).then(
      async (response) => {
        if (!response.ok) {
          throw new Error(
            `${response.statusText}: ${JSON.stringify(await response.json())}`
          );
        }

        return response;
      }
    );
  }

  async navigateTo(path: string, options?: WaitForOptions) {
    return this.page.goto(`${this.parameters.frontend}${path}`, options);
  }

  async cleanup() {
    await this.databaseConnection.execute("DELETE FROM product");
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);
