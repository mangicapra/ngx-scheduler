import {
	Component,
	OnInit,
	ViewChild,
	ElementRef,
	Input,
	Output,
	EventEmitter,
	ViewChildren,
	QueryList,
	ChangeDetectionStrategy,
	AfterViewInit,
	Inject,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { LibConfig } from './scheduler.config';
import { USER_OPTIONS } from './lib.config.token';

@Component({
	selector: 'ngx-scheduler',
	template: `
		<button
			*ngIf="libConfig?.showToday"
			class="scrollToToday"
			(click)="scrollToToday()"
		>
			Today
		</button>
		<div class="table">
			<div class="left">
				<div class="spacer"></div>
				<div
					*ngFor="let person of persons; trackBy: trackPersons"
					[ngStyle]="{
						height:
							person.data.length * 30 >= 60
								? (person?.data.length + 3) * 30 + 'px'
								: '100px'
					}"
					class="who"
				>
					<strong>{{ person?.name }}</strong>
					<br />
					<small [innerText]="person?.departments || ''"></small>
				</div>
			</div>
			<div #container class="right">
				<div class="header">
					<div
						*ngFor="let day of days; trackBy: trackMonths"
						class="headerData"
					>
						<div class="topData">
							<strong
								>{{
									showBy === 'day'
										? (day.month | date: 'MMM yyyy')
										: (day.month | date: 'yyyy')
								}}
							</strong>
						</div>
						<div class="bottomData">
							<div
								class="bottomData__title"
								*ngFor="let weekday of day?.weekDays; trackBy: trackDays"
								[class.today]="isToday(weekday)"
							>
								<strong>{{
									showBy === 'day'
										? (weekday | date: 'dd EEE')
										: (weekday | date: 'MMMM')
								}}</strong>
							</div>
						</div>
					</div>
				</div>
				<div>
					<div
						class="pos-rel"
						*ngFor="let person of persons; let i = index; trackBy: trackPersons"
					>
						<div *ngFor="let day of days; trackBy: trackMonths" class="body">
							<div
								class="bodyData"
								[ngStyle]="{
									height:
										person?.data.length * 30 >= 60
											? (person?.data.length + 3) * 30 + 'px'
											: '100px',
									'background-color': isToday(weekday)
										? 'rgba(241, 229, 188, .5)'
										: '#fff'
								}"
								*ngFor="let weekday of day?.weekDays; trackBy: trackDays"
							>
								<label
									class="projectLabel"
									*ngFor="let project of person?.data; trackBy: trackData"
								>
									<span
										[showTooltip]="libConfig?.showTooltip"
										[tooltip]="project?.description || ''"
										[placement]="placement"
										[delay]="delay"
										[ngStyle]="{ backgroundColor: project?.color }"
										*ngIf="calculateFromTo(project?.from, project?.to, weekday)"
										(click)="
											editInfo.emit({ person: person?.id, project: project })
										"
										>{{ project?.name }} {{ project?.hours }}</span
									>
								</label>
								<div
									#selectionDiv
									class="selectionDiv"
									(mousedown)="startSelect($event, weekday)"
									(mouseenter)="enter($event)"
									(mousemove)="reCalc($event)"
									(mouseup)="endSelect($event, weekday, person?.id)"
									[ngStyle]="{
										width: '100%',
										height:
											person.data.length * 30 >= 60
												? (person?.data.length + 3) * 30 -
												  person?.data.length * 30 +
												  'px'
												: 100 - person?.data.length * 30 + 'px'
									}"
								></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			* {
				box-sizing: border-box;
				border-collapse: collapse;
				-webkit-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
				user-select: none;
			}
			.table {
				border: 1px solid #d5d5d5;
				background-color: #f5f5f5;
				border-spacing: 0;
				display: flex;
			}
			.table .spacer {
				width: 300px;
				height: 70px;
				border: 1px solid #d5d5d5;
			}
			.table .who {
				height: 100px;
				padding: 8px 16px;
				border: 1px solid #d5d5d5;
				background-color: #fff;
			}
			.table .who strong {
				font-size: 16px;
				color: #1a1a1a;
			}

			.table .right {
				overflow-x: auto;
				overflow-y: hidden;
			}
			.table .right .header {
				display: flex;
			}
			.table .right .header .topData {
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
				border-right: 1px solid #d5d5d5;
				border-left: 1px solid #d5d5d5;
			}
			.table .right .header .bottomData {
				height: 30px;
				display: flex;
			}
			.table .right .header .bottomData__title {
				font-size: 12px;
				font-weight: 600;
				color: #1a1a1a;
				border: 1px solid #d5d5d5;
				width: 100px;
				min-width: 100px;
				padding: 9px;
				text-align: left;
			}

			.pos-rel {
				display: flex;
			}
			.selected {
				background-color: #f7f9fa;
				border-bottom: 2px solid #dce2e6;
				border-top: 2px solid #dce2e6;
				border-left-color: transparent;
				border-right-color: transparent;
			}
			.selected:first-of-type {
				border-left-color: #dce2e6;
			}
			.body {
				display: flex;
				position: relative;
			}
			.bodyData {
				background-color: #fff;
				border: 1px solid #d5d5d5;
				height: 100px;
				width: 100px;
				min-width: 100px;
			}
			.projectLabel {
				position: relative;
				margin-bottom: 5px;
				display: block;
				height: 25px;
				-webkit-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
				user-select: none;
			}
			.projectLabel span {
				color: #fff;
				width: 100%;
				display: block;
				padding: 5px;
				font-size: 12px;
				-webkit-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
				user-select: none;
			}
			.today {
				background-color: rgba(241, 229, 188, 0.5);
			}
			.scrollToToday {
				background: #f2f0eb 0% 0% no-repeat padding-box;
				border-radius: 4px;
				border: 0;
				height: 36px;
				display: flex;
				align-items: center;
				justify-content: center;
				letter-spacing: 0px;
				color: #27241d;
				font-size: 14px;
				line-height: 21px;
				padding: 0 15px;
				margin-bottom: 10px;
			}

			.ng-tooltip {
				position: absolute;
				max-width: 150px;
				font-size: 14px;
				text-align: center;
				color: #f8f8f2;
				padding: 3px 8px;
				background: #282a36;
				border-radius: 4px;
				z-index: 1000;
				opacity: 0;
			}
			.ng-tooltip:after {
				content: '';
				position: absolute;
				border-style: solid;
			}
			.ng-tooltip-top:after {
				top: 100%;
				left: 50%;
				margin-left: -5px;
				border-width: 5px;
				border-color: black transparent transparent transparent;
			}
			.ng-tooltip-bottom:after {
				bottom: 100%;
				left: 50%;
				margin-left: -5px;
				border-width: 5px;
				border-color: transparent transparent black transparent;
			}
			.ng-tooltip-left:after {
				top: 50%;
				left: 100%;
				margin-top: -5px;
				border-width: 5px;
				border-color: transparent transparent transparent black;
			}
			.ng-tooltip-right:after {
				top: 50%;
				right: 100%;
				margin-top: -5px;
				border-width: 5px;
				border-color: transparent black transparent transparent;
			}
			.ng-tooltip-show {
				opacity: 1;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulerComponent implements OnInit, AfterViewInit, OnChanges {
	days: Day[];
	isSelecting = false;
	@ViewChild('container', null) container: ElementRef;
	startDay: Date;
	@Input() persons: Person[];
	@Input() showBy: ShowBy;
	@Input() delay: number;
	@Input() placement: Placement;
	@Output() finishedSelecting = new EventEmitter();
	@Output() editInfo = new EventEmitter();
	@ViewChildren('selectionDiv') selections: QueryList<any>;

	constructor(
		@Inject(USER_OPTIONS) public libConfig: LibConfig,
		private elementRef: ElementRef
	) {}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.showBy) {
			this.generateAllDates();
		}
	}

	ngOnInit() {}

	ngAfterViewInit(): void {
		this.scrollToToday();
	}

	generateAllDates(): void {
		const CURRENT_MONTH = new Date().getMonth();
		const CURRENT_YEAR = new Date().getFullYear();

		const MONTHS_IN_PAST = this.libConfig.monthsInPast || 4;
		const MONTHS_IN_FUTURE = this.libConfig.monthsInFuture || 12;

		let pastMonth =
			CURRENT_MONTH - MONTHS_IN_PAST < 0
				? CURRENT_MONTH - MONTHS_IN_PAST + 12
				: CURRENT_MONTH - MONTHS_IN_PAST;
		let pastYear = pastMonth >= 9 ? CURRENT_YEAR - 1 : CURRENT_YEAR;

		const TO_DATE = this.calculateToDate(
			CURRENT_YEAR,
			CURRENT_MONTH,
			MONTHS_IN_FUTURE
		);

		const DATEOBJ = [];
		while (pastYear <= TO_DATE.getFullYear()) {
			const FRAME =
				pastYear === TO_DATE.getFullYear() ? TO_DATE.getMonth() : 11;
			if (this.showBy === 'day') {
				for (let index = pastMonth; index <= FRAME; index++) {
					DATEOBJ.push({
						month: new Date(Date.UTC(pastYear, pastMonth, 1)),
						weekDays: this.generateDates(pastYear, pastMonth),
					});
					pastMonth = pastMonth === 11 ? 0 : pastMonth + 1;
				}
			} else {
				DATEOBJ.push({
					month: new Date(Date.UTC(pastYear, pastMonth, 1)),
					weekDays: this.generateMonths(pastYear, pastMonth, FRAME),
				});
				for (let index = pastMonth; index <= FRAME; index++) {
					pastMonth = pastMonth === 11 ? 0 : pastMonth + 1;
				}
			}
			pastYear += 1;
		}
		this.days = DATEOBJ;
	}

	calculateToDate(year, month, toMonths): Date {
		const NEW_MONTH =
			month + toMonths > 12 ? (month + toMonths) % 12 : month + toMonths;
		const ADD_TO_YEAR =
			month + toMonths > 12 ? Math.floor((month + toMonths) / 12) : 0;

		return new Date(Date.UTC(year + ADD_TO_YEAR, NEW_MONTH, 1));
	}

	generateDates(year, month): Date[] {
		const DATEOBJ = new Date(Date.UTC(year, month, 1));
		const WEEKDAYS = [];

		while (DATEOBJ.getMonth() === month) {
			WEEKDAYS.push(new Date(DATEOBJ));
			DATEOBJ.setDate(DATEOBJ.getDate() + 1);
		}

		return WEEKDAYS;
	}

	calculateFromTo(start, end, current): boolean {
		const FROM = new Date(start);
		const TO = new Date(end);
		const CHECK = new Date(current);
		if (this.showBy === 'day') {
			return (
				CHECK >= FROM &&
				CHECK <= TO &&
				!this.libConfig.skipDays.includes(CHECK.getDay())
			);
		}
		return CHECK >= FROM && CHECK <= TO;
	}

	enter(ev): void {
		if (this.isSelecting) {
			if (ev.target.classList.contains('selected')) {
				ev.target.classList.remove('selected');
				if (
					ev.target.parentNode.nextSibling.lastChild.classList.contains(
						'selected'
					)
				) {
					ev.target.parentNode.nextSibling.lastChild.classList.remove(
						'selected'
					);
				}
			} else {
				ev.target.classList.add('selected');
				if (
					!ev.target.parentNode.previousSibling.lastChild.classList.contains(
						'selected'
					)
				) {
					ev.target.parentNode.previousSibling.lastChild.classList.add(
						'selected'
					);
				}
			}
		}
	}

	startSelect(ev, day): void {
		// tslint:disable-next-line:curly
		if (ev.button !== 0) return;
		this.isSelecting = true;
		ev.target.classList.add('selected');
		this.startDay = day;
	}

	endSelect(ev, endDay, user) {
		// tslint:disable-next-line:curly
		if (ev.button !== 0) return;
		ev.target.classList.add('selected');
		this.isSelecting = false;
		this.selections.forEach((el) =>
			el.nativeElement.classList.remove('selected')
		);
		const DATA = {
			endDay: (endDay as Date).toISOString(),
			user,
			startDay: this.startDay.toISOString(),
		};
		this.finishedSelecting.emit(DATA);
	}

	reCalc(ev): void {
		if (this.isSelecting) {
			const RECT = this.container.nativeElement.getBoundingClientRect();
			const X = ev.clientX - RECT.left;
			if (X > 1000) {
				this.container.nativeElement.scrollLeft += 40;
			}
		}
	}

	scrollToToday(): void {
		const ELEM = this.elementRef.nativeElement.querySelector(
			'.bottomData__title.today'
		) as HTMLElement;
		ELEM.scrollIntoView();
	}

	generateMonths(year: number, month: number, toMonth: number): Date[] {
		let counter = month;
		let months = [];
		while (counter <= toMonth) {
			(<Date[]>months) = [...months, new Date(Date.UTC(year, counter, 1))];
			counter++;
		}
		return months;
	}

	isToday(day): boolean {
		return new Date(day).toDateString() === new Date().toDateString();
	}

	trackPersons(index: number, el: any): number {
		return el.id;
	}

	trackMonths(index: number): number {
		return index;
	}

	trackDays(index: number): number {
		return index;
	}

	trackData(index: number, el: any): number {
		return el.id;
	}
}

export interface Day {
	month: Date;
	weekDays: Date[];
}

export interface Person {
	id: number;
	name: string;
	departments: string[];
	data: Project[];
}

export interface Project {
	id: number;
	name: string;
	color: string;
	from: Date;
	to: Date;
	hours: string;
	description: string;
}

export type ShowBy = 'month' | 'day';

export type Placement = 'top' | 'bottom' | 'left' | 'right';
