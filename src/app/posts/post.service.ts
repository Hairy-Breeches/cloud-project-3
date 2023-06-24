import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { PostDataStorageService } from './posts-data-storgare.service';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  postsUpdated: Subject<Post[]> = new Subject<Post[]>();

  constructor(
    private http: HttpClient,
    private postDataStorageService: PostDataStorageService,
    private router: Router
  ) {}

  addPost(newPost: Post, image: File): void {
    const postData = new FormData();

    postData.append('title', newPost.title);
    postData.append('content', newPost.content);
    postData.append('image', image, newPost.title);


    this.http
      .post<{ message: string; post: Post}>(
        'http://13.48.195.6:80/api/posts',
        postData
      )
      .subscribe({
        next: (responseData) => {
          newPost.id = responseData.post.id;
          newPost.imagePath = responseData.post.imagePath
          this.router.navigate(['/']);

        },
      });

    this.posts.push(newPost);
    this.postsUpdated.next(this.posts.slice());
  }

  getPost() {
    this.http
      .get<{
        message: string;
        posts: {_id: string, title: string, content: string, imagePath: string, __v: number}[];
      }>('http://13.48.195.6:80/api/posts')
      .pipe(
        map(responseData => {
          return {
            message: responseData.message,
            posts: responseData.posts.map(
              (post) => {
                return {
                  id: post._id,
                  title: post.title,
                  content: post.content,
                  imagePath: post.imagePath
                };
              }
            )

          }

        })
      )
      .subscribe(responseData => {
        this.posts = responseData.posts;

        this.postsUpdated.next(this.posts.slice());
      });
  }

  deletePost(id: string): void {
    this.http
      .delete(`http://13.48.195.6:80/api/posts/${id}`)
      .subscribe((responseData) => {
        this.posts = this.posts.filter((post) => post.id != id);

        this.postsUpdated.next(this.posts.slice());
      });
  }

  editPost(currentPost: Post): void {
    if(typeof currentPost.imagePath !== 'string') {
      const postData = new FormData();
      console.log('triggered!')

      postData.append('id', currentPost.id)
      postData.append('title', currentPost.title);
      postData.append('content', currentPost.content);
      postData.append('image', currentPost.imagePath, currentPost.title);

      this.http
      .put<{message: string}>('http://13.48.195.6:80/api/posts/' + currentPost.id, postData)
      .subscribe((responseData) => {
        this.router.navigate([''])
      });

    }


    this.http
      .put<{message: string}>('http://13.48.195.6:80/api/posts/' + currentPost.id, currentPost)
      .subscribe((responseData) => {
        this.router.navigate([''])
      });


  }

  getPostByIdDb(id: string) {

    return this.http.get<{message: string, post: Post}>(`http://13.48.195.6:80/api/posts/${id}`);
  }
}
