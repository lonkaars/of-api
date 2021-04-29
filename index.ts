import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

import * as types from './types';

var browser = await puppeteer.launch();
var page = await browser.newPage();

await page.goto("https://optifine.net/downloads", { waitUntil: 'domcontentloaded' });

var html = await page.content();

await browser.close();

var $ = cheerio.load(html);

var versions: types.OptifineVersion[] = [];
$("td.content span.downloads .downloadLine").each((i, el) => {
	var downloadLinkPre = $(el).find(".colMirror a").attr("href");
	var version: types.OptifineVersion = {
		name: $(el).find(".colFile").text(),
		minecraft: downloadLinkPre.match(/1\.\d{1,2}(\.\d{1,2})?/)[0],
		forge: $(el).find(".colForge").text().toLowerCase().replace("forge", "").trim(),
		date: $(el).find(".colDate").text(),
		preview: downloadLinkPre.toLowerCase().includes("preview"),
		download: {
			link: downloadLinkPre,
			token: "",
			filename: downloadLinkPre.match(/OptiFine.+?\.jar/).toString()
		}
	}
	versions.push(version);
});

var minecraftVersions = {};
var latest: types.OptifineVersion;
var latestPre: types.OptifineVersion;
for(var version of versions) {
	if (typeof minecraftVersions[version.minecraft] === "undefined")
		minecraftVersions[version.minecraft] = [];
	minecraftVersions[version.minecraft].push(version);

	if (!latest && version.preview == false)
		latest = version;
	if (!latestPre && version.preview == true)
		latestPre = version;
}

var response: types.APIResponse = {
	lastUpdate: Date.now(),
	all: versions,
	versions: minecraftVersions,
	latest,
	latestPre
}

console.log(JSON.stringify(response));

