import { Entry } from "../types";
import { useStateValue } from "../state";

import { Typography } from "@material-ui/core";

type EntryProps = {
  entry: Entry;
};

const formatDiagnosisCodes = (codes: string[] | undefined) => {
  const [{ diagnoses },] = useStateValue();

  if (codes) {
    return (
      codes.map(code => {
        return (
          <li key={code}>
            <Typography variant="body2">{code} {diagnoses[code].name}</Typography>
          </li>
        );
      })
    );
  }
};

const HospitalEntry = ({ entry }: EntryProps) => {
  return (
    <div>
      <Typography variant="body2" style={{ marginTop: "0.5em" }}>
        {entry.date} <i>{entry.description}</i>
      </Typography>
      <ul>
        {formatDiagnosisCodes(entry.diagnosisCodes)}
      </ul>
    </div>
  );
};

const HealthCheckEntry = ({ entry }: EntryProps) => {
  return (
    <div>
      <Typography variant="body2" style={{ marginTop: "0.5em" }}>
        {entry.date} <i>{entry.description}</i>
      </Typography>
      <ul>
        {formatDiagnosisCodes(entry.diagnosisCodes)}
      </ul>
    </div>
  );
};

const OccupationalHealthcareEntry = ({ entry }: EntryProps) => {
  return (
    <div>
      <Typography variant="body2" style={{ marginTop: "0.5em" }}>
        {entry.date} <i>{entry.description}</i>
      </Typography>
      <ul>
        {formatDiagnosisCodes(entry.diagnosisCodes)}
      </ul>
    </div>
  );
};

const EntryDetails = ({ entry }: EntryProps) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  switch (entry.type) {
    case "Hospital":
      return <HospitalEntry entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntry entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntry entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;