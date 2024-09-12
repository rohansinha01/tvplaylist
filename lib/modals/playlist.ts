import {Schema, model, models} from "mongoose";

const PlaylistSchema = new Schema(
    {
        title: {type: "string", required: true},
        description: {type: "string"},
        user: {type: Schema.Types.ObjectId, ref: "User"},
        category: {type: Schema.Types.ObjectId, ref: "Category"},
    },
    {
        timestamps: true,
    }
);

const Playlist = models.Playlist || model("Playlist", PlaylistSchema);

export default Playlist;