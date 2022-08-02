import axios from "axios";

import { apiBaseUrl } from "../constants";
import { Patient } from "../types";

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

  if (!patient.ssn) {
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

  return (
      <div className="App">
        <Box>
          <Typography variant="h6" style={{ marginTop: "0.5em" }}>
            {patient.name}
          </Typography>
          <Typography variant="body1">
            gender: {patient.gender}<br />
            date of birth: {patient.dateOfBirth}<br />
            ssn: {patient.ssn} <br />
            occupation: {patient.occupation}
          </Typography>
        </Box>
      </div>
    );
};

export default PatientInfoPage;