import { HttpErrorResponse } from '@angular/common/http';

export function apiErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 404) {
      return 'Post non trovato (errore 404).';
    }

    if (error.status === 0) {
      return 'Impossibile raggiungere il server: controlla la connessione di rete.';
    }
  }

  return 'Si è verificato un errore durante la richiesta. Riprova.';
}
