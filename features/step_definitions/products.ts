import { Given, Then, When } from "@cucumber/cucumber";
import DataTable from "@cucumber/cucumber/lib/models/data_table";
import * as expect from "expect";
import { ElementHandle } from "puppeteer/lib/cjs/puppeteer/common/JSHandle";
import { Page } from "puppeteer/lib/cjs/puppeteer/common/Page";
import { EvaluateFn } from "puppeteer/lib/esm/puppeteer/common/EvalTypes";
import { CustomWorld } from "../support/world";

const checkRegistered = (expected: boolean) =>
  async function (this: CustomWorld, sku: string) {
    const product = await findProduct(this, sku);
    expect(Boolean(product)).toBe(expected);
  };

async function findProduct(world: CustomWorld, sku: string) {
  const response = await world.request(`/products?limit=50&search=${sku}`);
  const data = await response.json();
  return data.products.find((p) => p.sku == sku);
}

async function searchSku(page: Page, sku: string) {
  const input = await page.$("div[data-section=Search] input");
  return Promise.all([
    page.waitForResponse((response) => response.request().url().includes(sku)),
    clearAndType(input, sku),
  ]);
}

async function clickSku(page: Page, sku: string) {
  await searchSku(page, sku);
  await Promise.all([
    page.click(".MuiListItem-root"),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);
}

async function findInputByLabel(
  page: Page,
  label: string
): Promise<ElementHandle<HTMLInputElement>> {
  return page.$(
    `.MuiFormControl-root[data-label=${label.replace(/ /g, "_")}] input`
  );
}

async function clearAndType(
  target: ElementHandle<HTMLInputElement>,
  text: string
) {
  await target.evaluate<EvaluateFn<HTMLInputElement>>(
    (node) => (node.value = "")
  );
  await target.type(text);
}

Given("que há um produto de SKU {string} cadastrado", checkRegistered(true));

Given(
  "que não há um produto de SKU {string} cadastrado",
  checkRegistered(false)
);

Then(
  "o produto de SKU {string} deve ser cadastrado com sucesso",
  checkRegistered(true)
);

Given("os seguintes produtos cadastrados:", async function (
  this: CustomWorld,
  table: DataTable
) {
  await Promise.all(
    table.hashes().map((row) =>
      this.request("/products", "POST", {
        title: row["Título"],
        sku: row["SKU"],
        price: Number(row["Valor unitário"]),
        stock: Number(row["Estoque"]),
      })
    )
  );
});

Given("que o título do produto de SKU {string} é {string}", async function (
  this: CustomWorld,
  sku: string,
  title: string
) {
  const product = await findProduct(this, sku);
  expect(product.title).toBe(title);
});

When("clicar no produto de SKU {string}", async function (
  this: CustomWorld,
  sku: string
) {
  await this.navigateTo("/");
  await clickSku(this.page, sku);
});

When("clicar no botão de adicionar um novo produto", async function (
  this: CustomWorld
) {
  await this.navigateTo("/");
  await Promise.all([
    this.page.click("#root .MuiFab-root"),
    this.page.waitForNavigation(),
  ]);
});

When("preencher os seguintes dados do produto:", async function (
  this: CustomWorld,
  table: DataTable
) {
  const rawTable = table.raw();
  for (let index in rawTable[0]) {
    const input = await findInputByLabel(this.page, rawTable[0][index]);
    await clearAndType(input, rawTable[1][index]);
  }
});

When("salvar o produto", async function (this: CustomWorld) {
  await Promise.all([
    this.page.click("button[type=submit]"),
    this.page.waitForNavigation(),
  ]);
});

When("alterar o título para {string}", async function (
  this: CustomWorld,
  title: string
) {
  const input = await findInputByLabel(this.page, "Título");
  await clearAndType(input, title);
});

When("alterar o estoque para {int}", async function (
  this: CustomWorld,
  stock: number
) {
  const input = await findInputByLabel(this.page, "Estoque");
  await clearAndType(input, stock.toString());
});

When("selecionar o produto de SKU {string}", async function (
  this: CustomWorld,
  sku: string
) {
  await this.navigateTo("/");
  await this.page.click(
    `.MuiListItem-root[data-sku=${sku}]~.MuiListItemSecondaryAction-root > span`
  );
});

When("clicar no botão de deletar produtos", async function (this: CustomWorld) {
  await Promise.all([
    this.page.waitForResponse(
      (request) => request.request().method() === "DELETE"
    ),
    this.page.click("div[data-section=SelectionMenu] > button"),
  ]);
});

Then("o título do produto de SKU {string} deve ser {string}", async function (
  this: CustomWorld,
  sku: string,
  title: string
) {
  await this.navigateTo("/", { waitUntil: "networkidle0" });
  await searchSku(this.page, sku);
  const currentTitle = await this.page.$eval(
    ".MuiListItem-root span",
    (element) => element.innerHTML
  );

  expect(currentTitle).toBe(title);
});

Then("o usuário deve ver o produto de nome {string} na lista", async function (
  this: CustomWorld,
  title: string
) {
  await this.navigateTo("/", { waitUntil: "networkidle0" });
  const productData = await this.page.$$eval(
    ".MuiListItem-secondaryAction > div",
    (elements) =>
      elements.map((el) => ({
        title: el.querySelector("span").innerText,
        description: el.querySelector("p").innerText,
      }))
  );

  expect(productData.filter((p) => p.title == title)).toHaveLength(1);
});

Then("o estoque do produto de SKU {string} deve ser de {int}", async function (
  this: CustomWorld,
  sku: string,
  stock: number
) {
  await clickSku(this.page, sku);
  const input = await findInputByLabel(this.page, "Estoque");
  const value = await input.evaluate((element) => (element as any).value);
  expect(value).toBe(stock.toString());
});

Then("o produto de SKU {string} não deve ser mostrado", async function (
  this: CustomWorld,
  sku: string
) {
  await searchSku(this.page, sku);
  const text = await this.page.$eval(
    "#root > div > div:nth-child(2) > span",
    (element) => element.innerHTML
  );

  expect(text).toContain("Nenhum produto");
});
