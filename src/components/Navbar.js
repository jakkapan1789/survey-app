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

const Navbar = () => {
  const { createForm } = useFormContext();
  const router = useRouter();

  const handleCreateForm = () => {
    const formId = createForm();
    router.push(`/formbuilder?formId=${formId}`);
  };

  return (
    <AppBar position="fixed" color="default" elevation={2}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            onClick={() => router.push("/")}
            sx={{
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
                display: { xs: "none" },
              }}
              onClick={() => router.push("/dashboard")}
            >
              แดชบอร์ด
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateForm}
              startIcon={<Add />}
              sx={{ bgcolor: "#003092" }}
            >
              สร้างแบบสอบถาม
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
