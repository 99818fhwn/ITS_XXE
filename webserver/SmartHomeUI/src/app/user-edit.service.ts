import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserEditService {

  constructor(private http: HttpClient) { }

  public getUsers() {
    return this.http.get('http://localhost:4200/mainpage/users', { responseType: 'text' });
  }
}
