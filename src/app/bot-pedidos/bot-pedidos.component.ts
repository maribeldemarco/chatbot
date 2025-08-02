import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../services/productos.service';
import { HomeComponent } from "../home/home.component";
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'bot-pedidos',
  templateUrl: './bot-pedidos.component.html',
  styleUrls: ['./bot-pedidos.component.scss'],
  imports: [MatCardModule, RouterModule, MatIconModule, MatButtonModule, FormsModule, CommonModule, HomeComponent],
})
export class BotPedidosComponent implements OnInit {

  productos: any[] = [];
  mensaje = '';
  historial: { texto: string, emisor: 'usuario' | 'bot' }[] = [];

  @ViewChild('chatHistorial') chatHistorial!: ElementRef;

  constructor(
    private productosService: ProductosService,
    private router: Router
  ) {}

  ngOnInit(): void {
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

  cerrarChat() {
    this.router.navigate(['/home']);
  }

  enviar() {
    const mensajeUsuario = this.mensaje.trim();
    if (!mensajeUsuario) return;

    this.historial.push({ texto: mensajeUsuario, emisor: 'usuario' });
    this.mensaje = '';
    this.scrollToBottom();

    this.productosService.sendMessage(mensajeUsuario).subscribe({
      next: (res) => {
        this.historial.push({ texto: res.reply, emisor: 'bot' });
        this.scrollToBottom();
      },
      error: () => {
        this.historial.push({
          texto: 'Error al conectarse con el bot. Espera unos segundos. Probablemente este cargando...',
          emisor: 'bot'
        });
        this.scrollToBottom();
      }
    });
  }

  scrollToBottom() {
    if (this.chatHistorial) {
      setTimeout(() => {
        this.chatHistorial.nativeElement.scrollTop = this.chatHistorial.nativeElement.scrollHeight;
      }, 0);
    }
  }
}
