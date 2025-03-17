import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/context/FormContext";
import FormCard from "@/components/FormCard";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Card,
} from "@mui/material";
import { Add as PlusIcon, Search as SearchIcon } from "@mui/icons-material";
import AppLayout from "@/components/Layout";

const Dashboard = () => {
  const { forms, createForm } = useFormContext();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateForm = async () => {
    const formId = await createForm();
    router.push(`/formbuilder?formId=${formId}`);
  };

  //   const filteredForms = forms;
  const filteredForms = forms.filter(
    (form) =>
      form.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedForms = [...filteredForms].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  return (
    <AppLayout>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "grey.50",
        }}
      >
        {/* <Navbar /> */}

        <Box
          component="main"
          sx={{ flex: 1, py: 4, mt: 8 }}
          data-aos="fade-up"
          data-aos-duration="700"
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", md: "center" },
                mb: 4,
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "grey.800" }}
                >
                  แบบสอบถามของฉัน
                </Typography>
                <Typography sx={{ color: "grey.600" }}>
                  จัดการแบบสอบถามทั้งหมดของคุณได้ที่นี่
                </Typography>
              </Box>

              <Box sx={{ mt: { xs: 2, md: 0 } }}>
                <Button
                  variant="contained"
                  onClick={handleCreateForm}
                  startIcon={<PlusIcon />}
                  sx={{ bgcolor: "#003092" }}
                >
                  สร้างแบบฟอร์ม
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                p: 2,
                mb: 3,
              }}
              component={Card}
            >
              <Box sx={{ position: "relative" }}>
                <SearchIcon
                  sx={{
                    position: "absolute",
                    left: 12,
                    top: 12,
                    color: "grey.400",
                  }}
                />
                <TextField
                  size="small"
                  fullWidth
                  placeholder="ค้นหาแบบสอบถาม..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ "& .MuiInputBase-root": { pl: 5 } }}
                  variant="outlined"
                />
              </Box>
            </Box>

            {sortedForms.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 6 }}>
                {searchQuery ? (
                  <>
                    <Typography sx={{ color: "grey.500", mb: 2 }}>
                      ไม่พบแบบฟอร์มที่ตรงกัน ({searchQuery})
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => setSearchQuery("")}
                    >
                      ล้างการค้นหา
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography sx={{ color: "grey.500", mb: 2 }}>
                      คุณยังไม่มีแบบฟอร์มใดๆ สร้างแบบฟอร์มแรกของคุณเลยตอนนี้!
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleCreateForm}
                      startIcon={<PlusIcon />}
                      sx={{ bgcolor: "#003092" }}
                    >
                      สร้างแบบฟอร์ม
                    </Button>
                  </>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "1fr 1fr",
                    lg: "1fr 1fr 1fr",
                  },
                  gap: 2,
                }}
              >
                {sortedForms.map((form) => (
                  <FormCard key={form.id} form={form} />
                ))}
              </Box>
            )}
          </Container>
        </Box>
      </Box>
    </AppLayout>
  );
};

export default Dashboard;
