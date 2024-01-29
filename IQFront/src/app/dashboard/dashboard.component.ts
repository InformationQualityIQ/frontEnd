import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {BreakpointObserver} from '@angular/cdk/layout';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ChangeDetectionStrategy } from '@angular/compiler';
import { Router } from '@angular/router';
import { ApiService } from '../servicios/api/api.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent {


  @ViewChild('confirmModal') confirmModal: any;
  @ViewChild('confirmModal2') confirmModal2: any;
  confirmModalRef!: BsModalRef;

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  formPassAct =  new FormControl('', [Validators.required]);
  formNewPass =  new FormControl('', [Validators.required]);
  formConfirmarPass =  new FormControl('', [Validators.required]);
  
  formValidacionForm = false;
  formMensajeError = '';

  formCorrectForm = false;
  formMensajeCorrecto = '';

  constructor( 
    private router: Router, 
    private observer: BreakpointObserver, 
    private cd : ChangeDetectorRef, 
    private modalService: BsModalService,
    private api: ApiService
  ){

  }
  

  ngAfterViewInit(){
    this.observer.observe(['(max-width: 800px)']).subscribe((resp:any) => {
      if (resp.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    })
    this.cd.detectChanges();
  }

  


  modalCerrarSesion() {
    this.confirmModalRef = this.modalService.show(this.confirmModal);
  }

  modalCambiarClave() {
    this.formNewPass.setValue('');
    this.formConfirmarPass.setValue('');
    this.formPassAct.setValue('');
    
    this.confirmModalRef = this.modalService.show(this.confirmModal2);
    this.limpiarformCambioClave();
  }

  confirmCerrarSesion() {
    // Lógica para confirmar la acción aquí
    
    this.api.logout().subscribe(
      data => {
        localStorage.removeItem('token');
        this.router.navigate(['login'])
        this.confirmModalRef.hide();
    }, error => {console.log(error)});
  }
  
  confirmarCambioClave(){

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,-_])[A-Za-z\d@$!%*?&.,-_]+$/;

    var passAct = (this.formPassAct.value != undefined) ? this.formPassAct.value : '';
    var newPass = (this.formNewPass.value != undefined) ? this.formNewPass.value : '';
    var confirmarPass = (this.formConfirmarPass.value != undefined) ? this.formConfirmarPass.value : '';

    if (newPass != '' && confirmarPass != '' && passAct != '') {
      if (newPass === confirmarPass) {

        if (newPass === passAct) {
          this.imprimirError(
            true, 
            'El nuevo password debe ser diferente al password actual. '
          );
        } else {

          let longitud = newPass.length;
          
          if (longitud >= 5) {
            
            const isValid = passwordPattern.test(newPass);
            if (isValid) {
              this.formValidacionForm = false;
              this.formMensajeError = '';

              let json = {
                old_password: passAct,
                new_password: newPass, 
                confirm_password: confirmarPass
              }

              this.api.putUpdateClave(json).subscribe(
                data => {
                  this.imprimirError(
                    false, 
                    'Cambio de clave correcto.'
                  );

                  setTimeout(() => {
                    // Código de la función que deseas llamar después de 4 segundos
                    this.confirmCerrarSesion();
                  }, 1500);
                  
                
                }, error => {
                  this.imprimirError(
                    true, 
                    'El Password actual erroneo. '
                  );

                }
              );
              
            } else {
              this.imprimirError(
                true, 
                'La contraseña no cumple con la estructura requerida.  Al menos una letra mayuscula, al menos una letra minuscula, al menos un caracter entre @$!%*?&.,-'
              );
            }

          } else {
            this.imprimirError(
              true, 
              'La contraseña no cumple con la estructura requerida. Longitud minima de cinco (5) caracteres'
            );
          }
        
        
        }
      } else {
        this.imprimirError(true, 'Las contraseña son diferentes.');
      }  
    } else {
      this.imprimirError(true, 'Diligencie los campos del formulario.');
    }
  }

  imprimirError(estado: boolean, mensaje: string){
    if (estado) {
      this.formValidacionForm = true;
      this.formMensajeError = mensaje;

      this.formCorrectForm = false;
      this.formMensajeCorrecto = '';

    } else {
      this.formCorrectForm = true;
      this.formMensajeCorrecto = mensaje;

      this.formValidacionForm = false;
      this.formMensajeError = '';
    }  

  }
  limpiarformCambioClave(){

   
    
    this.formNewPass.clearValidators();
    this.formConfirmarPass.clearValidators();

    this.formNewPass.updateValueAndValidity();
    this.formConfirmarPass.updateValueAndValidity();

    this.formValidacionForm = false;
    this.formMensajeError = '';

  }
}
