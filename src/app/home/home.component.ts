import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'] // <- Corregido aquí
})
export class HomeComponent {

  constructor(private router: Router) {}


  abrirBot() {
    this.router.navigate(['/botpedidos']);
  }

  abrirFaq() {
    this.router.navigate(['/faq']);
  }

}
