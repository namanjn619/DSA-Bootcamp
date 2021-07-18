const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Bootcamp = require('../models/bootcamp');
const { bootcampSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

//importing all routes(controllers):
const bootcamps = require('../controllers/bootcamps');
//------------------------------------------//
//Middlewares:
const validateBootcamp = (req, res, next) => {
    //not working with create and edit question right now
    const { error } = bootcampSchema.validate(req.body);
    console.log(error);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
//------------------------------------------//
//creating product page
router.get('/', catchAsync(bootcamps.index));
//------------------------------------------//
//creating new question
router.get('/new', isLoggedIn, bootcamps.renderNewForm);

router.post('/', isLoggedIn, catchAsync(bootcamps.createBootcamp));
//------------------------------------------//
//creating show page
router.get('/:id', catchAsync(bootcamps.showBootcamp));
//------------------------------------------//
//Editing the question
router.get('/:id/edit', isLoggedIn, catchAsync(bootcamps.renderEditForm));

router.put('/:id', isLoggedIn, catchAsync(bootcamps.updateBootcamp));
//------------------------------------------//
//Delete a Question
router.delete('/:id', isLoggedIn, catchAsync(bootcamps.deleteBootcamp));
//------------------------------------------//
module.exports = router;