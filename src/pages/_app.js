// import "@/styles/globals.css";
import "@/styles/globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React from "react";
import "@fontsource/roboto";
import { FormProvider } from "@/context/FormContext";
import getLPTheme from "@/data/getLPTheme";
import Aos from "aos";
const LPtheme = createTheme(getLPTheme("light"));

export default function App({ Component, pageProps: { ...pageProps } }) {
  // return <Component {...pageProps} />;
  React.useEffect(() => {
    Aos.init();
  }, []);
  return (
    <FormProvider>
      <ThemeProvider theme={LPtheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </FormProvider>
  );
}
