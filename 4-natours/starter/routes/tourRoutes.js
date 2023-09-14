const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const tourRouter = express.Router();

tourRouter
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
tourRouter.route('/tour-stats').get(tourController.getTourStats);
tourRouter.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
tourRouter
  .route('/')
  //.get(tourController.getAllTours)
  .get(authController.protect, tourController.getAllTours)
  .post(authController.protect, tourController.createTour);
tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = tourRouter;
