import { AuthEffects } from './auth/store/auth.effects';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {StoreModule} from "@ngrx/store";

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core.module";
import * as fromApp from './store/app.reducer';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
    imports: [
      StoreModule.forRoot(fromApp.appReducer),
      EffectsModule.forRoot([AuthEffects]),
      BrowserModule,
      HttpClientModule,
      AppRoutingModule,
      SharedModule,
      CoreModule,
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
