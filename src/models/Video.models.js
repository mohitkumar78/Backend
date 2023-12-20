import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-paginate-v2'
const Videoschema = new mongoose.Schema({
    Videofile: {
        type: String, // cloudnary url
        requrired: true,
    },
    thumbnail: {
        type: String,
        requrired: true,
    },
    title: {
        type: String,
        requrired: true
    },
    description: {
        type: String,
        requrired: true
    },
    duration: {
        type: Number, // clodnary url
        requrired: true,
    },
    view: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {
    timestamps: true
})
Videoschema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model('Video', Videoschema)