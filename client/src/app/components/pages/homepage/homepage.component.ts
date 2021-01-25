import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  //Titulo de la pagina
  title = 'Lion Rooms | Inicio';

  private diasArray = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes','Sábado'];
  private date = new Date();

  public hora: any;
  public minuto: string;
  public segundo: string;
  public ampm: string;
  public dia: string;
  public fecha: any = (new Date().toISOString().slice(0, 10)).split('-').reverse().join('-') ;

  constructor(
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    
    setInterval(() =>{
      const date = new Date();
      this.actualizarFecha(date);
    }, 1000); //Será llamada cada segundo para actualizar
    this.dia = this.diasArray[this.date.getDay()]; //Te regresa el numero del dia que se tiene del 0 al 6
  }

  //Funcion para actulizar la fecha 
  private actualizarFecha(date : any){
     const horas = date.getHours();
     
     this.ampm = horas >= 12 ? 'PM' : 'AM';
     this.hora = horas % 12;
     this.hora = this.hora ? this.hora : 12;

     this.hora = this.hora < 10 ? '0' + this.hora : this.hora;
     const minutos =  date.getMinutes();
     this.minuto = minutos < 10 ? '0' + minutos : minutos.toString();

     const segundos = date.getSeconds();
     this.segundo = segundos < 10 ? '0' + segundos :  segundos.toString();
  }

}
