import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { CommunicationService } from '../../../services/communication.service';
import { MessageService } from '../../../services/message.service';
import { Contact } from '../../../models/user';
import { Message } from '../../../models/message';

import { AddContactComponent } from '../addcontact/addcontact.component';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-prattle',
  templateUrl: './prattle.component.html',
  styleUrls: ['./prattle.component.scss']
})
export class PrattleComponent implements OnInit {
  contactsTitle = "Contacts";
  contacts: Contact[];
  fgSendMessage: FormGroup;
  newMessage: Message;
  selectedContact: Contact;
  messages = new Array<Message>();
  userId: string;

  constructor(
    private communicationSvc: CommunicationService,
    private authSvc: AuthService,
    private messageSvc: MessageService,
    public dialog: MatDialog
    ) { 
      this.userId = this.authSvc.getToken().id;
    }

  ngOnInit(): void {
    this.subscribeToServerEvents();

    this.getContacts();

    this.getMessages();

    this.fgSendMessage = new FormGroup({
      newMessage: new FormControl("", [Validators.required])
    })    
  }

  getContacts() {
    this.communicationSvc.getContacts().subscribe(result => {
      this.contacts = result;
      if (this.contacts != null && this.contacts.length > 0) {
        this.contacts[0].selected = true;
        this.selectedContact = this.contacts[0];
      }      
    });
  }

  getMessages() {
    if (this.userId && this.selectedContact) {
      this.communicationSvc.getMessages(this.selectedContact.id).subscribe(result => {
        this.messages = result;
      });
    }
    else {
      this.messages = new Array<Message>();
    }
  }

  sendMessage(formDirective: FormGroupDirective): void {
    if (this.fgSendMessage.valid) {
      this.newMessage = new Message();
      this.newMessage.senderId = this.userId;
      this.newMessage.receiverId = this.selectedContact.id;
      this.newMessage.body = this.fgSendMessage.value.newMessage;
      this.messageSvc.sendMessage(this.newMessage);
      formDirective.resetForm();
      this.fgSendMessage.reset();
    }
  }  

  addContact(): void {
    let dialogRef = this.dialog.open(AddContactComponent, {
      width: '30vw',
      data: { contactsToAdd: null },
      disableClose: true,
      panelClass: 'myapp-no-padding-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == true) {
        this.getContacts();
      }
    });    
  }

  onContactSelected(e) {
    this.selectedContact = this.contacts.find(c => c.id == e.id);
    this.getMessages();
  }
  
  private subscribeToServerEvents(): void {
    this.messageSvc.messageReceived.subscribe((receivedMessage: Message) => {
      if ( this.selectedContact && 
            (receivedMessage.senderId == this.userId && receivedMessage.receiverId == this.selectedContact.id)
            || (receivedMessage.receiverId == this.userId && receivedMessage.senderId == this.selectedContact.id) ) {
              this.messages.push(receivedMessage);
      }
      console.log("message received event handler");
    });
  }
  
}
