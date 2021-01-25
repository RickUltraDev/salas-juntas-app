export class ModelUsuario {
    public nombre: string;
    public ap_paterno: string;
    public ap_materno: string;
    public correo: string;
    public contrasena: string;

    constructor(){
     this.nombre = '',
     this.ap_paterno = '',
     this.ap_materno = '',
     this.correo = '',
     this.contrasena = ''
    }
}