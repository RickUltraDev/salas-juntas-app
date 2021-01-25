import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";  //Ese es un servicio que hará httpRequests
import { environment } from '../../environments/environment';
import { Router } from "@angular/router";  //Es el router de angular para redirigir a otras paginas

import { ToastrService } from 'ngx-toastr'; //Para tener los mensaje de toast en pantalla

import { Observable } from "rxjs"; 

import { ModelReservacion } from '../models/ModelReservacion'; //Modelos que usará el servicio

@Injectable({
  providedIn: 'root'
})
export class ReservacionService {

  //Api del backend
  apiUrl = environment.apiUlrl;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }
  //Headers que se enviarán al backend
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })};

    getMuestraReservaciones(): Observable<ModelReservacion>{
      return this.http.get<ModelReservacion>(this.apiUrl+'/api/reservacion/');
    }

    postRegistroReservacion(reservacion: ModelReservacion){
      return this.http.post(this.apiUrl+'/api/reservacion/registro', JSON.stringify(reservacion),this.httpOptions).subscribe((resp:any) => {
        this.toastr.success("Se ha reservado una sala", "Nueva reservacion");  
        this.router.navigate(["/reservacion"]);
      }, ((err: any) =>{
        if (err.status === 400) {
          this.toastr.warning(err.error.message, 'No se ha reservado');
        }else if(err.status === 404) {
          this.toastr.warning(err.error.message, 'No se ha reservado');
        } else {
          this.toastr.error('Error en la aplicación.', 'Error');
          this.router.navigate(['/home']);
        }
      }));
    }

    deleteEliminarReservacion(idReservacion: number){
      return this.http.delete(this.apiUrl+'/api/reservacion/elimina/'+idReservacion, this.httpOptions);
    }

    putFinalizarReservacion(idReservacion: number){
      return this.http.put(this.apiUrl+'/api/reservacion/finaliza/'+idReservacion, this.httpOptions);
    }

    putEditarReservacion(idReservacion: number, Reservacion: ModelReservacion){
      return this.http.put(this.apiUrl+'/api/reservacion/actualiza/'+idReservacion, JSON.stringify(Reservacion), this.httpOptions);
    }

}
