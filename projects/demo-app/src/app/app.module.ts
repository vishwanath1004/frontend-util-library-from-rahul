import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Import your library module
import { GenericChartModule } from 'projects/generic-chart/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GenericChartModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
