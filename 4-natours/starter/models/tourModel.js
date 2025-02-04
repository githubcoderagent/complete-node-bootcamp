const mongoose = require('mongoose');
const slugify = require('slugify');
const logger = require('../utils/logger');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'Max name is 40'],
      minlength: [10, 'Min length for name is 10'],
    },
    duration: {
      type: Number,
      required: [true, 'Must have a  duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'Must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficulty'],
        message: '3 levels of difficulty',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.1,
      min: [1, 'Min is 1'],
      max: [5, 'Max is 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: `discount ({VALUE}) must be below price`,
      },
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
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
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (res, next) {
  logger.silly(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
