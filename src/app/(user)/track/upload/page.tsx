import UploadTabs from "@/components/upload.tabs/upload.tabs";
import Container from "@mui/material/Container";

const UploadPage = () => {

  return (
    <Container
      sx={{
        marginTop: "100px",
        border: "1px solid #ddd",
      }}
    >
      <UploadTabs />
    </Container>
  );
};

export default UploadPage;
