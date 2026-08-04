import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/*
 * Este é o ponto de entrada da aplicação.
 *
 * Quando o navegador abre o site, o Angular inicia por este arquivo. A função
 * bootstrapApplication cria a aplicação usando AppComponent como componente
 * principal e appConfig como a lista de serviços disponíveis para toda a
 * aplicação.
 *
 * A inicialização é assíncrona, por isso ela devolve uma Promise. Caso algo dê
 * errado nesse processo, o catch mostra o erro no console do navegador.
 */
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
