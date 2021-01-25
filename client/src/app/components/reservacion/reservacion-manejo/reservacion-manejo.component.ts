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
  faBuilding, faPeopleArrows, faClock,
  faCalendarDay, faUser, faUserFriends, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons'; //Iconos

//Servicios que usará el componente
import { ReservacionService } from '../../../services/reservacion.service';
import { SalaService } from '../../../services/sala.service';
import { UsuarioService } from '../../../services/usuario.service';

//Modelos que usará el componente
import { ModelReservacion } from 'src/app/models/ModelReservacion';

//Modal service
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reservacion-manejo',
  templateUrl: './reservacion-manejo.component.html',
  styleUrls: ['./reservacion-manejo.component.css']
})
export class ReservacionManejoComponent implements OnInit, AfterViewInit {
  //Titulo de la pagina
  title = 'Lion Rooms | Reservaciones';

  //Api del backend
  apiUrl = environment.apiUlrl;
  
  //Iconos
  faSearch = faSearch;
  faExclamationCircle = faExclamationCircle;
  faFileSignature = faFileSignature;
  faBuilding = faBuilding;
  faPeopleArrows = faPeopleArrows;
  faClock = faClock;
  faCalendar = faCalendarDay;
  faUser = faUser;
  faUserFriends = faUserFriends;
  faLock = faLock;
  faEnvelope = faEnvelope;

  //Variables para las reservaciones
  listaReserv: any = [];
  displayedColumns: string[] = [
    'idReservacion',
    'fecha',
    'hora',
    'sala',
    'estado',
    'reservado_por',
    'acciones'
  ];

  //Lista de datos de la tabla
  dataSource: MatTableDataSource<ModelReservacion>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Variables para modales
  closeResult: String;

  //Formulario a usar
  editarForm: FormGroup; 
  public Reservacion: ModelReservacion;
  listaSalas: any = [];
  listaUsuarios: any = [];

  constructor(
    private titleService: Title,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private reservacionService: ReservacionService,
    private salaService: SalaService,
    private usuarioService: UsuarioService,
    private modalService: NgbModal
  ) { 
    //Asigna los datos a la lista data source para el renderizado de la tabla
    this.dataSource = new MatTableDataSource(this.listaReserv);

    this.editarForm = this.builder.group({
      fecha: [""], 
      hora_inicial: ["", Validators.required], 
      hora_final: ["", Validators.required],
      num_asistentes:[null ,[Validators.required,Validators.min(1),Validators.max(50)]],
      asunto: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      correoUsuario: [null],
      idSala: [null, Validators.required],
    });

    this.Reservacion = new ModelReservacion();
    this.Reservacion.idSala = null;
    this.editarForm.setValue(this.Reservacion);

  }

  ngOnInit(): void {
    this.spinner();
    this.titleService.setTitle(this.title);
    this.cargarReservaciones();
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

   //Funcion para cargar las salas desde el backend atraves de un servicio
   cargarUsuarios() {
    return this.usuarioService.getMuestraUsuarios().subscribe(
      (resp: any) => {
        this.listaUsuarios = resp['JsonArray'];
        console.log(this.listaUsuarios);
        
      },
      (error: any) => {
        if (error.status == 404) {
         this.listaUsuarios = [];
        } else {
          this.toastr.error('Error en la aplicación', 'Error');
          this.router.navigate(['/home']);
        }
      });
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

  openElimina(contentElimina, idReservacion: number) {
    this.modalService
      .open(contentElimina, {
        size: 'md',
        scrollable: true,
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => {   
           this.eliminarReservacion(idReservacion);
           
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openEditar(contentEditar, idReservacion: number, Reservacion: ModelReservacion) {
    this.modalService
      .open(contentEditar, {
        size: 'lg',
        scrollable: true,
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => {
          this.editarReservacion(idReservacion, Reservacion);          
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
           this.cargarReservaciones();
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openFinaliza(contentFinaliza, idReservacion: number) {
    this.modalService
      .open(contentFinaliza, {
        size: 'md',
        scrollable: true,
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => {   
           this.finalizarReservacion(idReservacion);
           
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openUsuarios(contentUsuario) {
    this.cargarUsuarios();
    this.modalService
      .open(contentUsuario, {
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


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

   //Funcion para cargar las reservaciones desde el backend atraves de un servicio
   cargarReservaciones() {
    return this.reservacionService.getMuestraReservaciones().subscribe(
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

    //Funcion para eliminar una reservacion registrada
    eliminarReservacion(idReservacion: number){  
      return this.reservacionService.deleteEliminarReservacion(idReservacion).subscribe(
        (resp: any) => {
          this.toastr.success('Se ha eliminado la reservacion con éxito', 'Reservacion eliminada');
          this.cargarReservaciones();
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

     //Funcion para editar una reservacion y enviarla al backend
   editarReservacion(idReservacion: number, Reservacion: ModelReservacion){

    return this.reservacionService.putEditarReservacion(idReservacion, Reservacion).subscribe(
      (resp: any) => {
        this.toastr.success('Se han guardado los cambios de la reservacion', 'Cambio exitoso');
        this.cargarReservaciones();
      },(err: any) =>{
        if (err.status === 400) {
          this.toastr.warning(err.error.message, 'No se guardo el cambio');
        }else if(err.status === 404) {
          this.toastr.warning(err.error.message, 'No se guardo el cambio');
        } else {
          this.toastr.error('Error en la aplicación.', 'Error');
          this.router.navigate(['/home']);
        }
      });
  }

    //Funcion para eliminar una reservacion registrada
    finalizarReservacion(idReservacion: number){  
      return this.reservacionService.putFinalizarReservacion(idReservacion).subscribe(
        (resp: any) => {
          this.toastr.success('Se ha terminado su reservación, nos vemos.', 'Reservacion actualizada');
          this.cargarReservaciones();
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
function contentDetalles(contentDetalles: any) {
  throw new Error('Function not implemented.');
}

