import { Component, Renderer2, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Post } from '../post.model'
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  private expand = false;
  posts: Post[] = [];
  private postServiceSub!: Subscription;

  constructor(
    private renderer: Renderer2, private postService: PostService,
    private router: Router

    ) { }

  ngOnInit(): void {
    this.postService.getPost()

    this.postServiceSub = this.postService.postsUpdated.subscribe({
      next: posts => {
          this.posts = posts;
          console.log('post: ', posts)
        }
    })
  }


  onClickPostItem(postItem: HTMLDivElement) {
    if(this.expand) {
      this.renderer.removeClass(postItem, 'expand')
      this.expand = !this.expand;
    } else {
      this.renderer.addClass(postItem, 'expand')
      this.expand = !this.expand
    }



  }

  onDeletePost(id: string): void {
    this.postService.deletePost(id)
  }

  onEditPost(id: string): void {
    this.router.navigate(['edit-post', id]);
  }

  ngOnDestroy(): void {
    this.postServiceSub.unsubscribe();
  }

}
