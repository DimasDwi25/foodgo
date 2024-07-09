import jsonServer from 'json-server';
import bodyParser from 'body-parser';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(bodyParser.json());

server.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get('users').value();

  const user = users.find(user => user.email === email && user.password === password);

  if (user) {
    res.status(200).json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

server.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = router.db.get('users').find({ email }).value();

  if (userExists) {
    res.status(400).json({ status: 'error', message: 'User already exists' });
  } else {
    const id = router.db.get('users').size().value() + 1;
    const newUser = { id, name, email, password, role };
    router.db.get('users').push(newUser).write();
    res.json({ status: 'success', user: newUser });
  }
});

server.post('/logout', (req, res) => {
  // Implementasi logout (bisa menggunakan token untuk autentikasi)
  res.json({ status: 'success', message: 'Logged out' });
});

server.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const user = router.db.get('users').find({ id: Number(id) }).assign(updates).write();

  if (user) {
    res.json({ status: 'success', user });
  } else {
    res.status(404).json({ status: 'error', message: 'User not found' });
  }
});

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
