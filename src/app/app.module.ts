// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts'; // Import NgxChartsModule
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { AppComponent } from './app.component';
import { TimeEntryService } from './time-entry.service'; // Import your service

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule, // Add HttpClientModule
    NgxChartsModule   // Add NgxChartsModule
  ],
  providers: [TimeEntryService], // Add your service to providers
  bootstrap: [AppComponent]
})
export class AppModule {}
