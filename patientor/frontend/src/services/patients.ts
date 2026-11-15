import axios from "axios";
import { Entry, EntryWithoutId, Patient, PatientFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const getPatient = async (id: string) => {
  const response = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
  return response.data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const addEntry = async (
  id: string,
  entry: EntryWithoutId
): Promise<Entry> => {
  const response = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${id}/entries`,
    entry
  );

  return response.data;
};

export default {
  getAll, 
  create,
  getPatient,
  addEntry
};

