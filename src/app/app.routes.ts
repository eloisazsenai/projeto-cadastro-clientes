import { Routes } from '@angular/router';
import { CadastroClienteComponent } from './components/cadastro-cliente/cadastro-cliente.component';
import { ListaComponent } from './components/lista/lista.component';
import { HomeComponent } from './components/home/home.component';

/*
 * Cada rota associa um endereço do navegador a um componente. O menu muda a
 * URL e o RouterOutlet do AppComponent exibe o componente correspondente.
 */
export const routes: Routes = [
  { path: 'cadastro', component: CadastroClienteComponent },
  { path: 'cadastro/:id', component: CadastroClienteComponent },
  { path: 'consulta', component: ListaComponent },
  {path: 'home', component: HomeComponent},

  // Ao entrar no endereço principal, direciona para a página home.
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Qualquer endereço desconhecido também volta para.
  { path: '**', redirectTo: 'home' }
];
