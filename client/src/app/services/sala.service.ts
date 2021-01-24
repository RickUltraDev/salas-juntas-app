import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";  //Ese es un servicio que hará httpRequests
import { environment } from '../../environments/environment';
import { Router } from "@angular/router";  //Es el router de angular para redirigir a otras paginas

import { Observable } from "rxjs"; 

import { ModelSala } from '../models/ModelSala';

@Injectable({
  providedIn: 'root'
})
export class SalaService {
  //Api del backend
  apiUrl = environment.apiUlrl;

  constructor(private http: HttpClient, private router: Router) { }
  //Headers que se enviarán al backend
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })};


  getMuestraSalas(): Observable<ModelSala>{
    return this.http.get<ModelSala>(this.apiUrl+'/api/sala/');
  }


}
