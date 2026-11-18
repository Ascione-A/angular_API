// Importa TestBed per configurare e gestire l'ambiente di test Angular
import { TestBed } from '@angular/core/testing';

// Importa provideRouter per configurare il sistema di routing durante i test
import { provideRouter } from '@angular/router';

// Importa il componente principale dell'applicazione
import { App } from './app';

// Raggruppa tutti i test relativi al componente App
describe('App', () => {

  // beforeEach viene eseguito prima di ogni singolo test
  // async permette di utilizzare operazioni asincrone
  beforeEach(async () => {

    // Configura il modulo di test di Angular
    await TestBed.configureTestingModule({

      // Importa il componente App da testare
      imports: [App],

      // Configura il router con un array vuoto di rotte
      // In questo modo il componente può utilizzare il routing durante i test
      providers: [provideRouter([])],

    // Completa la compilazione dei componenti prima di eseguire i test
    }).compileComponents();
  });

  // Primo test: verifica che il componente principale venga creato correttamente
  it('should create the app', () => {

    // Crea un'istanza del componente App nell'ambiente di test
    const fixture = TestBed.createComponent(App);

    // Recupera l'istanza della classe TypeScript del componente
    const app = fixture.componentInstance;

    // Verifica che il componente esista e non sia null o undefined
    expect(app).toBeTruthy();
  });

  // Secondo test: verifica che l'intestazione dell'applicazione venga visualizzata
  it('should render the application header', async () => {

    // Crea un'istanza del componente App
    const fixture = TestBed.createComponent(App);

    // Attende che il componente abbia completato le operazioni asincrone
    await fixture.whenStable();

    // Recupera l'elemento HTML generato dal componente
    const compiled = fixture.nativeElement as HTMLElement;

    // Cerca l'elemento HTML con classe CSS "brand"
    // e verifica che il suo contenuto testuale includa "Postboard"
    expect(compiled.querySelector('.brand')?.textContent).toContain('Postboard');
  });
});