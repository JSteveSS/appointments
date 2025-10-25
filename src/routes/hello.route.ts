import { Router } from 'express';
const router = Router();

router.get('/', (_, res) => {
  res.json({ message: 'Hello from Express + Serverless!' });
});

export default router;