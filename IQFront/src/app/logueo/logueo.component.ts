import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../servicios/api/api.service'
import { LoginI } from '../modelos/login.interface'
import { ResponseI } from '../modelos/response.interface'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CertificadoAllI } from '../modelos/certficadosAll.interface';

@Component({
    selector: 'app-logueo',
    templateUrl: './logueo.component.html',
    styleUrls: ['./logueo.component.css']
})

export class LogueoComponent implements OnInit {

    @ViewChild('confirmModal') confirmModal: any;
    @ViewChild('confirmModal2') confirmModal2: any;
    confirmModalRef!: BsModalRef;

    
    userValidations = new FormControl('', [Validators.required, Validators.email]);
    passValidations = new FormControl('', [Validators.required]);

    formCertificado =  new FormControl('', [Validators.required]);

    formValidacionForm = false;
    formMensajeError  = '';

    infoCertificado :  CertificadoAllI | undefined;

    constructor(private router: Router, private api: ApiService, private modalService: BsModalService,) { }

    ngOnInit(): void {
        this.checkLocalStorage();
     }

    checkLocalStorage() {
        if (localStorage.getItem('token')) {
            this.router.navigate(['dashboard']);
        }
    }

    onSubmit() {

        if (this.userValidations.hasError('required')) {

        } else if (this.passValidations.hasError('required')) {

        } else {

            var username = (this.userValidations.value != undefined) ? this.userValidations.value : '';
            var password = (this.passValidations.value != undefined) ? this.passValidations.value : '';

            let json = {username:username, password:password }

            this.api.loginByEmail(json).subscribe(
                data => {
                    let dataResponse: ResponseI = data;

                    if (dataResponse.token == undefined) {
                        alert('Error de credenciales');
                    } else {
                        localStorage.setItem("token", dataResponse.token);
                        this.router.navigate(['dashboard'])
                    }
                }, error => {

                    console.log('este es el error', error);
                    if (error.status == 400) {
                        alert('Error de credenciales');
                    } else {
                        alert('Error general del sistema, intente nuevamente.');
                    }
                }
            );
        }
    }

    ventanaModalCertificado(){
        this.confirmModalRef = this.modalService.show(this.confirmModal);
    }

    consultarCertificado(){

        if (this.formCertificado.hasError('required') ){ 
            this.formValidacionForm = true;
            this.formMensajeError = 'Ingrese el codigo del Certificado a consultar';
        } else {

            this.formValidacionForm = false;
            this.formMensajeError = '';

            var codigo = (this.formCertificado.value != undefined) ? this.formCertificado.value : '';


            if (codigo != '' && codigo != 'Null' && codigo != null) {
  
                this.api.getAllCertificacionesXCodigo(codigo).subscribe(
                    data => {
                        // this.confirmModalRef.hide();
                        
                        this.infoCertificado = data[0];
                       // this.confirmModalRef = this.modalService.show(this.confirmModal2);
                    }, error => {
                        console.log(error);
                        this.formValidacionForm = true;
                        this.formMensajeError = 'No se encontro informacion del certificado';
                    }
                );
            }
  
        }
    }
        
    
}
