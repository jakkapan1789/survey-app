import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/system";

const FormPreview = ({ form, onAnswerChange, answers = {} }) => {
  const [checkboxValues, setCheckboxValues] = useState({});
  const [visibleQuestions, setVisibleQuestions] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const calculateVisibility = () => {
      const visible = [];

      form.questions.forEach((question) => {
        if (!question.conditionalLogic) {
          visible.push(question.id);
        } else {
          const { questionId, operator, value } = question.conditionalLogic;
          const parentAnswer = answers[questionId];

          if (parentAnswer) {
            let isConditionMet = false;

            if (operator === "equals") {
              if (Array.isArray(parentAnswer)) {
                isConditionMet = parentAnswer.includes(value);
              } else {
                isConditionMet = parentAnswer === value;
              }
            } else if (operator === "contains") {
              if (Array.isArray(parentAnswer)) {
                isConditionMet = parentAnswer.some((ans) =>
                  ans.includes(value)
                );
              } else {
                isConditionMet = parentAnswer.includes(value);
              }
            }

            if (isConditionMet) {
              visible.push(question.id);
            }
          }
        }
      });

      setVisibleQuestions(visible);
    };

    calculateVisibility();
  }, [form.questions, answers]);

  const handleCheckboxChange = (questionId, optionId, checked) => {
    const newCheckboxValues = {
      ...checkboxValues,
      [questionId]: {
        ...(checkboxValues[questionId] || {}),
        [optionId]: checked,
      },
    };

    setCheckboxValues(newCheckboxValues);

    const selectedOptions = Object.entries(newCheckboxValues[questionId] || {})
      .filter(([_, isChecked]) => isChecked)
      .map(([optionId]) => {
        const option = form.questions
          .find((q) => q.id === questionId)
          ?.options?.find((opt) => opt.id === optionId);
        return option?.text || "";
      })
      .filter((text) => text !== "");

    if (onAnswerChange) {
      onAnswerChange(questionId, selectedOptions);
    }
  };

  const renderQuestion = (question, index) => {
    if (!visibleQuestions.includes(question.id)) {
      return null;
    }

    const isAnswered = answers && answers[question.id] !== undefined;

    return (
      <Card
        key={question.id}
        sx={{
          p: 2,
          width: "100%",
          //   mb: 3,
          //   p: isMobile ? 2 : 3,
          //   borderRadius: 2,
          //   border: "1px solid",
          //   borderColor: "grey.200",
          //   width: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
          <Typography
            sx={{
              color: "grey.500",
              mr: 1,
              fontSize: isMobile ? "0.875rem" : "1rem",
            }}
          >
            {index + 1}.
          </Typography>
          <Box>
            <Typography
              sx={{
                fontWeight: "medium",
                color: "grey.800",
                fontSize: isMobile ? "1rem" : "1.125rem",
              }}
            >
              {question.title}
            </Typography>
            {question.required && (
              <Typography sx={{ color: "red.500", fontSize: "0.875rem" }}>
                * Required
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          {question.type === "text" && (
            <TextField
              size="small"
              fullWidth
              value={answers[question.id] || ""}
              onChange={(e) => onAnswerChange?.(question.id, e.target.value)}
              placeholder="Your answer"
              variant="outlined"
              sx={{ bgcolor: isAnswered ? "inherit" : "grey.50" }}
            />
          )}

          {question.type === "paragraph" && (
            <TextField
              size="small"
              fullWidth
              multiline
              rows={4}
              value={answers[question.id] || ""}
              onChange={(e) => onAnswerChange?.(question.id, e.target.value)}
              placeholder="Your answer"
              variant="outlined"
              sx={{ bgcolor: isAnswered ? "inherit" : "grey.50" }}
            />
          )}

          {question.type === "multipleChoice" && question.options && (
            <RadioGroup
              value={answers[question.id] || ""}
              onChange={(e) => onAnswerChange?.(question.id, e.target.value)}
            >
              {question.options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.text}
                  control={<Radio />}
                  label={option.text}
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          )}

          {question.type === "checkbox" && question.options && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {question.options.map((option) => {
                const isChecked = Array.isArray(answers[question.id])
                  ? answers[question.id].includes(option.text)
                  : false;

                return (
                  <FormControlLabel
                    key={option.id}
                    control={
                      <Checkbox
                        size="small"
                        checked={isChecked}
                        onChange={(e) =>
                          handleCheckboxChange(
                            question.id,
                            option.id,
                            e.target.checked
                          )
                        }
                      />
                    }
                    label={option.text}
                  />
                );
              })}
            </Box>
          )}

          {question.type === "dropdown" && question.options && (
            <FormControl fullWidth>
              <InputLabel size="small">เลือกคำตอบ</InputLabel>
              <Select
                size="small"
                value={answers[question.id] || ""}
                label="เลือกคำตอบ"
                onChange={(e) => onAnswerChange?.(question.id, e.target.value)}
                sx={{ bgcolor: isAnswered ? "inherit" : "grey.50" }}
              >
                {question.options.map((option) => (
                  <MenuItem key={option.id} value={option.text}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </Card>
    );
  };

  return (
    <Box>
      <Box
        sx={{
          p: 2,
          bgcolor: "grey.100",
          borderRadius: 2,
          borderTop: "4px solid",
          borderColor: "grey.300",
          mb: 2,
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{ fontWeight: "bold", color: "grey.800", mb: 1 }}
        >
          {form.title}
        </Typography>
        <Typography
          sx={{ color: "grey.600", fontSize: isMobile ? "0.875rem" : "1rem" }}
        >
          {form.description}
        </Typography>
      </Box>
      <Stack direction={"column"} spacing={1}>
        {form.questions.map((question, index) => {
          return (
            <Stack direction={"row"}>{renderQuestion(question, index)}</Stack>
          );
        })}
      </Stack>

      {/* {form.questions.map((question, index) => renderQuestion(question, index))} */}
    </Box>
  );
};

export default FormPreview;
