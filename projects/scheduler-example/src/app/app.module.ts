import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SchedulerModule } from 'scheduler';

import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		SchedulerModule.forRoot({
			showTooltip: true,
			showToday: true,
			monthsInPast: 5,
			monthsInFuture: 10,
		}),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
