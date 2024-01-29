import { ClienteI } from "./Cliente.interface";
import { FormulariosSaqI } from "./formulariosSaq.interface";
import { versionesnormaI } from "./versionnorma.interface";

export interface CertificadoAllI{
    
    id_certificado: string;
    fecha_emision: string;
    fecha_vencimiento: string;
    estado_certificado: string;
    cliente_id: string;
    versiones_norma_id: string;
    nivel: string;
    tipo_cliente: string;
    codigo_certificado: string;
    cliente: ClienteI;
    versiones_norma: versionesnormaI;
    formularios_saq: FormulariosSaqI;
    
}