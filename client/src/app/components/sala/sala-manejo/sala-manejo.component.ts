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
import { faSearch } from '@fortawesome/free-solid-svg-icons'; //Iconos

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




}
