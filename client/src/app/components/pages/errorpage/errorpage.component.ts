import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

// Servicios que usará la página
import { ScrollTopService } from '../../../services/scroll-top.service';

@Component({
  selector: 'app-errorpage',
  templateUrl: './errorpage.component.html',
  styleUrls: ['./errorpage.component.css']
})
export class ErrorpageComponent implements OnInit {
  //Titulo de la pagina
  title = 'Lion Rooms | Página error';

  constructor(
    private titleService:Title,
    private scrollTopService: ScrollTopService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.scrollTopService.setScrollTop();
  }

}
