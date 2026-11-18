// Importa Component per definire un componente Angular
import { Component } from '@angular/core';

// Importa RouterLink per creare collegamenti tra le pagine
// e RouterOutlet per visualizzare il componente associato alla rotta corrente
import { RouterLink, RouterOutlet } from '@angular/router';

// Decoratore che fornisce ad Angular le informazioni necessarie
// per configurare il componente
@Component({
  // Dichiara le direttive e i componenti utilizzabili nel template HTML
  // RouterLink gestisce i collegamenti di navigazione
  // RouterOutlet permette di caricare dinamicamente le pagine
  imports: [RouterLink, RouterOutlet],

  // Nome del selettore utilizzato per richiamare il componente nell'applicazione
  selector: 'app-root',

  // Percorso del file CSS che definisce lo stile del componente
  styleUrl: './app.css',

  // Percorso del template HTML associato al componente
  templateUrl: './app.html',
})

// Esporta la classe principale del componente App
// Rappresenta il componente radice (root) dell'applicazione Angular
export class App {}