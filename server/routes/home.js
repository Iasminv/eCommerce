import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Home page');
});

// router.get('/users', (req, res) => {
//   res.send('aaaaaaaaa');
// })

export default router;