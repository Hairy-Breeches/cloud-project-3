import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { mimeTypeValidator } from './mime-type.validator';

import { Post } from '../post.model';

import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html'
})


export class PostCreateComponent implements OnInit {
  mode = 'create-mode';
  postId = '';
  post: Post = {
    id: '',
    title: '',
    content: '',
    imagePath: null
  };
  isLoading = false;
  postForm: FormGroup;
  imagePreview: string = null;

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.postForm = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)], updateOn: 'change'}),
      'postImage': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeTypeValidator]}),
      'content': new FormControl('No content!', {validators: [Validators.required]})
    });

    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit-mode';
        this.postId = paramMap.get('postId');

        this.postService.getPostByIdDb(this.postId).subscribe(responseData => {
          const returnedPost = responseData.post;
          this.postId = responseData.post.id;
          this.post = returnedPost;
          console.log('returnedPost: ', this.post)

          this.postForm.setValue({
            'title': this.post.title,
            'content': this.post.content,
            'postImage': this.post.imagePath
          })

        })

      } else {
        this.post = null;
        this.mode = 'create-mode';
        this.postId = null;

      }
    })
  }

  onImagePicked(event: Event): void {
    if(this.mode === 'edit-mode') {
      this.post.imagePath = null;

      const imageFile = (event.target as HTMLInputElement).files[0];
      this.postForm.patchValue({'postImage': imageFile})
      this.postForm.get('postImage').updateValueAndValidity();

      const reader = new FileReader();
      reader.readAsDataURL(imageFile);

      reader.onload = () => {
        this.imagePreview = reader.result as string;

      }

    }

    const imageFile = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({'postImage': imageFile})
    this.postForm.get('postImage').updateValueAndValidity();

    const reader = new FileReader();
    reader.readAsDataURL(imageFile);

    reader.onload = () => {
      this.imagePreview = reader.result as string;

    }


  }

  onAddPost() {
    if(this.postForm.invalid)
      return;

    const title = this.postForm.value.title;
    const image = this.postForm.value.postImage;
    const content = this.postForm.value.content;


    if(this.mode === 'create-mode') {
      const newPost = new Post(this.postId, title, content, null);
      this.isLoading = true;
      this.postService.addPost(newPost, this.postForm.value.postImage);
      this.isLoading = false;

    } else {
      const currentPost = new Post(this.postId, title, content, image);
      this.isLoading = true;
      this.postService.editPost(currentPost);
      this.isLoading = false;

    }

  }

  onCancelEdit(): void {
    this.router.navigate(['/']);

  }

}
