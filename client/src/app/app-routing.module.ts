import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Pagina de error */
import { ErrorpageComponent } from  './components/pages/errorpage/errorpage.component';

/* Pagina de inicio */
import { HomepageComponent } from  './components/pages/homepage/homepage.component';

/* Salas */
import { SalaManejoComponent } from  './components/sala/sala-manejo/sala-manejo.component';
import { SalaRegistroComponent } from  './components/sala/sala-registro/sala-registro.component';

/* Reservaciones */
import { ReservacionManejoComponent } from './components/reservacion/reservacion-manejo/reservacion-manejo.component';
import { ReservacionRegistroComponent } from './components/reservacion/reservacion-registro/reservacion-registro.component';

/* Usuarios */
import { UsuarioRegistroComponent } from './components/usuario/usuario-registro/usuario-registro.component';

const routes: Routes = [
  {path: "", redirectTo: "home", pathMatch: "full"},
  {path: "home", component: HomepageComponent},
  { path: "sala", component: SalaManejoComponent},
  { path: "sala/registro", component: SalaRegistroComponent},
  { path: "reservacion", component: ReservacionManejoComponent},
  { path: "reservacion/registro", component: ReservacionRegistroComponent},
  { path: "usuario/registro", component: UsuarioRegistroComponent},
  { path: "**", component: ErrorpageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
