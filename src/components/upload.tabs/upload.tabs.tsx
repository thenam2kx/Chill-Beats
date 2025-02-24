"use client";

import { Container } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import FileUpload from "./steps/file.upload";
import { useState } from "react";
import ProgressUpload from "./steps/progress.upload";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>{children}</Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export interface IFileUploadState {
  fileName: string;
  percent: number;
  fileNameUploaded: string;
}

const UploadTabs = () => {
  const [fileUpload, setFileUpload] = useState<IFileUploadState>({ fileName: '', percent: 0, fileNameUploaded: '' });
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Upload" {...a11yProps(0)} disabled={value !== 0} />
            <Tab label="Information" {...a11yProps(1)} disabled={value !== 1} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <FileUpload setValue={setValue} setFileUpload={setFileUpload} fileUpload={fileUpload} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <ProgressUpload fileUpload={fileUpload} setValue={setValue} />
        </CustomTabPanel>
      </Box>
    </Container>
  );
};

export default UploadTabs;
