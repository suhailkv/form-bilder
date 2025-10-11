// src/components/FormPreview.jsx
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  memo,
} from "react";
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
  Divider,
  Skeleton,
  CircularProgress,
  LinearProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Chip,
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

/* -------------------------------------------------------------------------- */
/*                                   CONFIG                                   */
/* -------------------------------------------------------------------------- */
const CONFIG = {
  COLORS: { PRIMARY: "#673ab7", BACKGROUND: "#f6f4fb" },
  ANIMATION_DURATION: 240,
  OTP_RESEND_INTERVAL: 30,
  MAX_FILE_MB: 5,
  FONT_URL:
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
};

const FILE_PATH = import.meta.env.VITE_FILE_PATH || "/";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

/* ---------------------------- THEME ---------------------------- */
const theme = createTheme({
  palette: {
    primary: { main: CONFIG.COLORS.PRIMARY },
    background: { default: CONFIG.COLORS.BACKGROUND },
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: ['"Inter"', "Roboto", "Helvetica", "Arial", "sans-serif"].join(
      ","
    ),
  },
});

/* ---------------------------- SKELETON ---------------------------- */
const FormSkeleton = memo(() => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="flex-start"
    minHeight="100vh"
    sx={{
      background: "linear-gradient(135deg,#f7f1ff 0%,#f1eefe 100%)",
    }}
    py={6}
  >
    <Paper sx={{ p: 4, width: "100%", maxWidth: 760 }}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={220}
        sx={{ mb: 3, borderRadius: 2 }}
      />
      {[...Array(4)].map((_, idx) => (
        <Box key={idx} sx={{ mb: 3 }}>
          <Skeleton variant="text" width={`${40 + idx * 10}%`} height={28} />
          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
        </Box>
      ))}
    </Paper>
  </Box>
));

/* ---------------------------- FIELD WRAPPER ---------------------------- */
const FieldWrapper = memo(({ field, children, formik }) => (
  <Box sx={{ mb: 2 }}>
    {children}
    {/* show error only when touched or after submit */}
    {formik.touched?.[field.id] && formik.errors?.[field.id] && (
      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
        {formik.errors[field.id]}
      </Typography>
    )}
  </Box>
));

/* ---------------------------- DYNAMIC FIELD ---------------------------- */
const DynamicField = memo(({ field, formik, dispatch, setFileAndItsFilePath }) => {
  // compute max bytes for file validation (field.maxSize may be string or number in bytes)
  const maxBytes = useMemo(() => {
    if (!field?.maxSize) return CONFIG.MAX_FILE_MB * 1024 * 1024;
    // if provided in MB or bytes; try parseInt, if small assume MB else bytes
    const parsed = parseInt(field.maxSize, 10);
    if (isNaN(parsed)) return CONFIG.MAX_FILE_MB * 1024 * 1024;
    // Heuristic: if parsed < 100 then assume MB (e.g., "5"), else bytes (e.g., 5242880)
    return parsed < 100 ? parsed * 1024 * 1024 : parsed;
  }, [field?.maxSize]);

  const handleFileUpload = useCallback(
    (e) => {
      const file = e.currentTarget.files?.[0];
      if (!file) return;

      // Type check if accept provided (basic)
      if (field.accept) {
        const accepts = field.accept.split(",").map((s) => s.trim().toLowerCase());
        const fileName = (file.name || "").toLowerCase();
        const matches = accepts.some((a) => {
          if (a.startsWith(".")) return fileName.endsWith(a);
          return file.type === a;
        });
        if (!matches) {
          formik.setFieldError(field.id, `File type not allowed (${field.accept})`);
          return;
        }
      }

      if (file.size > maxBytes) {
        formik.setFieldError(
          field.id,
          `File too large. Max ${(maxBytes / 1024 / 1024).toFixed(1)} MB allowed.`
        );
        return;
      }

      // clear previous error and set file
      formik.setFieldError(field.id, undefined);
      formik.setFieldValue(field.id, file);

      // dispatch upload and store returned name/path
      dispatch(uploadBannerImage(file))
        .unwrap()
        .then((response) => {
          setFileAndItsFilePath((prev) => ({
            ...prev,
            [field.id]: response?.storedName,
          }));
        })
        .catch((err) => {
          console.error("Upload failed:", err);
          formik.setFieldError(field.id, "Upload failed. Try again.");
        });
    },
    [dispatch, field, formik, maxBytes, setFileAndItsFilePath]
  );

  // common props for text/select fields
  const commonProps = {
    name: field.id,
    onBlur: formik.handleBlur,
    onChange: formik.handleChange,
    value:
      formik.values[field.id] === undefined || formik.values[field.id] === null
        ? field.type === "multipleChoice"
          ? []
          : field.type === "checkbox"
          ? false
          : ""
        : formik.values[field.id],
  };

  switch (field.type) {
    case "text":
      return (
        <FieldWrapper field={field} formik={formik}>
          <TextField
            {...commonProps}
            fullWidth
            type="text"
            placeholder={field.placeholder || ""}
            variant="outlined"
            size="small"
          />
        </FieldWrapper>
      );

    case "number":
      return (
        <FieldWrapper field={field} formik={formik}>
          <TextField
            {...commonProps}
            fullWidth
            type="number"
            placeholder={field.placeholder || ""}
            variant="outlined"
            size="small"
          />
        </FieldWrapper>
      );

    case "select":
      return (
        <FieldWrapper field={field} formik={formik}>
          <FormControl fullWidth size="small">
            <Select
              {...commonProps}
              displayEmpty
              renderValue={(selected) =>
                selected ? selected : <span style={{ color: "#9e9e9e" }}>Select an option</span>
              }
            >
              {field.options?.map((opt, i) => (
                <MenuItem key={i} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FieldWrapper>
      );

    case "radio":
      return (
        <FieldWrapper field={field} formik={formik}>
          <RadioGroup
            name={field.id}
            value={formik.values[field.id] ?? ""}
            onChange={(e) => formik.setFieldValue(field.id, e.target.value)}
          >
            {field.options?.map((opt, i) => (
              <FormControlLabel
                key={i}
                value={opt}
                control={<Radio sx={{ color: "#9e9e9e", "&.Mui-checked": { color: CONFIG.COLORS.PRIMARY } }} />}
                label={opt}
              />
            ))}
          </RadioGroup>
        </FieldWrapper>
      );

    case "multipleChoice":
      return (
        <FieldWrapper field={field} formik={formik}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {field.options?.map((opt, i) => (
              <FormControlLabel
                key={i}
                control={
                  <Checkbox
                    checked={formik.values[field.id]?.includes(opt) ?? false}
                    onChange={(e) => {
                      const current = formik.values[field.id] || [];
                      formik.setFieldValue(
                        field.id,
                        e.target.checked ? [...current, opt] : current.filter((v) => v !== opt)
                      );
                    }}
                    icon={<RadioButtonUnchecked />}
                    checkedIcon={<RadioButtonChecked sx={{ color: CONFIG.COLORS.PRIMARY }} />}
                  />
                }
                label={opt}
              />
            ))}
          </Box>
        </FieldWrapper>
      );

    case "checkbox":
      return (
        <FieldWrapper field={field} formik={formik}>
          <FormControlLabel
            control={
              <Checkbox
                name={field.id}
                checked={!!formik.values[field.id]}
                onChange={(e) => formik.setFieldValue(field.id, e.target.checked)}
                sx={{ color: "#9e9e9e", "&.Mui-checked": { color: CONFIG.COLORS.PRIMARY } }}
              />
            }
            label={field.label}
          />
        </FieldWrapper>
      );

    case "uploadFile":
      return (
        <FieldWrapper field={field} formik={formik}>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Upload file (Max {(maxBytes / 1024 / 1024).toFixed(1)} MB)
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{
                borderColor: "#b39ddb",
                color: CONFIG.COLORS.PRIMARY,
                "&:hover": { borderColor: CONFIG.COLORS.PRIMARY, backgroundColor: "#f3e5f5" },
              }}
            >
              {formik.values[field.id]?.name || "Add file"}
              <input type="file" hidden name={field.id} accept={field.accept || ""} onChange={handleFileUpload} />
            </Button>
          </Box>
        </FieldWrapper>
      );

    default:
      return null;
  }
});

/* ---------------------------- VALIDATION BUILDER ---------------------------- */
const buildValidationSchema = (fields = []) => {
  const shape = {};
  (fields || []).forEach((f) => {
    let rule;
    switch (f.type) {
      case "text": {
        rule = Yup.string();
        if (f.min) {
          const min = Number(f.min);
          if (!isNaN(min)) rule = rule.min(min, `${f.label} must be at least ${min} characters`);
        }
        if (f.max) {
          const max = Number(f.max);
          if (!isNaN(max)) rule = rule.max(max, `${f.label} must be at most ${max} characters`);
        }
        // if placeholder of email or label contains 'email', try email validation (best-effort)
        if ((f.label || "").toLowerCase().includes("email") || (f.placeholder || "").toLowerCase().includes("email")) {
          rule = rule.email("Enter a valid email");
        }
        break;
      }

      case "number": {
        rule = Yup.number().typeError(`${f.label} must be a number`).transform((v, o) => (o === "" ? undefined : v));
        if (f.min) {
          const min = Number(f.min);
          if (!isNaN(min)) rule = rule.min(min, `${f.label} must be at least ${min}`);
        }
        if (f.max) {
          const max = Number(f.max);
          if (!isNaN(max)) rule = rule.max(max, `${f.label} must be at most ${max}`);
        }
        break;
      }

      case "select":
      case "radio": {
        rule = Yup.string();
        break;
      }

      case "multipleChoice": {
        rule = Yup.array();
        if (f.min) {
          const min = Number(f.min);
          if (!isNaN(min)) rule = rule.min(min, `Select at least ${min}`);
        }
        if (f.max) {
          const max = Number(f.max);
          if (!isNaN(max)) rule = rule.max(max, `Select up to ${max}`);
        }
        break;
      }

      case "checkbox": {
        rule = Yup.boolean();
        break;
      }

      case "uploadFile": {
        // validate presence & size; actual file type check is done at upload handler
        const maxBytes = (f.maxSize && parseInt(f.maxSize, 10) < 100 ? parseInt(f.maxSize, 10) * 1024 * 1024 : parseInt(f.maxSize, 10)) || (CONFIG.MAX_FILE_MB * 1024 * 1024);
        rule = Yup.mixed().test("fileSize", `File too large (max ${Math.round(maxBytes / 1024 / 1024)}MB)`, (value) => {
          if (!value) return true; // not required by default
          if (value && value.size) return value.size <= maxBytes;
          return true;
        });
        break;
      }

      default:
        rule = Yup.mixed();
    }

    if (f.required) {
      // for checkbox, require true if it's required
      if (f.type === "checkbox") rule = rule.oneOf([true], `${f.label} is required`);
      else rule = rule.required(`${f.label} is required`);
    }

    shape[f.id] = rule;
  });

  return Yup.object().shape(shape);
};

/* ---------------------------- MAIN COMPONENT ---------------------------- */
export default function FormPreview({ previewData }) {
  const dispatch = useDispatch();
  const { formId } = useParams();

  // redux state
  const {
    formData,
    email,
    otpSent,
    otpVerified,
    error,
    loading,
    formLoading,
  } = useSelector((store) => store.form);

  // local state
  const [openDialog, setOpenDialog] = useState(false);
  const [fileIdAndItsFilePath, setFileAndItsFilePath] = useState({});
  const [otp, setOtp] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const resendIntervalRef = useRef(null);

  // ensure Inter font (only once)
  useEffect(() => {
    if (document.getElementById("inter-font")) return;
    const l = document.createElement("link");
    l.id = "inter-font";
    l.rel = "stylesheet";
    l.href = CONFIG.FONT_URL;
    document.head.appendChild(l);
  }, []);

  // fetch form on mount / formId change
  useEffect(() => {
    if (!formId) return;
    if (!formData?.id || formData?.id !== Number(formId)) {
      dispatch(fetchForm(formId)).catch((err) =>
        console.error("Fetch form failed:", err)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, formId]);

  // schema & validation
  const schema = useMemo(
    () => previewData?.schema || formData?.schema || null,
    [previewData, formData]
  );

  const validationSchema = useMemo(
    () => buildValidationSchema(schema?.fields || []),
    [schema]
  );

  const initialValues = useMemo(() => {
    if (!schema?.fields) return {};
    return schema.fields.reduce((acc, field) => {
      if (field.type === "checkbox") acc[field.id] = !!field.defaultChecked || false;
      else if (field.type === "multipleChoice") acc[field.id] = [];
      else acc[field.id] = "";
      return acc;
    }, {});
  }, [schema]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      // require email verification if configured
      if (!previewData && schema?.emailVerification && !otpVerified) {
        alert("Please verify your email before submitting.");
        return;
      }

      const data = { ...values, ...fileIdAndItsFilePath };
      dispatch(submitForm({ formId, email, data }))
        .unwrap()
        .then((res) => {
          if (res?.success) setOpenDialog(true);
          else alert("Form submission failed.");
        })
        .catch((err) => console.error("Submit error:", err));
    },
  });

  /* ---------- Conditional Field Animation Manager ---------- */
  const visibleFields = useMemo(() => {
    if (!schema?.fields) return [];
    try {
      return schema.fields.filter((f) => evaluateConditions(f, formik.values));
    } catch {
      return schema.fields;
    }
  }, [schema, formik.values]);

  const [mountedFields, setMountedFields] = useState(() =>
    visibleFields.map((f) => ({ id: f.id, state: "present" }))
  );

  // When visibleFields changes, add new ones as 'entering' and mark removed ones as 'leaving'
  useEffect(() => {
    const visibleIds = visibleFields.map((f) => f.id);

    setMountedFields((prev) => {
      const prevMap = new Map(prev.map((p) => [p.id, p]));

      // Step 1 — update/add
      visibleIds.forEach((id) => {
        const current = prevMap.get(id);
        if (!current) prevMap.set(id, { id, state: "entering" });
        else if (current.state === "leaving")
          prevMap.set(id, { id, state: "present" });
      });

      // Step 2 — mark missing as leaving
      for (const [id, entry] of prevMap) {
        if (!visibleIds.includes(id) && entry.state !== "leaving") {
          prevMap.set(id, { id, state: "leaving" });
        }
      }

      // Step 3 — produce array sorted by current visible order,
      // while keeping leaving items at their original place (so layout doesn’t jump)
      const ordered = [];
      visibleFields.forEach((f) => {
        const entry = prevMap.get(f.id);
        if (entry) ordered.push(entry);
      });
      // append leaving ones that aren’t visible anymore
      prev.forEach((p) => {
        if (p.state === "leaving" && !ordered.find((o) => o.id === p.id))
          ordered.push(p);
      });

      return ordered;
    });
  }, [visibleFields]);

  // Flip entering -> present shortly after mount to trigger CSS transition
  useEffect(() => {
    if (!mountedFields.some((m) => m.state === "entering")) return;
    const t = setTimeout(() => {
      setMountedFields((prev) =>
        prev.map((m) => (m.state === "entering" ? { ...m, state: "present" } : m))
      );
    }, 20);
    return () => clearTimeout(t);
  }, [mountedFields]);

  // Remove leaving items after animation duration
  useEffect(() => {
    const leaving = mountedFields.filter((m) => m.state === "leaving");
    if (leaving.length === 0) return;
    const timers = leaving.map((m) =>
      setTimeout(() => {
        setMountedFields((prev) => prev.filter((p) => p.id !== m.id));
      }, CONFIG.ANIMATION_DURATION)
    );
    return () => timers.forEach((t) => clearTimeout(t));
  }, [mountedFields]);

  /* ---------- OTP handlers & resend countdown ---------- */
  useEffect(() => {
    // start countdown after otpSent becomes true
    if (otpSent) {
      setResendCountdown(CONFIG.OTP_RESEND_INTERVAL);
      if (resendIntervalRef.current) clearInterval(resendIntervalRef.current);
      resendIntervalRef.current = setInterval(() => {
        setResendCountdown((s) => {
          if (s <= 1) {
            clearInterval(resendIntervalRef.current);
            resendIntervalRef.current = null;
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (resendIntervalRef.current) {
        clearInterval(resendIntervalRef.current);
        resendIntervalRef.current = null;
      }
      setResendCountdown(0);
    }

    return () => {
      if (resendIntervalRef.current) {
        clearInterval(resendIntervalRef.current);
        resendIntervalRef.current = null;
      }
    };
  }, [otpSent]);

  const handleRequestOtp = useCallback(() => {
    if (!email) return alert("Enter email first");
    dispatch(requestOtp({ formId, email }));
  }, [dispatch, email, formId]);

  const handleResendOtp = useCallback(() => {
    if (resendCountdown > 0) return;
    if (!email) return alert("Enter email first");
    dispatch(requestOtp({ formId, email }));
  }, [dispatch, email, formId, resendCountdown]);

  const handleVerifyOtp = useCallback(() => {
    if (!otp) return alert("Enter OTP");
    dispatch(verifyOtp({ email, otp, formToken: formId }));
  }, [dispatch, email, otp, formId]);

  /* ---------- banner rendering helper ---------- */
  const renderBanner = useCallback(() => {
    const bannerFile =
      previewData?.bannerImage ||
      formData?.bannerImage ||
      previewData?.bannerImageFilename ||
      formData?.bannerImageFilename;
    if (!bannerFile) return null;

    return (
      <Box
        sx={{
          mb: 3,
          overflow: "hidden",
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <Box
          component="img"
          src={`${BACKEND_URL}${FILE_PATH}${bannerFile}`}
          alt="Banner"
          loading="lazy"
          sx={{
            width: "100%",
            height: { xs: 140, sm: 180, md: 220 },
            objectFit: "cover",
            display: "block",
          }}
        />
        <Box
          sx={{
            height: 44,
            mt: -7,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(246,244,251,1) 90%)",
          }}
        />
      </Box>
    );
  }, [previewData, formData]);

  const isFormReady = !formLoading && Boolean(schema?.fields);
  const showTopProgress = formLoading || loading;

  if (!isFormReady) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {showTopProgress && (
          <LinearProgress
            color="primary"
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1400,
              height: 3,
            }}
          />
        )}
        <FormSkeleton />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* top linear progress when fetching or performing actions */}
      {showTopProgress && (
        <LinearProgress
          color="primary"
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1400,
            height: 3,
          }}
        />
      )}

      {!previewData && !formData && <FormHeader />}

      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg,#f7f1ff 0%,#f1eefe 100%)",
          py: 6,
          display: "flex",
          justifyContent: "center",
          fontFamily: '"Inter", Roboto, Arial, sans-serif',
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 760 }}>
          {/* Banner */}
          {renderBanner()}

          {/* Title card */}
          <Paper sx={{ p: 3, mb: 3, borderTop: `6px solid ${CONFIG.COLORS.PRIMARY}` }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              {schema?.title || "Untitled form"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {schema?.description || ""}
            </Typography>
          </Paper>

          {/* Email verification - special compact section above fields */}
          {!previewData && schema?.emailVerification && (
            <Paper sx={{ p: 2, mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
              {/* left: messages */}
              <Box sx={{ flex: 1 }}>
                {otpVerified ? (
                  <Chip label="Email verified" color="success" sx={{ fontWeight: 600 }} />
                ) : (
                  <>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                      Verify your email
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      We will send an OTP to your email address to verify your identity.
                    </Typography>
                  </>
                )}
              </Box>

              {/* right: inputs / actions */}
              <Box sx={{ minWidth: 240, display: "flex", gap: 1, alignItems: "center", justifyContent: "flex-end" }}>
                {!otpSent && !otpVerified && (
                  <>
                    <TextField size="small" value={email} onChange={(e) => dispatch(setEmail(e.target.value))} placeholder="you@example.com" sx={{ minWidth: 200 }} />
                    <Button variant="contained" onClick={handleRequestOtp} disabled={loading} sx={{ px: 2 }}>
                      {loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Send"}
                    </Button>
                  </>
                )}

                {otpSent && !otpVerified && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "nowrap" }}>
                    <TextField size="small" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" sx={{ minWidth: 150, flexShrink: 0 }} />
                    <Button variant="contained" color="success" onClick={handleVerifyOtp} disabled={loading} sx={{ px: 2, flexShrink: 0 }}>
                      {loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Verify"}
                    </Button>

                    {/* resend / countdown */}
                    <Typography
                      variant="body2"
                      sx={{
                        minWidth: 100,
                        textAlign: "right",
                        flexShrink: 0,
                        color: resendCountdown > 0 ? "text.secondary" : "primary.main",
                        fontWeight: resendCountdown > 0 ? 400 : 600,
                        cursor: resendCountdown > 0 ? "default" : "pointer",
                      }}
                      onClick={resendCountdown > 0 ? undefined : handleResendOtp}
                    >
                      {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend OTP"}
                    </Typography>
                  </Box>
                )}

                {otpVerified && (
                  <Typography variant="body2" sx={{ color: "success.main", fontWeight: 600 }}>
                    Verified ✓
                  </Typography>
                )}
              </Box>
            </Paper>
          )}

          {/* Form fields */}
          <FormikProvider value={formik}>
            {!openDialog ? (
              <Form onSubmit={formik.handleSubmit}>
                {mountedFields.map((mountItem) => {
                  const field = schema?.fields?.find((f) => f.id === mountItem.id);
                  if (!field) return null;

                  // determine visual state
                  const state = mountItem.state; // 'entering' | 'present' | 'leaving'
                  const isLeaving = state === "leaving";
                  const opacity = state === "present" ? 1 : 0;
                  const translateY = state === "present" ? "0px" : "-8px";

                  // compute whether this field is currently one of the visibleFields and its index
                  const visibleIndex = visibleFields.findIndex((f) => f.id === field.id);
                  const showDivider = visibleIndex !== -1 && visibleIndex < visibleFields.length - 1;

                  return (
                    <Box
                      key={field.id}
                      sx={{
                        transition: `opacity ${CONFIG.ANIMATION_DURATION}ms ease, transform ${CONFIG.ANIMATION_DURATION}ms ease, margin ${CONFIG.ANIMATION_DURATION}ms ease`,
                        opacity,
                        transform: `translateY(${translateY})`,
                        pointerEvents: isLeaving ? "none" : "auto",
                        mb: isLeaving ? `${CONFIG.ANIMATION_DURATION / 1000 * 0.5}rem` : 2.5,
                      }}
                    >
                      <Paper
                        sx={{
                          p: 2.5,
                          borderLeft: `4px solid ${CONFIG.COLORS.PRIMARY}`,
                          backgroundColor: "#fff",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                        }}
                      >
                        {field.type !== "checkbox" && (
                          <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            {field.label}
                          </Typography>
                        )}

                        <DynamicField
                          field={field}
                          formik={formik}
                          dispatch={dispatch}
                          setFileAndItsFilePath={setFileAndItsFilePath}
                        />

                        {showDivider && <Divider sx={{ mt: 2, borderColor: "#eee" }} />}
                      </Paper>
                    </Box>
                  );
                })}

                <Box mt={3} display="flex" justifyContent="space-between" sx={{ px: 0 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ backgroundColor: CONFIG.COLORS.PRIMARY, px: 3 }}
                    disabled={Boolean(previewData) || (!previewData && schema.emailVerification && !otpVerified) || loading}
                  >
                    {loading ? <><CircularProgress size={18} sx={{ color: "#fff" }} /> &nbsp;Submitting...</> : "Submit Form"}
                  </Button>

                  <Button type="reset" variant="text" onClick={formik.handleReset} sx={{ color: CONFIG.COLORS.PRIMARY, fontWeight: 600 }}>
                    Clear form
                  </Button>
                </Box>
              </Form>
            ) : (
              <Paper sx={{ p: 6, mt: 3, textAlign: "center" }}>
                <Box sx={{ width: 88, height: 88, borderRadius: "50%", background: CONFIG.COLORS.PRIMARY, mx: "auto", mb: 2, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 32 }}>
                  ✓
                </Box>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>{schema?.title || "Form Submitted"}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{schema?.thankYouMessage || "Your response has been recorded."}</Typography>
                <Button variant="outlined" onClick={() => window.location.reload()} sx={{ borderRadius: 1, px: 3 }}>
                  Submit another response
                </Button>
              </Paper>
            )}
          </FormikProvider>
        </Box>
      </Box>
    </ThemeProvider>
  );
}


