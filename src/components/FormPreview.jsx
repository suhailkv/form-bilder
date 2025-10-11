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
  Divider,
  Skeleton,
  CircularProgress

} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { RadioButtonUnchecked, RadioButtonChecked } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchForm,
  setEmail,
  requestOtp,
  verifyOtp,
  submitForm,
} from "../redux/features/formSlice";
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
  const { formData, email, otpSent, otpVerified, error, loading, formLoading } =
    useSelector((store) => store.form);

  const [openDialog, setOpenDialog] = useState(false);
  const [fileIdAndItsFilePath, setFileAndItsFilePath] = useState({});
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!formId) return;
    if (!formData?.id || formData?.id !== Number(formId)) {
      dispatch(fetchForm(formId)).catch((err) =>
        console.error("Fetch form failed:", err)
      );
    }
  }, [dispatch, formId]);

  const schema = useMemo(
    () => previewData?.schema || formData?.schema || null,
    [previewData, formData]
  );
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
      return schema.fields.filter((f) => evaluateConditions(f, formik.values));
    } catch {
      return schema.fields;
    }
  }, [schema, formik.values]);

  /* Loading Skeleton */
  if (formLoading || !schema?.fields) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        minHeight="100vh"
        sx={{
          background:
            "linear-gradient(135deg, #f3e8ff 0%, #ede7f6 100%)",
        }}
        py={6}
      >
        <Paper
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 640,
            borderRadius: "16px",
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height={120}
            sx={{ mb: 3, borderRadius: "8px" }}
          />
          {[...Array(4)].map((_, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton
                variant="rectangular"
                height={50}
                sx={{ borderRadius: "8px" }}
              />
            </Box>
          ))}
        </Paper>
      </Box>
    );
  }

  /* ---- UI ---- */
  return (
    <>
      {!previewData && !formData && <FormHeader />}

      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f3e8ff 0%, #ede7f6 100%)",
          py: 6,
          display: "flex",
          justifyContent: "center",
          fontFamily: "Roboto, Arial, sans-serif",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 700 }}>
          {/* Banner */}
          {(previewData?.bannerImage ||
            formData?.bannerImage ||
            previewData?.bannerImageFilename ||
            formData?.bannerImageFilename) && (
              <Paper
                sx={{
                  mb: 3,
                  overflow: "hidden",
                  borderRadius: "16px",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                }}
              >
                <img
                  loading="lazy"
                  src={`${BACKEND_URL}${FILE_PATH}${previewData?.bannerImage || formData?.bannerImage
                    }`}
                  alt="Banner"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
              </Paper>
            )}

          {/* Title */}
          <Paper
            sx={{
              p: 4,
              mb: 3,
              borderTop: "10px solid #673ab7",
              borderRadius: "16px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{ color: "#202124", mb: 1 }}
            >
              {schema?.title || "Untitled form"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {schema?.description || ""}
            </Typography>
          </Paper>

          {/* OTP Section */}
          {!previewData && schema?.emailVerification && (
            <>
              {otpVerified ? (
                // ✅ Verified Success UI
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    background: "linear-gradient(90deg, #4caf50 0%, #81c784 100%)",
                    color: "#fff",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: "#ffffff33",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    ✅
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Email Verified
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      You’re good to go! You can now submit your form.
                    </Typography>
                  </Box>
                </Paper>
              ) : (
                // 🔄 Interactive OTP Section
                <Paper
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: "16px",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
                    backgroundColor: "#fff",
                    transition: "all 0.3s ease",
                  }}
                >
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
                        <Button
                          variant="contained"
                          onClick={handleRequestOtp}
                          disabled={loading}
                          sx={{
                            backgroundColor: "#673ab7",
                            borderRadius: "25px",
                            px: 4,
                            "&:hover": { backgroundColor: "#5e35b1" },
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          {loading ? (
                            <>
                              <CircularProgress
                                size={18}
                                thickness={5}
                                sx={{ color: "white" }}
                              />
                              <span>Sending...</span>
                            </>
                          ) : (
                            "Request OTP"
                          )}
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
                          disabled={loading || otpVerified}
                          onClick={handleVerifyOtp}
                          sx={{
                            borderRadius: "25px",
                            px: 4,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          {loading ? (
                            <>
                              <CircularProgress
                                size={18}
                                thickness={5}
                                sx={{ color: "white" }}
                              />
                              <span>Verifying...</span>
                            </>
                          ) : (
                            "Verify OTP"
                          )}
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

          {/* Form Fields */}
          <FormikProvider value={formik}>
            {!openDialog ? (


              <Form onSubmit={formik.handleSubmit}>
                {visibleFields.map((field, idx) => (
                  <Paper
                    key={field.id}
                    sx={{
                      p: 3,
                      mb: 3,
                      borderLeft: "6px solid #673ab7",
                      borderRadius: "16px",
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    }}
                  >
                    {field.type !== "checkbox" && (
                      <Typography
                        variant="subtitle1"
                        fontWeight={500}
                        sx={{ mb: 1, color: "#202124" }}
                      >
                        {field.label}
                      </Typography>
                    )}

                    <FieldWrapper
                      field={field}
                      values={formik.values}
                      setFieldValue={formik.setFieldValue}
                    >
                      {/* Inputs */}
                      {["text", "number"].includes(field.type) && (
                        <TextField
                          fullWidth
                          name={field.id}
                          type={field.type}
                          placeholder={field.placeholder || ""}
                          value={formik.values[field.id] ?? ""}
                          onChange={formik.handleChange}
                          variant="outlined"
                          size="small"
                        />
                      )}

                      {field.type === "select" && (
                        <FormControl fullWidth size="small">
                          <Select
                            name={field.id}
                            value={formik.values[field.id] ?? ""}
                            onChange={formik.handleChange}
                            displayEmpty
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
                                    color: "#9e9e9e",
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
                                  icon={<RadioButtonUnchecked />}
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
                                color: "#9e9e9e",
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
                            sx={{
                              borderColor: "#b39ddb",
                              color: "#673ab7",
                              "&:hover": {
                                borderColor: "#673ab7",
                                backgroundColor: "#f3e5f5",
                              },
                            }}
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
                    {idx < visibleFields.length - 1 && (
                      <Divider sx={{ mt: 2, borderColor: "#e0e0e0" }} />
                    )}
                  </Paper>
                ))}

                {/* Buttons */}
                <Box
                  mt={4}
                  display="flex"
                  justifyContent="space-between"
                  sx={{ px: 1 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: "#673ab7",
                      borderRadius: "25px",
                      px: 4,
                      "&:hover": { backgroundColor: "#5e35b1" },
                    }}
                    disabled={
                      Boolean(previewData) ||
                      (!previewData && schema.emailVerification && !otpVerified)
                    }
                  >
                    Submit
                  </Button>
                  <Button
                    type="reset"
                    variant="text"
                    onClick={formik.handleReset}
                    sx={{
                      borderRadius: "25px",
                      color: "#673ab7",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "#ede7f6",
                      },
                    }}
                  >
                    Clear form
                  </Button>
                </Box>
              </Form>
            ) : (

              // ✅ Thank You Section
              <Paper
                elevation={3}
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: "20px",
                  mt: 5,
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                  animation: "fadeIn 0.6s ease-out",
                  "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "translateY(20px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                {/* Animated checkmark */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    mx: "auto",
                    mb: 3,
                    backgroundColor: "#673ab7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "popIn 0.5s ease",
                    "@keyframes popIn": {
                      from: { transform: "scale(0)", opacity: 0 },
                      to: { transform: "scale(1)", opacity: 1 },
                    },
                  }}
                >
                  <Typography variant="h4" sx={{ color: "#fff" }}>
                    ✓
                  </Typography>
                </Box>

                {/* Title */}
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: "#202124", mb: 1 }}
                >
                  {schema?.title || "Form Submitted"}
                </Typography>

                {/* Thank You Text */}
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  {schema?.thankYouMessage ||
                    "Your response has been recorded."}
                </Typography>

                {/* Optional: "Submit another response" button */}
                <Button
                  variant="outlined"
                  sx={{
                    color: "#673ab7",
                    borderColor: "#b39ddb",
                    borderRadius: "25px",
                    px: 4,
                    "&:hover": {
                      borderColor: "#673ab7",
                      backgroundColor: "#f3e5f5",
                    },
                  }}
                  onClick={() => window.location.reload()}
                >
                  Submit another response
                </Button>
              </Paper>
            )}
          </FormikProvider>
        </Box>

        {/* Thank You */}

      </Box>
    </>
  );
}
