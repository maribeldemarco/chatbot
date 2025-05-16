// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import { BotPedidosComponent } from './bot-pedidos/bot-pedidos.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [

    { path: 'bot', component: ChatBotComponent },
    { path: 'botpedidos', component: BotPedidosComponent },
 ];
