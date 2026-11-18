// Importa Component per definire un componente Angular
// inject per ottenere le dipendenze senza utilizzare il costruttore
// OnInit per eseguire operazioni quando il componente viene inizializzato
// signal per creare variabili reattive
import { Component, inject, OnInit, signal } from '@angular/core';

// Importa ActivatedRoute per leggere i parametri della URL
// Router per effettuare la navigazione tra le pagine
// RouterLink per utilizzare i collegamenti di navigazione nel template
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

// Importa il servizio che gestisce le operazioni relative ai post
import { PostsService } from '../../services/posts.service';

// Importa il modello Post, che definisce la struttura dei dati di un post
import { Post } from '../../models/post';

// Importa una funzione che restituisce un messaggio di errore comprensibile
import { apiErrorMessage } from '../../utils/api-error-message';

// Decoratore che definisce le caratteristiche del componente Angular
@Component({
  // Importa RouterLink per poter utilizzare routerLink nel template HTML
  imports: [RouterLink],

  // Nome del selettore del componente
  selector: 'app-post-detail-page',

  // Indica il percorso del file CSS che contiene gli stili del componente
  styleUrl: './post-detail-page.css',

  // Indica il percorso del template HTML associato al componente
  templateUrl: './post-detail-page.html',
})

// Definisce ed esporta la classe PostDetailPage
// Implementa OnInit per eseguire il metodo ngOnInit all'inizializzazione
export class PostDetailPage implements OnInit {

  // Recupera il servizio ActivatedRoute per leggere i parametri della rotta corrente
  private readonly route = inject(ActivatedRoute);

  // Recupera il servizio Router per navigare tra le diverse pagine
  private readonly router = inject(Router);

  // Recupera PostsService per ottenere i dati dei post
  private readonly postsService = inject(PostsService);

  // Crea un signal che contiene il post selezionato
  // Può contenere un oggetto Post oppure null se non è disponibile
  readonly post = signal<Post | null>(null);

  // Crea un signal booleano che indica se il caricamento è in corso
  // Inizialmente è impostato su true
  readonly loading = signal(true);

  // Crea un signal che contiene un eventuale messaggio di errore
  // Inizialmente non è presente alcun errore (null)
  readonly error = signal<string | null>(null);

  // Metodo eseguito automaticamente quando il componente viene inizializzato
  ngOnInit(): void {

    // Si iscrive ai cambiamenti dei parametri della rotta
    // In questo modo rileva quando cambia l'ID del post nell'URL
    this.route.paramMap.subscribe((params) => {

      // Recupera il parametro id dalla URL e lo converte in un numero
      const id = Number(params.get('id'));

      // Azzera il post precedente prima di caricare quello nuovo
      this.post.set(null);

      // Azzera eventuali errori precedenti
      this.error.set(null);

      // Imposta lo stato di caricamento su true
      this.loading.set(true);

      // Controlla che l'ID sia un numero intero e maggiore o uguale a 1
      if (!Number.isInteger(id) || id < 1) {

        // Se l'ID non è valido, imposta un messaggio di errore 404
        this.error.set('Post non trovato (errore 404).');

        // Termina lo stato di caricamento
        this.loading.set(false);

        // Interrompe l'esecuzione del codice all'interno della funzione
        return;
      }

      // Chiama il servizio per recuperare il post corrispondente all'ID
      // subscribe permette di ricevere e gestire la risposta della richiesta
      this.postsService.getPost(id).subscribe({

        // Viene eseguito quando la richiesta termina correttamente
        // Salva il post ricevuto all'interno del signal post
        next: (post) => this.post.set(post),

        // Viene eseguito quando si verifica un errore durante la richiesta
        error: (error: unknown) => {

          // Converte l'errore ricevuto in un messaggio comprensibile
          this.error.set(apiErrorMessage(error));

          // Termina lo stato di caricamento
          this.loading.set(false);
        },

        // Viene eseguito quando la richiesta Observable termina
        // Imposta loading su false
        complete: () => this.loading.set(false),
      });
    });
  }

  // Metodo che permette di visualizzare il post precedente
  goToPrevious(): void {

    // Recupera l'ID del post attualmente visualizzato
    // Se post è null, id sarà undefined
    const id = this.post()?.id;

    // Controlla che l'ID esista e sia maggiore di 1
    if (id && id > 1) {

      // Naviga verso il post con ID inferiore di 1
      // void indica che il valore restituito dalla Promise non viene utilizzato
      void this.navigateTo(id - 1);
    }
  }

  // Metodo che permette di visualizzare il post successivo
  goToNext(): void {

    // Recupera l'ID del post attualmente visualizzato
    const id = this.post()?.id;

    // Controlla che l'ID esista e sia inferiore a 100
    if (id && id < 100) {

      // Naviga verso il post con ID superiore di 1
      void this.navigateTo(id + 1);
    }
  }

  // Metodo che verifica se è possibile visualizzare il post precedente
  canGoPrevious(): boolean {

    // Restituisce true se l'ID del post è maggiore di 1
    // Se il post non è disponibile, utilizza 1 come valore predefinito
    return (this.post()?.id ?? 1) > 1;
  }

  // Metodo che verifica se è possibile visualizzare il post successivo
  canGoNext(): boolean {

    // Restituisce true se l'ID del post è inferiore a 100
    // Se il post non è disponibile, utilizza 100 come valore predefinito
    return (this.post()?.id ?? 100) < 100;
  }

  // Metodo privato utilizzato per effettuare la navigazione verso un altro post
  // È privato perché viene utilizzato solamente all'interno di questa classe
  private navigateTo(id: number): void {

    // Naviga verso la pagina di dettaglio del post con l'ID specificato
    // L'URL risultante sarà /posts/ seguito dall'ID del post
    this.router.navigate(['/posts', id]);
  }
}