import { Box } from "@chakra-ui/react";

export function Header () {
  return (
    <header>
      <Box backgroundColor="blue.800" color="white" padding="50" fontSize="50" onClick={() => window.history.back()}>EasyTrips</Box>
    </header>
  )
}