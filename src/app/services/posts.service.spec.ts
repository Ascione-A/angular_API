// Importa HttpErrorResponse per simulare gli errori HTTP
// e provideHttpClient per configurare il client HTTP di Angular
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';

// Importa gli strumenti per intercettare e simulare le richieste HTTP nei test
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

// Importa TestBed per configurare e gestire l'ambiente di test Angular
import { TestBed } from '@angular/core/testing';

// Importa la funzione che trasforma gli errori API in messaggi leggibili
import { apiErrorMessage } from '../utils/api-error-message';

// Importa il servizio che si vuole testare
import { PostsService } from './posts.service';

// Importa i tipi utilizzati per rappresentare i post
import { NewPost, Post } from '../models/post';

// Raggruppa tutti i test relativi a PostsService
describe('PostsService', () => {

  // Dichiara la variabile che conterrà il servizio da testare
  let service: PostsService;

  // Dichiara il controller che permette di intercettare le richieste HTTP
  let httpTesting: HttpTestingController;

  // beforeEach viene eseguito prima di ogni singolo test
  beforeEach(() => {

    // Configura l'ambiente di test di Angular
    TestBed.configureTestingModule({

      // Registra il servizio e configura il client HTTP
      // provideHttpClientTesting permette di simulare le risposte del server
      providers: [PostsService, provideHttpClient(), provideHttpClientTesting()],
    });

    // Recupera un'istanza del servizio PostsService
    service = TestBed.inject(PostsService);

    // Recupera il controller per gestire le richieste HTTP simulate
    httpTesting = TestBed.inject(HttpTestingController);
  });

  // afterEach viene eseguito dopo ogni test
  // Verifica che non siano rimaste richieste HTTP non gestite
  afterEach(() => httpTesting.verify());

  // Verifica che il servizio carichi l'elenco dei post
  // e lo renda disponibile attraverso il signal in sola lettura
  it('loads the list and publishes it through the readonly signal', () => {

    // Crea un elenco di esempio contenente un post
    const posts: Post[] = [{ id: 1, userId: 1, title: 'Titolo', body: 'Testo' }];

    // Chiama getPosts() e si iscrive all'Observable
    service.getPosts().subscribe();

    // Intercetta la richiesta GET e simula una risposta contenente i post
    httpTesting.expectOne('https://jsonplaceholder.typicode.com/posts').flush(posts);

    // Verifica che il signal pubblico contenga esattamente i post ricevuti
    expect(service.posts()).toEqual(posts);
  });

  // Verifica che il servizio recuperi un singolo post tramite il suo ID
  it('loads a single post by id', () => {

    // Crea un post di esempio con ID 4
    const post: Post = { id: 4, userId: 1, title: 'Titolo', body: 'Testo' };

    // Chiama getPost(4) e verifica che il risultato ricevuto corrisponda al post atteso
    service.getPost(4).subscribe((result) => expect(result).toEqual(post));

    // Intercetta la richiesta GET relativa al post con ID 4
    // e simula la risposta del server
    httpTesting.expectOne('https://jsonplaceholder.typicode.com/posts/4').flush(post);
  });

  // Verifica che la creazione di un nuovo post aggiorni correttamente il signal
  it('posts a new item and adds the simulated response to the signal', () => {

    // Definisce i dati del nuovo post prima dell'invio
    const draft: NewPost = { userId: 1, title: 'Nuovo', body: 'Contenuto' };

    // Simula la risposta che il server restituirebbe dopo la creazione
    const response: Post = { ...draft, id: 101 };

    // Chiama createPost() e si iscrive all'Observable
    service.createPost(draft).subscribe();

    // Intercetta la richiesta HTTP inviata all'endpoint dei post
    const request = httpTesting.expectOne('https://jsonplaceholder.typicode.com/posts');

    // Verifica che il metodo HTTP utilizzato sia POST
    expect(request.request.method).toBe('POST');

    // Verifica che il corpo della richiesta contenga i dati del nuovo post
    expect(request.request.body).toEqual(draft);

    // Simula la risposta del server con il post appena creato
    request.flush(response);

    // Verifica che il signal contenga il nuovo post
    // con la proprietà createdLocally impostata a true
    expect(service.posts()).toEqual([{ ...response, createdLocally: true }]);
  });

  // Verifica che la funzione di gestione degli errori
  // distingua un post inesistente da un problema di rete
  it('distinguishes a missing post from a network failure', () => {

    // Simula un errore HTTP 404 (risorsa non trovata)
    // e verifica che il messaggio restituito contenga il codice 404
    expect(apiErrorMessage(new HttpErrorResponse({ status: 404 }))).toContain('404');

    // Simula un errore di rete (status 0)
    // e verifica che il messaggio restituito contenga la parola "rete"
    expect(apiErrorMessage(new HttpErrorResponse({ status: 0 }))).toContain('rete');
  });
});