import {
  Favorite,
  MedicalServices,
  Work,
  LocalHospital,
} from '@mui/icons-material';

import type { Entry } from '../../types';

interface Props {
  entry: Entry;
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const EntryDetails = ({ entry }: Props) => {
  switch (entry.type) {
    case 'Hospital':
      return (
        <div className="entry">
          <h3>
            {entry.date} <LocalHospital />
          </h3>

          <em>{entry.description}</em>

          <p>
            Discharge: {entry.discharge.date} - {entry.discharge.criteria}
          </p>

          <p>Diagnose by {entry.specialist}</p>
        </div>
      );

    case 'OccupationalHealthcare':
      return (
        <div className="entry">
          <h3>
            {entry.date} <Work />
          </h3>

          <em>{entry.description}</em>

          <p>Employer: {entry.employerName}</p>

          {entry.sickLeave && (
            <p>
              Sick leave: {entry.sickLeave.startDate} -{' '}
              {entry.sickLeave.endDate}
            </p>
          )}

          <p>Diagnose by {entry.specialist}</p>
        </div>
      );

    case 'HealthCheck':
      return (
        <div className="entry">
          <h3>
            {entry.date} <MedicalServices />
          </h3>

          <em>{entry.description}</em>

          <p>
            <Favorite
              style={{
                color:
                  entry.healthCheckRating === 0
                    ? 'green'
                    : entry.healthCheckRating === 1
                    ? 'yellow'
                    : entry.healthCheckRating === 2
                    ? 'orange'
                    : 'red',
              }}
            />
          </p>

          <p>Diagnose by {entry.specialist}</p>
        </div>
      );

    default:
      return assertNever(entry);
  }
};

export default EntryDetails;