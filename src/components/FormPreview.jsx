import { Formik, Form, useFormik, FormikProvider } from "formik";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Paper,
} from "@mui/material";
import { defaultFormSchema, evaluateConditions } from "../utils/formSchema";
import FormHeader from "./FormHeader";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFormData } from "../redux/features/formSlice";
import * as Yup from "yup";

const FieldWrapper = ({ field, children, values, handleChange }) => (
  <Box sx={{ mb: 2 }}>
    {children}
    {values[field.id] && (
      <Box display="flex" justifyContent="flex-end" mt={1}>
        <Button
          size="small"
          variant="text"
          onClick={() =>
            handleChange({ target: { name: field.id, value: "" } })
          }
          sx={{
            textTransform: "none",
            fontSize: "0.85rem",
            color: "text.secondary",
            fontFamily: "Roboto, Arial, sans-serif",
          }}
        >
          Clear
        </Button>
      </Box>
    )}
  </Box>
);

export default function FormPreview() {
  const { loading, formData } = useSelector((store) => store.form);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFormData(defaultFormSchema));
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const schema = formData;

  // Initial values based on schema
  const initialValues =
    !schema || !schema.fields
      ? {}
      : schema.fields.reduce((acc, field) => {
          acc[field.id] = "";
          return acc;
        }, {});

  // Yup validation (basic example: required fields)
  const validationSchema = Yup.object(
    schema?.fields?.reduce((acc, field) => {
      if (field.required) {
        acc[field.id] = Yup.string().required(`${field.label} is required`);
      }
      return acc;
    }, {}) || {}
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log("Submitted values:", values);
    },
  });

  if (!schema || !schema.fields) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h6">Loading form...</Typography>
      </Box>
    );
  }

  return (
    <>
      <FormHeader />

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f1ebf9",
          py: 4,
          display: "flex",
          justifyContent: "center",
          fontFamily: "Roboto, Arial, sans-serif",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 640 }}>
          <Paper
            sx={{ p: 4, mb: 3, borderTop: "10px solid #673ab7" }}
            elevation={3}
          >
            <Typography variant="h5" fontWeight={500} gutterBottom>
              {schema?.title || "Untitled form"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {schema?.description || ""}
            </Typography>
          </Paper>

          <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit}>
              {schema.fields.map(
                (field) =>
                  evaluateConditions(field, formik.values) && (
                    <Paper key={field.id} sx={{ p: 3, mb: 2 }} elevation={1}>
                      <Typography gutterBottom fontWeight={400} fontSize="16px">
                        {field.label}
                      </Typography>

                      <FieldWrapper
                        field={field}
                        values={formik.values}
                        handleChange={formik.handleChange}
                      >
                        {/* TEXT INPUT */}
                        {field.type === "text" && (
                          <TextField
                            fullWidth
                            name={field.id}
                            placeholder={field.placeholder || ""}
                            value={formik.values[field.id]}
                            onChange={formik.handleChange}
                            variant="standard"
                            InputProps={{
                              style: {
                                fontSize: 16,
                                fontFamily: "Roboto, Arial, sans-serif",
                              },
                            }}
                            sx={{ mt: 1 }}
                            error={
                              formik.touched[field.id] &&
                              Boolean(formik.errors[field.id])
                            }
                            helperText={
                              formik.touched[field.id] && formik.errors[field.id]
                            }
                          />
                        )}

                        {/* NOTE INPUT (italic) */}
                        {field.type === "note" && (
                          <TextField
                            fullWidth
                            name={field.id}
                            value={formik.values[field.id]}
                            onChange={formik.handleChange}
                            placeholder={field.label}
                            variant="standard"
                            InputProps={{
                              style: {
                                fontSize: 16,
                                fontFamily: "Roboto, Arial, sans-serif",
                                fontStyle: "italic",
                              },
                            }}
                            sx={{ mt: 1 }}
                          />
                        )}

                        {/* SELECT DROPDOWN */}
                        {field.type === "select" && (
                          <FormControl fullWidth variant="standard" sx={{ mt: 1 }}>
                            <Select
                              name={field.id}
                              value={formik.values[field.id] ??""}
                              onChange={formik.handleChange}
                              displayEmpty
                              inputProps={{ "aria-label": field.label }}
                              sx={{
                                fontFamily: "Roboto, Arial, sans-serif",
                                fontSize: 16,
                              }}
                            >
                              <MenuItem value="">
                                <em>Select an option</em>
                              </MenuItem>
                              {field.options.map((opt, i) => (
                                <MenuItem key={i} value={opt}>
                                  {opt}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}

                        {/* RADIO GROUP */}
                        {field.type === "radio" && (
                          <RadioGroup
                            name={field.id}
                            value={formik.values[field.id]}
                            onChange={formik.handleChange}
                            sx={{ mt: 1 }}
                          >
                            {field.options.map((opt, i) => (
                              <FormControlLabel
                                key={i}
                                value={opt}
                                control={<Radio sx={{ color: "#673ab7" }} />}
                                label={opt}
                                sx={{
                                  fontFamily: "Roboto, Arial, sans-serif",
                                  fontSize: 16,
                                  ml: 0,
                                }}
                              />
                            ))}
                          </RadioGroup>
                        )}
                      </FieldWrapper>
                    </Paper>
                  )
              )}

              <Box mt={3} display="flex" justifyContent="space-between">
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
                <Button type="reset" variant="text" onClick={formik.handleReset}>
                  Clear form
                </Button>
              </Box>
            </Form>
          </FormikProvider>
        </Box>
      </Box>
    </>
  );
}











