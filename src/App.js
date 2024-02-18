import React, {useState, useEffect} from 'react'
import {createTheme, CssBaseline, makeStyles, ThemeProvider} from "@material-ui/core";
import {parseInput} from './utils';


const useStyles = makeStyles((theme) => ({
    main: {
        margin: '50px',
    },
    mention: {
        color: 'white',
        padding: '2px',
        borderRadius: '5px'
    }
}));


function App() {

    const classes = useStyles();

    const theme = createTheme();

    theme.typography.h1 = {
        fontSize: '28px'
    };

    theme.typography.h4 = {
        fontSize: '16px'
    };

    const [parsedData, setParsedData] = useState(<div>Loading...</div>);

    useEffect(() => {
        if (classes) {
            // fetch data upon loading classes
            fetch('input.json')
                .then(response => response.json())
                .then(data => {
                    setParsedData(parseInput(data[0], null, null, classes))
                })
                .catch(error => {
                    console.error('Error reading the file:', error);
                });
        }
    }, [classes])

    return (
        <>
            <CssBaseline/>
            <main className={classes.main}>
                <ThemeProvider theme={theme}>
                    {parsedData}
                </ThemeProvider>

            </main>
        </>
    );
}

export default App;
