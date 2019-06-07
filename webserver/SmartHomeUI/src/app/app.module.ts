import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FridgeSimulatorComponent } from './fridge-simulator/fridge-simulator.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { TokenInterceptorService } from './tokeninterceptor.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginLandingPageComponent } from './login-landing-page/login-landing-page.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    LoginLandingPageComponent,
    RegisterPageComponent,
    FridgeSimulatorComponent
  ]
})
export class AppModule { }
