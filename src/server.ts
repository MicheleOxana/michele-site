import express from 'express';
import dotenv from 'dotenv';
import session from 'cookie-session';
import path from 'path';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
  name: 'session',
  keys: ['unicorn-sparkle'],
  maxAge: 24 * 60 * 60 * 1000 // 1 day
}));

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  const user = req.session.user || null;
  res.render('index', { user });
});

app.listen(PORT, () => {
  console.log(`✨ MicheleOxana site rodando na porta ${PORT}`);
});
