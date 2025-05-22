// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BotPedidosComponent } from './bot-pedidos/bot-pedidos.component';
import { HomeComponent } from './home/home.component';
import { SaboresComponent } from './sabores/sabores.component';

export const routes: Routes = [

   { path: '', component: HomeComponent }, // Pantalla de inicio
  { path: 'sabores', component: SaboresComponent },
    { path: 'botpedidos', component: BotPedidosComponent },
    { path: 'home', component: HomeComponent },


 ];
