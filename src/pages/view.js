import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormContext } from "@/context/FormContext";
import FormPreview from "@/components/FormPreview";
import { Box, Button, Card, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { evaluateCondition } from "@/lib/utils";

const FormView = () => {
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");
  const { getForm, submitResponse } = useFormContext();
  const router = useRouter();

  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (formId) {
      const foundForm = getForm(formId);
      if (foundForm && foundForm.published) {
        setForm(foundForm);
      } else if (foundForm && !foundForm.published) {
        setForm(null);
      } else {
        router.push("/not-found");
      }
    }
  }, [formId, getForm, router]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formId || !form) return;

    const visibleQuestions = form.questions.filter((question) => {
      if (!question.conditionalLogic) return true; // ถ้าไม่มีเงื่อนไข แสดงเสมอ
      return evaluateCondition(question.conditionalLogic, answers);
    });

    const requiredQuestions = visibleQuestions.filter((q) => q.required);
    const unansweredRequired = requiredQuestions.filter((q) => {
      const answer = answers[q.id];
      return !answer || (Array.isArray(answer) && answer.length === 0);
    });

    if (unansweredRequired.length > 0) {
      const firstUnanswered = unansweredRequired[0];
      const element = document.getElementById(firstUnanswered.id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, value]) => ({
        questionId,
        value,
      })
    );

    submitResponse({
      formId,
      answers: formattedAnswers,
    });

    setSubmitted(true);
  };

  if (!form && !submitted) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.50",
        }}
      >
        <Card sx={{ p: 4, maxWidth: 400, width: "100%" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
          >
            แบบฟอร์มไม่พร้อมใช้งาน
          </Typography>
          <Typography sx={{ color: "grey.600", mb: 3, textAlign: "center" }}>
            แบบฟอร์มนี้ไม่ได้เผยแพร่หรือไม่มีอยู่ในระบบ
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/")}
            fullWidth
          >
            กลับสู่หน้าแรก
          </Button>
        </Card>
      </Box>
    );
  }

  if (submitted) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.50",
        }}
      >
        <Card sx={{ p: 4, maxWidth: 400, width: "100%", textAlign: "center" }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              bgcolor: "green.100",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ width: 70, height: 70, color: "green" }}
            />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            ขอขอบคุณสำหรับการตอบกลับของคุณ
          </Typography>
          <Typography sx={{ color: "grey.600", mb: 3 }}>
            บันทึกการตอบกลับของคุณเรียบร้อยแล้ว
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/")}
            fullWidth
          >
            กลับสู่หน้าแรก
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4, px: 2 }}>
      <Box sx={{ maxWidth: "48rem", mx: "auto" }}>
        <FormPreview
          form={form}
          onAnswerChange={handleAnswerChange}
          answers={answers}
        />
        <Box sx={{ mt: 4, mb: 8, display: "flex", justifyContent: "center" }}>
          <Button variant="contained" size="large" onClick={handleSubmit}>
            ส่งการตอบกลับ
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FormView;
