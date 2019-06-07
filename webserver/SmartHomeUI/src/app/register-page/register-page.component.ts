import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthentificationService } from '../authentification.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  public userForm: FormGroup;
  public submitted: boolean; // keep track on whether form is submitted
  public events: any[] = []; // use later to display form changes
  public connectionError: boolean;
  public errorMessage: string;
  public errorStatusText: string;

  constructor(private formB: FormBuilder, private registerS: AuthentificationService, private router: Router) { }

  ngOnInit() {
    this.userForm = this.formB.group({
      name: ['', [<any>Validators.required, <any>Validators.maxLength(16), <any>Validators.minLength(4)]],
      password: ['', [<any>Validators.required, <any>Validators.minLength(4)]],
      passwordConfirmation: ['', [<any>Validators.required, this.matchOtherValidator('password')]]
    });
    this.submitted = false;
    this.connectionError = false;
    this.errorMessage = "";
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

      this.registerS.register(this.userForm.controls['name'].value, this.userForm.controls['password'].value).subscribe(
        data => {
          localStorage.setItem('currentUser', JSON.stringify({ token: data, name: this.userForm.controls['name'].value }));
          this.router.navigate(['/login']);
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

  private matchOtherValidator(otherControlName: string) {

    let thisControl: FormControl;
    let otherControl: FormControl;

    return function matchOtherValidate(control: FormControl) {

      if (!control.parent) {
        return null;
      }

      // Initializing the validator.
      if (!thisControl) {
        thisControl = control;
        otherControl = control.parent.get(otherControlName) as FormControl;
        if (!otherControl) {
          throw new Error('matchOtherValidator(): other control is not found in parent group');
        }
        otherControl.valueChanges.subscribe(() => {
          thisControl.updateValueAndValidity();
        });
      }

      if (!otherControl) {
        return null;
      }

      if (otherControl.value !== thisControl.value) {
        return {
          matchOther: true
        };
      }

      return null;

    }
  }
}