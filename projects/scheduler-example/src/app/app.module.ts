import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SchedulerModule, LibConfig } from 'scheduler';

import { AppComponent } from './app.component';

const CONFIG: LibConfig = {
	showTooltip: true,
	showToday: true,
	monthsInPast: 5,
	monthsInFuture: 10,
	skipDays: [0, 6],
};

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, SchedulerModule.forRoot(CONFIG)],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
