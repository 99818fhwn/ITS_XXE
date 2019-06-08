import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from 'src/assets/product';
//import { BrowserModule } from '@angular/platform-browser'; 
//import { HttpModule } from '@angular/http';
//import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FridgeConnectionService {

  constructor(private http: HttpClient) { }

  public sendTemperature(fridgeid: number, temp : number) {
    return this.http.get('http://localhost:4200/setTemperature/' + fridgeid +'.' + temp, 
    { responseType: 'text' });
  }

  public isOn(fridgeid: number, isOn : boolean) {
    return this.http.get('http://localhost:4200/isOn/' + fridgeid +'.' + isOn, 
    { responseType: 'text' });
  }

  public sendProducts(fridgeid: number, products : Product[]) {
    // return this.http.get('http://localhost:4200/products/' + products, 
    // { responseType: XMLDocument });
      // Set your HttpHeaders to ask for XML.

     /* const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/xml', //<- To SEND XML
          'Accept':  'application/xml',       //<- To ask for XML
          'Response-Type': 'text'             //<- b/c Angular understands text
        })
      };
      const postedData = `
        <id>1</id>
        <expire_date>title here</expire_date>
        <body>body text</body>`;
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type': 'text/xml');
        headers = headers.append('Accept', 'text/xml');*/

        const httpOptions = {
          headers: new HttpHeaders({
            contentType:  'text/xml', //<- To SEND XML
            accept:  'text/xml',       //<- To ask for XML
            responseType: 'text'             //<- b/c Angular understands text
          })
        };

        let body = '<?xml version = "1.0" encoding="UTF-8" standalone="yes"?><root>';

        products.forEach(product => 
        {
          body += `<product><id>
          ${product.id}</id><fridge_id>
          ${product.fridge_id}</fridge_id><start_weight>
          ${product.start_weight}</start_weight><current_weight>
          ${product.current_weight}</current_weight><expire_date>
          ${product.expire_date}</expire_date></product>`;
          });

          body += `</root>`;

          return this.http.post<string>('http://localhost:4200/products/' + fridgeid, body, httpOptions)
            .subscribe(
              result => { 
                console.log(result);  //<- XML response is in here *as plain text*
              }, 
              error => console.log('There was an error: ', error));
        
  }
/*
  public login(username: string, password: string) {
    return this.http.get('http://localhost:4200/login/' + username + '.' + password, 
    { responseType: 'text' });
  }

  public register(username: string, password: string) {
    return this.http.get('http://localhost:4200/register/' + username + '.' + password, 
    { responseType: 'text' });
  }

  public revalidateToken(token: string) {
    return this.http.get('http://localhost:4200/revalidate/' + token, 
    { responseType: 'text' });
  }

  public logout() {
    return this.http.get('http://localhost:4200/logout/', 
    { responseType: 'text' });
  }*/
}

