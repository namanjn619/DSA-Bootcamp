const Bootcamp = require('../models/bootcamp');


module.exports.index = async (req, res) => {
    const bootcamps = await Bootcamp.find({});
    res.render('bootcamps/index', { bootcamps });
}

module.exports.renderNewForm = (req, res) => {
    res.render('bootcamps/new')
}

module.exports.createBootcamp = async (req, res, next) => {
    const newQuestion = new Bootcamp(req.body);
    await newQuestion.save();
    req.flash('success', 'Successfully Created a new Question');
    res.redirect(`/bootcamps/${newQuestion._id}`);
}

module.exports.showBootcamp = async (req, res) => {
    const { id } = req.params;
    const bootcamp = await (await Bootcamp.findById(id).populate('reviews')).populate('author');
    if (!bootcamp) {
        req.flash('error', " can not find that Question!")
        return res.redirect('/bootcamps');
    }
    res.render('bootcamps/show', { bootcamp });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const bootcamp = await Bootcamp.findById(id);
    if (!bootcamp) {
        req.flash('error', " cannot find that Question!")
        return res.redirect('/bootcamps');
    }
    res.render('bootcamps/edit', { bootcamp })
}

module.exports.updateBootcamp = async (req, res) => {
    const { id } = req.params;
    const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    req.flash('success', 'Successfully Updated a new Question');
    res.redirect(`/bootcamps/${bootcamp._id}`);
}

module.exports.deleteBootcamp = async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Bootcamp.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted a Question');
    res.redirect('/bootcamps');
}