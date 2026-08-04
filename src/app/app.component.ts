import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CadastroClienteComponent } from './components/cadastro-cliente/cadastro-cliente.component';

/*
 * @Component transforma a classe abaixo em um componente Angular.
 * Um componente une três partes: comportamento (TypeScript), estrutura (HTML)
 * e aparência (CSS).
 */
@Component({
  // Nome da tag HTML usada para inserir este componente (veja index.html).
  selector: 'app-root',

  // Standalone dispensa a criação de um AppModule para registrar o componente.
  standalone: true,

  // Componentes e recursos que este template tem permissão para utilizar.
  imports: [RouterOutlet, CadastroClienteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // Propriedade disponível no template por meio de {{ title }}, se necessário.
  title = 'projeto-cadastro-clientes';
}
