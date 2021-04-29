import puppeteer from 'puppeteer';

var browser = await puppeteer.launch();
var page = await browser.newPage();

await page.goto("https://optifine.net/downloads", { waitUntil: 'domcontentloaded' });

var html = await page.content();
console.log(html);

await browser.close();

