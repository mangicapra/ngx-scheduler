import { NgModule, ModuleWithProviders } from '@angular/core';
import { SchedulerComponent } from './scheduler.component';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from './tooltip.directive';
import { USER_OPTIONS } from './lib.config.token';
import { OverlayModule } from '@angular/cdk/overlay';
import { LibConfig } from './interfaces';

@NgModule({
	declarations: [SchedulerComponent, TooltipDirective],
	imports: [CommonModule, OverlayModule],
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
