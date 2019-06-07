import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import * as loginLandingPageComponent from './login-landing-page/login-landing-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';


const routes: Routes = [
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }),
    FormsModule, ReactiveFormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
