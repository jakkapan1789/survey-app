// import "@/styles/globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "@fontsource/roboto";
import { FormProvider } from "@/context/FormContext";
import getLPTheme from "@/data/getLPTheme";
const LPtheme = createTheme(getLPTheme("light"));

export default function App({ Component, pageProps: { ...pageProps } }) {
  // return <Component {...pageProps} />;

  return (
    <FormProvider>
      <ThemeProvider theme={LPtheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </FormProvider>
  );
}
