import { z } from 'zod';
import { HealthCheckRating } from '../types.ts';

const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

const DischargeSchema = z.object({
  date: z.string(),
  criteria: z.string(),
});

const SickLeaveSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
});

const HealthCheckRatingSchema = z.union([
  z.literal(HealthCheckRating.Healthy),
  z.literal(HealthCheckRating.LowRisk),
  z.literal(HealthCheckRating.HighRisk),
  z.literal(HealthCheckRating.CriticalRisk),
]);

export const NewEntrySchema = z.discriminatedUnion('type', [
  BaseEntrySchema.extend({
    type: z.literal('Hospital'),
    discharge: DischargeSchema,
  }),

  BaseEntrySchema.extend({
    type: z.literal('OccupationalHealthcare'),
    employerName: z.string(),
    sickLeave: SickLeaveSchema.optional(),
  }),

  BaseEntrySchema.extend({
    type: z.literal('HealthCheck'),
    healthCheckRating: HealthCheckRatingSchema,
  }),
]);