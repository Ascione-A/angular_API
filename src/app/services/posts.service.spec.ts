import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { apiErrorMessage } from '../utils/api-error-message';
import { PostsService } from './posts.service';
import { NewPost, Post } from '../models/post';

describe('PostsService', () => {
  let service: PostsService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostsService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PostsService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('loads the list and publishes it through the readonly signal', () => {
    const posts: Post[] = [{ id: 1, userId: 1, title: 'Titolo', body: 'Testo' }];

    service.getPosts().subscribe();
    httpTesting.expectOne('https://jsonplaceholder.typicode.com/posts').flush(posts);

    expect(service.posts()).toEqual(posts);
  });

  it('loads a single post by id', () => {
    const post: Post = { id: 4, userId: 1, title: 'Titolo', body: 'Testo' };

    service.getPost(4).subscribe((result) => expect(result).toEqual(post));
    httpTesting.expectOne('https://jsonplaceholder.typicode.com/posts/4').flush(post);
  });

  it('posts a new item and adds the simulated response to the signal', () => {
    const draft: NewPost = { userId: 1, title: 'Nuovo', body: 'Contenuto' };
    const response: Post = { ...draft, id: 101 };

    service.createPost(draft).subscribe();
    const request = httpTesting.expectOne('https://jsonplaceholder.typicode.com/posts');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(draft);
    request.flush(response);

    expect(service.posts()).toEqual([{ ...response, createdLocally: true }]);
  });

  it('distinguishes a missing post from a network failure', () => {
    expect(apiErrorMessage(new HttpErrorResponse({ status: 404 }))).toContain('404');
    expect(apiErrorMessage(new HttpErrorResponse({ status: 0 }))).toContain('rete');
  });
});
