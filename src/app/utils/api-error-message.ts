import { HttpErrorResponse } from '@angular/common/http';

/**
 * Funzione di utilità centralizzata che riceve un errore generico catturato
 * da una chiamata HTTP e restituisce un messaggio chiaro per l'utente,
 * distinguendo tra risorsa inesistente (404) e assenza di rete (stato 0).
 */
export function apiErrorMessage(error: unknown): string {
  // Verifichiamo che l'errore sia effettivamente una risposta di errore HTTP di Angular
  if (error instanceof HttpErrorResponse) {
    // Stato 404 (Not Found): il server ha risposto, ma l'ID richiesto non esiste
    if (error.status === 404) {
      return 'Post non trovato (errore 404).';
    }

    // Stato 0: il browser non è riuscito nemmeno a contattare il server
    // (es. dispositivo offline, connessione assente o blocco CORS/rete)
    if (error.status === 0) {
      return 'Impossibile raggiungere il server: controlla la connessione di rete.';
    }
  }

  // Fallback per qualsiasi altro codice di errore HTTP (es. 500) o eccezione imprevista
  return 'Si è verificato un errore durante la richiesta. Riprova.';
}