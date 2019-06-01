import { UserImageDTO } from "../user-images";

export class UpdatePhotoGalleryResponse {

    public constructor (addedPhotos: UserImageDTO[]) {
        this.AddedPhotos = addedPhotos;
    }

    public AddedPhotos: UserImageDTO[];

}
