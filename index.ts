import cheerio from 'cheerio';
import axios from 'axios';
import { writeFile } from 'fs';
import { promisify } from 'util';

var writeFileAsync = promisify(writeFile);

import * as types from './types';

async function getPageHTML(url: string) {
	var response = await axios(url)
	return response.data
}

var html = await getPageHTML('https://optifine.net/downloads');

var $ = cheerio.load(html);

var versions: types.OptifineVersion[] = [];
var downloads = $('td.content span.downloads .downloadLine');
var downloadCount = downloads.length;
downloads.each(async (i, el) => {
	var downloadLinkPre = $(el).find('.colMirror a').attr('href').replace("http", "https");
	var downloadPageHTML = await getPageHTML(downloadLinkPre);
	var d$ = cheerio.load(downloadPageHTML);
	var link = "https://optifine.net/" + d$("#Download .downloadButton a").attr("href");
	var version: types.OptifineVersion = {
		name: $(el).find(".colFile").text(),
		minecraft: downloadLinkPre.match(/1\.\d{1,2}(\.\d{1,2})?/)[0],
		forge: $(el).find('.colForge').text().toLowerCase().replace('forge', '').trim(),
		date: $(el).find('.colDate').text(),
		preview: downloadLinkPre.toLowerCase().includes('preview'),
		download: {
			link,
			token: link.match(/(?<=x=).+/)[0],
			filename: downloadLinkPre.match(/OptiFine.+?\.jar/).toString()
		}
	}
	versions.push(version);
	if( i == downloadCount - 1 ) {
		versions = versions.sort((a, b) => {
			var dateFormat = /(\d{2})\.(\d{2})\.(\d{4})/;
			var aR = a.date.match(dateFormat);
			var bR = b.date.match(dateFormat);
			return ( new Date(Number(bR[3]), Number(bR[2]) - 1, Number(bR[1])).getTime() ) -
				   ( new Date(Number(aR[3]), Number(aR[2]) - 1, Number(aR[1])).getTime() );
		});

		var minecraftVersions = {};
		var latest: types.OptifineVersion;
		var latestPre: types.OptifineVersion;
		for(var version of versions) {
			if (typeof minecraftVersions[version.minecraft] === "undefined")
				minecraftVersions[version.minecraft] = [];
			minecraftVersions[version.minecraft].push(version);

			if (!latest && version.preview == false) {
				latest = version;
				await writeFileAsync("./out/latest", JSON.stringify(version));
			}
			if (!latestPre && version.preview == true) {
				latestPre = version;
				await writeFileAsync("./out/latestPre", JSON.stringify(version));
			}
		}

		for(var mcVersion in minecraftVersions) {
			await writeFileAsync("./out/" + mcVersion, JSON.stringify(minecraftVersions[mcVersion]));
		}

		var response: types.APIResponse = {
			lastUpdate: Date.now(),
			all: versions,
			versions: minecraftVersions,
			latest,
			latestPre
		}

		await writeFileAsync("./out/all", JSON.stringify(response));
	}
});

