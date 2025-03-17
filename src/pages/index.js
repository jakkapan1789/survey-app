import { useRouter } from "next/navigation";
import { useFormContext } from "@/context/FormContext";
import { Box, Button, Typography, Container, Card } from "@mui/material";
import {
  Description as FileTextIcon,
  Share as ShareIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
import AppLayout from "@/components/Layout";

const Index = () => {
  const { createForm } = useFormContext();
  const router = useRouter();

  const handleCreateForm = () => {
    const formId = createForm();
    router.push(`/formbuilder?formId=${formId}`);
  };

  return (
    <AppLayout>
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Box
          component="main"
          sx={{ flex: 1, py: 6, px: 2, mt: 8 }}
          data-aos="fade-up"
          data-aos-duration="700"
        >
          <Container maxWidth="lg">
            <Box
              sx={{ textAlign: "center", maxWidth: "48rem", mx: "auto", mb: 8 }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "grey.900", mb: 3 }}
              >
                สร้างแบบฟอร์มออนไลน์ฟรีและเผยแพร่ได้ทันที
              </Typography>
              <Typography variant="h6" sx={{ color: "grey.600", mb: 4 }}>
                ออกแบบแบบฟอร์มที่เป็นมิตรกับผู้ใช้
                รวบรวมข้อมูลอย่างมีประสิทธิภาพ และดูผลลัพธ์แบบเรียลไทม์
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={handleCreateForm}
                sx={{ bgcolor: "#003092", "&:hover": { bgcolor: "#003092" } }}
              >
                เริ่มสร้างแบบฟอร์มใหม่
              </Button>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                gap: 4,
              }}
            >
              <Box
                component={Card}
                sx={{
                  bgcolor: "white",
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "blue.50",
                    p: 1.5,
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <FileTextIcon
                    sx={{ color: "blue.500", width: 24, height: 24 }}
                  />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "medium", mb: 1 }}>
                  การสร้างสรรค์ที่ไร้ขีดจำกัด
                </Typography>
                <Typography sx={{ color: "grey.600" }}>
                  ออกแบบแบบฟอร์มไม่จำกัดพร้อมคำถามหลากหลายประเภท
                </Typography>
              </Box>

              <Box
                component={Card}
                sx={{
                  bgcolor: "white",
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "blue.50",
                    p: 1.5,
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <ShareIcon
                    sx={{ color: "blue.500", width: 24, height: 24 }}
                  />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "medium", mb: 1 }}>
                  แบ่งปันทันที
                </Typography>
                <Typography sx={{ color: "grey.600" }}>
                  เผยแพร่แบบฟอร์มผ่าน URL และแบ่งปันได้อย่างง่ายดาย
                </Typography>
              </Box>

              <Box
                component={Card}
                sx={{
                  bgcolor: "white",
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "blue.50",
                    p: 1.5,
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <BarChartIcon
                    sx={{ color: "blue.500", width: 24, height: 24 }}
                  />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "medium", mb: 1 }}>
                  วิเคราะห์ผลลัพธ์
                </Typography>
                <Typography sx={{ color: "grey.600" }}>
                  ดูและวิเคราะห์คำตอบแบบฟอร์มอย่างละเอียด
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </AppLayout>
  );
};

export default Index;
