
import { isNotNumber } from './utils.ts';

export const calculateBmi = (
  height: number,
  weight: number
): string => {
  const bmi = weight / ((height / 100) ** 2);

  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi < 25) {
    return 'Normal range';
  } else if (bmi < 30) {
    return 'Overweight';
  } else {
    return 'Obese';
  }
};

const parseArguments = (args: string[]): [number, number] => {
  if (args.length !== 2) {
    throw new Error('Please provide exactly two arguments');
  }

  if (args.some(isNotNumber)) {
    throw new Error('Arguments must be numbers');
  }

  const height = Number(args[0]);
  const weight = Number(args[1]);

  if (height <= 0 || weight <= 0) {
    throw new Error('Height and weight must be positive');
  }

  return [height, weight];
};

if (process.argv[1] === import.meta.filename) {
  try {
    const [height, weight] = parseArguments(
      process.argv.slice(2)
    );

    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}
