import { Flex, SimpleGrid } from "@chakra-ui/react";
import { FcPaid, FcDepartment } from "react-icons/fc";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <SimpleGrid columns={[1, 2]} spacing="5">
      <Link to="/tickets">
        <Flex
          fontSize="4xl"
          borderRadius="xl"
          backgroundColor="white"
          boxShadow="lg"
          padding="5"
          alignItems="center"
          direction="column"
        >
          <FcPaid size="100" />
          <span>Comprar Passagens</span>
        </Flex>
      </Link>
      <Link to="/accommodation">
        <Flex
          fontSize="4xl"
          borderRadius="xl"
          backgroundColor="white"
          boxShadow="lg"
          padding="5"
          alignItems="center"
          direction="column"
        >
          <FcDepartment size="100" />
          <span>Hospedagem</span>
        </Flex>
      </Link>
    </SimpleGrid>
  );
}
