import patientsData from "../../data/patients.ts";
import type { Patient, NonSensitivePatient, NewPatient } from "../types.ts";
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

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatient);

  return newPatient;
};

export default {
  getPatients,
  addPatient
};