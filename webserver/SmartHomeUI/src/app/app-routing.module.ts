import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { FridgeSimulatorComponent } from './fridge-simulator/fridge-simulator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as loginLandingPageComponent from './login-landing-page/login-landing-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { XEEHackerComponent } from './xeehacker/xeehacker.component';

const routes: Routes = [
  {
    path: "home",
    component: AppComponent
  },
  {
    path: "fridge-simulator",
    component: FridgeSimulatorComponent
  },
  {
    path: "",
    component: loginLandingPageComponent.LoginLandingPageComponent
  },
  {
    path: "login",
    component: loginLandingPageComponent.LoginLandingPageComponent
  },
  {
    path: "register",
    component: RegisterPageComponent
  },
  {
    path: "mainpage",
    component: MainpageComponent
  },
  {
    path: "hack",
    component: XEEHackerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }),
    FormsModule, ReactiveFormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
