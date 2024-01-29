import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteCreateComponent } from './cliente-create/cliente-create.component';

import { ClienteRoutingModule } from './cliente-routing.module';


import {MatDividerModule} from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ClienteCreateComponent,
    
  ],
  imports: [
    CommonModule,
    ClienteRoutingModule,
    MatDividerModule,
    ReactiveFormsModule,
    
  ]
})
export class ClienteModule { }
