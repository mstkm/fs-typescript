import patientsData from "../../data/patients.ts";
import type { Patient, NonSensitivePatient, NewPatient, Entry, EntryWithoutId } from "../types.ts";
import { v4 as uuid } from "uuid";

const patients: Patient[] = patientsData;

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const getPatient = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    entries: [],
    ...entry
  };

  patients.push(newPatient);

  return newPatient;
};

const addEntry = (
  patientId: string,
  entry: EntryWithoutId
): Entry | undefined => {
  const patient = patients.find(
    (patient) => patient.id === patientId
  );

  if (!patient) {
    return undefined;
  }

  const newEntry: Entry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);

  return newEntry;
};

export default {
  getPatients,
  addPatient,
  getPatient,
  addEntry
};