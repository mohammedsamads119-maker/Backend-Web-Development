const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail } = require('../repositories/userRepository');

const COST_FACTOR = 10;

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (await findUserByEmail(normalizedEmail)) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, COST_FACTOR);

  const user = await createUser({ name, email: normalizedEmail, passwordHash });

  return res.status(201).json({ id: user.id, name: user.name, email: user.email });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  const dummyHash = await bcrypt.hash('dummy_password', COST_FACTOR);
  const valid = user ? await bcrypt.compare(password, user.passwordHash) : await bcrypt.compare(password, dummyHash);

  if (!user || !valid) {
    return res.status(401).json({
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      },
    });
  }

  return res.status(200).json({ id: user.id, name: user.name, email: user.email });
}

module.exports = { register, login };
