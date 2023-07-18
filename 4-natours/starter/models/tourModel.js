const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Must have a name'],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Must have a  duration'],
    },
    maxGroupSize: {
      type: Number,
      reuqired: [true, 'Must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'Must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.1,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'Must have summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Must have cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre('save', (next) => {
//   //console.log('will save...');
//   next();
// });
// tourSchema.post('save', (doc, next) => {
//   //console.log(doc);
//   next();
// });

tourSchema.pre('find', (next) => {
  //
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
