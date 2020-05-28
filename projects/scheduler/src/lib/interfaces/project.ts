export interface Project {
	id: number;
	name: string;
	color: string;
	from: Date | string;
	to: Date | string;
	hours?: string;
	description?: string;
	includeDays: Date[] | string[];
	excludeDays: Date[] | string[];
}
