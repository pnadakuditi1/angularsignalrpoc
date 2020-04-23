import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth.guard';

import { LoginComponent } from './modules/general/login/login.component';
import { RegisterComponent } from './modules/general/register/register.component';

import { ContactsComponent } from './modules/secured/contacts/contacts.component';
import { MessagesComponent } from './modules/secured/messages/messages.component';
import { PrattleComponent } from './modules/secured/prattle/prattle.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },    
  // { path: 'contacts', component: ContactsComponent },
  // { path: 'messages', component: MessagesComponent },
  { path: 's/chat', component: PrattleComponent, canActivate: [AuthGuard]  }    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
