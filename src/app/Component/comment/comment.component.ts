import { ChangeDetectorRef, Component, inject, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { CommentService } from '../../service/comment.service';
import { CommonModule } from '@angular/common';
import { Comment } from '../../Models/Comment.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment',
  imports: [CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() objectId = 0;
  commentsList: Comment[] = [];
  commentFlag: boolean = false;
  commentPrev: Comment = new Comment();
  commentsPrev: Comment[] = [];
  comment: Comment = new Comment();

  constructor(private commentService: CommentService) {

  }
  getComment(idAfter: bigint) {
    this.commentService.GetComment(idAfter).subscribe(
      data => {
        console.log("comment after get", data);
        this.commentFlag = true
        this.commentPrev = data;
        this.commentsPrev = [...this.commentsPrev, data]
        this.commentsList = [...this.commentsList, data]
        console.log("commentsList", this.commentsList);

      },
      error => {
        console.error('Error fetching project', error);
      }
    );
  }

  async saveComment() {
    if (this.comment.commentText != "") {

      try {
        this.comment.id = BigInt(0).toString();
        this.comment.objectId = this.objectId;

        const data = await this.commentService.AddComment(this.comment).toPromise();
        console.log("Data received:", data);
        if (data) {
          // שליפת ההערה שנוצרה מהמסד
          if (data.id !== undefined) {

            const idAfter = BigInt(data.id);
            this.getComment(idAfter)

          } else {
            console.error("ID is undefined in received data");
          }

          this.comment = new Comment();
        }
      } catch (err) {
        console.error("Error occurred:", err);
      }
    }
  }

  async updateComment(idOfProj: number) {
    for (let i = 0; i < this.commentsList.length; i++) {
      // if(this.comment.commentText !=""){
      if (this.commentsList[i].commentText != "") {
        this.commentsList[i].objectId = idOfProj

        const id = this.commentsList[i].id ?? '0';
        const idComment = BigInt(id);
        console.log("idComment", idComment);
        console.log("this.commentsList[i]", this.commentsList[i]);


        // השתמשי ב-UpdateComment עם idComment
        this.commentService.UpdateComment(idComment, this.commentsList[i]).subscribe(
          data => {
            console.log('Comment updated:', data);
          },
          error => {
            console.error('Error updating comment', error);
          }
        );
      }
    }
  }

  deleteCommentFromList(idComment: bigint) {
    for (let i = 0; i < this.commentsList.length; i++) {
      const commentId = this.commentsList[i].id;
      if (commentId !== undefined && BigInt(commentId) === idComment) {
        this.commentsList[i].commentText = "";
      }
    }
    console.log("this.commentsList after delete", this.commentsList);

  }

  deleteComment(comment: Comment) {
    if (comment.id !== undefined && comment.id !== null) {
      const id = BigInt(comment.id);

      this.commentService.DeleteComment((id)).subscribe(
        data => {
          console.log("Delete comment:", comment);
          this.commentsList = this.commentsList.filter(c => {
            const commentId = c.id ? BigInt(c.id) : undefined;
            return commentId !== id;
          });
          this.commentsPrev = this.commentsPrev.filter(c => {
            const commentId = c.id ? BigInt(c.id) : undefined;
            return commentId !== id;
          });
          console.log("commentsList after filter", this.commentsList);
        },
        error => {
          console.error('Error updating comment', error);
        }
      );
    } else {
      console.error('Comment id is not a valid bigint:', comment.id);
    }
  }

}
