import { Component, OnInit } from '@angular/core';
import { FridgeConnectionService } from '../fridge-connection.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from 'src/assets/product';

@Component({
  selector: 'app-fridge-simulator',
  templateUrl: './fridge-simulator.component.html',
  styleUrls: ['./fridge-simulator.component.css']
})

export class FridgeSimulatorComponent implements OnInit 
{
  id : number;
  home_id : number;

  tempSensor: number;
  isOn : boolean;
  products : Product[];

  public connectionError: boolean;
  public errorMessage: string;
  public errorStatusText: string;
  
  
  constructor(private fridgeConn: FridgeConnectionService) 
  {
      this.id = 1;
      this.home_id = 1;

      this.tempSensor  = 12; // random temp
      this.isOn = true;

      let p1 = new Product(1,1,100,56, "2019-10-07"); 
      let p2 = new Product(2,2,500,456, "2019-07-12");

      this.products = [p1, p2];
      // send get request to server mit xml doc telling which products it has
  }


  ngOnInit() {
    this.products.forEach(element => {
      let pr = document.getElementById("products"); 
      let x = document.createElement("div");
      x.className = "prod";
      x.innerText = "ID: " + element.id +
      " Expire date: " + element.expire_date + "\n";
      pr.appendChild(x);
    });

    this.fridgeConn.isOn(this.id, this.isOn).subscribe(
      data => {
        // response?
      },

      error => {
        this.connectionError = true;
        if (this.connectionError) {
          let httpResponseError = <HttpErrorResponse>error;
          this.errorMessage = httpResponseError.error;
          this.errorStatusText = httpResponseError.statusText + ": " + httpResponseError.status;
        }
      }
    );

    this.fridgeConn.sendTemperature(this.id, this.tempSensor).subscribe(
      data => {
        // response?
      },

      error => {
        this.connectionError = true;
        if (this.connectionError) {
          let httpResponseError = <HttpErrorResponse>error;
          this.errorMessage = httpResponseError.error;
          this.errorStatusText = httpResponseError.statusText + ": " + httpResponseError.status;
        }
      }
    );

    // this.fridgeConn.sendProducts(this.id, this.products).add(
    //   data => {
    //     // response?
    //   },
    // );

    this.fridgeConn.sendProducts(this.id, this.products);
  }

}
