import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuestionEditor from "@/components/QuestionEditor";
import FormPreview from "@/components/FormPreview";
import { useFormContext } from "@/context/FormContext";
import {
  Box,
  Button,
  TextField,
  Tabs,
  Tab,
  IconButton,
  Typography,
  Card,
  Stack,
  Grid,
  Container,
} from "@mui/material";
import {
  AddCircleOutline,
  Visibility,
  Save,
  ArrowBack,
  Link as LinkIcon,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import Title from "@/components/Title";
import AppLayout from "@/components/Layout";

const FormBuilder = () => {
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");
  const { getForm, updateForm, publishForm, unpublishForm } = useFormContext();
  const router = useRouter();

  const [form, setForm] = useState(null);
  const [activeTab, setActiveTab] = useState("edit");
  const [previewAnswers, setPreviewAnswers] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      if (!formId) return;

      const existingForm = await getForm(formId);
      if (existingForm) {
        setForm(existingForm);
        console.log("existingForm", existingForm);
        console.log("form", form);
      } else {
        router.push("/dashboard");
      }
    };

    fetchForm();
  }, [formId, router]);

  //   useEffect(() => {
  //     if (formId) {
  //       const existingForm = getForm(formId);
  //       if (existingForm) {
  //         setForm(existingForm);
  //       } else {
  //         router.push("/dashboard");
  //       }
  //     } else {
  //       router.push("/dashboard");
  //     }
  //   }, [formId, router]);

  if (!form) {
    return (
      <Box>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const handleSave = () => {
    // console.log("form", form);
    router.back();
    updateForm(form);
  };

  const handlePublish = () => {
    form.published ? unpublishForm(form.id) : publishForm(form.id);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: "text",
      title: "คำถามใหม่",
      required: false,
    };

    setForm({
      ...form,
      questions: [...form.questions, newQuestion],
    });
  };

  const handleUpdateQuestion = (questionId, updatedQuestion) => {
    setForm({
      ...form,
      questions: form.questions.map((q) =>
        q.id === questionId ? updatedQuestion : q
      ),
    });
  };

  const handleDeleteQuestion = (questionId) => {
    const updatedQuestions = form.questions.map((q) => {
      if (q.conditionalLogic?.questionId === questionId) {
        return { ...q, conditionalLogic: undefined };
      }
      return q;
    });

    setForm({
      ...form,
      questions: updatedQuestions.filter((q) => q.id !== questionId),
    });
  };

  const handlePreviewAnswerChange = (questionId, value) => {
    setPreviewAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  return (
    <AppLayout>
      <Title title={`Designed form`} />
      <Box
        sx={{
          mt: 8,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          mb: 2,
        }}
        data-aos="fade-up"
        data-aos-duration="700"
      >
        <Container maxWidth="lg">
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={12}>
              <Box
                sx={{
                  bgcolor: "white",
                  border: "none",
                  pt: 3,
                }}
              >
                <Stack
                  direction={"row"}
                  display={"flex"}
                  justifyContent={"end"}
                  sx={{
                    mb: 1,
                    display: { xs: "flex", md: "none", sm: "none" },
                  }}
                >
                  <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={handleSave}
                      startIcon={<Save />}
                      sx={{ color: "#003092", borderColor: "#003092" }}
                    >
                      บันทึก
                    </Button>

                    <Button
                      variant="contained"
                      onClick={handlePublish}
                      startIcon={<LinkIcon />}
                      sx={{
                        bgcolor: form.published ? "#D84040" : " #003092",
                      }}
                    >
                      {form.published ? "ยกเลิกเผยแพร่" : " เผยแพร่"}
                    </Button>
                  </Box>
                </Stack>
                <Box component={Card} sx={{ p: 2, borderRadius: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      onClick={() => router.push("/dashboard")}
                      sx={{ mr: 2 }}
                    >
                      <ArrowBack />
                    </IconButton>

                    <TextField
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="Form Title"
                      variant="outlined"
                      fullWidth
                      sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          border: "none",
                          "& fieldset": { border: "none" },
                        },
                      }}
                    />

                    <Box
                      component={Stack}
                      spacing={1}
                      direction={"row"}
                      sx={{
                        ml: "auto",
                        display: { xs: "none", md: "flex", sm: "flex" },
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={handleSave}
                        startIcon={<Save />}
                        sx={{ color: "#003092", borderColor: "#003092" }}
                      >
                        บันทึก
                      </Button>

                      <Button
                        variant="contained"
                        onClick={handlePublish}
                        startIcon={<LinkIcon />}
                        sx={{
                          bgcolor: form.published ? "#D84040" : " #003092",
                        }}
                      >
                        {form.published ? "ยกเลิกเผยแพร่" : " เผยแพร่"}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ maxWidth: "100%", py: 1 }}>
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                >
                  <Tab
                    value="edit"
                    icon={
                      <Stack direction={"row"} spacing={1}>
                        <EditIcon fontSize="small" />
                        <Typography>แก้ไข</Typography>
                      </Stack>
                    }
                  />
                  <Tab
                    value="preview"
                    icon={
                      <Stack direction={"row"} spacing={1}>
                        <Visibility fontSize="small" />
                        <Typography>ตัวอย่าง</Typography>
                      </Stack>
                    }
                    onClick={() => setPreviewAnswers({})}
                  />
                </Tabs>

                {activeTab === "edit" && (
                  <Box sx={{ pt: 2 }}>
                    <Box
                      sx={{
                        bgcolor: "white",
                        borderRadius: 2,
                        p: 3,
                        mb: 3,
                      }}
                      component={Card}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: "medium",
                          color: "grey.700",
                          mb: 1,
                        }}
                      >
                        คำอธิบายแบบสอบถาม
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        placeholder="Enter form description or details"
                        variant="outlined"
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "100%",
                      }}
                    >
                      {form &&
                        form.questions.forEach((question) => (
                          <QuestionEditor
                            key={question.id}
                            question={question}
                            form={form}
                            onUpdate={(updatedQuestion) =>
                              handleUpdateQuestion(question.id, updatedQuestion)
                            }
                            onDelete={() => handleDeleteQuestion(question.id)}
                          />
                        ))}
                      {form &&
                        form.questions.map((question) => (
                          <QuestionEditor
                            key={question.id}
                            question={question}
                            form={form}
                            onUpdate={(updatedQuestion) =>
                              handleUpdateQuestion(question.id, updatedQuestion)
                            }
                            onDelete={() => handleDeleteQuestion(question.id)}
                          />
                        ))}
                      {/* {form && form.questions && form.questions.length > 0 ? (
                        form.questions.map((question) => (
                          <QuestionEditor
                            key={question.id}
                            question={question}
                            form={form}
                            onUpdate={(updatedQuestion) =>
                              handleUpdateQuestion(question.id, updatedQuestion)
                            }
                            onDelete={() => handleDeleteQuestion(question.id)}
                          />
                        ))
                      ) : (
                        <p>No questions available</p>
                      )} */}

                      <Button
                        variant="outlined"
                        onClick={handleAddQuestion}
                        sx={{
                          py: 2,
                          borderStyle: "dashed",
                          textTransform: "none",
                          borderColor: "#003092",
                          color: "#003092",
                        }}
                        fullWidth
                        startIcon={<AddCircleOutline />}
                      >
                        เพิ่มคำถาม
                      </Button>
                    </Box>
                  </Box>
                )}

                {activeTab === "preview" && (
                  <Box
                    sx={{
                      pt: 2,
                    }}
                  >
                    <FormPreview
                      form={form}
                      onAnswerChange={handlePreviewAnswerChange}
                      answers={previewAnswers}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AppLayout>
  );
};

export default FormBuilder;
