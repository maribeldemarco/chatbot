import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../services/productos.service';
import {MatCard, MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-sabores',
  standalone: true,
  imports: [MatCardModule, MatCardModule, CommonModule],
  templateUrl: './sabores.component.html',
  styleUrl: './sabores.component.scss'
})
export class SaboresComponent {
  sabores: any[] = []
  
  constructor(private productosService: ProductosService) {}
   ngOnInit(): void {
    this.productosService.getSabores().subscribe({
      next: (data) => {
        this.sabores = data;
        console.log('Productos:', this.sabores);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

}

