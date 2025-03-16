// components/FormCard.js
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/context/FormContext";
import { formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  CardActions,
  Button,
  Menu,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
} from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  BarChart,
  ContentCopy,
  Link as LinkIcon,
} from "@mui/icons-material";
import Link from "next/link";

const FormCard = ({ form }) => {
  const { deleteForm, publishForm, unpublishForm } = useFormContext();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const copyLink = () => {
    const link = `${window.location.origin}?formId=form${form.id}`;
    navigator.clipboard.writeText(link);
    handleMenuClose();
  };

  return (
    <>
      <Card sx={{ width: "100%" }}>
        <CardHeader
          title={
            <Typography
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {form.title}
            </Typography>
          }
        />
        <CardContent>
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: "grey.500",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {form.description}
          </Typography>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "0.75rem", color: "grey.500" }}>
              แก้ไขล่าสุด: {formatDate(form.updatedAt)}
            </Typography>
            <Typography
              component="span"
              sx={{
                bgcolor: form.published ? "#4AA96C" : "#DDDDDD",
                color: form.published ? "white" : "#444444",
                fontSize: "0.75rem",
                px: 1.5,
                py: 0.5,
                borderRadius: "9999px",
              }}
            >
              {form.published ? "เผยแพร่" : "แบบร่าง"}
            </Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Link href={`/formbuilder?formId=${form.id}`} passHref>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Edit />}
              sx={{ border: "0.2px solid #BACDDB", color: "#222831" }}
            >
              แก้ไข
            </Button>
          </Link>
          <div>
            <Button
              size="small"
              onClick={handleMenuOpen}
              variant="outlined"
              sx={{ color: "#222831", border: "0.2px solid #BACDDB" }}
            >
              ตัวเลือก
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{ sx: { width: 224, boxShadow: 1 } }}
            >
              <MenuItem
                onClick={() => {
                  window.open(`/view?formId=${form.id}`, "_blank");
                  handleMenuClose();
                }}
              >
                <Visibility sx={{ mr: 1, width: 16, height: 16 }} />
                ดูแบบสอบถาม
              </MenuItem>
              <MenuItem onClick={copyLink}>
                <ContentCopy sx={{ mr: 1, width: 16, height: 16 }} />
                คัลลอกลิ้งก์
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  router.push(`/responses?formId=${form.id}`);
                }}
              >
                <BarChart sx={{ mr: 1, width: 16, height: 16 }} />
                ดูคำตอบ
              </MenuItem>
              <Divider />
              {form.published ? (
                <MenuItem
                  onClick={() => {
                    unpublishForm(form.id);
                    handleMenuClose();
                  }}
                >
                  <LinkIcon sx={{ mr: 1, width: 16, height: 16 }} />
                  ยกเลิกเผยแพร่
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    publishForm(form.id);
                    handleMenuClose();
                  }}
                >
                  <LinkIcon sx={{ mr: 1, width: 16, height: 16 }} />
                  เผยแพร่
                </MenuItem>
              )}
              <Divider />
              <MenuItem
                onClick={() => {
                  setIsDeleteDialogOpen(true);
                  handleMenuClose();
                }}
                sx={{ color: "#BE3144" }}
              >
                <Delete sx={{ mr: 1, width: 16, height: 16 }} />
                ลบแบบสอบถาม
              </MenuItem>
            </Menu>
          </div>
        </CardActions>
      </Card>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>คุณแน่ใจมั้ย?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            การดำเนินการนี้จะลบฟอร์ม ({form.title}) และไม่สามารถย้อนกลับได้
            ข้อมูลการตอบกลับทั้งหมดจะถูกลบเช่นกัน
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            sx={{ color: "black" }}
          >
            ยกเลิก
          </Button>
          <Button
            onClick={() => {
              deleteForm(form.id);
              setIsDeleteDialogOpen(false);
            }}
            sx={{
              bgcolor: "#D84040",
              "&:hover": { bgcolor: "#A31D1D" },
              color: "white",
            }}
          >
            ลบ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FormCard;
