import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { UserViewModel } from 'src/assets/UserViewModel';
import { FormsModule } from "@angular/forms";
import { UserEditService } from '../user-edit.service';
import { Router } from '@angular/router';
import { Product } from 'src/assets/product';
import { LightViewModel } from 'src/assets/LightViewModel';
import { dashCaseToCamelCase } from '@angular/animations/browser/src/util';
import { FridgeViewModel } from 'src/assets/FridgeViewModel';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  constructor(private usereditservice: UserEditService, private router: Router) { }

  public username: string;
  public isadmin: number;
  private userInfo;
  public users: UserViewModel[] = [];
  public products: Product[] = [];
  public lights: LightViewModel[] = [];
  public fridges: FridgeViewModel[] = [];
  //public tempvalue: Number;

  ngOnInit() {

    this.userInfo = JSON.parse(localStorage.getItem("currentUser"));

    if (this.userInfo == null) {
      this.router.navigate(['/login']);
      return;
    }

    this.username = this.userInfo.name;
    this.isadmin = this.userInfo.isadmin;

    this.usereditservice.getUsers().subscribe(
      data => {
        this.users = <UserViewModel[]>JSON.parse(data);
      }
    );

    this.usereditservice.getProducts().subscribe(
      data => {
        this.products = <Product[]>JSON.parse(data);
      }
    );

    this.usereditservice.getLights().subscribe(
      data => {
        this.lights = <LightViewModel[]>JSON.parse(data);
      }
    );

    this.usereditservice.getFridges().subscribe(
      data => {
        this.fridges = <FridgeViewModel[]>JSON.parse(data);
      }
    )
  }

  public remove(user: UserViewModel) {

    console.log("Remove requested:" + user.name);

    var index = this.users.indexOf(user, 0);
    if (index > -1) {
      this.users.splice(index, 1);
      this.usereditservice.deleteUser(user.id).subscribe(
        data => {
          console.log(data);
        }
      );
    }
  }

  public order(amount: Number) {
    console.log("Try ordering?");
    return;
  }

  public changeFridgeTemp(fridge: FridgeViewModel) {
    console.log(fridge);
    var temp = +fridge.temperatur;
    if (temp >= 0 && temp <= 20) {
      this.usereditservice.patchFridgeTemp(fridge.fridge_id, temp).subscribe(
        data => {
          fridge.temperatur = data;
          console.log(data);
        }
      );
    }
  }

  public fridgeOnOff(fride: FridgeViewModel) {

    if (fride.is_on == '1') {
      this.usereditservice.patchFridgeOn(fride.fridge_id, 0).subscribe(
        data => {
          fride.is_on = '0';
          console.log(data);
        }
      );
    }
    else {
      this.usereditservice.patchFridgeOn(fride.fridge_id, 1).subscribe(
        data => {
          fride.is_on = '1';
          console.log(data);
        }
      );
    }
  }

  public flickSwitch(light: LightViewModel) {

    if (light.is_on == '1') {
      this.usereditservice.patchLight(light.id, 0).subscribe(
        data => {
          light.is_on = '0';
          console.log(data);
        }
      );
    }
    else {
      this.usereditservice.patchLight(light.id, 1).subscribe(
        data => {
          light.is_on = '1';
          console.log(data);
        }
      );
    }
  }
}
