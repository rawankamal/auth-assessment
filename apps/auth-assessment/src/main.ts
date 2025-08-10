import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot(appRoutes),
      HttpClientModule  
    )
  ]
}).catch(err => console.error(err));
