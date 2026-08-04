import { Routes } from '@angular/router';
import { CadastroClienteComponent } from './components/cadastro-cliente/cadastro-cliente.component';
import { ListaComponent } from './components/lista/lista.component';

/*
 * Cada rota associa um endereço do navegador a um componente. O menu muda a
 * URL e o RouterOutlet do AppComponent exibe o componente correspondente.
 */
export const routes: Routes = [
  { path: 'cadastro', component: CadastroClienteComponent },
  { path: 'cadastro/:id', component: CadastroClienteComponent },
  { path: 'consulta', component: ListaComponent },

  // Ao entrar no endereço principal, direciona para a página de cadastro.
  { path: '', redirectTo: 'cadastro', pathMatch: 'full' },

  // Qualquer endereço desconhecido também volta para o cadastro.
  { path: '**', redirectTo: 'cadastro' }
];
