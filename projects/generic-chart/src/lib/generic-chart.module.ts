import { NgModule } from '@angular/core';
import { GenericChartComponent } from './generic-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    GenericChartComponent,
    BarChartComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GenericChartComponent,
    BarChartComponent
  ]
})
export class GenericChartModule { }
