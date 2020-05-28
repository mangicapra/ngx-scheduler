import { Project } from './project';

export interface Person {
	id: number;
	name: string;
	departments?: string[];
	data: Project[];
}
