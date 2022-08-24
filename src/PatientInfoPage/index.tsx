import React from "react";
import axios from "axios";

import { apiBaseUrl } from "../constants";
import { Patient, Entry, Gender } from "../types";
import EntryDetails from "../components/EntryDetails";
import { HealthCheckEntryFormValues } from "../AddEntryModal/AddHealthCheckEntryForm";
import AddEntryModal from "../AddEntryModal";
import { assertNever } from "../utils";

import { useParams } from "react-router-dom"; 
import { useStateValue, setPatient, addEntry } from "../state";

import { Box, Typography, Button } from "@material-ui/core";
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

const PatientInfoPage = () => {
  const [{ patients }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

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

  const submitNewHealthCheckEntry = async (values: HealthCheckEntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${patient.id}/entries`,
        values
      );
      dispatch(addEntry({ id: patient.id, entry: newEntry }));
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(String(e?.response?.data?.error) || "Unrecognized axios error");
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

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
          <AddEntryModal
            modalOpen={modalOpen}
            onSubmit={submitNewHealthCheckEntry}
            error={error}
            onClose={closeModal}
          />
          <Button variant="contained" onClick={() => openModal()}>
            Add New Health Check Entry
          </Button>
          <Typography variant="h6" style={{ marginTop: "0.5em" }}>
            entries
          </Typography>
            {formatEntries(patient.entries)}
        </Box>
      </div>
    );
};

export default PatientInfoPage;