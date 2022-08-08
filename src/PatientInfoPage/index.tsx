import axios from "axios";

import { apiBaseUrl } from "../constants";
import { Patient, Entry } from "../types";

import { useParams } from "react-router-dom"; 
import { useStateValue, setPatient } from "../state";
import { Box, Typography } from "@material-ui/core";

const PatientInfoPage = () => {
  const [{ patients }, dispatch] = useStateValue();

  const { id } = useParams<{ id: string }>();
  const patient = Object.values(patients).find((patient => patient.id === id));

  if (!patient) {
    return (
      <div className="App">
        <Typography variant="h6" style={{ marginTop: "0.5em" }}>
          Patient with the id {id} could not be found.
        </Typography>
      </div>
    );
  }

  if (!patient.ssn || !patient.entries) {
    const fetchPatientInfo = async () => {
      try {
        const { data: patientInfoFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${patient.id}`
        );
        dispatch(setPatient(patientInfoFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatientInfo();
  }

  const formatDiagnosisCodes = (codes: string[] | undefined) => {
    if (codes) {
      return (
        codes.map(code => {
          return (
            <li key={code}>
              <Typography variant="body2">{code}</Typography>
            </li>
          );
        })
      );
    }
  };

  const formatEntries = (entries: Entry[] | undefined) => {
    if (entries) {
      if (entries.length === 0) {
        return (
          <Typography variant="body2">No entries</Typography>
        );
      }

      return (
        entries.map(entry => {
          return (
            <div key={entry.id}>
              <Typography variant="body2" style={{ marginTop: "0.5em" }}>
                {entry.date} <i>{entry.description}</i>
              </Typography>
              <ul>
                {formatDiagnosisCodes(entry.diagnosisCodes)}
              </ul>
            </div>
          );
        })
      );
    }
  };
  
  return (
      <div className="App">
        <Box>
          <Typography variant="h5" style={{ marginTop: "0.5em" }}>
            {patient.name}
          </Typography>
          <Typography variant="body1">
            gender: {patient.gender}<br />
            date of birth: {patient.dateOfBirth}<br />
            ssn: {patient.ssn} <br />
            occupation: {patient.occupation}
          </Typography>
          <Typography variant="h6" style={{ marginTop: "0.5em" }}>
            entries
          </Typography>
            {formatEntries(patient.entries)}
          
        </Box>
      </div>
    );
};

export default PatientInfoPage;