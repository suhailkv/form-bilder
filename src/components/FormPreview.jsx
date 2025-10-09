import { Formik, Form, useFormik, FormikProvider } from "formik";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

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
import { RadioButtonUnchecked, RadioButtonChecked } from "@mui/icons-material";
import {
  fetchForm,
  setEmail,
  requestOtp,
  verifyOtp,
  submitForm,
} from "../redux/features/formSlice";
import { evaluateConditions } from "../utils/formSchema";
import FormHeader from "./FormHeader";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
import { backendUrl } from "../redux/features/formCreationSlice";
// Wrapper to add Clear button for each field
const FieldWrapper = ({ field, children, values, setFieldValue }) => (
  <Box sx={{ mb: 2 }}>
    {children}
    {values[field.id] !== undefined &&
      (field.type !== "checkbox" || values[field.id] === true) && (
        <Box display="flex" justifyContent="flex-end" mt={1}>
          <Button
            size="small"
            variant="text"
            onClick={() => {
              if (field.type === "checkbox") {
                setFieldValue(field.id, false);
              } else if (field.type === "multipleChoice") {
                setFieldValue(field.id, []);
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

export default function FormPreview({ previewData }) {
  const { formData, email, otpSent, otpVerified, error } = useSelector(
    (store) => store.form
  );
  const dispatch = useDispatch();

  // Get URL param formId (slug)
  const { formId } = useParams();

  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (formId) {
      dispatch(fetchForm(formId));
    }
  }, [dispatch, formId]);

  // Use URL param formId directly as formIdentifier
  const formIdentifier = formId;

  const schema = previewData || formData?.schema || null;

  // Initialize form values safely
  const initialValues =
    schema?.fields?.reduce((acc, field) => {
      if (field.type === "checkbox") acc[field.id] = false;
      else if (field.type === "multipleChoice") acc[field.id] = [];
      else acc[field.id] = "";
      return acc;
    }, {}) || {};

  // Setup validation schema
  const validationSchema = Yup.object(
    schema?.fields?.reduce((acc, field) => {
      if (field.required)
        acc[field.id] = Yup.mixed().required(`${field.label} is required`);
      return acc;
    }, {}) || {}
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (!previewData && schema.emailVerification && !otpVerified) {
        alert("Please verify your email with OTP before submitting.");
        return;
      }
      dispatch(submitForm({ formId: formIdentifier, email, data: values }));
    },
  });

  const handleRequestOtp = () => {
    if (!email) return alert("Enter email first");
    if (!formIdentifier) {
      alert("Form ID is missing! Cannot request OTP.");
      return;
    }
    dispatch(requestOtp({ formId: formIdentifier, email }));
  };

  const handleVerifyOtp = () => {
    if (!otp) return alert("Enter OTP");
    console.log("Verify OTP with formToken:", formIdentifier);
    dispatch(verifyOtp({ email, otp, formToken: formIdentifier }));
  };

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
      {!previewData && !formData && <FormHeader />}
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
          <Paper>
            {(previewData?.bannerImageFilename || formData?.bannerImage) && (
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 70, sm: 120, md: 200 },
                  borderRadius: 1,
                  overflow: "hidden",
                  mb: 2,
                  position: "relative",
                }}
              >
                <img
                  src={
                    previewData?.bannerImageFilename
                      ?  `${backendUrl}/uploads/temp/${previewData.bannerImageFilename}`
                      : `${backendUrl}/uploads/temp/${formData.bannerImage}`
                  }
                  alt="Banner"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            )}
          </Paper>

          <Paper
            sx={{ p: 4, mb: 3, borderTop: "10px solid #673ab7" }}
            elevation={3}
          >
            <Typography variant="h5" fontWeight={500} gutterBottom>
              {schema.title || "Untitled form"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {schema.description || ""}
            </Typography>
          </Paper>

          {!previewData &&
            schema.emailVerification &&
            (otpVerified ? (
              // Compact green Paper after verification
              <Paper
                sx={{
                  p: 1,
                  mb: 2,
                  width: "fit-content",
                  minWidth: 160,
                  bgcolor: "success.main",
                }}
                elevation={3}
              >
                <Typography
                  align="center"
                  sx={{ color: "common.white", fontWeight: 500 }}
                >
                  ✔️ Verified
                </Typography>
              </Paper>
            ) : (
              <Paper sx={{ p: 2, mb: 3 }}>
                {/* Email field shown before requesting OTP */}
                {!otpSent && (
                  <>
                    <TextField
                      fullWidth
                      label="Enter Email"
                      value={email}
                      onChange={(e) => dispatch(setEmail(e.target.value))}
                      sx={{ mb: 2 }}
                    />

                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      sx={{ padding: "8px 0", backgroundColor: "#fff" }}
                    >
                      <Button
                        variant="contained"
                        onClick={handleRequestOtp}
                        disabled={!formIdentifier}
                        sx={{
                          backgroundColor: "#1a73e8", // Google blue
                          color: "#fff",
                          borderRadius: "4px",
                          fontWeight: 500,
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "#1669c1",
                          },
                          "&:disabled": {
                            backgroundColor: "#e0e0e0",
                            color: "#9e9e9e",
                          },
                          padding: "8px 20px",
                          fontSize: "0.875rem",
                        }}
                      >
                        Request OTP
                      </Button>
                    </Box>
                  </>
                )}
                {/* OTP field and right-aligned Verify button */}
                {otpSent && !otpVerified && (
                  <>
                    <TextField
                      label="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      sx={{ mb: 2 }}
                      fullWidth
                    />
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleVerifyOtp}
                        disabled={otpVerified}
                      >
                        Verify OTP
                      </Button>
                    </Box>
                  </>
                )}
                {/* Error display */}
                {error && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                  </Typography>
                )}
              </Paper>
            ))}

          <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit}>
              {schema.fields.map(
                (field) =>
                  evaluateConditions(field, formik.values) && (
                    <Paper key={field.id} sx={{ p: 3, mb: 2 }} elevation={1}>
                      {field.type !== "checkbox" && (
                        <Typography
                          gutterBottom
                          fontWeight={400}
                          fontSize="16px"
                        >
                          {field.label}
                        </Typography>
                      )}

                      <FieldWrapper
                        field={field}
                        values={formik.values}
                        setFieldValue={formik.setFieldValue}
                      >
                        {/* Render inputs based on type */}
                        {field.type === "text" && (
                          <TextField
                            fullWidth
                            name={field.id}
                            placeholder={field.placeholder || ""}
                            value={formik.values[field.id] ?? ""}
                            onChange={formik.handleChange}
                            variant="standard"
                            sx={{ mt: 2 }}
                          />
                        )}
                        {field.type === "number" && (
                          <TextField
                            fullWidth
                            type="number"
                            name={field.id}
                            placeholder={field.placeholder || ""}
                            value={formik.values[field.id] ?? ""}
                            onChange={formik.handleChange}
                            variant="standard"
                            inputProps={{ min: field.min, max: field.max }}
                            sx={{ mt: 2 }}
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
                        {field.type === "radio" && (
                          <RadioGroup
                            name={field.id}
                            value={formik.values[field.id] ?? ""}
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
                        {field.type === "multipleChoice" && (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              mt: 1,
                            }}
                          >
                            {field.options.map((opt, i) => (
                              <FormControlLabel
                                key={i}
                                control={
                                  <Checkbox
                                    checked={
                                      formik.values[field.id]?.includes(opt) ??
                                      false
                                    }
                                    onChange={(e) => {
                                      const current =
                                        formik.values[field.id] || [];
                                      formik.setFieldValue(
                                        field.id,
                                        e.target.checked
                                          ? [...current, opt]
                                          : current.filter((v) => v !== opt)
                                      );
                                    }}
                                    icon={
                                      <RadioButtonUnchecked
                                        sx={{ color: "gray" }}
                                      />
                                    }
                                    checkedIcon={
                                      <RadioButtonChecked
                                        sx={{ color: "#673ab7" }}
                                      />
                                    }
                                  />
                                }
                                label={opt}
                              />
                            ))}
                          </Box>
                        )}
                        {field.type === "checkbox" && (
                          <FormControlLabel
                            control={
                              <Checkbox
                                name={field.id}
                                checked={formik.values[field.id] ?? false}
                                onChange={formik.handleChange}
                                sx={{
                                  color: "gray",
                                  "&.Mui-checked": { color: "#673ab7" },
                                }}
                              />
                            }
                            label={field.label}
                          />
                        )}
                        {field.type === "uploadFile" && (
                          <Box
                            sx={{
                              mt: 2,
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 2 }}
                            >
                              Upload 1 supported file: PDF, document, or image.
                              Max {field.maxSize / 1024 / 1024} MB.
                            </Typography>
                            <Button
                              variant="outlined"
                              component="label"
                              sx={{
                                textTransform: "none",
                                borderColor: "#2c292939",
                              }}
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={
                    !previewData && schema.emailVerification
                      ? !otpVerified
                      : false
                  }
                >
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
