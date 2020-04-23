import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../../../models/user';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  @Output() onContactClicked = new EventEmitter<Contact>();
  @Input() contacts: Contact[];

  constructor(){
  }


  onContactSelected(contact) {
    this.contacts.forEach(c => c.selected = false);
    this.onContactClicked.emit(contact);
    contact.selected = true;
  }

}
