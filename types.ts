export interface OptifineVersion {
	name: string;
	minecraft: string;
	forge: string;
	date: string;
	preview: boolean;
	download: OptifineDownload;
}

export interface OptifineDownload {
	link: string;
	filename: string;
	token: string;
}

export interface APIResponse {
	lastUpdate: number;
	latest: OptifineVersion;
	latestPre: OptifineVersion;
	versions: {
		[key: string]: OptifineVersion[];
	}
	all: OptifineVersion[];
}
