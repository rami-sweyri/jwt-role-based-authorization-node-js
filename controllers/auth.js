const bcrypt = require('bcrypt');
const _ = require('lodash');
const {validateSignup, validateLogin} = require('../validator/auth')
const {User} = require('../models/user');

exports.me = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
}

exports.userId = async (req, res) => {
  const user = await User.findById(req.params.userId).select('-password');
  res.send(user);
}

exports.signup = async (req, res) => {
  const { error } = validateSignup(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('Authorization', token).send(_.pick(user, ['_id', 'name', 'email']));
}

exports.login = async (req, res) => {
  const { error } = validateLogin(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  const userId = user._id;
  res.status(200).send({token, userId : userId.toString()});
}