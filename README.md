# Postboard

Applicazione Angular standalone per consultare i post di
[JSONPlaceholder](https://jsonplaceholder.typicode.com/).

## Funzionalità

- Elenco post con conteggio e filtro per titolo o testo.
- Dettaglio del post su `/posts/:id`, con navigazione al precedente e al
  successivo.
- Creazione con `POST /posts`: JSONPlaceholder simula la risposta ma non salva
  i dati in modo permanente; il post creato viene aggiunto allo stato locale
  dell'applicazione.
- Servizio `PostsService` basato su `HttpClient`, con i post conservati in un
  signal privato ed esposti in sola lettura.
- Indicatori di caricamento e messaggi distinti per risorsa non trovata (404)
  e rete non disponibile (stato 0).

## Avvio

```bash
npm install
npm start
```

Apri l'indirizzo mostrato da Angular CLI (normalmente
`http://localhost:4200/`). La pagina iniziale reindirizza a `/posts`.

## Verifica

```bash
ng build
npm test -- --watch=false
```

Repository pubblico: <https://github.com/Ascione-A/angular_API>
