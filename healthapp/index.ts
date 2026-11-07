
import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';

const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (
    !req.query.height ||
    !req.query.weight ||
    !Number.isFinite(height) ||
    !Number.isFinite(weight) ||
    height <= 0 ||
    weight <= 0
  ) {
    return res.status(400).json({
      error: 'malformatted parameters'
    });
  }

  return res.json({
    weight,
    height,
    bmi: calculateBmi(height, weight)
  });
});

app.post('/exercises', (req, res) => {
  const body: unknown = req.body;

  if (
    typeof body !== 'object' ||
    body === null ||
    Array.isArray(body)
  ) {
    return res.status(400).json({
      error: 'malformatted parameters'
    });
  }

  const data = body as Record<string, unknown>;

  if (
    data.daily_exercises === undefined ||
    data.target === undefined
  ) {
    return res.status(400).json({
      error: 'parameters missing'
    });
  }

  if (
    !Array.isArray(data.daily_exercises) ||
    data.daily_exercises.length === 0
  ) {
    return res.status(400).json({
      error: 'malformatted parameters'
    });
  }

  const isValidNumber = (value: unknown): boolean => {
    if (typeof value === 'number') {
      return Number.isFinite(value);
    }

    if (typeof value === 'string' && value.trim() !== '') {
      return Number.isFinite(Number(value));
    }

    return false;
  };

  if (
    !isValidNumber(data.target) ||
    !data.daily_exercises.every(isValidNumber)
  ) {
    return res.status(400).json({
      error: 'malformatted parameters'
    });
  }

  const target = Number(data.target);
  const dailyExercises = data.daily_exercises.map(Number);

  if (
    target <= 0 ||
    dailyExercises.some(hours => hours < 0)
  ) {
    return res.status(400).json({
      error: 'malformatted parameters'
    });
  }

  const result = calculateExercises(dailyExercises, target);

  return res.json(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
