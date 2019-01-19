import { Component, OnInit } from '@angular/core';
import { UserAccount } from '../account-details';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {

  user: UserAccount = {
    name: "Rah Yan",
    phone: "634-123-4238",
    email: 'blah@gmail.com',
    startOfMem: "12/16/2000"
  };

  edit = false;

  allowEdit() {
    this.edit = true;
  }

  save(name,phone,email) {
    if (name) this.user.name = name;
    if (phone) this.user.phone = phone;
    if (email) this.user.email = email;
    this.edit = false;
  }

  constructor() { }

  ngOnInit() {
  }

}
