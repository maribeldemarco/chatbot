// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ChatBotComponent } from './chat-bot/chat-bot.component';


export const routes: Routes = [
    { path: 'bot', component: ChatBotComponent },
 ];
