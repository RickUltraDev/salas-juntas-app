import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";  //Ese es un servicio que hará httpRequests
import { environment } from '../../environments/environment';
import { Router } from "@angular/router";  //Es el router de angular para redirigir a otras paginas

import { ToastrService } from 'ngx-toastr'; //Para tener los mensaje de toast en pantalla

import { Observable } from "rxjs"; 

import { ModelSala } from '../models/ModelSala';

@Injectable({
  providedIn: 'root'
})
export class SalaService {
  //Api del backend
  apiUrl = environment.apiUlrl;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }
  //Headers que se enviarán al backend
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })};


  getMuestraSalas(): Observable<ModelSala>{
    return this.http.get<ModelSala>(this.apiUrl+'/api/sala/');
  }


  postRegistroSala(sala: ModelSala){
    return this.http.post(this.apiUrl+'/api/sala/registro', JSON.stringify(sala),this.httpOptions).subscribe((resp:any) => {
      this.toastr.success("Se ha guardado una nueva sala", "Nueva sala");  
      this.router.navigate(["/sala"]);
    }, (error:any)=>{
      this.toastr.error("No se ha guardado la sala","Error");    
    });
  }

  putEliminarSala(idSala: number){
    return this.http.delete(this.apiUrl+'/api/sala/elimina/'+idSala, this.httpOptions);
  }
   
  putEditarSala(idSala: number, sala: ModelSala){
    return this.http.put(this.apiUrl+'/api/sala/actualiza/'+idSala, JSON.stringify(sala), this.httpOptions);
  }



}
