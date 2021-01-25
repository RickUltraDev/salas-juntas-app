import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators} from "@angular/forms"; //Para validar los formularios
import { Router } from '@angular/router'; //Para redireccionar a otra ruta si es que se necesita
import { ToastrService } from 'ngx-toastr'; //Para tener los mensaje de toast en pantalla
import { NgxSpinnerService } from 'ngx-spinner'; //Para el spinner de carga

//Servicios que usará el componente
import { ScrollTopService } from '../../../services/scroll-top.service'; //Es un servicio para poner ubicar la ventana
import { SalaService } from '../../../services/sala.service';
import { ReservacionService } from '../../../services/reservacion.service';

//Modelos que usará el componente
import { ModelReservacion } from 'src/app/models/ModelReservacion';

@Component({
  selector: 'app-reservacion-registro',
  templateUrl: './reservacion-registro.component.html',
  styleUrls: ['./reservacion-registro.component.css']
})
export class ReservacionRegistroComponent implements OnInit {
  //Titulo de la pagina
  title = 'Lion Rooms | Registro reservacion';

  //Api del backend
  apiUrl = environment.apiUlrl;

  //Formulario a usar
  public Reservacion: ModelReservacion;
  registroForm: FormGroup; 
  listaSalas: any = [];


  constructor(
    private titleService: Title,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private salaService: SalaService,
    private reservacionService: ReservacionService,
    private scrollTopService: ScrollTopService
  ) { 
    this.registroForm = this.builder.group({
      fecha: ["", Validators.required], 
      hora_inicial: ["", Validators.required], 
      hora_final: ["", Validators.required],
      num_asistentes:[null ,[Validators.required,Validators.min(1),Validators.max(50)]],
      asunto: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      correoUsuario: ["", [Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$'),
       Validators.required, Validators.email, Validators.maxLength(80)]],
      idSala: [null, Validators.required],
    });

    this.Reservacion = new ModelReservacion();
    this.Reservacion.idSala = null;
    this.registroForm.setValue(this.Reservacion);
  }

  ngOnInit(): void {
    this.spinner();
    this.scrollTopService.setScrollTop();
    this.titleService.setTitle(this.title);
    this.cargarSalas();
  }

  spinner() {
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 500);
  }

  //Funcion para cargar las salas desde el backend atraves de un servicio
  cargarSalas() {
    return this.salaService.getMuestraSalas().subscribe(
      (resp: any) => {
        this.listaSalas = resp['JsonArray'];
      },
      (error: any) => {
        if (error.status == 404) {
         this.listaSalas = [];
        } else {
          this.toastr.error('Error en la aplicación', 'Error');
          this.router.navigate(['/home']);
        }
      });
   }

  postRegistro(){
    try {
      if (!this.registroForm.invalid) {               
        this.reservacionService.postRegistroReservacion(this.Reservacion);
      }
    } catch (err) {
      console.log(err);
    }
      
   }

}
