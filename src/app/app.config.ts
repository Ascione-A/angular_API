// Importa ApplicationConfig per configurare l'applicazione Angular
// e provideBrowserGlobalErrorListeners per gestire gli errori globali del browser
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

// Importa provideHttpClient per abilitare le richieste HTTP nell'applicazione
import { provideHttpClient } from '@angular/common/http';

// Importa provideRouter per configurare il sistema di navigazione Angular
import { provideRouter } from '@angular/router';

// Importa l'elenco delle rotte definite nel file app.routes.ts
import { routes } from './app.routes';

// Esporta la configurazione principale dell'applicazione Angular
export const appConfig: ApplicationConfig = {
  // Registra i provider globali utilizzati dall'applicazione
  providers: [
    // Attiva la gestione degli errori globali del browser
    provideBrowserGlobalErrorListeners(),

    // Abilita il servizio HttpClient per comunicare con le API
    provideHttpClient(),

    // Configura il sistema di routing utilizzando le rotte definite
    provideRouter(routes),
  ],
};