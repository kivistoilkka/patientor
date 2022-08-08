import {
  Entry,
  HealthCheckEntry,
  HealthCheckRating,
  HospitalEntry,
  OccupationalHealthcareEntry,
  SickLeave
} from "../types";
import { useStateValue } from "../state";

import { Typography } from "@material-ui/core";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WorkIcon from '@mui/icons-material/Work';
import HealingIcon from '@mui/icons-material/Healing';
import FavoriteIcon from '@mui/icons-material/Favorite';

type EntryProps = {
  entry: Entry;
};

type HealthCheckEntryProps = {
  entry: HealthCheckEntry;
};

type OccupationalHealthcareEntryProps = {
  entry: OccupationalHealthcareEntry;
};

type HospitalEntryProps = {
  entry: HospitalEntry;
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const formatDiagnosisCodes = (codes: string[] | undefined) => {
  const [{ diagnoses },] = useStateValue();
  if (!codes) {
    return;
  }

  return (
    codes.map(code => {
      return (
        <li key={code}>
          <Typography variant="body2">{code} {diagnoses[code].name}</Typography>
        </li>
      );
    })
  );
};

const HospitalEntryDetails = ({ entry }: HospitalEntryProps) => {
  return (
    <div>
      <Typography variant="body2" style={{ marginTop: "0.5em" }}>
        {entry.date} <HealingIcon /><br />
        <i>{entry.description}</i><br />
        discharge {entry.discharge.date} <i>{entry.discharge.criteria}</i>
      </Typography>
      <ul>
        {formatDiagnosisCodes(entry.diagnosisCodes)}
      </ul>
      <Typography variant="body2">diagnose by {entry.specialist}</Typography>
    </div>
  );
};

const HealthCheckEntryDetails = ({ entry }: HealthCheckEntryProps) => {
  const healthIcon = (rating: HealthCheckRating) => {
    switch (rating) {
      case HealthCheckRating.Healthy:
        return <FavoriteIcon sx={{ color: 'green' }} />;
      case HealthCheckRating.LowRisk:
        return <FavoriteIcon sx={{ color: 'yellow' }} />;
      case HealthCheckRating.HighRisk:
        return <FavoriteIcon sx={{ color: 'orange' }} />;
      case HealthCheckRating.CriticalRisk:
        return <FavoriteIcon sx={{ color: 'red' }} />;
      default:
        return assertNever(rating);
    }
  };

  return (
    <div>
      <Typography variant="body2">
        {entry.date} <MedicalServicesIcon /><br />
        <i>{entry.description}</i>
      </Typography>
      {healthIcon(entry.healthCheckRating)}<br />
      <ul>
        {formatDiagnosisCodes(entry.diagnosisCodes)}
      </ul>
      <Typography variant="body2">diagnose by {entry.specialist}</Typography>
    </div>
  );
};

const OccupationalHealthcareEntryDetails = ({ entry }: OccupationalHealthcareEntryProps) => {
  const sickLeave = (sl: SickLeave | undefined) => {
    if (!sl) {
      return;
    }
    return (`sick leave ${sl.startDate} - ${sl.endDate}`);
  };

  return (
    <div>
      <Typography variant="body2">
        {entry.date} <WorkIcon /> <i>{entry.employerName}</i><br />
        <i>{entry.description}</i><br />
        {sickLeave(entry.sickLeave)}
      </Typography>
      <ul>
        {formatDiagnosisCodes(entry.diagnosisCodes)}
      </ul>
      <Typography variant="body2">diagnose by {entry.specialist}</Typography>
    </div>
  );
};

const EntryDetails = ({ entry }: EntryProps) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;