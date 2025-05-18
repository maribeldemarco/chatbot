import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { ProductosService } from '../services/productos.service';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bot-pedidos',
  templateUrl: './bot-pedidos.component.html',
  styleUrls: ['./bot-pedidos.component.scss'],
  imports: [MatCardModule, MatButtonModule, CommonModule],
})
export class BotPedidosComponent implements OnInit {

  productos: any[] = [];

  constructor(private productosService: ProductosService) {}

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
}
