import { Formik, Form, useFormik, FormikProvider } from "formik";
import UploadFileIcon from "@mui/icons-material/UploadFile";

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
  Checkbox,
  Button,
  Paper,
} from "@mui/material";
import { defaultFormSchema, evaluateConditions } from "../utils/formSchema";
import FormHeader from "./FormHeader";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFormData } from "../redux/features/formSlice";
import * as Yup from "yup";

const FieldWrapper = ({ field, children, values, setFieldValue }) => (
  <Box sx={{ mb: 2 }}>
    {children}

    {/* Show Clear button only if there is a value */}
    {values[field.id] &&
      (field.type !== "checkbox" || values[field.id] === true) && (
        <Box display="flex" justifyContent="flex-end" mt={1}>
          <Button
            size="small"
            variant="text"
            onClick={() => {
              if (field.type === "checkbox") {
                setFieldValue(field.id, false);
              } else {
                setFieldValue(field.id, "");
              }
            }}
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

export default function FormPreview({previewData, closePreview}) {
  const { loading, formData } = useSelector((store) => store.form);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFormData(defaultFormSchema));
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  let schema ;
  if (previewData) {
    schema = previewData;
  } else {
    schema = formData;
  }

  // Initial values
  const initialValues =
    !schema || !schema.fields
      ? {}
      : schema.fields.reduce((acc, field) => {
          acc[field.id] =
            field.type === "checkbox"
              ? false
              : field.type === "multipleChoice"
              ? []
              : "";
          return acc;
        }, {});

  // Validation
  const validationSchema = Yup.object(
    schema?.fields?.reduce((acc, field) => {
      if (field.required) {
        acc[field.id] = Yup.mixed().required(`${field.label} is required`);
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
      <Button onClick={closePreview}>Close Preview</Button>
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
                        setFieldValue={formik.setFieldValue}
                      >
                        {field.type === "text" && (
                          <TextField
                            fullWidth
                            name={field.id}
                            placeholder={field.placeholder || ""}
                            value={formik.values[field.id]}
                            onChange={formik.handleChange}
                            variant="standard"
                            sx={{ mt: 1 }}
                          />
                        )}

                        {field.type === "number" && (
                          <TextField
                            fullWidth
                            type="number"
                            name={field.id}
                            placeholder={field.placeholder || ""}
                            value={formik.values[field.id]}
                            onChange={formik.handleChange}
                            variant="standard"
                            inputProps={{ min: field.min, max: field.max }}
                            sx={{ mt: 1 }}
                          />
                        )}

                        {field.type === "select" && (
                          <FormControl
                            fullWidth
                            variant="standard"
                            sx={{ mt: 1 }}
                          >
                            <Select
                              name={field.id}
                              value={formik.values[field.id] ?? ""}
                              onChange={formik.handleChange}
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

                        {(field.type === "radio" ||
                          field.type === "multipleChoice") && (
                          <RadioGroup
                            name={field.id}
                            value={formik.values[field.id]}
                            onChange={(e) =>
                              formik.setFieldValue(field.id, e.target.value)
                            }
                          >
                            {field.options.map((opt, i) => (
                              <FormControlLabel
                                key={i}
                                value={opt}
                                control={
                                  <Radio
                                    sx={{
                                      color: "gray",
                                      "&.Mui-checked": { color: "#673ab7" },
                                    }}
                                  />
                                }
                                label={opt}
                              />
                            ))}
                          </RadioGroup>
                        )}

                        {field.type === "checkbox" && (
                          <FormControlLabel
                            control={
                              <Checkbox
                                name={field.id}
                                checked={formik.values[field.id]}
                                onChange={formik.handleChange}
                              />
                            }
                            label={field.label}
                          />
                        )}

                        {field.type === "uploadFile" && (
                          <Box sx={{ mt: 1 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1.2 }}
                            >
                              Upload 1 supported file: PDF, document, or image.
                              Max {field.maxSize / 1024 / 1024} MB.
                            </Typography>

                            <Button
                              variant="outlined"
                              component="label"
                              sx={{ textTransform: "none" }}
                              startIcon={<UploadFileIcon />}
                            >
                              {formik.values[field.id]?.name || "Add file"}
                              <input
                                type="file"
                                hidden
                                name={field.id}
                                accept={field.accept}
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    field.id,
                                    e.currentTarget.files[0]
                                  )
                                }
                              />
                            </Button>
                          </Box>
                        )}
                      </FieldWrapper>
                    </Paper>
                  )
              )}

              <Box mt={3} display="flex" justifyContent="space-between">
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
                <Button
                  type="reset"
                  variant="text"
                  onClick={formik.handleReset}
                >
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
