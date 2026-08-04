import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

/*
 * Configuração global da aplicação.
 *
 * "providers" são recursos que o Angular cria e disponibiliza por injeção de
 * dependência. Assim, componentes podem pedir esses recursos no construtor sem
 * precisar criá-los manualmente.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Habilita a navegação entre páginas definidas em app.routes.ts.
    provideRouter(routes),

    // Permite injetar HttpClient para fazer requisições a APIs HTTP.
    provideHttpClient()
  ]
};
