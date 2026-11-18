// Importa bootstrapApplication, la funzione Angular che avvia un'applicazione standalone
import { bootstrapApplication } from '@angular/platform-browser';

// Importa la configurazione globale dell'applicazione
import { appConfig } from './app/app.config';

// Importa il componente principale (root) dell'applicazione
import { App } from './app/app';

// Avvia l'applicazione Angular utilizzando:
// - App come componente principale
// - appConfig come configurazione globale
bootstrapApplication(App, appConfig)

  // Gestisce eventuali errori che potrebbero verificarsi durante l'avvio
  // console.error() stampa l'errore nella console del browser
  .catch((err) => console.error(err));