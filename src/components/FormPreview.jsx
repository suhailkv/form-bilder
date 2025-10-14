// src/components/FormPreview.jsx
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  memo,
  Suspense,
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
// NOTE: we no longer statically import UploadFileIcon to reduce initial bundle
import { RadioButtonUnchecked, RadioButtonChecked } from "@mui/icons-material";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
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
import Recaptcha from "../components/reCaptcha/Recaptcha";
/* FormHeader will be lazy-loaded — removes it from initial bundle */
const LazyFormHeader = React.lazy(() => import("./FormHeader"));

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
    {formik.touched?.[field.id] && formik.errors?.[field.id] && (
      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
        {formik.errors[field.id]}
      </Typography>
    )}
  </Box>
));

/* ---------------------------- Dynamic Upload Icon (lazy) ---------------------------- */
/* We dynamically import the UploadFileIcon only when the upload field renders.
   This avoids shipping the icon module in the initial bundle if upload fields
   aren't present on the first render. */
function useLazyUploadIcon() {
  const [Icon, setIcon] = useState(null);
  useEffect(() => {
    let mounted = true;
    // schedule dynamic import on idle to avoid jank
    const load = () => {
      import("@mui/icons-material/UploadFile")
        .then((mod) => {
          if (mounted) setIcon(() => mod.default);
        })
        .catch(() => {
          /* ignore — icon is purely decorative */
        });
    };
    if ("requestIdleCallback" in window) {
      // small idle window
      const id = (window).requestIdleCallback(load, { timeout: 300 });
      return () => {
        mounted = false;
        (window).cancelIdleCallback?.(id);
      };
    } else {
      // fallback
      const t = setTimeout(load, 200);
      return () => {
        mounted = false;
        clearTimeout(t);
      };
    }
  }, []);
  return Icon;
}

/* ---------------------------- DYNAMIC FIELD ---------------------------- */
const DynamicField = memo(({ field, formik, dispatch, setFileAndItsFilePath }) => {
  const UploadIcon = useLazyUploadIcon();

  // compute max bytes for file validation (field.maxSize may be string or number in bytes)
  const maxBytes = useMemo(() => {
    if (!field?.maxSize) return CONFIG.MAX_FILE_MB * 1024 * 1024;
    const parsed = parseInt(field.maxSize, 10);
    if (isNaN(parsed)) return CONFIG.MAX_FILE_MB * 1024 * 1024;
    return parsed < 100 ? parsed * 1024 * 1024 : parsed;
  }, [field?.maxSize]);

  const handleFileUpload = useCallback(
    (e) => {
      const file = e.currentTarget.files?.[0];
      if (!file) return;

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

      formik.setFieldError(field.id, undefined);
      formik.setFieldValue(field.id, file);

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

  const commonProps = useMemo(
    () => ({
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
    }),
    [field.id, field.type, formik]
  );

  switch (field.type) {
    case "text":
      return (
        <FieldWrapper field={field} formik={formik}>
          <TextField {...commonProps} fullWidth type="text" placeholder={field.placeholder || ""} variant="outlined" size="small" />
        </FieldWrapper>
      );

    case "number":
      return (
        <FieldWrapper field={field} formik={formik}>
          <TextField {...commonProps} fullWidth type="number" placeholder={field.placeholder || ""} variant="outlined" size="small" />
        </FieldWrapper>
      );

    case "select":
      return (
        <FieldWrapper field={field} formik={formik}>
          <FormControl fullWidth size="small">
            <Select {...commonProps} displayEmpty renderValue={(selected) => (selected ? selected : <span style={{ color: "#9e9e9e" }}>Select an option</span>)}>
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
          <RadioGroup name={field.id} value={formik.values[field.id] ?? ""} onChange={(e) => formik.setFieldValue(field.id, e.target.value)}>
            {field.options?.map((opt, i) => (
              <FormControlLabel key={i} value={opt} control={<Radio sx={{ color: "#9e9e9e", "&.Mui-checked": { color: CONFIG.COLORS.PRIMARY } }} />} label={opt} />
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
                      formik.setFieldValue(field.id, e.target.checked ? [...current, opt] : current.filter((v) => v !== opt));
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
            control={<Checkbox name={field.id} checked={!!formik.values[field.id]} onChange={(e) => formik.setFieldValue(field.id, e.target.checked)} sx={{ color: "#9e9e9e", "&.Mui-checked": { color: CONFIG.COLORS.PRIMARY } }} />}
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
            <Button variant="outlined" component="label" startIcon={UploadIcon ? <UploadIcon /> : null} sx={{ borderColor: "#b39ddb", color: CONFIG.COLORS.PRIMARY, "&:hover": { borderColor: CONFIG.COLORS.PRIMARY, backgroundColor: "#f3e5f5" } }}>
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
    let rule = Yup.mixed();

    switch (f.type) {
      case "text":
        rule = Yup.string();
        if (f.min) rule = rule.min(+f.min, `${f.label} min ${f.min}`);
        if (f.max) rule = rule.max(+f.max, `${f.label} max ${f.max}`);
        if ((f.label || "").toLowerCase().includes("email") || (f.placeholder || "").toLowerCase().includes("email")) {
          rule = rule.email("Enter a valid email");
        }
        break;

      case "number":
        rule = Yup.number().typeError(`${f.label} must be a number`).transform((v, o) => (o === "" ? undefined : v));
        if (f.min) rule = rule.min(+f.min, `${f.label} must be at least ${f.min}`);
        if (f.max) rule = rule.max(+f.max, `${f.label} must be at most ${f.max}`);
        break;

      case "select":
      case "radio":
        rule = Yup.string();
        break;

      case "multipleChoice":
        rule = Yup.array();
        if (f.min) rule = rule.min(+f.min, `Select at least ${f.min}`);
        if (f.max) rule = rule.max(+f.max, `Select up to ${f.max}`);
        break;

      case "checkbox":
        rule = Yup.boolean();
        break;

      case "uploadFile":
        const maxB = (f.maxSize && parseInt(f.maxSize, 10) < 100 ? parseInt(f.maxSize, 10) * 1024 * 1024 : parseInt(f.maxSize, 10)) || (CONFIG.MAX_FILE_MB * 1024 * 1024);
        rule = Yup.mixed().test("fileSize", `File too large (max ${Math.round(maxB / 1024 / 1024)}MB)`, (value) => {
          if (!value) return true;
          if (value && value.size) return value.size <= maxB;
          return true;
        });
        break;

      default:
        rule = Yup.mixed();
    }

    if (f.required) {
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

  ///token state
  const [token , setToken] = useState("");
  const [submitEnable , setSubmitEnable]  = useState(false);

  useEffect(()=>{
    if(token.length){
      setSubmitEnable(true)
    }
  },[token])

  // Use shallowEqual to avoid unrelated updates causing re-renders
  const { formData, email, otpSent, otpVerified, error, loading, formLoading } = useSelector((s) => ({
    formData: s.form.formData,
    email: s.form.email,
    otpSent: s.form.otpSent,
    otpVerified: s.form.otpVerified,
    error: s.form.error,
    loading: s.form.loading,
    formLoading: s.form.formLoading,
  }), shallowEqual);

  // local state
  const [openDialog, setOpenDialog] = useState(false);
  const [fileIdAndItsFilePath, setFileAndItsFilePath] = useState({});
  const [otp, setOtp] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const resendIntervalRef = useRef(null);

  /* ---------------------- Resource hints & font preload --------------------- */
  // Insert preconnect + preload for Google Fonts and preconnect to backend for images
  useEffect(() => {
    // idempotent helpers
    const addIfMissing = (selector, el) => {
      if (!document.querySelector(selector)) document.head.appendChild(el);
    };

    try {
      // preconnect to fonts
      const p1 = document.createElement("link");
      p1.rel = "preconnect";
      p1.href = "https://fonts.googleapis.com";
      p1.crossOrigin = "";
      addIfMissing('link[rel="preconnect"][href="https://fonts.googleapis.com"]', p1);

      const p2 = document.createElement("link");
      p2.rel = "preconnect";
      p2.href = "https://fonts.gstatic.com";
      p2.crossOrigin = "";
      addIfMissing('link[rel="preconnect"][href="https://fonts.gstatic.com"]', p2);

      // preload stylesheet with onload swap for faster render
      if (!document.getElementById("inter-font-preload")) {
        const l = document.createElement("link");
        l.id = "inter-font-preload";
        l.rel = "preload";
        l.as = "style";
        l.href = CONFIG.FONT_URL;
        l.crossOrigin = "";
        l.onload = function () {
          this.rel = "stylesheet";
        };
        document.head.appendChild(l);

        // fallback for no-js: append real stylesheet after a small delay
        setTimeout(() => {
          if (!document.getElementById("inter-font")) {
            const fs = document.createElement("link");
            fs.rel = "stylesheet";
            fs.href = CONFIG.FONT_URL;
            fs.id = "inter-font";
            document.head.appendChild(fs);
          }
        }, 2000);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // fetch form on mount / formId change
  useEffect(() => {
    if (!formId) return;
    if (!formData?.id || formData?.id !== Number(formId)) {
      dispatch(fetchForm(formId)).catch((err) => console.error("Fetch form failed:", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, formId]);

  // schema & validation
  const schema = useMemo(() => previewData?.schema || formData?.schema || null, [previewData, formData]);
  const validationSchema = useMemo(() => buildValidationSchema(schema?.fields || []), [schema]);

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
      if (!previewData && schema?.emailVerification && !otpVerified) {
        alert("Please verify your email before submitting.");
        return;
      }
      const data = { ...values, ...fileIdAndItsFilePath };
      dispatch(submitForm({ formId, email, data  , token}))
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

  const [mountedFields, setMountedFields] = useState(() => visibleFields.map((f) => ({ id: f.id, state: "present" })));

  useEffect(() => {
    const visibleIds = visibleFields.map((f) => f.id);
    setMountedFields((prev) => {
      const prevMap = new Map(prev.map((p) => [p.id, p]));
      visibleIds.forEach((id) => {
        const current = prevMap.get(id);
        if (!current) prevMap.set(id, { id, state: "entering" });
        else if (current.state === "leaving") prevMap.set(id, { id, state: "present" });
      });
      for (const [id, entry] of prevMap) {
        if (!visibleIds.includes(id) && entry.state !== "leaving") {
          prevMap.set(id, { id, state: "leaving" });
        }
      }
      const ordered = [];
      visibleFields.forEach((f) => {
        const entry = prevMap.get(f.id);
        if (entry) ordered.push(entry);
      });
      prev.forEach((p) => {
        if (p.state === "leaving" && !ordered.find((o) => o.id === p.id)) ordered.push(p);
      });
      return ordered;
    });
  }, [visibleFields]);

  useEffect(() => {
    if (!mountedFields.some((m) => m.state === "entering")) return;
    const t = setTimeout(() => {
      setMountedFields((prev) => prev.map((m) => (m.state === "entering" ? { ...m, state: "present" } : m)));
    }, 20);
    return () => clearTimeout(t);
  }, [mountedFields]);

  useEffect(() => {
    const leaving = mountedFields.filter((m) => m.state === "leaving");
    if (leaving.length === 0) return;
    const timers = leaving.map((m) => setTimeout(() => setMountedFields((prev) => prev.filter((p) => p.id !== m.id)), CONFIG.ANIMATION_DURATION));
    return () => timers.forEach((t) => clearTimeout(t));
  }, [mountedFields]);

  /* ---------- OTP handlers & resend countdown ---------- */
  useEffect(() => {
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

  /* ---------------------------- banner rendering helper ---------------------------- */
   const bannerFile =
    previewData?.bannerImage ||
    formData?.bannerImage ||
    previewData?.bannerImageFilename ||
    formData?.bannerImageFilename;

  // Always call the hook — conditionally prefetch the resource
  useIdlePrefetch(bannerFile ? `${BACKEND_URL}${FILE_PATH}${bannerFile}` : null);
   
  /// calll back for receiving the token 
   const handleToken = useCallback((token) => {
  setToken(token);
}, []);
  const renderBanner = useCallback(() => {
    if (!bannerFile) return null;
    return (
      <Box sx={{ mb: 3, overflow: "hidden", borderRadius: { xs: 2, sm: 3 }, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <picture>
          <source srcSet={`${BACKEND_URL}${FILE_PATH}${bannerFile}`} type="image/webp" />
          <Box
            component="img"
            src={`${BACKEND_URL}${FILE_PATH}${bannerFile}`}
            alt="Banner"
            loading="lazy"
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: { xs: 320, sm: 420, md: 600 },
              objectFit: "contain",
              display: "block",
            }}
          />
        </picture>
      </Box>
    );
  }, [bannerFile]);

  // helper to prefetch resources in idle
  /* ---------- utility hook: prefetch resource during idle ---------- */
function useIdlePrefetch(url) {
  useEffect(() => {
    if (!url) return;
    let didCancel = false;
    const doPrefetch = () => {
      if (didCancel) return;
      try {
        const l = document.createElement("link");
        l.rel = "prefetch";
        l.href = url;
        l.as = "image";
        document.head.appendChild(l);
      } catch {}
    };
    if ("requestIdleCallback" in window) {
      const id = (window).requestIdleCallback(doPrefetch, { timeout: 500 });
      return () => {
        didCancel = true;
        (window).cancelIdleCallback?.(id);
      };
    } else {
      const t = setTimeout(doPrefetch, 500);
      return () => {
        didCancel = true;
        clearTimeout(t);
      };
    }
  }, [url]);
}


  // Prefetch FormHeader module on idle so it loads faster when route shows it.
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = (window).requestIdleCallback(() => {
        import("./FormHeader").catch(() => {});
      }, { timeout: 800 });
      return () => (window).cancelIdleCallback?.(id);
    } else {
      const t = setTimeout(() => import("./FormHeader").catch(() => {}), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const isFormReady = !formLoading && Boolean(schema?.fields);
  const showTopProgress = formLoading || loading;

  if (!isFormReady) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {showTopProgress && <LinearProgress color="primary" sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1400, height: 3 }} />}
        <FormSkeleton />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {showTopProgress && <LinearProgress color="primary" sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1400, height: 3 }} />}

      {/* lazy FormHeader: won't add to initial JS until actually rendered */}
      {!previewData && !formData ? (
        <Suspense fallback={null}>
          <LazyFormHeader />
        </Suspense>
      ) : null}

      <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg,#f7f1ff 0%,#f1eefe 100%)", py: { xs: 4, sm: 6 }, px: { xs: 2, sm: 0 }, display: "flex", justifyContent: "center", fontFamily: '"Inter", Roboto, Arial, sans-serif' }}>
        <Box sx={{ width: "100%", maxWidth: 760 }}>
          {/* Banner */}
          {renderBanner()}

          {/* Title card */}
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderTop: `6px solid ${CONFIG.COLORS.PRIMARY}` }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>{schema?.title || "Untitled form"}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.85rem", sm: "0.9rem" } }}>{schema?.description || ""}</Typography>
          </Paper>

          {/* Email verification */}
          {!previewData && schema?.emailVerification && (
            <Paper sx={{ p: { xs: 2, sm: 2.5 }, mb: 3, display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                {otpVerified ? <Chip label="Email verified" color="success" sx={{ fontWeight: 600 }} /> : <>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, textAlign: { xs: "center", sm: "left" } }}>Verify your email</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: "center", sm: "left" }, fontSize: { xs: "0.85rem", sm: "0.9rem" } }}>We will send an OTP to your email address to verify your identity.</Typography>
                </>}
              </Box>

              <Box sx={{ minWidth: { xs: "100%", sm: 240 }, display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1, alignItems: "center", justifyContent: "flex-end" }}>
                {!otpSent && !otpVerified && (<>
                  <TextField size="small" fullWidth value={email} onChange={(e) => dispatch(setEmail(e.target.value))} placeholder="you@example.com" />
                  <Button variant="contained" onClick={handleRequestOtp} disabled={loading} sx={{ px: { xs: 2, sm: 2.5 }, width: { xs: "100%", sm: "auto" } }}>{loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Send"}</Button>
                </>)}

                {otpSent && !otpVerified && (
                  <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", gap: { xs: 1, sm: 1 }, width: "100%" }}>
                    <TextField size="small" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" sx={{ minWidth: { xs: "100%", sm: 150 }, flexShrink: 0 }} />
                    <Button variant="contained" color="success" onClick={handleVerifyOtp} disabled={loading} sx={{ px: 2, flexShrink: 0, width: { xs: "100%", sm: "auto" } }}>{loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Verify"}</Button>

                    <Typography variant="body2" sx={{ mt: { xs: 1, sm: 0 }, minWidth: { xs: "100%", sm: 100 }, textAlign: { xs: "center", sm: "right" }, color: resendCountdown > 0 ? "text.secondary" : "primary.main", fontWeight: resendCountdown > 0 ? 400 : 600, cursor: resendCountdown > 0 ? "default" : "pointer" }} onClick={resendCountdown > 0 ? undefined : handleResendOtp}>
                      {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend OTP"}
                    </Typography>
                  </Box>
                )}

                {otpVerified && <Typography variant="body2" sx={{ color: "success.main", fontWeight: 600, textAlign: { xs: "center", sm: "left" } }}>Verified ✓</Typography>}
              </Box>
            </Paper>
          )}

          {/* FORM FIELDS */}
          <FormikProvider value={formik}>
            {!openDialog ? (
              <Form onSubmit={formik.handleSubmit}>
                {mountedFields.map((mountItem) => {
                  const field = schema?.fields?.find((f) => f.id === mountItem.id);
                  if (!field) return null;
                  const state = mountItem.state;
                  const isLeaving = state === "leaving";
                  const opacity = state === "present" ? 1 : 0;
                  const translateY = state === "present" ? "0px" : "-8px";
                  const visibleIndex = visibleFields.findIndex((f) => f.id === field.id);
                  const showDivider = visibleIndex !== -1 && visibleIndex < visibleFields.length - 1;

                  return (
                    <Box key={field.id} sx={{ transition: `opacity ${CONFIG.ANIMATION_DURATION}ms ease, transform ${CONFIG.ANIMATION_DURATION}ms ease, margin ${CONFIG.ANIMATION_DURATION}ms ease`, opacity, transform: `translateY(${translateY})`, pointerEvents: isLeaving ? "none" : "auto", mb: isLeaving ? `${CONFIG.ANIMATION_DURATION / 1000}rem` : 2.5 }}>
                      <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderLeft: `4px solid ${CONFIG.COLORS.PRIMARY}`, backgroundColor: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
                        {field.type !== "checkbox" && <Typography variant="subtitle1" sx={{ mb: 1, fontSize: { xs: "0.95rem", sm: "1rem" } }}>{field.label}</Typography>}

                        <DynamicField field={field} formik={formik} dispatch={dispatch} setFileAndItsFilePath={setFileAndItsFilePath} />

                        {showDivider && <Divider sx={{ mt: 2, borderColor: "#eee" }} />}
                      </Paper>
                    </Box>
                  );
                })}
                   
                 {!schema?.emailVerification && (
                      <Box mt={3}>
                        <Recaptcha 
                          sitekey={'6LdE3OkrAAAAAKa2WLVqOsj4UmfqQV6dysfuyKKt'} 
                          callback={handleToken}
                        />
                      </Box>
                  )}

                <Box mt={3} display="flex" justifyContent="space-between" sx={{ flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1.5, sm: 0 } }}>
                  <Button type="submit" variant="contained" sx={{ backgroundColor: CONFIG.COLORS.PRIMARY, px: 3, width: { xs: "100%", sm: "auto" } }} 
                  // disabled={Boolean(previewData) || (!previewData && schema.emailVerification && !otpVerified) || loading ||(!schema.emailVerification && !submitEnable) 
                    disabled={
                        Boolean(previewData) ||
                        (!previewData &&
                          (
                            (schema.emailVerification && !otpVerified) ||  // waiting for email OTP
                            (!schema.emailVerification && !submitEnable)   // waiting for reCAPTCHA
                          )
                        ) ||
                        loading
                      }
                   >
                    {loading ? <><CircularProgress size={18} sx={{ color: "#fff" }} /> &nbsp;Submitting...</> : "Submit"}
                  </Button>

                  <Button type="reset" variant="text" onClick={formik.handleReset} sx={{ color: CONFIG.COLORS.PRIMARY, fontWeight: 600, width: { xs: "100%", sm: "auto" } }}>
                    Clear form
                  </Button>
                </Box>
              </Form>
            ) : (
              <Paper sx={{ p: { xs: 4, sm: 6 }, mt: 3, textAlign: "center" }}>
                <Box sx={{ width: 88, height: 88, borderRadius: "50%", background: CONFIG.COLORS.PRIMARY, mx: "auto", mb: 2, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 32 }}>✓</Box>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>{schema?.title || "Form Submitted"}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: { xs: "0.9rem", sm: "1rem" } }}>{schema?.thankYouMessage || "Your response has been recorded."}</Typography>
                <Button variant="outlined" onClick={() => window.location.reload()} sx={{ borderRadius: 1, px: 3, width: { xs: "100%", sm: "auto" } }}>Submit another response</Button>
              </Paper>
            )}
          </FormikProvider>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
