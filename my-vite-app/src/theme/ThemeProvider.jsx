import { createContext, useContext, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import PropTypes from "prop-types";

// Context to provide the theme toggle function
const ColorModeContext = createContext();

export const useColorMode = () => useContext(ColorModeContext);

export const CustomThemeProvider = ({ children }) => {
    const [mode, setMode] = useState("light");

    // Function to toggle between light and dark modes
    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    // Memoized theme object
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === "light"
                        ? {
                            background: { default: "#f5f5f5" },
                            text: { primary: "#242424" },
                        }
                        : {
                            background: { default: "#121212" },
                            text: { primary: "#fff" },
                        }),
                },
            }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={toggleColorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

// PropTypes validation
CustomThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
