export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  // Proprietà opzionale usata nel template per contrassegnare i post creati localmente dal form
  createdLocally?: boolean;
}