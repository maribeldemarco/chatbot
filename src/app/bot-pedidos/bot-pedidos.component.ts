import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../services/productos.service';
import { HomeComponent } from "../home/home.component";

@Component({
  standalone: true,
  selector: 'bot-pedidos',
  templateUrl: './bot-pedidos.component.html',
  styleUrls: ['./bot-pedidos.component.scss'],
  imports: [MatCardModule, MatButtonModule,FormsModule, CommonModule, HomeComponent],
})
export class BotPedidosComponent implements OnInit {

  productos: any[] = [];
  mensaje = '';
  historial: { texto: string, emisor: 'usuario' | 'bot' }[] = [];

  // Inyectamos ambos servicios
  constructor(
    private productosService: ProductosService,
  ) {}

  ngOnInit(): void {
    // Cargar productos
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        console.log('Productos:', this.productos);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  enviar() {
    const mensajeUsuario = this.mensaje.trim();
    if (!mensajeUsuario) return;

    this.historial.push({ texto: mensajeUsuario, emisor: 'usuario' });
    this.mensaje = '';

    this.productosService.sendMessage(mensajeUsuario).subscribe({
      next: (res) => {
        this.historial.push({ texto: res.reply, emisor: 'bot' });
      },
      error: () => {
        this.historial.push({
          texto: 'Error al conectarse con el bot. ¿Está corriendo el backend o Ngrok?',
          emisor: 'bot'
        });
      }
    });
  }
}
