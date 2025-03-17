// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useFormContext } from "@/context/FormContext";
// import FormPreview from "@/components/FormPreview";
// import { Box, Button, Card, Container, Grid, Typography } from "@mui/material";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import { evaluateCondition } from "@/lib/utils";
// import MoodBadIcon from "@mui/icons-material/MoodBad";

// const FormView = () => {
//   const searchParams = useSearchParams();
//   const formId = searchParams.get("formId");
//   const { getForm, submitResponse } = useFormContext();
//   const router = useRouter();

//   const [form, setForm] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [submitted, setSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchForm = async () => {
//       if (!formId) return;

//       const foundForm = await getForm(formId);

//       if (foundForm) {
//         if (foundForm.published) {
//           setForm(foundForm);
//         } else {
//           setForm(null);
//         }
//       } else {
//         router.push("/not-found");
//       }
//     };

//     fetchForm();
//   }, [formId, router]);

//   const handleAnswerChange = (questionId, value) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionId]: value,
//     }));
//   };

//   const handleSubmit = () => {
//     if (!formId || !form) return;

//     const visibleQuestions = form.questions.filter((question) => {
//       if (!question.conditional_logic) return true;
//       return evaluateCondition(question.conditional_logic, answers);
//     });

//     const requiredQuestions = visibleQuestions.filter((q) => q.required);
//     const unansweredRequired = requiredQuestions.filter((q) => {
//       const answer = answers[q.id];
//       return !answer || (Array.isArray(answer) && answer.length === 0);
//     });

//     if (unansweredRequired.length > 0) {
//       const firstUnanswered = unansweredRequired[0];
//       const element = document.getElementById(firstUnanswered.id);
//       if (element) {
//         element.scrollIntoView({ behavior: "smooth" });
//       }
//       return;
//     }

//     const formattedAnswers = Object.entries(answers).map(
//       ([questionId, value]) => ({
//         questionId,
//         value,
//       })
//     );

//     submitResponse({
//       formId,
//       answers: formattedAnswers,
//     });

//     setSubmitted(true);
//   };

//   if (!form && !submitted) {
//     return (
//       <Box
//         sx={{
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           bgcolor: "grey.50",
//         }}
//       >
//         <Card sx={{ p: 4, maxWidth: 400, width: "100%", mr: 2, ml: 2 }}>
//           <Box
//             sx={{
//               width: 64,
//               height: 64,
//               bgcolor: "green.100",
//               borderRadius: "50%",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               mx: "auto",
//               mb: 2,
//             }}
//           >
//             <MoodBadIcon sx={{ width: 70, height: 70, color: "red" }} />
//           </Box>

//           <Typography
//             variant="h5"
//             sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
//           >
//             แบบฟอร์มไม่พร้อมใช้งาน
//           </Typography>
//           <Typography sx={{ color: "grey.600", mb: 3, textAlign: "center" }}>
//             แบบฟอร์มนี้ไม่ได้เผยแพร่หรือไม่มีอยู่ในระบบ
//           </Typography>
//           <Button
//             variant="contained"
//             onClick={() => router.refresh()}
//             fullWidth
//             sx={{ bgcolor: "#003092" }}
//           >
//             ลองอีกครั้ง
//           </Button>
//         </Card>
//       </Box>
//     );
//   }

//   if (submitted) {
//     return (
//       <Box
//         sx={{
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           bgcolor: "grey.50",
//         }}
//       >
//         <Card
//           sx={{
//             p: 4,
//             maxWidth: 400,
//             width: "100%",
//             textAlign: "center",
//             mr: 2,
//             ml: 2,
//           }}
//         >
//           <Box
//             sx={{
//               width: 64,
//               height: 64,
//               bgcolor: "green.100",
//               borderRadius: "50%",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               mx: "auto",
//               mb: 2,
//             }}
//           >
//             <CheckCircleOutlineIcon
//               sx={{ width: 70, height: 70, color: "green" }}
//             />
//           </Box>
//           <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
//             ขอขอบคุณสำหรับการตอบกลับของคุณ
//           </Typography>
//           <Typography sx={{ color: "grey.600", mb: 3 }}>
//             บันทึกการตอบกลับของคุณเรียบร้อยแล้ว
//           </Typography>
//           <Button
//             variant="contained"
//             onClick={() => router.refresh()}
//             fullWidth
//             sx={{ bgcolor: "#003092" }}
//           >
//             กลับสู่หน้าแรก
//           </Button>
//         </Card>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4, px: 2 }}>
//       <Container maxWidth="lg">
//         <Grid container>
//           <Grid item xs={12} md={12}>
//             <Box data-aos="fade-up" data-aos-duration="700">
//               <FormPreview
//                 form={form}
//                 onAnswerChange={handleAnswerChange}
//                 answers={answers}
//               />
//               <Box
//                 sx={{ mt: 4, mb: 8, display: "flex", justifyContent: "center" }}
//               >
//                 <Button
//                   variant="contained"
//                   size="large"
//                   onClick={handleSubmit}
//                   sx={{ bgcolor: "#003092" }}
//                 >
//                   ส่งการตอบกลับ
//                 </Button>
//               </Box>
//             </Box>
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default FormView;

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormContext } from "@/context/FormContext";
import FormPreview from "@/components/FormPreview";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { evaluateCondition } from "@/lib/utils";
import MoodBadIcon from "@mui/icons-material/MoodBad";

const FormView = () => {
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");
  const { getForm, submitResponse } = useFormContext();
  const router = useRouter();

  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      if (!formId) return;
      setLoading(true);
      const foundForm = await getForm(formId);
      setLoading(false);

      if (foundForm) {
        if (foundForm.published) {
          setForm(foundForm);
        } else {
          setForm(null);
        }
      } else {
        router.push("/not-found");
      }
    };

    fetchForm();
  }, [formId, router]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formId || !form) return;

    const visibleQuestions = form.questions.filter((question) => {
      if (!question.conditional_logic) return true;
      return evaluateCondition(question.conditional_logic, answers);
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

  if (loading) {
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
        <CircularProgress />
      </Box>
    );
  }

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
        <Card sx={{ p: 4, maxWidth: 400, width: "100%", mr: 2, ml: 2 }}>
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
            <MoodBadIcon sx={{ width: 70, height: 70, color: "red" }} />
          </Box>

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
            onClick={() => router.refresh()}
            fullWidth
            sx={{ bgcolor: "#003092" }}
          >
            ลองอีกครั้ง
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4, px: 2 }}>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={12} md={12}>
            <Box data-aos="fade-up" data-aos-duration="700">
              <FormPreview
                form={form}
                onAnswerChange={handleAnswerChange}
                answers={answers}
              />
              <Box
                sx={{ mt: 4, mb: 8, display: "flex", justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  sx={{ bgcolor: "#003092" }}
                >
                  ส่งการตอบกลับ
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FormView;
