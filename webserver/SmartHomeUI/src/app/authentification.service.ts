import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthentificationService {

  constructor(private http: HttpClient) { }

  public login(username: string, password: string) {
    return this.http.get('http://localhost:4200/login/' + username + '.' + password, { responseType: 'text' });
  }

  public register(username: string, password: string) {
    return this.http.get('http://localhost:4200/register/' + username + '.' + password, { responseType: 'text' });
  }

  public revalidateToken(token: string) {
    return this.http.get('http://localhost:4200/revalidate/' + token, { responseType: 'text' });
  }

  public logout() {
    return this.http.get('http://localhost:4200/logout/', { responseType: 'text' });
  }
}