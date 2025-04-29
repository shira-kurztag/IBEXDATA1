export class Comment {
    id?: string = BigInt(0).toString();
    commentText?: string = "";
    commentStatus?: boolean = false;
    pageId?: number = 0;
    isAddedToApprovalRights?: boolean = false;
    dateUpdate?: Date = new Date();
    objectId!: number;
}