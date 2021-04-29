import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

import { OptifineVersion } from './types';

var browser = await puppeteer.launch();
var page = await browser.newPage();

await page.goto("https://optifine.net/downloads", { waitUntil: 'domcontentloaded' });

var html = await page.content();

await browser.close();

var $ = cheerio.load(html);

var versions: OptifineVersion[] = [];
$("td.content span.downloads .downloadLine").each((i, el) => {
	var downloadLinkPre = $(el).find(".colMirror a").attr("href");
	var version: OptifineVersion = {
		name: $(el).find(".colFile").text(),
		minecraft: downloadLinkPre.match(/1\.\d{1,2}(\.\d{1,2})?/)[0],
		forge: $(el).find(".colForge").text().toLowerCase().replace("forge", "").trim(),
		date: $(el).find(".colDate").text(),
		download: {
			link: downloadLinkPre,
			token: "",
			filename: downloadLinkPre.match(/OptiFine.+?\.jar/).toString()
		}
	}
	versions.push(version);
});

console.log(versions);

