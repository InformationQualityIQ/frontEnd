import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../servicios/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ListaClientesI } from '../modelos/listaClientes.interface';
import { versionesnormaI } from '../modelos/versionnorma.interface';
import { CertificadoI } from '../modelos/certificados.interface';
import { FormulariosSaqI } from '../modelos/formulariosSaq.interface';
import { CertificadoAllI } from '../modelos/certficadosAll.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-certificados',
  templateUrl: './certificados.component.html',
  styleUrls: ['./certificados.component.css']
})
export class CertificadosComponent implements OnInit  {

  formVersionNorma =  new FormControl('', [Validators.required]);
  formFormularioSaq =  new FormControl('', [Validators.required]);
  formFechaEmision = new FormControl('', [Validators.required]);
  formFechaVencimiento =  new FormControl('', [Validators.required]);
  formBuscarRazonSocial = new FormControl('', [Validators.required]);

  formValidacionForm = false;
  formMensajeError = '';
 
  constructor(private router: Router, private api: ApiService, public dialog: MatDialog, private http: HttpClient) { }
  
  clientesL: ListaClientesI[] | undefined;
  versionesnormaList: versionesnormaI[] | undefined;
  listFormulariosSaq: FormulariosSaqI[] | undefined;
  certificadosL: CertificadoAllI[] | undefined;


  formCliente = new FormGroup({
    formID: new FormControl({value: '', disabled: true}, [Validators.required,]),
    formRazonSocial: new FormControl({value: '', disabled: true}, [Validators.required,]),
    formIdentificacion: new FormControl({value: '', disabled: true}, [Validators.required,]),
    formTipoCliente: new FormControl({value: '', disabled: true}, [Validators.required,]),
    formNivel: new FormControl({value: '', disabled: true}, [Validators.required,]),
  });

  
  ngOnInit(): void { 
    
    this.limpiarErrores();

    // carga select de las versiones de la norma 
    this.api.getAllVersionesNorma().subscribe(data => { this.versionesnormaList = data; }, error => {});
  
  }

  keyUp_formRazonSocial() {
    
    this.limpiarErrores();
    this.getAllClientesXRazonSocial();

  }

  clicSelectCliente(dataCliente: any){ 
    
    this.limpiarErrores();

    this.formCliente.setValue({
      'formID': dataCliente.id_cliente,
      'formRazonSocial': dataCliente.razon_social,
      'formIdentificacion': dataCliente.identificacion,
      'formTipoCliente': dataCliente.tipo_cliente,
      'formNivel': dataCliente.nivel,
    });

    // carga select de los formularios Saq
    this.api.getAllFormulariosSaq(dataCliente.tipo_cliente).subscribe(data => {this.listFormulariosSaq = data}, error => {});

    this.formBuscarRazonSocial.setValue('');
    this.clientesL = undefined;

    this.getCerticadosXCliente(dataCliente.id_cliente);

  }

  getCerticadosXCliente(id_cliente: string){

    if (id_cliente != "" && id_cliente != undefined) {
      this.api.getAllCertificacionesXCliente(id_cliente).subscribe(
        data => {
          this.certificadosL = data;
        }, error => {}
      );
    }

  }

  getAllClientesXRazonSocial(){

    this.limpiarErrores();
    
    var razonSocial = (this.formBuscarRazonSocial.value != undefined) ? this.formBuscarRazonSocial.value : '';
    if (razonSocial != '') {
      this.api.getAllClientesXRazonSocial(razonSocial).subscribe( 
        data => { 
          if (data != null && data != undefined){
            this.clientesL = data;
          } else {
            this.clientesL = undefined;
          }
        },error => { this.clientesL = undefined; });
    } else {
      this.clientesL = undefined;
    }
  }

  saveCertificado(){

    if (this.formFormularioSaq.hasError('required') ){ 
      this.formValidacionForm = true;
      this.formMensajeError = 'Seleccione el formulario SAQ.';
    } else if (this.formVersionNorma.hasError('required') ){ 
      this.formValidacionForm = true;
      this.formMensajeError = 'Seleccione la version de la norma.';
    } else if( this.formFechaEmision.hasError('required') ){
      this.formValidacionForm = true;
      this.formMensajeError = 'Seleccione la fecha de emision.';
    } else if (this.formFechaVencimiento.hasError('required')) {
      this.formValidacionForm = true;
      this.formMensajeError = 'Seleccione la fecha de vencimiento.';
    } else {

      var id_cliente = (this.formCliente.get('formID')?.value != undefined) ? this.formCliente.get('formID')?.value : '';
      var formNivel = (this.formCliente.get('formNivel')?.value != undefined) ? this.formCliente.get('formNivel')?.value : '';
      var formtipoCliente = (this.formCliente.get('formTipoCliente')?.value != undefined) ? this.formCliente.get('formTipoCliente')?.value : '';

      if (id_cliente != '' && formNivel != '' && formtipoCliente != '') {

        this.formValidacionForm = false;
        this.formMensajeError = '';
        
        var formularioSaq = (this.formFormularioSaq.value != undefined) ? this.formFormularioSaq.value : '';
        var versionNorma  = (this.formVersionNorma.value != undefined) ? this.formVersionNorma.value : '';
        var fechaEmision  = (this.formFechaEmision.value != undefined) ? this.formFechaEmision.value : '';
        var fechaVencimiento = (this.formFechaVencimiento.value != undefined) ? this.formFechaVencimiento.value : '';


        if (fechaEmision < fechaVencimiento) {
          
          let cliente_id = (id_cliente != undefined) ? id_cliente : '';

          let json = {
            fecha_emision: fechaEmision,
            fecha_vencimiento: fechaVencimiento, 
            tipo_cliente: (formtipoCliente != undefined) ? formtipoCliente : '',
            nivel: (formNivel != undefined) ? formNivel : '', 
            codigo_certificado: this.generarCodigoCertificado(cliente_id),
            versiones_norma_id: versionNorma,
            cliente_id: cliente_id,
            estado_certificado: 'activo',
            formularios_saq_id: formularioSaq
          }
          
          this.api.postGuardarCertificado(json).subscribe( 
            data => {
              alert("Certificado almacenado correctamente.");

              this.api.postGenerarCertificadoPDF(json).subscribe(
                data => {
                  console.log(data);
                }, error => {
                  this.formValidacionForm = true;
                  this.formMensajeError = 'Error en la generacion del PDF.';
                }
                );

              if (id_cliente != undefined && id_cliente != '') {
                this.getCerticadosXCliente(id_cliente);
                this.limpiarFormularioCertificado();
                this.limpiarErrores();

              }
              
            }, error => {
              if (error.status = 400) {
                this.formValidacionForm = true;
                this.formMensajeError = error.error.mensaje;
              }
            }
          );
          
        } else {
          this.formValidacionForm = true;
          this.formMensajeError = 'Fecha de Emision y Fecha de vencimiento erroneas.';
        }

      } else {
        this.formValidacionForm = true;
        this.formMensajeError = 'Realice la busqueda del cliente';
      }
    } 
  }

  limpiarErrores(){
    this.formValidacionForm = false;
    this.formMensajeError = '';
  }

  limpiarFormularioCertificado(){
    
    this.formVersionNorma.setValue('');
    this.formVersionNorma.clearValidators();
    this.formVersionNorma.updateValueAndValidity();

    this.formFormularioSaq.setValue('');
    this.formFormularioSaq.clearValidators();
    this.formFormularioSaq.updateValueAndValidity();

    this.formFechaEmision.setValue('');
    this.formFechaEmision.clearValidators();
    this.formFechaEmision.updateValueAndValidity();


    this.formFechaVencimiento.setValue('');
    this.formFechaVencimiento.clearValidators();
    this.formFechaVencimiento.updateValueAndValidity();
   
    this.formBuscarRazonSocial.setValue('');
    this.formBuscarRazonSocial.clearValidators();
    this.formBuscarRazonSocial.updateValueAndValidity();
  }

  generarCodigoCertificado(id : string) {

    let result = '';
    let longitud = 16;
    var dateDay = new Date().getDate();
    var dateMon = new Date().getDay();
    var dateSeg = new Date().getSeconds();
    var dateMin = new Date().getMinutes();
    
    const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
    const charactersLength = characters.length;
    for (let i = 0; i < longitud; i++) {
        if (i == 0) {
          result += dateDay;
        } else if (i == 4){
          result += dateMon;
        } else if (i == 8){
          result += id;
        } else if (i == 11){
          result += dateSeg;
        } else if (i == 13){
          result += dateMin;
        } else {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        i = result.length - 1 ;
    }

    return result;
  }
  
  descargarCertificado(codigo_certificado: string){
    
    let url = this.api.getDescargarArchivo(codigo_certificado);

    this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = codigo_certificado + '.pdf'; // Puedes establecer el nombre del archivo aquí
      link.click();
      URL.revokeObjectURL(link.href);
    });

  }
}
