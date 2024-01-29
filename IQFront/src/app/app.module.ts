import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClienteModule } from './cliente/cliente.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { LogueoComponent } from './logueo/logueo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




import { HttpClientModule } from '@angular/common/http';
import { CertificadosComponent } from './certificados/certificados.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';



import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { from } from 'rxjs';

import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [
    AppComponent,
    LogueoComponent,
    CertificadosComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule, 
    ClienteModule,
    DashboardModule,
   
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatSlideToggleModule,
    ModalModule

    
    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
