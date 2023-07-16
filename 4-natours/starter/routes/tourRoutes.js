const express = require('express');
const tourController = require('./../controllers/tourController');

//middleware
const tourRouter = express.Router();

tourRouter.param('id', tourController.checkID);

tourRouter //tours
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.checkBody,tourController.createTour);
   
tourRouter //tours
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = tourRouter;
