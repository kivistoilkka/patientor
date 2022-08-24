import React from "react";
import { Grid, Button, InputLabel } from "@material-ui/core";
import { Field, Formik, Form } from "formik";

import {
  TextField,
  DiagnosisSelection
} from "../AddPatientModal/FormField";
import { OccupationalHealthcareEntry } from "../types";
import { useStateValue } from "../state";

export type OccupationalHealthcareEntryFormValuesToPost = Omit<OccupationalHealthcareEntry, "id">;

type OmitedEntryFormValues = Omit<OccupationalHealthcareEntry, "id" | "sickLeave">;
export interface OccupationalHealthcareEntryFormValues extends OmitedEntryFormValues {
  sickLeaveStart: string;
  sickLeaveEnd: string;
}

interface Props {
  onSubmit: (values: OccupationalHealthcareEntryFormValues) => void;
  onCancel: () => void;
}

export const AddOccupationalHealthcareEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
    initialValues={{
      date: "",
      specialist: "",
      description: "",
      employerName: "",
      sickLeaveStart: "",
      sickLeaveEnd: "",
      type: "OccupationalHealthcare"
    }}
    onSubmit={onSubmit}
    validate={values => {
      const requiredError = "Field is required";
      const dateError = "Date format incorrect, use YYYY-MM-DD";
      const errors: { [field: string]: string } = {};
      const re = /^\d{4}-\d{2}-\d{2}$/;
      if (!values.date) {
        errors.date = requiredError;
      } else if (!re.test(values.date) || Boolean(Date.parse(values.date)) === false) {
        errors.date = dateError;
      }
      if (!values.specialist) {
        errors.specialist = requiredError;
      }
      if (!values.description) {
        errors.description = requiredError;
      }
      if (!values.employerName) {
        errors.employerName = requiredError;
      }
      if (values.sickLeaveStart || values.sickLeaveEnd) {
        if (!values.sickLeaveStart && values.sickLeaveEnd) {
          errors.sickLeaveStart = "Both dates are required";
        } else if (
          !re.test(values.sickLeaveStart) ||
          Boolean(Date.parse(values.sickLeaveStart)) === false
        ) {
          errors.sickLeaveStart = dateError;
        }
        if (values.sickLeaveStart && !values.sickLeaveEnd) {
          errors.sickLeaveEnd = "Both dates are required";
        } else if (
          !re.test(values.sickLeaveEnd) ||
          Boolean(Date.parse(values.sickLeaveEnd)) === false
        ) {
          errors.sickLeaveEnd = dateError;
        }
      }
      return errors;
    }}
  >
    {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
      return (
        <Form className="form ui">
          <Field
            label="Date"
            placeholder="YYYY-MM-DD"
            name="date"
            component={TextField}
          />
          <Field
            label="Specialist"
            placeholder="Specialist"
            name="specialist"
            component={TextField}
          />
          <Field
            label="Description"
            placeholder="Description"
            name="description"
            component={TextField}
          />
          <Field
            label="Employer name"
            placeholder="Employer name"
            name="employerName"
            component={TextField}
          />
          <InputLabel>Sick leave information (optional)</InputLabel>
          <Field
            label="Sick Leave Start"
            placeholder="YYYY-MM-DD"
            name="sickLeaveStart"
            component={TextField}
            touched
          />
          <Field
            label="Sick Leave End"
            placeholder="YYYY-MM-DD"
            name="sickLeaveEnd"
            component={TextField}
            touched
          />
          <DiagnosisSelection
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            diagnoses={Object.values(diagnoses)}
          />
          <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>

        </Form>
      );
    }}
  </Formik>
  );
};

export default AddOccupationalHealthcareEntryForm;