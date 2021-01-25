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

//Modelos que usará el componente
import { ModelSala } from 'src/app/models/ModelSala';

@Component({
  selector: 'app-sala-registro',
  templateUrl: './sala-registro.component.html',
  styleUrls: ['./sala-registro.component.css']
})
export class SalaRegistroComponent implements OnInit {
  //Titulo de la pagina
  title = 'Lion Rooms | Registro sala';

  //Api del backend
  apiUrl = environment.apiUlrl;

  //Formulario a usar
  public Sala: ModelSala;
  registroForm: FormGroup; 

  constructor(
    private titleService: Title,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private salaService: SalaService,
    private scrollTopService: ScrollTopService
  ) {
    this.registroForm = this.builder.group({
      nombre: ["", [Validators.required,Validators.minLength(2), Validators.maxLength(40)]],
      num_piso: [null, [Validators.required,Validators.min(1),Validators.max(50)]],
      capacidad_max: [null, [Validators.required,Validators.min(1),Validators.max(30)]],
      hora_disp_inicial: ["", [Validators.required]], 
      hora_disp_final: ["", [Validators.required]]
    });

    this.Sala = new ModelSala();
    this.registroForm.setValue(this.Sala);
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
         this.salaService.postRegistroSala(this.Sala);
      }
    } catch (err) {
      console.log(err);
    }
      
   }

}
