import { Formik, Form } from "formik";
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

export default function FormPreview1() {
  const schema = defaultFormSchema;

  const initialValues = schema.fields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});

  const handleSubmit = (values) => {
    alert("Form submitted:\n" + JSON.stringify(values, null, 2));
  };

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

          <Paper sx={{ p: 4, mb: 3, borderTop: "10px solid #673ab7" }} elevation={3}>
            <Typography variant="h5" fontWeight={500} gutterBottom>
              {schema.title || "Untitled form"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {schema.description || ""}
            </Typography>
          </Paper>

          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ values, handleChange, resetForm }) => (
              <Form>
                {schema.fields.map(
                  (field) =>
                    evaluateConditions(field, values) && (
                      <Paper key={field.id} sx={{ p: 3, mb: 2 }} elevation={1}>
                        <Typography gutterBottom fontWeight={400} fontSize="16px">
                          {field.label}
                        </Typography>

                        <FieldWrapper field={field} values={values} handleChange={handleChange}>

                          {field.type === "text" && (
                            <TextField
                              fullWidth
                              name={field.id}
                              placeholder={field.placeholder || ""}
                              value={values[field.id]}
                              onChange={handleChange}
                              variant="standard"
                              InputProps={{
                                style: { fontSize: 16, fontFamily: "Roboto, Arial, sans-serif" },
                              }}
                              sx={{ mt: 1 }}
                            />
                          )}


                          {field.type === "note" && (
                            <TextField
                              fullWidth
                              name={field.id}
                              value={values[field.id]}
                              onChange={handleChange}
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


                          {field.type === "select" && (
                            <FormControl fullWidth variant="standard" sx={{ mt: 1 }}>
                              <Select
                                name={field.id}
                                value={values[field.id]}
                                onChange={handleChange}
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

                          {field.type === "radio" && (
                            <RadioGroup
                              name={field.id}
                              value={values[field.id]}
                              onChange={handleChange}
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

             
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      bgcolor: "#673ab7",
                      "&:hover": { bgcolor: "#5e35b1" },
                      textTransform: "none",
                      fontFamily: "Roboto, Arial, sans-serif",
                      fontWeight: 500,
                      fontSize: 16,
                    }}
                  >
                    Submit
                  </Button>

                  <Button
                    variant="text"
                    onClick={() => resetForm()}
                    sx={{
                      textTransform: "none",
                      fontSize: 15,
                      color: "text.secondary",
                      fontFamily: "Roboto, Arial, sans-serif",
                    }}
                  >
                    Clear form
                  </Button>
                </Box>


                <Box mt={6} textAlign="center" color="text.secondary" fontSize="0.85rem">

                  <Typography
                    variant="body2"
                    mt={2}
                    fontWeight={500}
                    sx={{ fontFamily: "Roboto, Arial, sans-serif" }}
                  >
                    Interval Forms
                  </Typography>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </>
  );
}
