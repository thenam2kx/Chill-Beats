"use client";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { VisuallyHiddenInput } from "./file.upload";
import LinearProgress, { LinearProgressProps } from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { fetchAPIs } from "@/utils/fetchAPIs";
import { useToast } from "@/utils/toast";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const category = [
  {
    value: "CHILL",
    label: "CHILL",
  },
  {
    value: "WORKOUT",
    label: "WORKOUT",
  },
  {
    value: "PARTY",
    label: "PARTY",
  },
];

interface IProps {
  fileUpload: {
    fileName: string,
    percent: number
    fileNameUploaded: string
  }
  setValue: (value: number) => void
}
interface ITrackInfo {
  title: string
  description: string
  trackUrl: string
  imageUrl: string
  category: string
}

const ProgressUpload = (props: IProps) => {
  const { fileUpload, setValue } = props
  const { data: session } = useSession()
  const [trackInfo, setTrackInfo] = useState<ITrackInfo>({
    title: '',
    description: '',
    trackUrl: '',
    imageUrl: '',
    category: '',
  })

  const toast = useToast()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadImage = async (image: any) => {
      const formData = new FormData()
      formData.append('fileUpload', image)

      try {
        const res = await axios.post(
          'http://localhost:8000/api/v1/files/upload',
          formData,
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
              'target_type': 'images'
            },
          }
        )
        setTrackInfo({
          ...trackInfo,
          imageUrl: res.data.data.fileName
        })
        // setFileUpload({
        //   ...fileUpload,
        //   fileNameUploaded: res.data.data.fileName
        // })
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        alert(error?.response?.data?.message)
      }
  }

  const handleSubmitForm = async () => {
    const res = await fetchAPIs<IBackendRes<ITracksTop[]>>({
        url: 'http://localhost:8000/api/v1/tracks',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: {
          title: trackInfo.title,
          description: trackInfo.description,
          trackUrl: trackInfo.trackUrl,
          imgUrl: trackInfo.imageUrl,
          category: trackInfo.category,
        }
      })
    if (res.data) {
      setValue(0)
      toast.success('Upload track success')
    } else {
      toast.error(res.message)
    }
  }

  useEffect(() => {
    if (fileUpload && fileUpload.fileNameUploaded) {
      setTrackInfo({
        ...trackInfo,
        trackUrl: fileUpload.fileNameUploaded
      })
    }

  }, [fileUpload])

  return (
    <>
      <Box>
        <Box>Your uploading track: {fileUpload.fileName}</Box>
        <Box sx={{ width: "100%" }}>
          <LinearProgressWithLabel value={fileUpload.percent} />
        </Box>
      </Box>

      <Grid container spacing={2} mt={5}>
        <Grid
          size={{ xs: 6, md: 4 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Box sx={{ height: 250, width: 250, background: "#ccc" }}>
            {
              trackInfo.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${trackInfo.imageUrl}`}
                  alt="track"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )
            }
          </Box>
          <Box>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              onChange={e => {
                const event = e.target as HTMLInputElement
                if (event.files) {
                  handleUploadImage(event.files[0])
                }
              }}
            >
              Upload files
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => console.log(event.target.files)}
                multiple
              />
            </Button>
          </Box>
        </Grid>
        <Grid size={{ xs: 6, md: 8 }}>
          <TextField
            label="Title"
            variant="standard"
            fullWidth
            margin="dense"
            value={trackInfo?.title}
            onChange={(e) => setTrackInfo({ ...trackInfo, title: e.target.value })}
          />
          <TextField
            label="Description"
            variant="standard"
            fullWidth
            margin="dense"
            value={trackInfo?.description}
            onChange={(e) => setTrackInfo({ ...trackInfo, description: e.target.value })}
          />
          <TextField
            sx={{
              mt: 3,
            }}
            select
            label="Category"
            fullWidth
            variant="standard"
            value={trackInfo?.category}
            onChange={(e) => setTrackInfo({ ...trackInfo, category: e.target.value })}
          >
            {category.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="outlined"
            sx={{ mt: 5 }}
            onClick={() => handleSubmitForm()}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default ProgressUpload;
