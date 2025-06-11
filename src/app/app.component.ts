import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ContactoComponent } from './contacto/contacto.component';
import { SaboresComponent } from './sabores/sabores.component';
import { BotPedidosComponent } from './bot-pedidos/bot-pedidos.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ContactoComponent,NavbarComponent,SaboresComponent, HomeComponent],
  templateUrl: './app.component.html',
styleUrls: ['./app.component.scss']

})
export class AppComponent {
  title = 'proyectochatbot';



  



}
