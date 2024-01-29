import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ApiService } from '../../servicios/api/api.service';
import { Router } from '@angular/router';
import { ListaClientesI } from '../../modelos/listaClientes.interface';
import { ClienteI } from '../../modelos/Cliente.interface';
import { PaisesI } from '../../modelos/paises.interface';
import { DepartamentosI } from '../../modelos/departamentos.interfaces';
import { CiudadesI } from 'src/app/modelos/ciudades.interface';
import { NewClienteI } from 'src/app/modelos/newCliente.interface';
import { from } from 'rxjs';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-cliente-create',
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.css']
})
export class ClienteCreateComponent implements OnInit {

  @ViewChild('confirmModal') confirmModal: any;
  @ViewChild('confirmModalError') confirmModalError: any;
  confirmModalRef!: BsModalRef;



  constructor(private router: Router, private api: ApiService, public dialog: MatDialog, private modalService: BsModalService,) { }

  formRazonSocial = new FormControl('', [Validators.required]);
  formIdentificacion = new FormControl('', [Validators.required]);
  formNombreComercial = new FormControl('', [Validators.required]);
  formDireccion = new FormControl('', [Validators.required]);
  formTelefono = new FormControl('', [Validators.required]);
  formTelefono2 = new FormControl('', []);
  formContacto = new FormControl('', [Validators.required]);
  formCargo = new FormControl('', [Validators.required]);
  formEmail = new FormControl('', [Validators.required, Validators.email]);
  formPais = new FormControl('', [Validators.required]);
  formDepartamento = new FormControl('', [Validators.required]);
  formCiudad = new FormControl('', [Validators.required]);
  formCodigoPostal = new FormControl('', [Validators.required]);

  formCompleto = new FormGroup({});

  clientesL: ListaClientesI[] | undefined;
  paisesList: PaisesI[] | undefined;
  departamentosList: DepartamentosI[] | undefined;
  CiudadesList: CiudadesI[] | undefined;
  newCliente: ClienteI[] | undefined;

  mostrar2Tel: boolean = false;
  esProveedor: boolean = true;
  numNivel: string = '0';

  id_clienteMod: string = '';
  id_ciudadMod: string = '';

  formValidacionForm = false;
  formMensajeError = '';

  mensajeVentanaModal = '';
  mensajeVentanaModalError = '';

  /**
   * Funcion que inicia el selector de paises, y la tabla de clientes. 
   * carga inicial del formulario
   */
  ngOnInit(): void {

    this.id_clienteMod = '';

    this.api.getAllPaises().subscribe(
      data => { this.paisesList = data },
      error => {
        if (error.status == 401) {
          this.cerrarSesion();
        } else {
          this.setErrorFormulario('Error cargando informacion para la lista de Paises.');
        }
      }
    );

    this.api.getAllClientes(1).subscribe(
      data => {
        if (data.length != null && data.length != undefined) { this.clientesL = data; }
      }, error => {
        if (error.status == 401) {
          this.cerrarSesion();
        } else {
          this.setErrorFormulario('Error cargando informacion de los clientes.');
        }
      }
    )

  }

  /**
   * Funcion: cerrar sesion 
   * Accion: cierra sesion por fallas en el token
   */
  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  /**
  * Funcion: Actualiza el identificador  de proveedor 
  * accion: dependiendo de lo que recibe actualiza la bandera de si es proveedor
  * @param bandera parametro dependiendo la seleccion [1 = proveedor - 2 = merchant]
  */
  setProveedorComercio(bandera: string) { this.esProveedor = ((bandera == '1')) ? true : false; }

  /**
   * Funcion que recibe el nivel seleccionado y actualiza la variable global
   * @param bandera valor con el numero del nivel que seleccionaron en el formulario
   */
  setNivelCliente(bandera: string) { this.numNivel = bandera; }

  /**
   * Funcion: imprimir mensaje de error en formulario parte baja franja roja
   * Accion: recibir mensaje de error en la informacion de formulario y pintarla en el formulario. 
   * @param mensaje error a imprimir en pantalla
   */
  setErrorFormulario(mensaje: string) { this.formValidacionForm = true; this.formMensajeError = mensaje }

  /**
   * Funcion: limpiar mensaje de error en fomulario parte baja franja roja
   * Accion: limpiar variables que se usan para imprimir mensaje en pantalla
   */
  setErrorFormularioLimpiar() { this.formValidacionForm = false; this.formMensajeError = ''; }

  /**
   * Funcion: imprimir mensaje en ventana modal 
   * Accion: recibe el mensaje y lo muestra en pantalla
   * @param mensaje mensaje a mostrar
   */
  setVentanaModal(mensaje: string) { 
    
    this.mensajeVentanaModal = mensaje;
    this.confirmModalRef = this.modalService.show(this.confirmModal);
  }

  /**
   * Funcion: imprimir mensaje en ventana modal 
   * Accion: recibe el mensaje y lo muestra en pantalla
   * @param mensaje mensaje a mostrar
   */
  setVentanaModalError(mensaje: string) { 
    this.mensajeVentanaModalError = mensaje;
    this.confirmModalRef = this.modalService.show(this.confirmModalError);
  }

  /**
   * Funcion: Cambio de estado de si esta habilitado telefono 2
   * Accion: Se inicia desde el boton de mostrar telefono 2, cambio de estado
   */
  mostrarOcultarTelefono() { this.mostrar2Tel = (this.mostrar2Tel) ? false : true; }

  /**
   * Funcion: cambio de pais en el selecctor del formulario
   * Accion: carga el selector de departamentos dependiendo del pais seleccionado
   *          consume api de departamentos por el id del pais enviado
   */
  changePais() {
    let obje_paisT = this.formPais.value;
    let id_paisT = (obje_paisT != undefined) ? obje_paisT : '';
    if (id_paisT != '' && id_paisT != undefined && id_paisT != null) {
      this.api.getSingleDepartamentoIDPais(id_paisT).subscribe(
        data => { this.departamentosList = data },
        error => {
          if (error.status == 401) {
            this.cerrarSesion();
          } else {
            this.setErrorFormulario('Error cargando información de los departamentos');
          }
        }
      );
    }
  }

  /**
   * Funcion: cambio de deparmento en el selecctor del formulario
   * Accion: carga el selector de ciudades dependiendo del departamento seleccionado
   *          consume api de ciudades por el id del departamento enviado
   */
  changeDepartamento() {
    let obje_DepT = this.formDepartamento.value;
    let id_depT = (obje_DepT != undefined) ? obje_DepT : '';
    if (id_depT != '' && id_depT != undefined && id_depT != null) {
      this.api.getSingleCiudadIDXDep(id_depT).subscribe(
        data => { this.CiudadesList = data },
        error => {
          if (error.status == 401) {
            this.cerrarSesion();
          } else {
            this.setErrorFormulario('Error cargando información de las ciudades');
          }
        }
      );
    }
  }


  
  nuevoCliente(formCompleto: FormGroup) {
    
    if (this.id_clienteMod != '') {
      this.modificarCliente(formCompleto);
    } else {

      if (this.validacionFormulario()) {

        var formRazonSocial = (this.formRazonSocial.value != undefined) ? this.formRazonSocial.value : '';
        var formIdentificacion = (this.formIdentificacion.value != undefined) ? this.formIdentificacion.value : '';
        var formNombreComercial = (this.formNombreComercial.value != undefined) ? this.formNombreComercial.value : '';
        var formDireccion = (this.formDireccion.value != undefined) ? this.formDireccion.value : '';
        var formTelefono = (this.formTelefono.value != undefined) ? this.formTelefono.value : '';
        var formTelefono2 = (this.formTelefono2.value != undefined) ? this.formTelefono2.value : '';
        var formContacto = (this.formContacto.value != undefined) ? this.formContacto.value : '';
        var formCargo = (this.formCargo.value != undefined) ? this.formCargo.value : '';
        var formEmail = (this.formEmail.value != undefined) ? this.formEmail.value : '';
        var formCodigoPostal = (this.formCodigoPostal.value != undefined) ? this.formCodigoPostal.value : '';
        var formCiudad = (this.formCiudad.value != undefined) ? this.formCiudad.value : '';
        var formTipoCliente = (this.esProveedor == true) ? 'Service Provider' : 'Merchant';

        if (this.numNivel != '' && this.numNivel != '0') {

          let json = {
            razon_social: (formRazonSocial != undefined) ? formRazonSocial : '',
            identificacion: (formIdentificacion != undefined) ? formIdentificacion : '',
            nombre_comercial: (formNombreComercial != undefined) ? formNombreComercial : '',
            direccion: (formDireccion != undefined) ? formDireccion : '',
            telefono: (formTelefono != undefined) ? formTelefono : '',
            telefono2: (formTelefono2 != undefined && formTelefono2 != '') ? formTelefono2 : 'Null',
            codigo_postal: (formCodigoPostal != undefined) ? formCodigoPostal : '',
            tipo_cliente: (formTipoCliente != undefined) ? formTipoCliente : '',
            nivel: this.numNivel,
            estado_cliente: 'activo',
            ciudad_id: (formCiudad != undefined) ? formCiudad : '',
          }

          this.api.postCrearCliente(json).subscribe(
            data => {
              
              let dataResponse: NewClienteI = data;

              if  (dataResponse.id_cliente != undefined) {
                let newContacto = {
                  nombre_contacto: (formContacto != undefined) ? formContacto : '',
                  cargo_contacto: (formCargo != undefined) ? formCargo : '',
                  email_contacto: (formEmail != undefined) ? formEmail : '',
                  estado_contacto: 'activo',
                  id_cliente: dataResponse.id_cliente,
                }

                this.api.postCrearContacto(newContacto).subscribe(
                  data => {
                    this.ngOnInit();
                    this.limpiarForm();
                    this.setVentanaModal('Cliente creado correctamente, contacto creado correctamente');
                  }, error => {
                    if (error.status == 401) {
                      this.cerrarSesion();
                    } else {
                      this.ngOnInit();
                      this.limpiarForm();
                      this.setVentanaModalError('Cliente creado correctamente, Error en la creación del contacto');
                    }
                  }
                );
              } else {
                this.setVentanaModalError('Se presentaron problemas creando el cliente, por favor intente de nuevo');
              }

            }, error => {
              if (error.status == 401) {
                this.cerrarSesion();
              } else {
                this.setErrorFormulario('Error creando el cliente');
                this.setVentanaModalError('Error creando el cliente');
              }
            }
          );

        } else { 
          this.setErrorFormulario('Error en la seleccion del Nivel del cliente'); 
        }
      } else { 
        this.setErrorFormulario('Error en la informacion ingresada, verifique los datos del formulario.'); 
      }
    }
  }


  modificarCliente(formCompleto: FormGroup) {
    
    if (this.id_clienteMod != '') {
      if (this.validacionFormulario()) {

        var formRazonSocial = (this.formRazonSocial.value != undefined) ? this.formRazonSocial.value : '';
        var formIdentificacion = (this.formIdentificacion.value != undefined) ? this.formIdentificacion.value : '';
        var formNombreComercial = (this.formNombreComercial.value != undefined) ? this.formNombreComercial.value : '';
        var formDireccion = (this.formDireccion.value != undefined) ? this.formDireccion.value : '';
        var formTelefono = (this.formTelefono.value != undefined) ? this.formTelefono.value : '';
        var formTelefono2 = (this.formTelefono2.value != undefined) ? this.formTelefono2.value : '';
        var formContacto = (this.formContacto.value != undefined) ? this.formContacto.value : '';
        var formCargo = (this.formCargo.value != undefined) ? this.formCargo.value : '';
        var formEmail = (this.formEmail.value != undefined) ? this.formEmail.value : '';
        var formCodigoPostal = (this.formCodigoPostal.value != undefined) ? this.formCodigoPostal.value : '';
        var formCiudad = (this.formCiudad.value != undefined) ? this.formCiudad.value : '';
        var formTipoCliente = (this.esProveedor == true) ? 'Service Provider' : 'Merchant';

        if (this.numNivel != '' && this.numNivel != '0') {
          
          let json = {
            id_cliente: this.id_clienteMod,
            razon_social: (formRazonSocial != undefined) ? formRazonSocial : '',
            identificacion: (formIdentificacion != undefined) ? formIdentificacion : '',
            nombre_comercial: (formNombreComercial != undefined) ? formNombreComercial : '',
            direccion: (formDireccion != undefined) ? formDireccion : '',
            telefono: (formTelefono != undefined) ? formTelefono : '',
            telefono2: (formTelefono2 != undefined && formTelefono2 != '') ? formTelefono2 : 'Null',
            codigo_postal: (formCodigoPostal != undefined) ? formCodigoPostal : '',
            tipo_cliente: (formTipoCliente != undefined) ? formTipoCliente : '',
            nivel: this.numNivel,
            estado_cliente: 'activo',
            ciudad_id: (formCiudad != undefined) ? formCiudad : '',
          }
          
          this.api.putUpdateCliente(json).subscribe(
            data => {
              this.api.getSingleContacID(this.id_clienteMod).subscribe(
                dataCont => {
                  if (dataCont == null) {
                    
                    this.setVentanaModalError('Cliente actualizado correctamente, Error modificando la informacion del contacto');
                  } else {
    
                    let id_contacto = dataCont[0].id_contacto;
    
                    let updateContacto = {
                      id_contacto: id_contacto,
                      nombre_contacto: (formContacto != undefined) ? formContacto : '',
                      cargo_contacto: (formCargo != undefined) ? formCargo : '',
                      email_contacto: (formEmail != undefined) ? formEmail : '',
                      estado_contacto: 'activo'
                    }
    
                    this.api.putUpdateContacto(updateContacto).subscribe(
                      dataModCont => { 
                        this.setVentanaModal('Cliente actualizado correctamente, contacto actualizado correctamente'); 
                      },
                      errorModCont => { 
                        
                        if (errorModCont.status == 401) {
                          this.cerrarSesion();
                        } else {
                          this.setVentanaModalError('Cliente creado correctamente, Error modificando la informacion del contacto');
                        }
                      }
                    );
                    this.limpiarForm();
                    this.ngOnInit();
                  }

                }, errorCont => {
                  
                  if (errorCont.status == 401) {
                    this.cerrarSesion();
                  } else {
                    this.setVentanaModalError('Se presento un error modificando el cliente, intentelo nuevamente');
                    this.limpiarForm();
                    this.ngOnInit();
                  }
                }
              );
  
            }, error => {
              if (error.status == 401) {
                this.cerrarSesion();
              } else {
                this.limpiarForm();
                this.ngOnInit();
                this.setVentanaModalError('Se presento un error modificando el cliente, intentelo nuevamente');
              }
            }
          );
        }
      } else { this.setErrorFormulario('Error en la informacion ingresada, verifique los datos del formulario.'); }
    }
    
  }

  editarCliente(id: any) {

    this.api.getSingleClienteID(id).subscribe(
      data => {

        this.api.getSingleCiudadID(data[0].ciudad_id).subscribe(
          dataCiu => {

            this.api.getSingleDepartamentoID(dataCiu[0].departamento_id).subscribe(
              dataDep => {

                this.api.getSingleDepartamentoIDPais(dataDep[0].pais_id).subscribe(data => { this.departamentosList = data }, error => { this.id_clienteMod = data[0].id_cliente; });
                this.api.getSingleCiudadIDXDep(dataDep[0].id_departamento).subscribe(data => { this.CiudadesList = data }, error => { this.id_clienteMod = data[0].id_cliente; });

                this.numNivel = data[0].nivel;
                this.esProveedor = (data[0].tipo_cliente == "Merchant") ? false : true;

                data[0].telefono2 = (data[0].telefono2 == 'Null') ? '' : data[0].telefono2;
                this.mostrar2Tel = (data[0].telefono2 != null && data[0].telefono2 != undefined) ? true : false;
                this.mostrar2Tel = (data[0].telefono2 == 'Null' || data[0].telefono2 == '') ? false : true;


                this.api.getSingleContacID(data[0].id_cliente).subscribe(
                  dataCont => {

                    let nombre_contacto = '';
                    let cargo_contacto = '';
                    let email_contacto = '';

                    if (dataCont == null) {
                      alert("Error cargando la informacion del contacto");
                    } else {
                      nombre_contacto = dataCont[0].nombre_contacto;
                      cargo_contacto = dataCont[0].cargo_contacto;
                      email_contacto = dataCont[0].email_contacto;
                    }

                    this.formRazonSocial.setValue(data[0].razon_social);
                    this.formIdentificacion.setValue(data[0].identificacion);
                    this.formNombreComercial.setValue(data[0].nombre_comercial);
                    this.formDireccion.setValue(data[0].direccion);
                    this.formTelefono.setValue(data[0].telefono);
                    this.formTelefono2.setValue(data[0].telefono2);
                    this.formContacto.setValue(nombre_contacto);
                    this.formCargo.setValue(cargo_contacto);
                    this.formEmail.setValue(email_contacto);
                    this.formPais.setValue(dataDep[0].pais_id,);
                    this.formDepartamento.setValue(dataDep[0].id_departamento);
                    this.formCiudad.setValue(dataCiu[0].id_ciudad);
                    this.formCodigoPostal.setValue(data[0].codigo_postal);

                    this.formCompleto.setValue({});

                    this.id_clienteMod = data[0].id_cliente;

                  }, errorCont => { this.id_clienteMod = data[0].id_cliente; alert("Error consultando el contacto." + errorCont); }
                );
              }, error => { this.id_clienteMod = data[0].id_cliente; alert("Error cargando listado departamentos."); }
            );
          }, error => { this.id_clienteMod = data[0].id_cliente; alert("Error cargando listado de Ciudades."); }
        );
      }, error => {
        if (error.status == 401) {
          localStorage.removeItem('token');
          this.router.navigate(['login'])
        } else {
          alert('Error general del sistema, intente nuevamente.');
        }
      }
    );
  }

  validacionFormulario() {

    let formOk = true;

    if (this.formRazonSocial.hasError('required')) { formOk = false; }
    if (this.formIdentificacion.hasError('required')) { formOk = false; }
    if (this.formNombreComercial.hasError('required')) { formOk = false; }
    if (this.formDireccion.hasError('required')) { formOk = false; }
    if (this.formTelefono.hasError('required')) { formOk = false; }
    if (this.formContacto.hasError('required')) { formOk = false; }
    if (this.formCargo.hasError('required')) { formOk = false; }
    if (this.formEmail.hasError('required')) { formOk = false; }
    if (this.formPais.hasError('required')) { formOk = false; }
    if (this.formDepartamento.hasError('required')) { formOk = false; }
    if (this.formCiudad.hasError('required')) { formOk = false; }
    if (this.formCodigoPostal.hasError('required')) { formOk = false; }

    return formOk;

  }

  limpiarForm() {

    this.id_clienteMod = '';
    this.mostrar2Tel = false;
    this.esProveedor = true;

    this.numNivel = '0';

    this.id_clienteMod = '';
    this.id_ciudadMod = '';

    this.formCompleto.reset();

    this.formRazonSocial.reset();
    this.formIdentificacion.reset();
    this.formNombreComercial.reset();
    this.formDireccion.reset();
    this.formTelefono.reset();
    this.formTelefono2.reset();
    this.formContacto.reset();
    this.formCargo.reset();
    this.formEmail.reset();
    this.formPais.reset();
    this.formDepartamento.reset();
    this.formCiudad.reset();
    this.formCodigoPostal.reset();

    this.setErrorFormularioLimpiar();

  }

  cambiarEstadoCliente(id: string, enterAnimationDuration: string, exitAnimationDuration: string): void {
    localStorage.setItem("id_cliente_mod", id);
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    this.ngOnInit();
  }
}

@Component({
  selector: 'modal-cambio-estado',
  templateUrl: 'modalCambioEstado.html',
  styleUrls: ['./cliente-create.component.css']
})
export class DialogAnimationsExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>, private router: Router, private api: ApiService, public dialog: MatDialog) { }

  cambiarEstadoCliente() {

    let id_cliente = localStorage.getItem('id_cliente_mod');
    let id = (id_cliente != '' && id_cliente != undefined) ? id_cliente : '';

    if (id != '') {
      this.api.getSingleClienteID(id).subscribe(
        data => {

          let nuevo_estado = '';
          if (data[0].estado_cliente == "inactivo") {
            nuevo_estado = 'activo';
          } else if (data[0].estado_cliente == "activo") {
            nuevo_estado = 'inactivo';
          } else {
            nuevo_estado = 'inactivo';
          }

          let json = {
            id_cliente: data[0].id_cliente,
            razon_social: data[0].razon_social,
            identificacion: data[0].identificacion,
            nombre_comercial: data[0].nombre_comercial,
            direccion: data[0].direccion,
            telefono: data[0].telefono,
            telefono2: data[0].telefono2,
            codigo_postal: data[0].codigo_postal,
            tipo_cliente: data[0].tipo_cliente,
            nivel: data[0].nivel,
            estado_cliente: nuevo_estado,
            ciudad_id: data[0].ciudad_id,
          }

          this.api.putUpdateCliente(json).subscribe(data => {
            location.reload();
            localStorage.removeItem('id_cliente_mod');
            this.cerrarVentanaModal();
          }, error => {
            location.reload();
            localStorage.removeItem('id_cliente_mod');
            this.cerrarVentanaModal()
          });

        }, error => {
          location.reload();
          localStorage.removeItem('id_cliente_mod');
          this.cerrarVentanaModal()
        }
      );
    }
  }

  cerrarVentanaModal() {
    this.dialogRef.close();
  }
}



