// Definisce ed esporta l'interfaccia Post, che descrive la struttura di un post
export interface Post {
  // Identificativo dell'utente che ha creato il post
  userId: number;

  // Identificativo univoco del post
  id: number;

  // Titolo del post
  title: string;

  // Contenuto testuale del post
  body: string;

  // Indica se il post è stato creato localmente
  // Il simbolo ? significa che questa proprietà è facoltativa
  createdLocally?: boolean;
}

// Crea ed esporta il tipo NewPost partendo dall'interfaccia Post
export type NewPost = Pick<Post, 'userId' | 'title' | 'body'>;

// Pick seleziona solo alcune proprietà di un'interfaccia o di un tipo esistente
// In questo caso NewPost contiene userId, title e body
// La proprietà id viene esclusa perché può essere generata successivamente
// Anche createdLocally viene esclusa