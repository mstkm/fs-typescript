import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import patientService from '../../services/patients';
import type { Patient, EntryWithoutId } from '../../types';

import EntryDetails from '../EntryDetails';
import AddEntryForm from '../AddEntryForm';
import { Button } from '@mui/material';
import type { Diagnosis } from '../../types';

interface PatientPageProps {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: PatientPageProps) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showEntryForm, setShowEntryForm] = useState(false);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;

      const result = await patientService.getPatient(id);
      setPatient(result);
    };

    void fetchPatient();
  }, [id]);

  const submitNewEntry = async (values: EntryWithoutId) => {
    if (!patient) return;

    const newEntry = await patientService.addEntry(
      patient.id,
      values
    );

    setPatient({
      ...patient,
      entries: [...patient.entries, newEntry],
    });

    setShowEntryForm(false);
  };

  if (!patient) {
    return <div>Loading patient information...</div>;
  }

  return (
    <div>
      <h2>{patient.name}</h2>

      <p>SSN: {patient.ssn}</p>
      <p>Occupation: {patient.occupation}</p>
      <p>Gender: {patient.gender}</p>
      <p>Date of birth: {patient.dateOfBirth}</p>

      <h3>Entries</h3>

      {patient.entries.map((entry) => (
        <EntryDetails key={entry.id} entry={entry} />
      ))}

      {showEntryForm ? (
        <AddEntryForm
          onSubmit={submitNewEntry}
          onCancel={() => setShowEntryForm(false)}
          diagnoses={diagnoses}
        />
      ) : (
        <Button
          variant="contained"
          size="small"
          onClick={() => setShowEntryForm(true)}
        >
          ADD NEW ENTRY
        </Button>
      )}
    </div>
  );
};

export default PatientPage;