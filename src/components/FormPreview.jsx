import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useFormik, FormikProvider, Form } from "formik";

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import { RadioButtonUnchecked, RadioButtonChecked } from "@mui/icons-material";

import { useSelector, useDispatch } from "react-redux";
import { fetchForm, setEmail, requestOtp, verifyOtp, submitForm } from "../redux/features/formSlice";
import { uploadBannerImage } from "../redux/features/formCreationSlice";

import { evaluateConditions } from "../utils/formSchema";
import * as Yup from "yup";
import FormHeader from "./FormHeader";
const FILE_PATH = import.meta.env.VITE_FILE_PATH;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// Wrapper component to add a Clear button next to form fields
const FieldWrapper = ({ field, children, values, setFieldValue }) => (
  <Box sx={{ mb: 2 }}>
    {children}
    {values[field.id] !== undefined && (field.type !== "checkbox" || values[field.id] === true) && (
      <Box display="flex" justifyContent="flex-end" mt={1}>
        <Button
          size="small"
          variant="text"
          onClick={() => {
            // Clear the field based on type
            if (field.type === "checkbox") setFieldValue(field.id, false);
            else if (field.type === "multipleChoice") setFieldValue(field.id, []);
            else setFieldValue(field.id, "");
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

// Main component displaying form preview and handling user interactions
export default function FormPreview({ previewData }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [fileIdAndItsFilePath, setFileAndItsFilePath] = useState({});
  // Select required state from Redux store
  const { formData, email, otpSent, otpVerified, error } = useSelector((store) => store.form);
  const dispatch = useDispatch();

  // Get formId from URL params for fetching and identification
  const { formId } = useParams();

  const [otp, setOtp] = useState("");

  // Fetch form data on mount or when formId changes
  useEffect(() => {
    if (formId) {
      dispatch(fetchForm(formId));
    }
  }, [dispatch, formId]);

  // Use formId as form identifier for submission and OTP
  const formIdentifier = formId;

  // Determine active schema from preview data or fetched form data
  const schema = previewData || formData?.schema || null;

  // Initialize form values corresponding to field types for Formik.

  const initialValues =
    schema?.fields?.reduce((acc, field) => {
      if (field.type === "checkbox") acc[field.id] = false;
      else if (field.type === "multipleChoice") acc[field.id] = [];
      else acc[field.id] = "";
      return acc;
    }, {}) || {};

  // Setup Yup validation schema for required fields
  const validationSchema = Yup.object(
    schema?.fields?.reduce((acc, field) => {
      if (field.required) acc[field.id] = Yup.mixed().required(`${field.label} is required`);
      return acc;
    }, {}) || {}
  );

  // Initialize Formik for form state handling
  const formik = useFormik({
    enableReinitialize: true, // Reset form if initialValues change
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log("values", values);
      console.log("file path and id", fileIdAndItsFilePath);
      const data = { ...values, ...fileIdAndItsFilePath };
      console.log("final", data);

      // Prevent submission if OTP verification required but not verified
      if (!previewData && schema.emailVerification && !otpVerified) {
        alert("Please verify your email with OTP before submitting.");
        return;
      }
      // Dispatch form submission with form id, email, and values
      // dispatch(submitForm({ formId: formIdentifier, email, data: data }));

      dispatch(submitForm({ formId: formIdentifier, email, data }))
        .then((response) => {
          if (response.payload?.success) {
            setOpenDialog(true); // open thank-you dialog
          } else {
            console.error("Form submission failed:", response.payload);
          }
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        });
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
    dispatch(verifyOtp({ email, otp, formToken: formIdentifier }));
  };

  const { bannerImagePreviewUrl, loadingBannerImage } = useSelector((state) => state.formCreation);
  if (!schema || !schema.fields) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">Loading form...</Typography>
      </Box>
    );
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    window.close(); // close the window after user clicks OK
  };

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
            {(previewData?.bannerImageFilename || previewData?.bannerImage || formData?.bannerImageFilename || formData?.bannerImage) &&
              (console.log("hit", previewData),
              (
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 70, sm: 120, md: 200 },
                    borderRadius: "8px",
                    overflow: "hidden",
                    mb: 2,
                    position: "relative",
                  }}
                >
                  <img
                    src={
                      previewData?.bannerImage
                        ? `${BACKEND_URL}${FILE_PATH}${previewData.bannerImage}`
                        : `${BACKEND_URL}${FILE_PATH}${formData.bannerImage}`
                    }
                    alt="Banner"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              ))}
          </Paper>

          {/* Show form title and description */}
          <Paper
            sx={{
              p: 4,
              mb: 3,
              borderTop: "10px solid #673ab7",
              borderRadius: "8px",
            }}
            elevation={3}
          >
            <Typography variant="h5" fontWeight={500} gutterBottom>
              {schema.title || "Untitled form"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {schema.description || ""}
            </Typography>
          </Paper>

          {!previewData && schema.emailVerification && (
            <>
              {otpVerified ? (
                <Paper
                  sx={{
                    p: 1,
                    mb: 2,
                    width: "fit-content",
                    minWidth: 160,
                    bgcolor: "success.main",
                    borderRadius: "8px",
                  }}
                  elevation={3}
                >
                  <Typography align="center" sx={{ color: "common.white", fontWeight: 500 }}>
                    ✔️ Verified
                  </Typography>
                </Paper>
              ) : (
                <Paper sx={{ p: 2, mb: 3, borderRadius: "8px" }}>
                  {/* Email input & Request OTP button */}
                  {!otpSent && (
                    <>
                      <TextField fullWidth label="Enter Email" value={email} onChange={(e) => dispatch(setEmail(e.target.value))} sx={{ mb: 2 }} />
                      <Box display="flex" justifyContent="flex-end" sx={{ padding: "8px 0", backgroundColor: "#fff" }}>
                        <Button
                          variant="contained"
                          onClick={handleRequestOtp}
                          disabled={!formIdentifier}
                          sx={{
                            backgroundColor: "#1a73e8",
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

                  {/* OTP input & Verify button */}
                  {otpSent && !otpVerified && (
                    <>
                      <TextField label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} sx={{ mb: 2 }} fullWidth />
                      <Box display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="success" onClick={handleVerifyOtp} disabled={otpVerified}>
                          Verify OTP
                        </Button>
                      </Box>
                    </>
                  )}

                  {error && (
                    <Typography color="error" sx={{ mt: 1 }}>
                      {error}
                    </Typography>
                  )}
                </Paper>
              )}
            </>
          )}

          {/* Formik form handling */}
          <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit}>
              {/* Dynamically render form fields */}
              {schema.fields.map(
                (field) =>
                  evaluateConditions(field, formik.values) && (
                    <Paper key={field.id} sx={{ p: 3, mb: 2, color: "text.primary" }} elevation={1}>
                      {/* Display label if not checkbox */}
                      {field.type !== "checkbox" && (
                        <Typography gutterBottom fontWeight={500} fontSize="20px">
                          {field.label}
                        </Typography>
                      )}

                      {/* Field with clear button wrapper */}
                      <FieldWrapper field={field} values={formik.values} setFieldValue={formik.setFieldValue}>
                        {/* Render input based on field type */}

                        {/* Text input */}
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
                          <FormControl fullWidth variant="standard" sx={{ mt: 1 }}>
                            <Select name={field.id} value={formik.values[field.id] ?? ""} onChange={formik.handleChange}>
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

                        {/* Radio group */}
                        {field.type === "radio" && (
                          <RadioGroup
                            name={field.id}
                            value={formik.values[field.id] ?? ""}
                            onChange={(e) => formik.setFieldValue(field.id, e.target.value)}
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

                        {/* Multiple choice checkboxes */}
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
                                    checked={formik.values[field.id]?.includes(opt) ?? false}
                                    onChange={(e) => {
                                      const current = formik.values[field.id] || [];
                                      formik.setFieldValue(field.id, e.target.checked ? [...current, opt] : current.filter((v) => v !== opt));
                                    }}
                                    icon={<RadioButtonUnchecked sx={{ color: "gray" }} />}
                                    checkedIcon={<RadioButtonChecked sx={{ color: "#673ab7" }} />}
                                  />
                                }
                                label={opt}
                              />
                            ))}
                          </Box>
                        )}

                        {/* Single checkbox */}
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

                        {/* File upload field */}
                        {field.type === "uploadFile" && (
                          <Box
                            sx={{
                              mt: 2,
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Upload 1 supported file: PDF, document, or image. Max {field.maxSize / 1024 / 1024} MB.
                            </Typography>

                            {/* Upload button */}
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
                                onChange={(e) => {
                                  const file = e.currentTarget.files[0];
                                  if (!file) return;

                                  // Update Formik with file
                                  formik.setFieldValue(field.id, file);
                                  dispatch(uploadBannerImage(file))
                                    .unwrap()
                                    .then((response) => {
                                      setFileAndItsFilePath((prev) => ({
                                        ...prev,
                                        [field.id]: response?.storedName,
                                      }));

                                      // console.log("Upload success:", response);
                                    })
                                    .catch((error) => {
                                      console.error("Upload failed:", error);
                                    });
                                }}
                              />
                            </Button>
                          </Box>
                        )}
                      </FieldWrapper>
                    </Paper>
                  )
              )}

              {/* Submit and Reset buttons */}
              <Box mt={3} display="flex" justifyContent="space-between">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  // Disable submit if preview mode or OTP not verified when required
                  disabled={Boolean(previewData) || (!previewData && schema.emailVerification ? !otpVerified : false)}
                >
                  Submit
                </Button>
                <Button type="reset" variant="text" onClick={formik.handleReset}>
                  Clear form
                </Button>
              </Box>
            </Form>
          </FormikProvider>
        </Box>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>🎉 Thank You!</DialogTitle>
          <DialogContent>
            <Typography>Your form has been submitted successfully.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant="contained" color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
