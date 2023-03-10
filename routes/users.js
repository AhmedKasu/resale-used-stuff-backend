const express = require('express');
const router = express.Router();
const Joi = require('joi');
const usersStore = require('../store/users');
const validateWith = require('../middleware/validation');

const pattern = '^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$';

const schema = {
  name: Joi.string().required().min(2),
  email: Joi.string().email().required(),
  password: Joi.string().regex(RegExp(pattern)).required().min(8),
};

router.post('/', validateWith(schema), (req, res) => {
  const { name, email, password } = req.body;
  if (usersStore.getUserByEmail(email))
    return res
      .status(400)
      .send({ error: 'A user with the given email already exists.' });

  const user = { name, email, password };
  usersStore.addUser(user);

  res.status(201).send(user);
});

router.get('/', (req, res) => {
  res.send(usersStore.getUsers());
});

module.exports = router;
