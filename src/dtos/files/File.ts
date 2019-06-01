
export class File {

    constructor (file: any) {
        this.Buffer         = file.buffer;
        this.Encoding       = file.encoding;
        this.FieldName      = file.fieldname;
        this.MimeType       = file.mimetype;
        this.OriginalName   = file.originalname;
        this.Size           = file.size;
    }

    public Buffer: Buffer;

    public Encoding: string;

    public FieldName: string;

    public MimeType: string;

    public OriginalName: string;

    public Size: number;

}
