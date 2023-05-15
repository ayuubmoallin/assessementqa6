const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });


  
  test("clicking the Draw button displays the div with id 'choices'", async () => {
    await driver.get("http://localhost:8000");
    // finding the draw button
    const drawButton = await driver.findElement(By.id("draw"));

    // cliking button
    await drawButton.click();

    // expected bot choices div
    const choicesDiv = await driver.findElement(By.id("choices"));
    const divIsVisible = await choicesDiv.isDisplayed();
    expect(divIsVisible).toBe(true);
  });

  test("clicking an 'Add to Duo' button displays the div with id 'player-duo'", async () => {
    await driver.get("http://localhost:8000");
    await driver.findElement(By.id("draw")).click();
    await driver.findElement(By.className("bot-btn")).click();
    await driver.findElement(By.id("player-duo"));
    const isCardVisible = await playerDuoDiv.isDisplayed();
    expect(isCardVisible).toBe(true);
  });
});