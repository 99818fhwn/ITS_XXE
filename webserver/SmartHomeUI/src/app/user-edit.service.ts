import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReturnStatement } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class UserEditService {

  constructor(private http: HttpClient) { }

  public getUsers() {
    return this.http.get('http://localhost:4200/mainpage/users', { responseType: 'text' });
  }

  public deleteUser(userid: string) {
    return this.http.delete('http://localhost:4200/mainpage/users/delete/' + userid, { responseType: 'text' });
  }

  public getProducts() {
    return this.http.get('http://localhost:4200/mainpage/products', { responseType: 'text' });
  }

  public getLights() {
    return this.http.get('http://localhost:4200/mainpage/lights', { responseType: 'text' });
  }

  public patchLight(light, is_on) {
    return this.http.get('http://localhost:4200/mainpage/light/' + light + '.' + is_on, { responseType: 'text' });
  }

  public getFridges() {
    return this.http.get('http://localhost:4200/mainpage/fridges', { responseType: 'text' });
  }

  public patchFridgeOn(fridge_id, is_on) {
    return this.http.get('http://localhost:4200/mainpage/fridge/' + fridge_id + '.' + is_on, { responseType: 'text' });
  }

  public patchFridgeTemp(fridge_id, temp) {
    return this.http.get('http://localhost:4200/mainpage/fridget/' + fridge_id + '.' + temp, { responseType: 'text' });
  }
}