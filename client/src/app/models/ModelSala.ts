export class ModelSala {
    public nombre: string;
    public num_piso: number;
    public capacidad_max: number;
    public hora_disp_inicial: string;
    public hora_disp_final: string;

    constructor(){
     this.nombre = '',
     this.num_piso = 0,
     this.capacidad_max = 0,
     this.hora_disp_inicial = '',
     this.hora_disp_final = ''
    }
}