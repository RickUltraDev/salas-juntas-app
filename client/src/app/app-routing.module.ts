import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Navbar home */
import { NavbarHomeComponent }  from './components/pages/navbar-home/navbar-home.component';

/* Pagina de inicio */
import { HomepageComponent } from  './components/pages/homepage/homepage.component';

/* Salas */
import { SalaManejoComponent } from  './components/sala/sala-manejo/sala-manejo.component';
import { SalaRegistroComponent } from  './components/sala/sala-registro/sala-registro.component';


const routes: Routes = [
  {path: "", redirectTo: "home", pathMatch: "full"},
  {path: "home", component: HomepageComponent},
  { path: "sala", component: SalaManejoComponent},
  { path: "sala/registro", component: SalaRegistroComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
