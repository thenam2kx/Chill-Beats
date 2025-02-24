'use client'
import './file.upload.css'
import { FileWithPath, useDropzone } from 'react-dropzone';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import { useCallback } from 'react';
import axios from 'axios'
import { useSession } from 'next-auth/react';
import { IFileUploadState } from '../upload.tabs';

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


interface IProps {
  setValue: (value: number) => void
  fileUpload: IFileUploadState
  setFileUpload: (fileUpload: IFileUploadState | ((prevState: IFileUploadState) => IFileUploadState)) => void;
}

const FileUpload = (props: IProps) => {
  const { setValue, setFileUpload, fileUpload } = props
  const { data: session } = useSession()

  const onDrop = useCallback( async(acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setValue(1)

      const audio = acceptedFiles[0]
      const formData = new FormData()
      formData.append('fileUpload', audio)

      try {
        const res = await axios.post(
          'http://localhost:8000/api/v1/files/upload',
          formData,
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
              'target_type': 'tracks'
            },
            onUploadProgress: (progressEvent) => {
              const percentComplete = Math.floor((progressEvent.loaded * 100) / progressEvent.total!)
              setFileUpload({
                ...fileUpload,
                fileName: acceptedFiles[0].name,
                percent: percentComplete
              })
            }
          }
        )
        setFileUpload((prevState: IFileUploadState) => ({
          ...prevState,
          fileNameUploaded: res.data.data.fileName
        }))
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        alert(error?.response?.data?.message)
      }
    }
  }, [session, setValue, setFileUpload, fileUpload])

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: { 'audio': ['.mp3', '.m4a', '.wav'] }
  });

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <Box component={'section'} className="container">
      <Box {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          onClick={(e) => e.preventDefault()}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            onChange={(event) => console.log(event.target.files)}
            multiple
          />
        </Button>
        <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
      </Box>
      <Box component={'aside'}>
        <h4>Files</h4>
        <ul>{files}</ul>
      </Box>
    </Box>
  );
}

export default FileUpload