
import { useState, type FormEvent } from 'react';
import axios from 'axios';

import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import {
  HealthCheckRating,
  type HealthCheckRating as HealthCheckRatingType,
  type Diagnosis,
  type EntryWithoutId,
} from '../../types';

type EntryType = EntryWithoutId['type'];

type HealthCheckEntryWithoutId = Extract<
  EntryWithoutId,
  { type: 'HealthCheck' }
>;

interface Props {
  diagnoses: Diagnosis[];
  onSubmit: (values: EntryWithoutId) => Promise<void>;
  onCancel: () => void;
}

interface ValidationIssue {
  path?: (string | number)[];
  message: string;
}

interface ErrorResponse {
  error?: string | ValidationIssue[];
}

const AddEntryForm = ({
  diagnoses,
  onSubmit,
  onCancel,
}: Props) => {
  const [type, setType] = useState<EntryType>('HealthCheck');

  // Common fields
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  // HealthCheck fields
  const [healthCheckRating, setHealthCheckRating] =
    useState<HealthCheckRatingType | ''>('');

  // Hospital fields
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  // OccupationalHealthcare fields
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState('');
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState('');

  // Form state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const common = {
      date,
      description,
      specialist,
      ...(diagnosisCodes.length > 0 && { diagnosisCodes }),
    };

    let values: EntryWithoutId;

    switch (type) {
      case 'HealthCheck': {
        if (healthCheckRating === '') {
          setError('Please select a health check rating');
          return;
        }

        const healthCheckValues: HealthCheckEntryWithoutId = {
          ...common,
          type: 'HealthCheck',
          healthCheckRating,
        };

        values = healthCheckValues;
        break;
      }

      case 'Hospital': {
        values = {
          ...common,
          type: 'Hospital',
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        };
        break;
      }

      case 'OccupationalHealthcare': {
        if (
          Boolean(sickLeaveStartDate) !==
          Boolean(sickLeaveEndDate)
        ) {
          setError(
            'Both sick leave start date and end date must be provided'
          );
          return;
        }

        values = {
          ...common,
          type: 'OccupationalHealthcare',
          employerName,
          ...(sickLeaveStartDate && sickLeaveEndDate
            ? {
                sickLeave: {
                  startDate: sickLeaveStartDate,
                  endDate: sickLeaveEndDate,
                },
              }
            : {}),
        };
        break;
      }

      default: {
        const exhaustiveCheck: never = type;
        throw new Error(`Unknown entry type: ${exhaustiveCheck}`);
      }
    }

    setLoading(true);

    try {
      await onSubmit(values);
    } catch (err: unknown) {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        const issues = err.response?.data?.error;

        if (Array.isArray(issues)) {
          setError(
            issues
              .map((issue) => {
                const field = issue.path?.join('.') || 'Error';
                return `${field}: ${issue.message}`;
              })
              .join(', ')
          );
        } else {
          setError(
            typeof issues === 'string'
              ? issues
              : 'Failed to add entry'
          );
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={submit}
      sx={{
        border: '1px dashed',
        borderColor: 'grey.600',
        p: 1.5,
        mt: 2,
      }}
    >
      <Typography variant="subtitle1" fontWeight="medium" mb={1}>
        New {type} Entry
      </Typography>

      <Stack spacing={1}>
        {error && (
          <Alert severity="error" sx={{ py: 0 }}>
            {error}
          </Alert>
        )}

        {/* Entry Type */}
        <TextField
          select
          label="Entry Type"
          size="small"
          fullWidth
          value={type}
          onChange={(event) =>
            setType(event.target.value as EntryType)
          }
        >
          <MenuItem value="HealthCheck">HealthCheck</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">
            OccupationalHealthcare
          </MenuItem>
        </TextField>

        {/* Date */}
        <TextField
          label="Date"
          type="date"
          size="small"
          fullWidth
          required
          value={date}
          onChange={(event) => setDate(event.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />

        {/* Description */}
        <TextField
          label="Description"
          size="small"
          fullWidth
          required
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        {/* Specialist */}
        <TextField
          label="Specialist"
          size="small"
          fullWidth
          required
          value={specialist}
          onChange={(event) => setSpecialist(event.target.value)}
        />

        {/* Diagnosis Codes - Multiple Select */}
        <FormControl fullWidth size="small">
          <InputLabel id="diagnosis-codes-label">
            Diagnosis Codes
          </InputLabel>

          <Select<string[]>
            labelId="diagnosis-codes-label"
            multiple
            value={diagnosisCodes}
            onChange={(event) => {
              const value = event.target.value;
              setDiagnosisCodes(
                typeof value === 'string' ? value.split(',') : value
              );
            }}
            label="Diagnosis Codes"
            renderValue={(selected) => selected.join(', ')}
          >
            {diagnoses.map((diagnosis) => (
              <MenuItem
                key={diagnosis.code}
                value={diagnosis.code}
              >
                <Checkbox
                  checked={diagnosisCodes.includes(diagnosis.code)}
                />
                <ListItemText
                  primary={`${diagnosis.code} - ${diagnosis.name}`}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* HealthCheck fields */}
        {type === 'HealthCheck' && (
          <TextField
            select
            label="Health Check Rating (0-3)"
            size="small"
            fullWidth
            required
            value={healthCheckRating}
            onChange={(event) =>
              setHealthCheckRating(
                event.target.value === ''
                  ? ''
                  : Number(event.target.value) as HealthCheckRatingType
              )
            }
          >
            <MenuItem value={HealthCheckRating.Healthy}>
              0 - Healthy
            </MenuItem>
            <MenuItem value={HealthCheckRating.LowRisk}>
              1 - Low Risk
            </MenuItem>
            <MenuItem value={HealthCheckRating.HighRisk}>
              2 - High Risk
            </MenuItem>
            <MenuItem value={HealthCheckRating.CriticalRisk}>
              3 - Critical Risk
            </MenuItem>
          </TextField>
        )}

        {/* Hospital fields */}
        {type === 'Hospital' && (
          <>
            <TextField
              label="Discharge Date"
              type="date"
              size="small"
              fullWidth
              required
              value={dischargeDate}
              onChange={(event) =>
                setDischargeDate(event.target.value)
              }
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            <TextField
              label="Discharge Criteria"
              size="small"
              fullWidth
              required
              value={dischargeCriteria}
              onChange={(event) =>
                setDischargeCriteria(event.target.value)
              }
            />
          </>
        )}

        {/* OccupationalHealthcare fields */}
        {type === 'OccupationalHealthcare' && (
          <>
            <TextField
              label="Employer Name"
              size="small"
              fullWidth
              required
              value={employerName}
              onChange={(event) =>
                setEmployerName(event.target.value)
              }
            />

            <Typography variant="body2" fontWeight="medium">
              Sick Leave (Optional)
            </Typography>

            <TextField
              label="Sick Leave Start Date"
              type="date"
              size="small"
              fullWidth
              value={sickLeaveStartDate}
              onChange={(event) =>
                setSickLeaveStartDate(event.target.value)
              }
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            <TextField
              label="Sick Leave End Date"
              type="date"
              size="small"
              fullWidth
              value={sickLeaveEndDate}
              onChange={(event) =>
                setSickLeaveEndDate(event.target.value)
              }
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </>
        )}

        {/* Actions */}
        <Stack direction="row" spacing={1} pt={0.5}>
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add'}
          </Button>

          <Button
            type="button"
            variant="outlined"
            size="small"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddEntryForm;
