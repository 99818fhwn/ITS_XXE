import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { UserViewModel } from 'src/assets/UserViewModel';
import { UserEditService } from '../user-edit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  constructor(private usereditservice: UserEditService, private router: Router) { }

  public username: string;
  public isadmin: number;
  private userInfo;
  public users: UserViewModel[] = [];

  ngOnInit() {

    this.userInfo = JSON.parse(localStorage.getItem("currentUser"));

    if (this.userInfo == null) {
      this.router.navigate(['/login']);
      return;
    }

    this.username = this.userInfo.name;
    this.isadmin = this.userInfo.isadmin;


    var testuser = new UserViewModel("Hiername", "ID1", "isadmin0");

    this.users.push(testuser);

    this.usereditservice.getUsers().subscribe(
      data => {
        this.users = <UserViewModel[]>JSON.parse(data);
      }
    )

    console.log(this.users);

    // this.loginS.login(this.userForm.controls['name'].value, this.userForm.controls['password'].value).subscribe(
    //   data => {
    //     var dataarray = data.split("+//+");
    //     localStorage.setItem('currentUser', JSON.stringify({ token: dataarray[0], name: this.userForm.controls['name'].value, isadmin: dataarray[1] }));
    //     this.router.navigate(['/mainpage']); ////Insert a routing here.
    //   },
  }

  public remove(user: UserViewModel) {

    console.log("Remove requested:" + user);

    var index = this.users.indexOf(user, 0);
    if (index > -1) {
      this.users.splice(index, 1);
    }
  }
}
