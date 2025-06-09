import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../services/productos.service';
import {MatCard, MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap'
@Component({
  selector: 'app-sabores',
  standalone: true,
  imports: [MatCardModule, MatCardModule, CommonModule, NgbCarouselModule],
  templateUrl: './sabores.component.html',
  styleUrl: './sabores.component.scss'
})
export class SaboresComponent {
  sabores: any[] = []
  mostrarFlechas = true;

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

