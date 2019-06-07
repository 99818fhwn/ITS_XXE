import { Component, OnInit } from '@angular/core';

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
  
  
  constructor() 
  {
      this.id = 1;
      this.home_id = 1;

      this.tempSensor  = 12; // random temp
      this.isOn = true;

      let p1 = new Product(1,1,100,56, new Date("2019-10-07")); 
      let p2 = new Product(2,2,500,456, new Date("2019-07-12"));

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
  }

}

class Product
{
    id : number;
    fridge_id : number;
    start_weight : number;
    current_weight : number;
    expire_date : Date;

    constructor(id : number, fridge_id : number, 
      start_weight : number, current_weight : number, expire_date : Date) 
    {
      this.id = id;
      this.fridge_id = fridge_id;
      this.start_weight = start_weight;
      this.current_weight = current_weight;
      this.expire_date = expire_date;
    }
}
