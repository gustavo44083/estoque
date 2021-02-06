import { Given, Then, When } from "@cucumber/cucumber";
import DataTable from "@cucumber/cucumber/lib/models/data_table";
import * as expect from "expect";
import { CustomWorld } from "../support/world";

const checkRegistered = (expected: boolean) =>
  async function (this: CustomWorld, sku: string) {
    const isRegistered = await isProductRegistered(this, sku);
    expect(isRegistered).toBe(expected);
  };

async function isProductRegistered(world: CustomWorld, sku: string) {
  const response = await world.request(`/products?limit=50&search=${sku}`);
  const data = await response.json();

  const products = data.products.filter((p) => p.sku == sku);
  return products.length > 0;
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
  const promises = table.hashes().map((row) => {
    return this.request("/products", "POST", {
      title: row["Título"],
      sku: row["SKU"],
      stock: Number(row["Estoque"]),
    });
  });

  await Promise.all(promises);
});

When("clicar no botão de adicionar um novo produto", async function (
  this: CustomWorld
) {
  await this.navigateTo("/");
  await Promise.all([
    this.page.waitForNavigation(),
    this.page.click("#root .MuiFab-root"),
  ]);
});

When("preencher os seguintes dados do produto:", async function (
  this: CustomWorld,
  table: DataTable
) {
  const rawTable = table.raw();
  for (let index in rawTable[0]) {
    await this.page.type(
      `.MuiFormControl-root[data-label=${rawTable[0][index]}] input`,
      rawTable[1][index]
    );
  }
});

When("salvar o produto", async function (this: CustomWorld) {
  await Promise.all([
    this.page.waitForNavigation(),
    this.page.click("button[type=submit]"),
  ]);
});

When("selecionar o produto de SKU {string}", function (sku: string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

When("clicar no botão de deletar produtos", function () {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

Then("o usuário deve ver o produto de nome {string} na lista", async function (
  this: CustomWorld,
  title: string
) {
  await this.navigateTo("/", {waitUntil: 'networkidle0'});
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
