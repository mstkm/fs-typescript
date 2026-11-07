import express from "express";
import cors from "cors";
import diagnosesService from "./services/diagnosisService.ts";
import patientService from "./services/patientService.ts";
import { NewPatientSchema } from "./utils.ts";
import { z } from "zod";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/ping", (_req, res) => {
  res.send("pong");
});

app.get("/api/diagnoses", (_req, res) => {
  res.json(diagnosesService.getDiagnoses());
});

app.get("/api/patients", (_req, res) => {
  return res.json(patientService.getPatients());
});

app.post('/api/patients', (req, res) => {
  try {
    const newPatient = NewPatientSchema.parse(req.body);

    const addedPatient = patientService.addPatient(newPatient);

    res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({
        error: error.issues,
      });
    } else {
      res.status(400).send({
        error: 'Unknown error',
      });
    }
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});