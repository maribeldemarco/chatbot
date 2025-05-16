import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

import {MatCardModule} from '@angular/material/card';


/** @title Simple form field */
@Component({

   standalone: true,

 selector: 'bot-pedidos',

  templateUrl: './bot-pedidos.component.html',
  styleUrls: ['./bot-pedidos.component.scss'],
  imports: [MatCardModule,MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotPedidosComponent {}


