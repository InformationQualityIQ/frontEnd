import { ClienteI } from "./Cliente.interface";
export interface clientesrequest{
    success:string;
    status:string;
    mensaje:string;
    document: ClienteI[];
}