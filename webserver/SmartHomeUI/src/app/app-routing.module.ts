import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { FridgeSimulatorComponent } from './fridge-simulator/fridge-simulator.component';

const routes: Routes = [
{
    path: "home",
    component: AppComponent
},
{
  path: "fridge-simulator",
  component: FridgeSimulatorComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
