export class ModelReservacion {
    public fecha: string;
    public hora_inicial: string;
    public hora_final: string;
    public num_asistentes: number;
    public asunto: string;
    public estado: string;
    public correo: string;
    public idSala: number;

    constructor(){
     this.fecha = '',
     this.hora_inicial = '',
     this.hora_final = '',
     this.num_asistentes = 0,
     this.asunto = '',
     this.estado = '',
     this.correo = '',
     this.idSala = 0
    }
}