export interface OptifineVersion {
	name: string;
	minecraft: string;
	forge: string;
	date: string;
	download: OptifineDownload;
}

export interface OptifineDownload {
	link: string;
	filename: string;
	token: string;
}
