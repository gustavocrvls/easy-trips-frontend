import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Box, ChakraProvider } from '@chakra-ui/react';

import theme from './styles/theme';
import { BuyTickets } from "./pages/BuyTickets";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Accommodation } from "./pages/Accommodation";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Header />
      <Box marginTop="-10" backgroundColor="white" borderRadius="xl" padding="10">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/tickets" component={BuyTickets} />
            <Route path="/accommodation" component={Accommodation} />
          </Switch>
        </BrowserRouter>
      </Box>
    </ChakraProvider>
  );
}

export default App;
