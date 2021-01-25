import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator'; //Para manejar la paginacion de la tabla
import { MatSort } from '@angular/material/sort'; //Para ordenar la tabla
import { MatTableDataSource } from '@angular/material/table'; //Para el manejo de la data
import { MatButtonModule } from '@angular/material/button'; //Para los botones material

import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators} from "@angular/forms"; //Para validar los formularios
import { Router } from '@angular/router'; //Para redireccionar a otra ruta si es que se necesita
import { ToastrService } from 'ngx-toastr'; //Para tener los mensaje de toast en pantalla
import { NgxSpinnerService } from 'ngx-spinner'; //Para el spinner de carga
import { faSearch, faExclamationCircle, faFileSignature, 
  faBuilding, faPeopleArrows, faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons'; //Iconos

//Servicios que usará el componente
import { SalaService } from '../../../services/sala.service';

//Modelos que usará el componente
import { ModelSala } from 'src/app/models/ModelSala';

//Modal service
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sala-manejo',
  templateUrl: './sala-manejo.component.html',
  styleUrls: ['./sala-manejo.component.css']
})
export class SalaManejoComponent implements OnInit, AfterViewInit {
  //Titulo de la pagina
  title = 'Lion Rooms | Manejo de salas';

  //Api del backend
  apiUrl = environment.apiUlrl;
  
  //Iconos
  faSearch = faSearch;
  faExclamationCircle = faExclamationCircle;
  faFileSignature = faFileSignature;
  faBuilding = faBuilding;
  faPeopleArrows = faPeopleArrows;
  faClock = faClock;
  faArrowRight = faArrowRight;

   //Variables para las reservaciones
   listaSalas: any = [];
   displayedColumns: string[] = [
     'idSala',
     'nombre',
     'num_piso',
     'capacidad_max',
     'acciones',
   ];
   diaHoy: Date = new Date(); 

   //Lista de datos de la tabla
   dataSource: MatTableDataSource<ModelSala>;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   @ViewChild(MatSort) sort: MatSort;

   //Variables para modales
   closeResult: String;

   //Formulario a usar
  editarForm: FormGroup; 

  constructor(
    private titleService: Title,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private salaService: SalaService,
    private modalService: NgbModal
  ) { 
    //Asigna los datos a la lista data source para el renderizado de la tabla
    this.dataSource = new MatTableDataSource(this.listaSalas);

    this.editarForm = this.builder.group({
      nombre: ["", [Validators.required,Validators.minLength(2), Validators.maxLength(70)]],
      num_piso: [null, [Validators.required,Validators.min(1),Validators.max(70)]],
      capacidad_max: [null, [Validators.required,Validators.min(1),Validators.max(30)]],
      hora_disp_inicial: ["", [Validators.required]], 
      hora_disp_final: ["", [Validators.required]]
    });

  }

  ngOnInit(): void {
    this.spinner();
    this.titleService.setTitle(this.title);
    this.cargarSalas();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //Filtrado en la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  spinner() {
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 500);
  }

  //Funciones en modales
  openDetalles(contentDetalles) {
    this.modalService
      .open(contentDetalles, {
        size: 'md',
        scrollable: true,
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openEditar(contentEditar, idSala: number, Sala: ModelSala) {
    this.modalService
      .open(contentEditar, {
        size: 'lg',
        scrollable: true,
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => {
          this.editarSala(idSala, Sala);
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
           this.cargarSalas();
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openElimina(contentElimina, idSala: number) {
    this.modalService
      .open(contentElimina, {
        size: 'md',
        scrollable: true,
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => {   
          this.eliminarSala(idSala);
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
 
  //Funcion para cargar las salas desde el backend atraves de un servicio
  cargarSalas() {
    return this.salaService.getMuestraSalas().subscribe(
      (resp: any) => {
        this.dataSource.data = resp['JsonArray'];
      },
      (error: any) => {
        if (error.status == 404) {
         this.dataSource.data = [];
        } else {
          this.toastr.error('Error en la aplicación', 'Error');
          this.router.navigate(['/home']);
        }
      });
   }

   editarSala(idSala: number, Sala: ModelSala){

    return this.salaService.putEditarSala(idSala, Sala).subscribe(
      (resp: any) => {
        this.toastr.success('Se han guardado los cambios a la sala', 'Cambio exitoso');
        this.cargarSalas();
      },
      (error: any) => {
        if (error.status == 404) {
          this.dataSource.data = [];
        } else {
          this.toastr.error('Error en la aplicación', 'Error');
          this.router.navigate(['/home']);
        }
      }
    );
  }

   eliminarSala(idSala: number){
    
    return this.salaService.putEliminarSala(idSala).subscribe(
      (resp: any) => {
        this.toastr.success('Se ha eliminado la sala con éxito', 'Sala eliminada');
        this.cargarSalas();
      },
      (error: any) => {
        if (error.status == 404) {
          this.dataSource.data = [];
        } else {
          this.toastr.error('Error en la aplicación', 'Error');
        }
      }
    );
  }




}
