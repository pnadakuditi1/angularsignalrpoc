import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';

import { RegisterComponent } from './modules/general/register/register.component';
import { LoginComponent } from './modules/general/login/login.component';

import { PrattleComponent } from './modules/secured/prattle/prattle.component';
import { ContactsComponent } from './modules/secured/contacts/contacts.component';
import { MessagesComponent } from './modules/secured/messages/messages.component';
import { AddContactComponent } from './modules/secured/addcontact/addcontact.component';

import { AuthGuard } from './auth.guard';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MessageService } from './services/message.service';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ContactsComponent,
    MessagesComponent,
    PrattleComponent,
    AddContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatCardModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  //providers: [AuthGuard],
  providers: [AuthGuard, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
