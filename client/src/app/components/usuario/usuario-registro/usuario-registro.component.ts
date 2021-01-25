import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators} from "@angular/forms"; //Para validar los formularios
import { Router } from '@angular/router'; //Para redireccionar a otra ruta si es que se necesita
import { ToastrService } from 'ngx-toastr'; //Para tener los mensaje de toast en pantalla
import { NgxSpinnerService } from 'ngx-spinner'; //Para el spinner de carga

//Servicios que usará el componente
import { ScrollTopService } from '../../../services/scroll-top.service'; //Es un servicio para poner ubicar la ventana
import { UsuarioService } from '../../../services/usuario.service';

//Modelos que usará el componente
import { ModelUsuario } from 'src/app/models/ModelUsuario';

@Component({
  selector: 'app-usuario-registro',
  templateUrl: './usuario-registro.component.html',
  styleUrls: ['./usuario-registro.component.css']
})
export class UsuarioRegistroComponent implements OnInit {
  //Titulo de la pagina
  title = 'Lion Rooms | Registro usuario';

  //Api del backend
  apiUrl = environment.apiUlrl;

  //Formulario a usar
  public Usuario: ModelUsuario;
  registroForm: FormGroup; 

  constructor(
    private titleService: Title,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private usuarioService: UsuarioService,
    private scrollTopService: ScrollTopService
  ) { 
    this.registroForm = this.builder.group({
      nombre: ["", [Validators.required,Validators.minLength(2), Validators.maxLength(60)]],
      ap_paterno: ["", [Validators.required,Validators.minLength(2), Validators.maxLength(60)]],
      ap_materno: ["", [Validators.required,Validators.minLength(2), Validators.maxLength(60)]],
      correo: ["", [Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$'),
       Validators.required, Validators.email, Validators.maxLength(70)]], 
      contrasena: ["", [Validators.required,Validators.minLength(6), Validators.maxLength(72)]],
    });

    this.Usuario = new ModelUsuario();
    this.registroForm.setValue(this.Usuario);
  }

  ngOnInit(): void {
    this.spinner();
    this.scrollTopService.setScrollTop();
    this.titleService.setTitle(this.title);
  }

  spinner() {
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 500);
  }

  postRegistro(){
    try {
      if (!this.registroForm.invalid) {         
         this.usuarioService.postRegistroUsuario(this.Usuario);
      }
    } catch (err) {
      console.log(err);
    }
      
   }

}
