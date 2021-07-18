//Creating a Schema for Mongoose: (by default it is in models folder)
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const BootcampSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    points: {
        type: String,
        required: true
    },
    example: String,
    complexity: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
});

BootcampSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});


module.exports = mongoose.model('Bootcamp', BootcampSchema);
//exporting BootcampSchema as a mongoose model, named as 'Bootcamp'.