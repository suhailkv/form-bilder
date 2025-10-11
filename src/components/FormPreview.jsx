import { useState, useEffect, useMemo } from "react";
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
  Skeleton,
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

const FieldWrapper = ({ field, children, values, setFieldValue }) => (
  <Box sx={{ mb: 2 }}>
    {children}
    {values?.[field.id] !== undefined &&
      (field.type !== "checkbox" || values[field.id] === true) && (
        <Box display="flex" justifyContent="flex-end" mt={1}>
          <Button
            size="small"
            variant="text"
            onClick={() => {
              if (field.type === "checkbox") setFieldValue(field.id, false);
              else if (field.type === "multipleChoice")
                setFieldValue(field.id, []);
              else setFieldValue(field.id, "");
            }}
            sx={{
              textTransform: "none",
              fontSize: "0.85rem",
              color: "text.secondary",
            }}
          >
            Clear
          </Button>
        </Box>
      )}
  </Box>
);

export default function FormPreview({ previewData }) {
  const dispatch = useDispatch();
  const { formId } = useParams();

  const { formData, email, otpSent, otpVerified, error, loading } = useSelector(
    (store) => store.form
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [fileIdAndItsFilePath, setFileAndItsFilePath] = useState({});
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!formId) return;
    // Always fetch when no schema or formId mismatch
    if (!formData?.id || formData?.id !== Number(formId)) {
      dispatch(fetchForm(formId))
        .unwrap()
        .catch((err) => console.error("Fetch form failed:", err));
    }
  }, [dispatch, formId]);

  const schema = useMemo(() => {
    return previewData?.schema || formData?.schema || null;
  }, [previewData, formData]);

  const formIdentifier = formId;

  const initialValues = useMemo(() => {
    if (!schema?.fields) return {};
    return schema.fields.reduce((acc, field) => {
      if (field.type === "checkbox") acc[field.id] = false;
      else if (field.type === "multipleChoice") acc[field.id] = [];
      else acc[field.id] = "";
      return acc;
    }, {});
  }, [schema]);

  const validationSchema = useMemo(() => {
    if (!schema?.fields) return Yup.object({});
    return Yup.object(
      schema.fields.reduce((acc, field) => {
        if (field.required)
          acc[field.id] = Yup.mixed().required(`${field.label} is required`);
        return acc;
      }, {})
    );
  }, [schema]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (!schema) return;
      if (!previewData && schema?.emailVerification && !otpVerified) {
        alert("Please verify your email before submitting.");
        return;
      }

      const data = { ...values, ...fileIdAndItsFilePath };
      dispatch(submitForm({ formId: formIdentifier, email, data }))
        .unwrap()
        .then((res) => {
          if (res?.success) setOpenDialog(true);
          else alert("Form submission failed.");
        })
        .catch((err) => console.error("Submit error:", err));
    },
  });

  const handleRequestOtp = () => {
    if (!email) return alert("Enter email first");
    dispatch(requestOtp({ formId: formIdentifier, email }));
  };

  const handleVerifyOtp = () => {
    if (!otp) return alert("Enter OTP");
    dispatch(verifyOtp({ email, otp, formToken: formIdentifier }));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    window.close();
  };

  const visibleFields = useMemo(() => {
    if (!schema?.fields) return [];
    try {
      return schema.fields.filter((f) =>
        evaluateConditions(f, formik.values)
      );
    } catch {
      return schema.fields;
    }
  }, [schema, formik.values]);

  /* Skeleton Loader */
  if (loading || !schema?.fields) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        minHeight="100vh"
        bgcolor="#f1ebf9"
        py={6}
      >
        <Paper sx={{ p: 4, width: "100%", maxWidth: 640 }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={120}
            sx={{ mb: 3, borderRadius: "8px" }}
          />
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="70%" sx={{ mb: 2 }} />
          {[...Array(3)].map((_, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              <Skeleton variant="text" width="40%" />
              <Skeleton
                variant="rectangular"
                height={50}
                sx={{ borderRadius: "4px" }}
              />
            </Box>
          ))}
        </Paper>
      </Box>
    );
  }

  /* Actual Form UI */
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
          {(previewData?.bannerImage ||
            formData?.bannerImage ||
            previewData?.bannerImageFilename ||
            formData?.bannerImageFilename) && (
            <Paper sx={{ mb: 2, overflow: "hidden", borderRadius: "8px" }}>
              <img
                loading="lazy"
                src={`${BACKEND_URL}${FILE_PATH}${
                  previewData?.bannerImage || formData?.bannerImage
                }`}
                alt="Banner"
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </Paper>
          )}

          {/* Title & Description */}
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
              {schema?.title || "Untitled form"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {schema?.description || ""}
            </Typography>
          </Paper>

          {/* OTP Verification */}
          {!previewData && schema?.emailVerification && (
            <>
              {otpVerified ? (
                <Paper
                  sx={{
                    p: 1,
                    mb: 2,
                    width: "fit-content",
                    bgcolor: "success.main",
                    borderRadius: "8px",
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
                <Paper sx={{ p: 2, mb: 3, borderRadius: "8px" }}>
                  {!otpSent && (
                    <>
                      <TextField
                        fullWidth
                        label="Enter Email"
                        value={email}
                        onChange={(e) => dispatch(setEmail(e.target.value))}
                        sx={{ mb: 2 }}
                      />
                      <Box display="flex" justifyContent="flex-end">
                        <Button variant="contained" onClick={handleRequestOtp}>
                          Request OTP
                        </Button>
                      </Box>
                    </>
                  )}
                  {otpSent && !otpVerified && (
                    <>
                      <TextField
                        fullWidth
                        label="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleVerifyOtp}
                        >
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

          {/* Dynamic Form */}
          <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit}>
              {visibleFields.map((field) => (
                <Paper
                  key={field.id}
                  sx={{ p: 3, mb: 2, color: "text.primary" }}
                  elevation={1}
                >
                  {field.type !== "checkbox" && (
                    <Typography
                      gutterBottom
                      fontWeight={500}
                      fontSize="20px"
                      sx={{ mb: 1 }}
                    >
                      {field.label}
                    </Typography>
                  )}

                  <FieldWrapper
                    field={field}
                    values={formik.values}
                    setFieldValue={formik.setFieldValue}
                  >
                    {/* Input rendering (text, select, etc.) */}
                    {field.type === "text" && (
                      <TextField
                        fullWidth
                        name={field.id}
                        placeholder={field.placeholder || ""}
                        value={formik.values[field.id] ?? ""}
                        onChange={formik.handleChange}
                        variant="standard"
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
                      />
                    )}

                    {field.type === "select" && (
                      <FormControl fullWidth variant="standard">
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
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        {field.options.map((opt, i) => (
                          <FormControlLabel
                            key={i}
                            control={
                              <Checkbox
                                checked={
                                  formik.values[field.id]?.includes(opt) ?? false
                                }
                                onChange={(e) => {
                                  const current = formik.values[field.id] || [];
                                  formik.setFieldValue(
                                    field.id,
                                    e.target.checked
                                      ? [...current, opt]
                                      : current.filter((v) => v !== opt)
                                  );
                                }}
                                icon={
                                  <RadioButtonUnchecked sx={{ color: "gray" }} />
                                }
                                checkedIcon={
                                  <RadioButtonChecked sx={{ color: "#673ab7" }} />
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
                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Upload file (Max {field.maxSize / 1024 / 1024 || 5} MB)
                        </Typography>
                        <Button
                          variant="outlined"
                          component="label"
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
                              formik.setFieldValue(field.id, file);
                              dispatch(uploadBannerImage(file))
                                .unwrap()
                                .then((response) => {
                                  setFileAndItsFilePath((prev) => ({
                                    ...prev,
                                    [field.id]: response?.storedName,
                                  }));
                                })
                                .catch((error) =>
                                  console.error("Upload failed:", error)
                                );
                            }}
                          />
                        </Button>
                      </Box>
                    )}
                  </FieldWrapper>
                </Paper>
              ))}

              <Box mt={3} display="flex" justifyContent="space-between">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={
                    Boolean(previewData) ||
                    (!previewData && schema.emailVerification && !otpVerified)
                  }
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

        {/* Thank You Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>🎉 Thank You!</DialogTitle>
          <DialogContent>
            <Typography>
              {schema?.thankYouMessage ||
                "Your form has been submitted successfully."}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant="contained">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
