### Dependencies

`@angular/cdk`

`@angular/cdk/overlay-prebuilt.css`

### Setup

`npm install --save ngx-scheduler @angular/cdk`

import `SchedulerModule`

```typescript
import { SchedulerModule } from 'scheduler';

const CONFIG = {
    		showTooltip: true,
			showToday: true,
			monthsInPast: 5,
			monthsInFuture: 10,
			skipDays: [0, 6],
};

@NgModule({
  //...
  imports: [SchedulerModule.forRoot(CONFIG)]
  //...
})
```

import css file in your `styles.css`:

```css
@import '~@angular/cdk/overlay-prebuilt.css';
```

## Config options

|      Name      |   Type   | Default |                                                      Description                                                       |
| :------------: | :------: | :-----: | :--------------------------------------------------------------------------------------------------------------------: |
|  showTooltip   | boolean  |  false  |                                            shows optional tooltip on hover                                             |
|   showToday    | boolean  |  false  |                                       display button which will show today's day                                       |
|  monthsInPast  |  number  |    4    |                                     how much months in the past will be displayed                                      |
| monthsInFuture |  number  |   12    |                                    how much months in the future will be displayed                                     |
|    skipDays    | number[] | [0, 6]  | which days will be skipped: 0 - Sunday, 1 - Monday, 2 - Tuesday, 3 - Wednesday, 4 - Thursday, 5 - Friday, 6 - Saturday |

## Usage

In your component add `<ngx-scheduler></ngx-scheduler>`

#### List of component inputs

|        Name        |   Type   |                                              Description                                               |
| :----------------: | :------: | :----------------------------------------------------------------------------------------------------: |
|     [persons]      | Person[] | List of data that you want to display, below will be shown example of how that object should look like |
|      [showBy]      |  string  |                     How to display table, there are two options: `'day' | 'month'`                     |
|    [placement]     |  string  |                      Placement of tooltip: `'top' | 'bottom' | 'left' | 'right'`                       |
|      [delay]       |  number  |                                     Delay between tooltip display                                      |
| [todayButtonLabel] |  string  |                                  Label for button, default is 'Today'                                  |
|   [dayOffLabel]    |  string  |                                 Label of day off, default is 'Day off'                                 |

#### List of component outputs

|        Name         |                               Description                               |
| :-----------------: | :---------------------------------------------------------------------: |
| (finishedSelecting) |             Dispatch object with userid, startday i endday              |
|     (editInfo)      | Dispatch object with userid and whole data object that you wish to edit |
|    (excludedDay)    |          Dispatch object with userid, data object and weekday           |
|    (includedDay)    |          Dispatch object with userid, data object and weekday           |

### Person interface

When sending data you must send predefined fields:

```typescript
		persons: Person[] = [{
			id: 1,
			name: 'Tom Tompson',
			departments: ['Frontend', 'Backend'],
			data: [
				{
					id: 10,
					name: 'Google',
					color: 'red',
					hours: '/ 8h',
					from: '2019-08-03T08:00:00Z',
					to: '2020-03-11T08:00:00Z',
					description: 'Tooltip info',
					includeDays: [],
					excludeDays: [],
				},
				{
					id: 11,
					name: 'Facebook',
					color: '#28a745',
					hours: '/ 8h',
					from: '2019-08-03T08:00:00Z',
					to: '2020-03-11T08:00:00Z',
					description: 'Tooltip info - extra',
					includeDays: [],
					excludeDays: [],
				}
				...
			]
		},
		...
		]
```

`departments`, `hours` and `description` are optional. When working with `(excludedDay)` and `(includedDay)` you should manualy set that day to corresponding array and also remove it from other.

```typescript
	handleExclude(ev) {
		const { user, project, weekday } = ev;
		this.persons = this.persons.map((person) => {
			if (person.id === user) {
				person.data.forEach((proj) => {
					if (proj.id === project.id) {
						if (proj.includeDays.includes(weekday)) {
							proj.includeDays = proj.includeDays.filter(
								(el) => el !== weekday
							);
						}
						proj.excludeDays.push(weekday);
					}
				});
			}
			return person;
		});
	}
```

To select day range click on one cell and drag in one direction, if by accident you end up in a different row nothing will happen since package tracks start row.

### Licence

MIT
