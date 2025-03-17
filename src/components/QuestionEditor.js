import { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  IconButton,
  Button,
  Box,
  Collapse,
  Typography,
  Stack,
} from "@mui/material";
import {
  DragHandle,
  Delete,
  AddCircleOutline,
  Settings,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const QuestionEditor = ({ question, form, onUpdate, onDelete, isDragging }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLogic, setShowLogic] = useState(false);

  const handleTypeChange = (type) => {
    const updatedQuestion = {
      ...question,
      type,
      options:
        type === "text" || type === "paragraph"
          ? undefined
          : question.options || [
              { id: `opt-${Date.now()}-1`, text: "Option 1" },
            ],
    };
    onUpdate(updatedQuestion);
  };

  const handleAddOption = () => {
    if (!question.options) return;

    const newOption = {
      id: `opt-${Date.now()}-${question.options.length + 1}`,
      text: `Option ${question.options.length + 1}`,
    };

    onUpdate({
      ...question,
      options: [...question.options, newOption],
    });
  };

  const handleUpdateOption = (optionId, text) => {
    if (!question.options) return;

    onUpdate({
      ...question,
      options: question.options.map((option) =>
        option.id === optionId ? { ...option, text } : option
      ),
    });
  };

  const handleDeleteOption = (optionId) => {
    if (!question.options || question.options.length <= 1) return;

    onUpdate({
      ...question,
      options: question.options.filter((option) => option.id !== optionId),
    });
  };

  const handleUpdateconditional_logic = (conditional_logic) => {
    onUpdate({
      ...question,
      conditional_logic,
    });
  };

  const getEligibleConditionQuestions = () => {
    const questionIndex = form.questions.findIndex((q) => q.id === question.id);
    return form.questions
      .slice(0, questionIndex)
      .filter((q) =>
        ["multipleChoice", "checkbox", "dropdown"].includes(q.type)
      );
  };

  const eligibleQuestions = getEligibleConditionQuestions();
  const selectedQuestion = question.conditional_logic
    ? form.questions.find(
        (q) => q.id === question.conditional_logic?.questionId
      )
    : undefined;

  return (
    <Card sx={{ mb: 2, position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.100",
          borderRight: "1px solid",
          borderColor: "grey.300",
        }}
      >
        <DragHandle
          sx={{
            color: "grey.500",
            // cursor: "grab"
          }}
        />
      </Box>

      <CardContent sx={{ pt: 2, pl: 5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box
            sx={{ flex: 1 }}
            component={Stack}
            direction={"column"}
            spacing={1}
          >
            <Stack direction={"row"} spacing={1}>
              <TextField
                fullWidth
                size="small"
                value={question.title}
                onChange={(e) =>
                  onUpdate({ ...question, title: e.target.value })
                }
                placeholder="Question title"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <IconButton
                onClick={onDelete}
                color="error"
                sx={{ borderRadius: 2 }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <FormControl sx={{ minWidth: 180 }}>
                <Select
                  size="small"
                  value={question.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                >
                  <MenuItem value="text">ข้อความสั้น</MenuItem>
                  <MenuItem value="paragraph">ข้อความยาว</MenuItem>
                  <MenuItem value="multipleChoice">
                    หลายตัวเลือก(เลือกได้ข้อเดียว)
                  </MenuItem>
                  <MenuItem value="checkbox">
                    หลายตัวเลือก(เลือกได้หลายข้อ)
                  </MenuItem>
                  <MenuItem value="dropdown">เลือกจากรายการ</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={question.required}
                    onChange={(e) =>
                      onUpdate({ ...question, required: e.target.checked })
                    }
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "red",
                        "&:hover": {},
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: "red",
                        },
                    }}
                  />
                }
                label="จำเป็น"
              />
            </Box>
          </Box>
        </Box>

        {eligibleQuestions.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Settings />}
              endIcon={showLogic ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setShowLogic(!showLogic)}
              sx={{ color: "#003092", borderColor: "#003092" }}
            >
              เงื่อนไขแสดงคำถามนี้
            </Button>

            <Collapse in={showLogic}>
              <Box
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: "grey.200",
                  borderRadius: 1,
                  mt: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={!!question.conditional_logic}
                      onChange={(e) => {
                        if (e.target.checked && eligibleQuestions.length > 0) {
                          const firstQuestion = eligibleQuestions[0];
                          const firstOption = firstQuestion.options?.[0];
                          const newLogic = {
                            questionId: firstQuestion.id,
                            operator: "equals",
                            value: firstOption?.text || "",
                          };
                          handleUpdateconditional_logic(newLogic);
                        } else {
                          handleUpdateconditional_logic(undefined);
                        }
                      }}
                    />
                  }
                  label="แสดงคำถามนี้เฉพาะเมื่อ:"
                />

                {question.conditional_logic && (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 1,
                      mt: 2,
                    }}
                  >
                    <FormControl>
                      <Select
                        size="small"
                        value={question.conditional_logic.questionId}
                        onChange={(e) => {
                          const targetQuestion = form.questions.find(
                            (q) => q.id === e.target.value
                          );
                          const firstOption = targetQuestion?.options?.[0];
                          handleUpdateconditional_logic({
                            ...question.conditional_logic,
                            questionId: e.target.value,
                            value: firstOption?.text || "",
                          });
                        }}
                      >
                        {eligibleQuestions.map((q) => (
                          <MenuItem key={q.id} value={q.id}>
                            {q.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <Select
                        size="small"
                        value={question.conditional_logic.operator}
                        onChange={(e) => {
                          handleUpdateconditional_logic({
                            ...question.conditional_logic,
                            operator: e.target.value,
                          });
                        }}
                      >
                        <MenuItem value="equals">เท่ากับ</MenuItem>
                        <MenuItem value="contains">มีคำว่า</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <Select
                        size="small"
                        value={question.conditional_logic.value}
                        onChange={(e) => {
                          handleUpdateconditional_logic({
                            ...question.conditional_logic,
                            value: e.target.value,
                          });
                        }}
                      >
                        {selectedQuestion?.options?.map((option) => (
                          <MenuItem key={option.id} value={option.text}>
                            {option.text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}
              </Box>
            </Collapse>
          </Box>
        )}

        <Box>
          {question.type === "text" && (
            <TextField
              fullWidth
              size="small"
              disabled
              placeholder="ข้อความสั้น"
              variant="outlined"
              sx={{ bgcolor: "grey.50" }}
            />
          )}

          {question.type === "paragraph" && (
            <TextField
              size="small"
              fullWidth
              multiline
              rows={3}
              disabled
              placeholder="Long text answer"
              variant="outlined"
              sx={{ bgcolor: "grey.50" }}
            />
          )}

          {(question.type === "multipleChoice" ||
            question.type === "checkbox" ||
            question.type === "dropdown") && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {question.options?.map((option, index) => (
                <Box
                  key={option.id}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  {question.type === "multipleChoice" && (
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: 1,
                        borderColor: "grey.300",
                      }}
                    />
                  )}
                  {question.type === "checkbox" && (
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        border: 1,
                        borderColor: "grey.300",
                      }}
                    />
                  )}
                  {question.type === "dropdown" && (
                    <Typography sx={{ width: 16 }}>{index + 1}.</Typography>
                  )}
                  <TextField
                    size="small"
                    fullWidth
                    value={option.text}
                    onChange={(e) =>
                      handleUpdateOption(option.id, e.target.value)
                    }
                  />

                  <IconButton
                    onClick={() => handleDeleteOption(option.id)}
                    disabled={question.options?.length === 1}
                    color="error"
                    sx={{ borderRadius: 2 }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              <Button
                variant="text"
                startIcon={<AddCircleOutline />}
                onClick={handleAddOption}
                sx={{ color: "#003092", justifyContent: "flex-start" }}
              >
                เพิ่มตัวเลือก
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuestionEditor;
