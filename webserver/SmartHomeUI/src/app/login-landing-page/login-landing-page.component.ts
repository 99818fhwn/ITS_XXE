import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthentificationService } from '../authentification.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-landing-page-page',
  templateUrl: './login-landing-page.component.html',
  styleUrls: ['./login-landing-page.component.css']
})

export class LoginLandingPageComponent implements OnInit {

  public userForm: FormGroup;
  public submitted: boolean; // keep track on whether form is submitted
  public events: any[] = []; // use later to display form changes
  public connectionError: boolean;
  public errorMessage: string;
  public errorStatusText: string;

  constructor(private formB: FormBuilder, private loginS: AuthentificationService, private router: Router) { }

  ngOnInit() {
    this.userForm = this.formB.group({
      name: ['', [<any>Validators.required, <any>Validators.maxLength(16), <any>Validators.minLength(4)]],
      password: ['', [<any>Validators.required, <any>Validators.minLength(4)]]
    })
    this.submitted = false;
    this.connectionError = false;
    this.errorMessage = '';
    this.errorStatusText = "";
  }

  save(isValid: boolean) {
    this.submitted = true; // set form submit to true
    this.connectionError = false;

    // check if model is valid
    // if valid, call API to save customer
    console.log(isValid);

    if (this.userForm.valid) {

      localStorage.removeItem('currentUser');

      this.loginS.login(this.userForm.controls['name'].value, this.userForm.controls['password'].value).subscribe(
        data => {
          var dataarray = data.split("+//+");
          localStorage.setItem('currentUser', JSON.stringify({ token: dataarray[0], name: this.userForm.controls['name'].value, isadmin: dataarray[1] }));
          this.router.navigate(['/mainpage']); ////Insert a routing here.
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
    }
  }
}
