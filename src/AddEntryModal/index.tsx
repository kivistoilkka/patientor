import React from "react";
import { Dialog, DialogTitle, DialogContent, Divider } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import AddHealthCheckEntryForm, { HealthCheckEntryFormValues } from "./AddHealthCheckEntryForm";
import AddOccupationalHealthcareEntryForm, { OccupationalHealthcareEntryFormValues } from "./AddOccupationalHealthcareEntryForm";
import AddHospitalEntryForm, { HospitalEntryFormValues } from "./AddHospitalEntryForm";

interface HealthCheckProps {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: HealthCheckEntryFormValues) => void;
  error?: string;
}

export const AddHealthCheckEntryModal = ({ modalOpen, onClose, onSubmit, error }: HealthCheckProps) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>New health check entry</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <AddHealthCheckEntryForm onSubmit={onSubmit} onCancel={onClose} />
    </DialogContent>
  </Dialog>
);

interface OccupationalHealthcareProps {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: OccupationalHealthcareEntryFormValues) => void;
  error?: string;
}

export const AddOccupationalHealthcareEntryModal = ({ modalOpen, onClose, onSubmit, error }: OccupationalHealthcareProps) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>New occupational healthcare entry</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <AddOccupationalHealthcareEntryForm onSubmit={onSubmit} onCancel={onClose} />
    </DialogContent>
  </Dialog>
);

interface HospitalProps {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: HospitalEntryFormValues) => void;
  error?: string;
}

export const AddHospitalEntryModal = ({ modalOpen, onClose, onSubmit, error }: HospitalProps) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>New hospital entry</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <AddHospitalEntryForm onSubmit={onSubmit} onCancel={onClose} />
    </DialogContent>
  </Dialog>
);