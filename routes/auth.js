const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const on = require('await-on')

const User = require('../models/user')

const mailer = require('../lib/mailer')

router.post('/signup', async function(req, res, next) {
  const {username, password} = req.body;
  const user = new User({username});

  //closures to reuse short variable names
  {
    const [err] = await on(user.setPassword(password));
    if(err) return res.status(400).json({user: err.message})
  }

  {
    const [err] = await on(user.save());
    if(err) return res.status(400).json({user: err.message})
  }

  const expiresIn = Number(process.env.JWT_EXPIRE_IN_SECS)
  const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn});

  res.status(200).json({token})

  mailer.send({
    to: username,
    subject: 'Welcome to Bookr!',
    text: 'You can start using the app now!',
  })

});

router.post('/login', async function(req, res, next) {
  const {username, password} = req.body;

  const [err,user] = await User.findOne({username}).exec().handle()
  if(err) return res.status(400).json({user: err.message})

  const [authErr] = await user.authenticate(password).handle()
  if(authErr) return res.status(400).json({user: authErr})

  const expiresIn = Number(process.env.JWT_EXPIRE_IN_SECS)
  const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn});

  res.status(200).json({token})

});

module.exports = router;
