import axios from "axios";

import { apiBaseUrl } from "../constants";
import { Patient, Entry, Gender } from "../types";
import EntryDetails from "../components/EntryDetails";
import { assertNever } from "../utils";

import { useParams } from "react-router-dom"; 
import { useStateValue, setPatient } from "../state";
import { Box, Typography } from "@material-ui/core";
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

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

  const formatEntries = (entries: Entry[] | undefined) => {
    if (!entries) {
      return;
    }

    if (entries.length === 0) {
      return (
        <Typography variant="body2" style={{ marginTop: "0.5em" }}>
          No entries
        </Typography>
      );
    }

    return (
      entries.map(entry => {
        return (
          <Box key={entry.id} sx={{ p: 1, my: 1, border: "1px solid grey", borderRadius: "7px" }}>
            <EntryDetails entry={entry} />
          </Box>
        );
      })
    );
  };

  const genderIcon = (gender: Gender) => {
    switch (gender) {
      case Gender.Other:
        return <CircleOutlinedIcon fontSize="small" />;
      case Gender.Female:
        return <FemaleIcon />;
      case Gender.Male:
        return <MaleIcon />;
      default:
        return assertNever(gender);
    }
  };
  
  return (
      <div className="App">
        <Box>
          <Typography variant="h5" style={{ marginTop: "0.5em" }}>
            {patient.name} {genderIcon(patient.gender)}
          </Typography>
          <Typography variant="body1" style={{ marginTop: "0.5em" }}>
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