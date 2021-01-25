import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";  //Ese es un servicio que hará httpRequests
import { environment } from '../../environments/environment';
import { Router } from "@angular/router";  //Es el router de angular para redirigir a otras paginas

import { ToastrService } from 'ngx-toastr'; //Para tener los mensaje de toast en pantalla

import { Observable } from "rxjs"; 

import { ModelUsuario } from '../models/ModelUsuario'; //Modelos que usará el servicio

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  //Api del backend
  apiUrl = environment.apiUlrl;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }
  //Headers que se enviarán al backend
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })};


  getMuestraUsuarios(): Observable<ModelUsuario>{
    return this.http.get<ModelUsuario>(this.apiUrl+'/api/usuario/');
  }

  postRegistroUsuario(usuario: ModelUsuario){
    return this.http.post(this.apiUrl+'/api/usuario/registro', JSON.stringify(usuario),this.httpOptions).subscribe((resp:any) => {
      this.toastr.success("Se ha guardado un nuevo usuario", "Nuevo usuario");  
      this.router.navigate(["/reservacion"]);
    }, (error:any)=>{
      this.toastr.error("No se ha guardado el usuario","Error");    
    });
  }
  
}
