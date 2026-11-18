// Importa il tipo Routes per definire le rotte dell'applicazione Angular
import { Routes } from '@angular/router';

// Esporta l'array contenente tutte le rotte dell'applicazione
export const routes: Routes = [

  {
    // Percorso utilizzato per visualizzare l'elenco di tutti i post
    path: 'posts',

    // Caricamento lazy del componente PostsPage
    // import() carica il file solo quando viene richiesta questa pagina
    // then() recupera ed esporta il componente PostsPage dal modulo importato
    loadComponent: () => import('./pages/posts-page/posts-page').then((module) => module.PostsPage),
  },

  {
    // Percorso dinamico utilizzato per visualizzare il dettaglio di un singolo post
    // :id rappresenta un parametro variabile contenente l'identificativo del post
    // Esempio: /posts/5 visualizza il post con ID 5
    path: 'posts/:id',

    // Caricamento lazy del componente PostDetailPage
    // Il componente viene caricato soltanto quando si accede a questa rotta
    loadComponent: () =>
      import('./pages/post-detail-page/post-detail-page').then((module) => module.PostDetailPage),
  },

  {
    // Percorso iniziale dell'applicazione
    // Quando l'URL è vuoto, Angular esegue il reindirizzamento
    path: '',

    // Specifica che il percorso deve corrispondere esattamente alla stringa vuota
    pathMatch: 'full',

    // Reindirizza automaticamente alla pagina dell'elenco dei post
    redirectTo: 'posts',
  },

  {
    // Percorso jolly: intercetta tutti gli URL che non corrispondono alle rotte precedenti
    path: '**',

    // Reindirizza gli URL non riconosciuti alla pagina dell'elenco dei post
    redirectTo: 'posts',
  },
];