import AppHeader from "@/components/header/app.header";
import AppFooter from "@/components/footer/app.footer";
import Box from '@mui/material/Box';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader />
        <Box sx={{ mb: '70px' }}>
          {children}
        </Box>
        <AppFooter />
    </>
  );
}
