// Importa gli strumenti Angular necessari:
// Component per definire il componente,
// computed per creare valori derivati,
// inject per recuperare i servizi,
// OnInit per gestire l'inizializzazione,
// signal per creare dati reattivi.
import { Component, computed, inject, OnInit, signal } from '@angular/core';

// Importa FormsModule per gestire i campi dei form
import { FormsModule } from '@angular/forms';

// Importa RouterLink per creare collegamenti tra le pagine
import { RouterLink } from '@angular/router';

// Importa la funzione che converte gli errori API in messaggi leggibili
import { apiErrorMessage } from '../../utils/api-error-message';

// Importa il servizio che gestisce le richieste relative ai post
import { PostsService } from '../../services/posts.service';

// Decoratore che configura il componente Angular
@Component({
  // Moduli e direttive utilizzabili nel template HTML
  imports: [FormsModule, RouterLink],

  // Nome del selettore del componente
  selector: 'app-posts-page',

  // Percorso del file CSS del componente
  styleUrl: './posts-page.css',

  // Percorso del template HTML del componente
  templateUrl: './posts-page.html',
})

// Classe principale della pagina che mostra l'elenco dei post
// Implementa OnInit per eseguire operazioni quando il componente viene inizializzato
export class PostsPage implements OnInit {

  // Recupera un'istanza di PostsService tramite il sistema di Dependency Injection di Angular
  private readonly postsService = inject(PostsService);

  // Espone i post gestiti dal servizio
  readonly posts = this.postsService.posts;

  // Indica se il caricamento iniziale dei post è in corso
  readonly loading = signal(true);

  // Indica se l'operazione di creazione di un nuovo post è in corso
  readonly posting = signal(false);

  // Memorizza un eventuale messaggio di errore
  // Il valore iniziale null indica che non ci sono errori
  readonly error = signal<string | null>(null);

  // Memorizza il testo inserito dall'utente nel campo di ricerca
  readonly filter = signal('');

  // Calcola automaticamente il numero totale di post presenti
  readonly postCount = computed(() => this.posts().length);

  // Calcola l'elenco dei post visibili in base al filtro di ricerca
  readonly visiblePosts = computed(() => {

    // Recupera il testo del filtro, elimina gli spazi iniziali e finali
    // e lo converte in minuscolo per rendere la ricerca indipendente dalle maiuscole
    const query = this.filter().trim().toLocaleLowerCase();

    // Restituisce soltanto i post il cui titolo o contenuto include il testo cercato
    return this.posts().filter(
      (post) =>
        post.title.toLocaleLowerCase().includes(query) ||
        post.body.toLocaleLowerCase().includes(query),
    );
  });

  // Variabili che memorizzano il titolo e il contenuto del nuovo post
  // Sono collegate ai campi del form nel template HTML
  draftTitle = '';
  draftBody = '';

  // Metodo eseguito automaticamente quando Angular inizializza il componente
  ngOnInit(): void {

    // Avvia il caricamento dei post dal servizio
    this.loadPosts();
  }

  // Aggiorna il filtro di ricerca quando l'utente modifica il campo di input
  setFilter(event: Event): void {

    // Verifica che l'elemento che ha generato l'evento sia un campo input HTML
    if (event.target instanceof HTMLInputElement) {

      // Aggiorna il signal filter con il testo inserito dall'utente
      this.filter.set(event.target.value);
    }
  }

  // Gestisce la creazione di un nuovo post
  createPost(): void {

    // Elimina eventuali spazi iniziali e finali dal titolo
    const title = this.draftTitle.trim();

    // Elimina eventuali spazi iniziali e finali dal contenuto
    const body = this.draftBody.trim();

    // Interrompe l'operazione se:
    // - il titolo è vuoto
    // - il contenuto è vuoto
    // - è già in corso un'altra operazione di creazione
    if (!title || !body || this.posting()) {
      return;
    }

    // Rimuove eventuali messaggi di errore precedenti
    this.error.set(null);

    // Segnala che la creazione del post è iniziata
    this.posting.set(true);

    // Chiama il servizio per inviare il nuovo post all'API
    // userId: 1 indica l'utente associato al post
    this.postsService.createPost({ userId: 1, title, body }).subscribe({

      // Eseguito quando la richiesta HTTP restituisce correttamente il nuovo post
      next: () => {

        // Svuota il campo del titolo dopo la creazione
        this.draftTitle = '';

        // Svuota il campo del contenuto dopo la creazione
        this.draftBody = '';
      },

      // Eseguito se la richiesta HTTP restituisce un errore
      error: (error: unknown) => {

        // Converte l'errore in un messaggio comprensibile e lo salva nel signal
        this.error.set(apiErrorMessage(error));

        // Segnala che l'operazione di creazione è terminata
        this.posting.set(false);
      },

      // Eseguito quando l'Observable termina correttamente
      complete: () => this.posting.set(false),
    });
  }

  // Metodo privato che recupera l'elenco dei post dal servizio
  private loadPosts(): void {

    // Segnala che il caricamento dei post è iniziato
    this.loading.set(true);

    // Azzera eventuali errori precedenti
    this.error.set(null);

    // Richiede al servizio l'elenco dei post e si iscrive alla risposta
    this.postsService.getPosts().subscribe({

      // Eseguito se la richiesta HTTP restituisce un errore
      error: (error: unknown) => {

        // Converte l'errore in un messaggio leggibile e lo memorizza
        this.error.set(apiErrorMessage(error));

        // Segnala che il caricamento è terminato
        this.loading.set(false);
      },

      // Eseguito quando il caricamento termina correttamente
      complete: () => this.loading.set(false),
    });
  }
}