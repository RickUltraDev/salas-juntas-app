import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* Localización mexicana para los pipes */
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
registerLocaleData(localeEsMx, 'es-Mx');

/* HTTP Module for RestAPI */
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Animaciones de Toast */
import { ToastrModule } from 'ngx-toastr';

/* Fontawesome */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

/* Ngbootstrap y animaciones */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Ngx-Spinner */
import { NgxSpinnerModule } from 'ngx-spinner';

/* Angular Material componentes */
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
/* Chips  */
import { MatChipsModule } from '@angular/material/chips';
/* Tables */
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { getSpanishPaginatorIntl } from './translate/spanish-paginator-intl';
import { MatSortModule } from '@angular/material/sort';
/* Input  */
import { MatInputModule } from '@angular/material/input';
/* Icons */
import { MatIconModule } from '@angular/material/icon';
/* Select */
import { MatSelectModule } from '@angular/material/select';

/* Pipe cambio de formato 24hrs a 12hrs */
import { ConvertFrom24To12FormatPipe } from './pipes/convert-from24-to12-format.pipe';

/*Componentes de las paginas principales */
import { HomepageComponent } from './components/pages/homepage/homepage.component';
import { FooterComponent } from './components/pages/footer/footer.component';
import { NavbarHomeComponent } from './components/pages/navbar-home/navbar-home.component';
import { ErrorpageComponent } from './components/pages/errorpage/errorpage.component';

/* Componentes de las salas */
import { SalaManejoComponent } from './components/sala/sala-manejo/sala-manejo.component';
import { SalaRegistroComponent } from './components/sala/sala-registro/sala-registro.component';

/* Componentes de las reservaciones */
import { ReservacionManejoComponent } from './components/reservacion/reservacion-manejo/reservacion-manejo.component';
import { ReservacionRegistroComponent } from './components/reservacion/reservacion-registro/reservacion-registro.component';

/* Componentes de los usuarios */
import { UsuarioRegistroComponent } from './components/usuario/usuario-registro/usuario-registro.component';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    FooterComponent,
    NavbarHomeComponent,
    ErrorpageComponent,
    SalaManejoComponent,
    SalaRegistroComponent,
    ReservacionManejoComponent,
    ReservacionRegistroComponent,
    ConvertFrom24To12FormatPipe,
    UsuarioRegistroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 1650,
      progressBar: true,
      progressAnimation: 'decreasing',
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FontAwesomeModule,
    NgxSpinnerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule,
    MatBadgeModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatSelectModule,
  ],
  providers: [
    Title,
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
    { provide: LOCALE_ID, useValue: 'es-Mx' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
