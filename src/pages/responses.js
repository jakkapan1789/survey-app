// components/FormResponses.js หรือ app/responses/page.js
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormContext } from "@/context/FormContext";
import Navbar from "@/components/Navbar";
import { formatDate } from "@/lib/utils";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Grid,
} from "@mui/material";
import {
  ArrowBack as ArrowLeftIcon,
  Visibility as EyeIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import Link from "next/link";

const FormResponses = () => {
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");
  const { getForm, getFormResponses } = useFormContext();
  const router = useRouter();

  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [viewingResponse, setViewingResponse] = useState(null);

  useEffect(() => {
    if (formId) {
      const existingForm = getForm(formId);
      if (existingForm) {
        setForm(existingForm);
        setResponses(getFormResponses(formId));
      } else {
        router.push("/dashboard");
      }
    }
  }, [formId, getForm, getFormResponses, router]);

  if (!form) {
    return <Box>Loading...</Box>;
  }

  const exportToCsv = () => {
    if (!form || responses.length === 0) return;

    const questionHeaders = form.questions.map((q) => q.title);
    const header = ["ระยะเวลาการส่ง", ...questionHeaders];

    const rows = responses.map((response) => {
      const timestamp = formatDate(response.createdAt);
      const answerValues = form.questions.map((question) => {
        const answer = response.answers.find(
          (a) => a.questionId === question.id
        );
        if (!answer) return "";
        if (Array.isArray(answer.value)) {
          return answer.value.join("; ");
        }
        return answer.value;
      });
      return [timestamp, ...answerValues];
    });

    const csvContent = [
      header.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${form.title}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderResponseDetails = (response) => {
    return (
      <Card sx={{ mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Box>
            <Typography variant="h6">รายละเอียดการตอบกลับ</Typography>
            <Typography sx={{ color: "grey.600" }}>
              ส่งเมื่อ {formatDate(response.createdAt)}
            </Typography>
          </Box>
          <Button
            variant="text"
            onClick={() => setViewingResponse(null)}
            startIcon={<ArrowLeftIcon />}
            sx={{ color: "#000957" }}
          >
            ย้อนกลับ
          </Button>
        </Box>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {form.questions.map((question) => {
              const answer = response.answers.find(
                (a) => a.questionId === question.id
              );
              const value = answer ? answer.value : "";
              return (
                <Box
                  key={question.id}
                  sx={{
                    borderBottom: "1px solid",
                    borderColor: "grey.200",
                    pb: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: "medium" }}>
                    {question.title}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {Array.isArray(value) ? (
                      <ul style={{ paddingLeft: 20, listStyleType: "disc" }}>
                        {value.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <Typography sx={{ color: "grey.800" }}>
                        {value || "-"}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "grey.50",
      }}
    >
      <Navbar />
      <Box component="main" sx={{ flex: 1, py: 4, px: 2, mt: 8 }}>
        <Container maxWidth="lg">
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    variant="text"
                    onClick={() => router.back()}
                    startIcon={<ArrowLeftIcon />}
                    sx={{ mr: 1, color: "black" }}
                  >
                    ย้อนกลับ
                  </Button>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Link
                    href={`/form?formId=${form.id}`}
                    target="_blank"
                    passHref
                  >
                    <Button
                      variant="outlined"
                      sx={{ color: "#003092", borderColor: "#003092" }}
                      startIcon={<EyeIcon />}
                    >
                      ดูแบบฟอร์ม
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    // onClick={exportToCsv}
                    disabled={responses.length === 0}
                    startIcon={<DownloadIcon />}
                    sx={{ bgcolor: "#003092" }}
                  >
                    ดาวน์โหลด CSV
                  </Button>
                </Box>
              </Box>
              <Typography sx={{ color: "grey.600", mb: 3 }}>
                {form.title} - {responses.length} การตอบกลับ
              </Typography>

              {viewingResponse ? (
                renderResponseDetails(viewingResponse)
              ) : (
                <Card>
                  <CardContent sx={{ p: 0 }}>
                    {responses.length === 0 ? (
                      <Box sx={{ py: 8, textAlign: "center" }}>
                        <Typography sx={{ color: "grey.500", mb: 2 }}>
                          ยังไม่มีการตอบกลับสำหรับแบบฟอร์มนี้
                        </Typography>
                        <Typography
                          sx={{ color: "grey.400", fontSize: "0.875rem" }}
                        >
                          คำตอบจะปรากฏที่นี่เมื่อมีคนส่งแบบฟอร์ม
                        </Typography>
                      </Box>
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{ width: 180, fontWeight: "bold" }}
                              >
                                ระยะเวลาการส่ง
                              </TableCell>
                              {form.questions.slice(0, 3).map((question) => (
                                <TableCell
                                  key={question.id}
                                  sx={{
                                    maxWidth: 200,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {question.title}
                                </TableCell>
                              ))}
                              <TableCell
                                align="right"
                                sx={{ fontWeight: "bold" }}
                              >
                                ตัวเลือก
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {responses.map((response) => (
                              <TableRow key={response.id}>
                                <TableCell>
                                  {formatDate(response.createdAt)}
                                </TableCell>
                                {form.questions.slice(0, 3).map((question) => {
                                  const answer = response.answers.find(
                                    (a) => a.questionId === question.id
                                  );
                                  let displayValue = "-";
                                  if (answer) {
                                    displayValue = Array.isArray(answer.value)
                                      ? answer.value.join(", ")
                                      : answer.value;
                                  }
                                  return (
                                    <TableCell
                                      key={question.id}
                                      sx={{
                                        maxWidth: 200,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {displayValue || "-"}
                                    </TableCell>
                                  );
                                })}
                                <TableCell align="right">
                                  <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => setViewingResponse(response)}
                                    startIcon={<EyeIcon />}
                                    sx={{ color: "#000957" }}
                                  >
                                    ดูรายละเอียด
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default FormResponses;
