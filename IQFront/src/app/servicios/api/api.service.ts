import { Injectable } from '@angular/core';

import { LoginI} from '../../modelos/login.interface';
import { ListaClientesI } from '../../modelos/listaClientes.interface';
import { ClienteI } from '../../modelos/Cliente.interface';
import { ContactoI } from '../../modelos/contacto.interface';
import { PaisesI } from '../../modelos/paises.interface';
import { DepartamentosI } from '../../modelos/departamentos.interfaces';
import { CiudadesI } from '../../modelos/ciudades.interface';
import { NewClienteI }  from '../../modelos/newCliente.interface';
import { versionesnormaI } from '../../modelos/versionnorma.interface';

import {ResponseI} from '../../modelos/response.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { generalI } from 'src/app/modelos/general.interface';
import { CertificadoI } from 'src/app/modelos/certificados.interface';
import { clientesrequest } from 'src/app/modelos/clientesrequest.interface';
import { FormulariosSaqI } from 'src/app/modelos/formulariosSaq.interface';
import { CertificadoAllI } from 'src/app/modelos/certficadosAll.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url: string = 'http://127.0.0.1:8000/';

  constructor(private http:HttpClient) { }

  loginByEmail(LoginI: { username: string; password: string; }): Observable<ResponseI>{
    let direccion = this.url + "api_generate_token/";
    return this.http.post<ResponseI>(direccion, LoginI);
  }
  
  logout(){
    let direccion = this.url + "logout/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    let data = {token : this.getToken()};
    return this.http.post<NewClienteI>(direccion, data, {headers});
  }

  postCrearCliente(
    newCliente: {
      razon_social:string; 
      identificacion: string; 
      nombre_comercial: string;
      direccion: string;
      telefono: string;
      telefono2: string;
      codigo_postal: string;
      tipo_cliente: string;
      nivel: string;
      estado_cliente: string;
      ciudad_id: string;
    }
  ): Observable<NewClienteI>{
    let direccion = this.url + "clientes/createCliente/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.post<NewClienteI>(direccion, newCliente, {headers});
  }

  postCrearCliente2(
    newCliente: {
      razon_social:string; 
      identificacion: string; 
      nombre_comercial: string;
      direccion: string;
      telefono: string;
      codigo_postal: string;
      tipo_cliente: string;
      nivel: string;
      estado_cliente: string;
      ciudad_id: string;
    }
  ): Observable<NewClienteI>{
    let direccion = this.url + "clientes/createCliente/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.post<NewClienteI>(direccion, newCliente, {headers});
  }

  postCrearContacto(
    newContacto: {
      nombre_contacto:string; 
      cargo_contacto: string; 
      email_contacto: string;
      estado_contacto: string;
      id_cliente: string
    }
  ): Observable<ResponseI>{
    let direccion = this.url + "clientes/createContactoCliente/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.post<ResponseI>(direccion, newContacto, {headers});
  }

  postGuardarCertificado(
    newCertificado: {
      fecha_emision:string; 
      fecha_vencimiento: string; 
      tipo_cliente: string;
      nivel: string;
      codigo_certificado: string;
      versiones_norma_id: string;
      cliente_id: string;
      estado_certificado: string;
    }
  ): Observable<generalI>{
    let direccion = this.url + "clientes/createCertificadoCliente/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.post<generalI>(direccion, newCertificado, {headers});
  }

  postGenerarCertificadoPDF(
    newCertificado: {
      fecha_emision:string; 
      fecha_vencimiento: string; 
      tipo_cliente: string;
      nivel: string;
      codigo_certificado: string;
      versiones_norma_id: string;
      cliente_id: string;
      estado_certificado: string;
    }
  ): Observable<generalI>{
    let direccion = this.url + "clientes/generarCertificadoPDF/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.post<generalI>(direccion, newCertificado, {headers});
  }


  putUpdateCliente(
    updateCliente: {
      id_cliente: string;
      razon_social:string; 
      identificacion: string; 
      nombre_comercial: string;
      direccion: string;
      telefono: string;
      telefono2: string;
      codigo_postal: string;
      tipo_cliente: string;
      nivel: string;
      estado_cliente: string;
      ciudad_id: string;
    }
  ): Observable<ClienteI>{
    let direccion = this.url + "clientes/updateCliente/" + updateCliente.id_cliente + "/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.put<ClienteI>(direccion, updateCliente, {headers});
  }

  putUpdateCliente2(
    updateCliente: {
      id_cliente: string;
      razon_social:string; 
      identificacion: string; 
      nombre_comercial: string;
      direccion: string;
      telefono: string;
      codigo_postal: string;
      tipo_cliente: string;
      nivel: string;
      estado_cliente: string;
      ciudad_id: string;
    }
  ): Observable<ClienteI>{
    let direccion = this.url + "clientes/updateCliente/" + updateCliente.id_cliente + "/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.put<ClienteI>(direccion,updateCliente, {headers});
  }

  putUpdateContacto(
    updateContacto: {
      id_contacto: string;
      nombre_contacto: string; 
      cargo_contacto: string; 
      email_contacto: string;
      estado_contacto: string;
    }
  ): Observable<ClienteI>{
    let direccion = this.url + "clientes/updateContactoCliente/" + updateContacto.id_contacto + "/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.put<ClienteI>(direccion,updateContacto,{headers});
  }

  putUpdateClave(
    updateClave: {
      old_password: string;
      new_password: string; 
      confirm_password: string;
    }
  ): Observable<generalI>{
    let direccion = this.url + "password_change/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.put<generalI>(direccion,updateClave,{headers});
  }

  
  getAllClientes(page:number): Observable<ListaClientesI[]>{
    let direccion = this.url + "clientes/listadoClientes/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.get<ListaClientesI[]>(direccion, {headers});
  }

  getAllClientesXRazonSocial(razon_social:string): Observable<ListaClientesI[]>{
    let direccion = this.url + "clientes/ListadoClienteRazonSocial/" + razon_social;
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.get<ListaClientesI[]>(direccion, {headers});
  }
  
  
  getSingleClienteID(id: string):Observable<ClienteI[]>{
    let direccion = this.url + "clientes/ListadoClienteID/" + id + "/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.get<ClienteI[]>(direccion, {headers}); 
  }
  
  getSingleContacID(id: string):Observable<ContactoI[]>{
    let direccion = this.url + "clientes/listadoContactoCliente/" + id + "/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.get<ContactoI[]>(direccion, {headers});
  }

  getAllPaises(): Observable<PaisesI[]>{
    let direccion = this.url + "base/pais/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.get<PaisesI[]>(direccion, {headers});
  }

  getSingleDepartamentoID(id_departamento: string):Observable<DepartamentosI[]>{
    let direccion = this.url + "base/api/departamentos/ID/" + id_departamento ;
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.get<DepartamentosI[]>(direccion, {headers});
  }

  getSingleDepartamentoIDPais(id_pais: string):Observable<DepartamentosI[]>{
    let direccion = this.url + "base/api/departamentos/" + id_pais ;
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.get<DepartamentosI[]>(direccion, {headers});
  }

  getSingleCiudadIDXDep(id_departamento: string):Observable<CiudadesI[]>{
    let direccion = this.url + "base/api/ciudades/" + id_departamento ;
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.get<CiudadesI[]>(direccion, {headers});
  }

  getSingleCiudadID(id_ciudad: string):Observable<CiudadesI[]>{
    let direccion = this.url + "base/api/ciudades/ID/" + id_ciudad ;
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.get<CiudadesI[]>(direccion, {headers});
  }

  getAllVersionesNorma(): Observable<versionesnormaI[]>{
    let direccion = this.url + "base/versiones_norma/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.get<versionesnormaI[]>(direccion, {headers});
  }

  getAllCertificacionesXCliente(id_cliente: string):Observable<CertificadoAllI[]>{
    let direccion = this.url + "clientes/listadoCertificadoCliente/" + id_cliente + "/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.get<CertificadoAllI[]>(direccion, {headers});
  }

  getAllCertificacionesXCodigo(codigo: string):Observable<CertificadoAllI[]>{
    let direccion = this.url + "clientes/consultarCertificado/" + codigo;
    //let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.get<CertificadoAllI[]>(direccion);
  }

  getAllFormulariosSaq(tipo_cliente: string): Observable<FormulariosSaqI[]>{
    let direccion = this.url + "base/api/formularios_saq/" + tipo_cliente + "/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.get<FormulariosSaqI[]>(direccion, {headers});
  }

  getArchivo(): Observable<FormulariosSaqI[]>{
    let direccion = this.url + "base/api/formularios_saq/";
    let headers = new HttpHeaders().set('Authorization', 'token ' + this.getToken());
    return this.http.get<FormulariosSaqI[]>(direccion, {headers});
  }

  getDescargarArchivo(codigo: string){
    let direccion = this.url + "clientes/descargarPDF/" + codigo;
    return direccion;
  }

  getToken() {
    return localStorage.getItem('token');
  }


}
