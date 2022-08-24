import React from "react";
import { Grid, Button } from "@material-ui/core";
import { Field, Formik, Form } from "formik";

import {
  TextField,
  DiagnosisSelection
} from "../AddPatientModal/FormField";
import { HospitalEntry } from "../types";
import { useStateValue } from "../state";

export type HospitalEntryFormValuesToPost = Omit<HospitalEntry, "id">;

type OmitedEntryFormValues = Omit<HospitalEntry, "id" | "discharge">;
export interface HospitalEntryFormValues extends OmitedEntryFormValues {
  dischargeDate: string;
  dischargeCriteria: string;
}

interface Props {
  onSubmit: (values: HospitalEntryFormValues) => void;
  onCancel: () => void;
}

export const AddHospitalEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
    initialValues={{
      date: "",
      specialist: "",
      description: "",
      dischargeDate: "",
      dischargeCriteria: "",
      type: "Hospital"
    }}
    onSubmit={onSubmit}
    validate={values => {
      const requiredError = "Field is required";
      const dateError = "Date format incorrect, use YYYY-MM-DD";
      const errors: { [field: string]: string } = {};
      const re = /^\d{4}-\d{2}-\d{2}$/;
      if (!values.date) {
        errors.date = requiredError;
      } else if (
        !re.test(values.date) ||
        Boolean(Date.parse(values.date)) === false
      ) {
        errors.date = dateError;
      }
      if (!values.specialist) {
        errors.specialist = requiredError;
      }
      if (!values.description) {
        errors.description = requiredError;
      }
      if (
        !re.test(values.dischargeDate) ||
        Boolean(Date.parse(values.dischargeDate)) === false
      ) {
        errors.dischargeDate = dateError;
      }
      if (!values.dischargeCriteria) {
        errors.dischargeCriteria = requiredError;
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
            label="Discharge date"
            placeholder="YYYY-MM-DD"
            name="dischargeDate"
            component={TextField}
          />
          <Field
            label="Discharge criteria"
            placeholder="Discharge Criteria"
            name="dischargeCriteria"
            component={TextField}
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

export default AddHospitalEntryForm;