import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { SchedulerComponent } from './scheduler.component';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from './tooltip.directive';
import { LibConfig } from './scheduler.config';
import { USER_OPTIONS } from './lib.config.token';

@NgModule({
	declarations: [SchedulerComponent, TooltipDirective],
	imports: [CommonModule],
	exports: [SchedulerComponent, TooltipDirective],
})
export class SchedulerModule {
	static forRoot(libConfig?: LibConfig): ModuleWithProviders<SchedulerModule> {
		return {
			ngModule: SchedulerModule,
			providers: [
				{
					provide: USER_OPTIONS,
					useValue: libConfig,
				},
			],
		};
	}
}
