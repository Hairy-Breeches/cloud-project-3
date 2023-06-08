import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostDataStorageService {
  constructor(private http: HttpClient) { }

  getPosts() {
    return this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts');
  }


}
