import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent {
	title = 'scheduler-example';

	persons = [
		{
			id: 1,
			name: 'Dragan Dejanovic',
			departments: ['Frontend', 'Backend'],
			data: [
				{
					id: 10,
					name: 'lorisQ',
					color: 'red',
					hours: '/ 8h',
					from: '2019-08-03T08:00:00Z',
					to: '2020-03-11T08:00:00Z',
					description: 'test details',
				},
				{
					id: 11,
					name: 'mogree',
					color: 'blue',
					hours: '/ 8h',
					from: '2019-10-03T08:00:00Z',
					to: '2020-01-01T08:00:00Z',
					description: 'another details',
				},
			],
		},
		{
			id: 2,
			name: 'Mirko Novakovic',
			data: [
				{
					id: 12,
					name: 'mogree',
					color: 'blue',
					hours: '/ 8h',
					from: '2019-10-03T08:00:00Z',
					to: '2020-01-01T08:00:00Z',
				},
			],
		},
		{
			id: 3,
			name: 'Milan Desancic',
			departments: ['Backend'],
			data: [
				{
					id: 13,
					name: 'dvc',
					color: '#42b983',
					from: '2019-05-01T08:00:00Z',
					to: '2021-02-01T08:00:00Z',
					description: 'test details',
				},
			],
		},
	];

	endSelecting(ev) {
		console.log(ev);
	}

	handleEdit(ev) {
		console.log(ev);
	}
}
