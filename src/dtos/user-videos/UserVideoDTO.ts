import { UserVideo } from "../../models";

export class UserVideoDTO {

    public constructor(userVideo: UserVideo) {

        this.ID     = userVideo.ID;
        this.Video  = userVideo.Video;
    }

    public ID: string;

    public Video: string;

}
