import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import { CommunicationService } from '../../../services/communication.service';
import { Contact } from '../../../models/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-addcontact',
  templateUrl: './addcontact.component.html',
  styleUrls: ['./addcontact.component.scss']
})
export class AddContactComponent implements OnInit {
  contacts: Contact[];
  fgAddContact: FormGroup;
  selectedContact: Contact;
  errorMessage: string;
  
  constructor(
    private commSvc: CommunicationService,
    public dialogRef: MatDialogRef<AddContactComponent>,
    public dialog: MatDialog,    
  ) { }

  ngOnInit(): void {
    this.getContacts();
    
    this.fgAddContact = new FormGroup({
      selectContact: new FormControl("", [Validators.required])
    })
  }

  getContacts() {
    this.commSvc.getContactsToAdd().subscribe(result => {
      this.contacts = result;
    });
  }
  
  closeDialog() {
    this.fgAddContact.reset();
    this.dialogRef.close();
  }

  onOptionClicked(contact: Contact) {
    console.log("on option clicked " + contact.id);
    this.selectedContact = contact;
  }

  addContact() {
    this.errorMessage = null;
    if (this.fgAddContact.valid) {
      this.commSvc.addContact(this.selectedContact.id).subscribe(result => {
        if (result.message == null) {
          console.log("contact added successfully");
          this.dialogRef.close(true);
        }
        else {
          this.errorMessage = result.message;
        }
      })
    }
  }

}
