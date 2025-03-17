import { useRouter } from "next/navigation";
import { useFormContext } from "@/context/FormContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { Add } from "@mui/icons-material";

const AppLayout = ({ children }) => {
  const { createForm } = useFormContext();
  const router = useRouter();

  const handleCreateForm = () => {
    const formId = createForm();
    router.push(`/formbuilder?formId=${formId}`);
  };

  return (
    <Box>
      <AppBar position="fixed" color="default" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              onClick={() => router.push("/")}
              sx={{
                ml: -1,
                fontSize: 32,
                letterSpacing: -1.5,
                background: "linear-gradient(80deg, black, #7C00FE)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
              }}
            >
              appform
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                sx={{
                  color: "#003092",
                  borderColor: "#003092",
                }}
                onClick={() => router.push("/dashboard")}
              >
                แดชบอร์ด
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateForm}
                startIcon={<Add />}
                sx={{ bgcolor: "#003092", display: { xs: "none" } }}
              >
                สร้างแบบสอบถาม
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box>{children}</Box>
      <Box
        component="footer"
        sx={{
          backgroundColor: "#EFEFEF",
          color: "white",
          py: 3,
          flexShrink: 0, // Footer จะไม่ย่อขนาดลง
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ color: "#003092" }} align="center">
            © {new Date().getFullYear()} appform - Online Survey Form. Powered
            by AppLab Tech. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default AppLayout;
