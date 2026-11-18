import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/post';
import { apiErrorMessage } from '../../utils/api-error-message';

@Component({
  // Importiamo RouterLink per poter usare la direttiva routerLink nel template HTML (es. link "Torna ai post")
  imports: [RouterLink],
  selector: 'app-post-detail-page',
  styleUrl: './post-detail-page.css',
  templateUrl: './post-detail-page.html',
})
export class PostDetailPage implements OnInit {
  // Iniezione delle dipendenze tramite la funzione moderna inject()
  private readonly route = inject(ActivatedRoute); // Serve per leggere i parametri dell'URL (es. :id)
  private readonly router = inject(Router); // Serve per navigare programmaticamente tra i post
  private readonly postsService = inject(PostsService); // Servizio che effettua le chiamate HTTP

  // Signal per gestire in modo reattivo lo stato della pagina di dettaglio
  readonly post = signal<Post | null>(null); // Contiene i dati del singolo post caricato
  readonly loading = signal(true); // Indica se la richiesta HTTP è in corso (spinner/caricamento)
  readonly error = signal<string | null>(null); // Contiene l'eventuale messaggio di errore da mostrare

  ngOnInit(): void {
    // Ci iscriviamo a paramMap (Observable) invece di usare snapshot:
    // in questo modo, quando l'utente clicca su "Precedente" o "Successivo",
    // l'URL cambia (/posts/1 -> /posts/2) senza ricreare il componente, e questo blocco si riesegue automaticamente.
    this.route.paramMap.subscribe((params) => {
      // Estraiamo il parametro 'id' dalla rotta e lo convertiamo in numero
      const id = Number(params.get('id'));

      // Resettiamo lo stato prima di avviare il nuovo caricamento
      this.post.set(null);
      this.error.set(null);
      this.loading.set(true);

      // Validazione preventiva lato client: se l'ID non è un intero positivo (es. /posts/abc o /posts/0),
      // impostiamo subito l'errore 404 senza effettuare chiamate HTTP inutili
      if (!Number.isInteger(id) || id < 1) {
        this.error.set('Post non trovato (errore 404).');
        this.loading.set(false);
        return;
      }

      // Richiediamo il singolo post al servizio tramite HttpClient (GET /posts/:id)
      this.postsService.getPost(id).subscribe({
        // Caso di successo: salviamo il post ricevuto nel signal
        next: (post) => this.post.set(post),
        // Caso di errore (es. 404 o rete assente 0): traduciamo l'errore in un messaggio leggibile e fermiamo il loading
        error: (error: unknown) => {
          this.error.set(apiErrorMessage(error));
          this.loading.set(false);
        },
        // Al completamento dello stream (a chiamata riuscita), disattiviamo l'indicatore di caricamento
        complete: () => this.loading.set(false),
      });
    });
  }

  /**
   * Naviga al post precedente (id - 1) se non siamo già al primo elemento (id = 1).
   */
  goToPrevious(): void {
    const id = this.post()?.id;
    if (id && id > 1) {
      void this.navigateTo(id - 1);
    }
  }

  /**
   * Naviga al post successivo (id + 1) se non abbiamo raggiunto l'ultimo elemento (id = 100).
   */
  goToNext(): void {
    const id = this.post()?.id;
    if (id && id < 100) {
      void this.navigateTo(id + 1);
    }
  }

  /**
   * Restituisce true se il pulsante "Precedente" deve essere abilitato (id > 1).
   */
  canGoPrevious(): boolean {
    return (this.post()?.id ?? 1) > 1;
  }

  /**
   * Restituisce true se il pulsante "Successivo" deve essere abilitato (id < 100).
   */
  canGoNext(): boolean {
    return (this.post()?.id ?? 100) < 100;
  }

  /**
   * Metodo di supporto per eseguire la navigazione verso la rotta /posts/:id.
   */
  private navigateTo(id: number): void {
    void this.router.navigate(['/posts', id]);
  }
}