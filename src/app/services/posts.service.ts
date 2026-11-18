import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  // Iniezione di HttpClient come richiesto dal punto 1 della consegna
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  // Signal privato scrivibile e versione pubblica in sola lettura con asReadonly()
  private readonly _posts = signal<Post[]>([]);
  readonly posts = this._posts.asReadonly();

  // Notizie sportive italiane usate per sostituire al volo i testi in latino
  // restituiti da JSONPlaceholder, mantenendo comunque attive le vere chiamate HTTP.
  private readonly sportsTemplates: Array<{ title: string; body: string }> = [
    {
      title: 'Napoli, ritiro a Castel Volturno: gruppo al completo in vista del big match di Serie A',
      body: 'Seduta pomeridiana intensa per gli azzurri al centro sportivo di Castel Volturno. L’allenatore ha provato diverse soluzioni offensive con particolare attenzione alle palle inattive e alle ripartenze rapide.'
    },
    {
      title: 'Stadio Diego Armando Maradona verso il tutto esaurito per la sfida di domenica sera',
      body: 'Continua a ritmo serrato la prevendita dei biglietti per il prossimo turno di campionato a Fuorigrotta. Restano pochissimi tagliandi nei settori superiori: attesi oltre 50.000 spettatori.'
    },
    {
      title: 'Champions League, sorteggio infuocato: le italiane pronte alla fase a eliminazione diretta',
      body: 'Urna impegnativa per le squadre di Serie A nella massima competizione europea. Serviranno prestazioni di altissimo livello sia all’andata che al ritorno per conquistare i quarti di finale.'
    },
    {
      title: 'Calciomercato Napoli: la dirigenza osserva due giovani talenti per il centrocampo',
      body: 'Gli osservatori del club partenopeo sono al lavoro per individuare profili giovani ma già pronti per la Serie A, con l’obiettivo di garantire qualità e freschezza atletica nella mediana.'
    },
    {
      title: 'Serie A, corsa Scudetto equilibrata: quattro squadre racchiuse in cinque punti',
      body: 'Dopo l’ultimo turno di campionato la classifica resta cortissima nelle zone altissime. Gli scontri diretti delle prossime settimane saranno decisivi per tentare la prima vera fuga.'
    },
    {
      title: 'Napoli, numeri da record per la difesa azzurra: miglior rendimento interno del torneo',
      body: 'La solidità del reparto arretrato si conferma una delle armi principali della squadra. Nelle ultime cinque gare casalinghe sono arrivati quattro clean sheet grazie al pressing alto.'
    },
    {
      title: 'Nazionale Italiana: diramate le convocazioni per i prossimi impegni di Nations League',
      body: 'Il Commissario Tecnico ha ufficializzato la lista dei 26 calciatori chiamati a vestire la maglia azzurra. Spazio a diverse novità provenienti dalla Serie A accanto ai senatori.'
    },
    {
      title: 'Tennis, Sinner ancora protagonista sul cemento: conquistata un’altra semifinale ATP',
      body: 'Prestazione autoritaria dell’altoatesino che chiude l’incontro in due set senza concedere palle break. Percentuali altissime con la prima di servizio e grande solidità da fondocampo.'
    },
    {
      title: 'Primavera Napoli, vittoria in rimonta nel derby: decisiva una doppietta nella ripresa',
      body: 'Grande prova di carattere dei giovani azzurrini che ribaltano lo svantaggio iniziale nel secondo tempo sotto gli occhi dello staff tecnico della prima squadra.'
    },
    {
      title: 'Formula 1, la Ferrari prepara un nuovo pacchetto aerodinamico per il prossimo Gran Premio',
      body: 'I tecnici di Maranello hanno deliberato aggiornamenti al fondo e all’ala posteriore per migliorare la gestione delle gomme sul passo gara e ridurre il degrado nei curvoni veloci.'
    }
  ];

  /**
   * Trasforma un post ricevuto da JSONPlaceholder sostituendo il testo in latino
   * con una notizia sportiva in base al suo ID (così ogni ID ha sempre lo stesso titolo).
   */
  private mapToSportPost(post: Post): Post {
    // Se il post è appena stato creato dall'utente (ID > 100), manteniamo il testo inserito dall'utente
    if (post.id > 100) {
      return post;
    }
    const template = this.sportsTemplates[(post.id - 1) % this.sportsTemplates.length];
    return {
      ...post,
      title: `${template.title} (#${post.id})`,
      body: template.body,
    };
  }

  /**
   * GET elenco: scarica davvero i post da JSONPlaceholder con HttpClient,
   * li traduce in notizie sportive e aggiorna il signal privato `_posts`.
   */
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      map((posts) => posts.map((post) => this.mapToSportPost(post))),
      tap((sportsPosts) => this._posts.set(sportsPosts))
    );
  }

  /**
   * GET singolo elemento (`/risorsa/:id`):
   * Chiama realmente `GET /posts/:id` su JSONPlaceholder.
   * - Se l'ID non esiste (es. /posts/999), JSONPlaceholder risponde davvero con HTTP 404.
   * - Se manca Internet, HttpClient restituisce davvero errore con status 0.
   */
  getPost(id: number): Observable<Post> {
    // Se il post è uno di quelli appena creati localmente (ID > 100), lo leggiamo dal signal
    // perché JSONPlaceholder non salva davvero i POST su database
    const localNewPost = this._posts().find((p) => p.id === id && p.id > 100);
    if (localNewPost) {
      return new Observable<Post>((subscriber) => {
        subscriber.next(localNewPost);
        subscriber.complete();
      });
    }

    return this.http.get<Post>(`${this.apiUrl}/${id}`).pipe(
      map((post) => this.mapToSportPost(post)),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  /**
   * POST nuovo elemento: invia davvero la richiesta HTTP POST a JSONPlaceholder
   * e aggiunge il post creato in cima al signal `_posts`.
   */
  createPost(payload: { userId: number; title: string; body: string }): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, payload).pipe(
      tap((createdPost) => {
        // Calcoliamo un ID univoco locale per evitare collisioni se si creano più post di fila
        // (JSONPlaceholder risponde sempre con id: 101)
        const maxId = this._posts().reduce((max, p) => (p.id > max ? p.id : max), 100);
        const postWithUniqueId: Post = {
          ...createdPost,
          id: maxId + 1,
          createdLocally: true,
        };
        this._posts.update((current) => [postWithUniqueId, ...current]);
      })
    );
  }
}