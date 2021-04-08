import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useHistory } from "react-router";
import api from "../services/api";
import InputMask from "react-input-mask";

export function BuyTickets() {
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [total, setTotal] = useState(0);
  const [cities, setCities] = useState([]);
  const [destinyCityId, setDestinyCityId] = useState(0);
  const [departureCityId, setDepartureCityId] = useState(0);

  const [nAdults, setNAdults] = useState(0);
  const [nKids, setNKids] = useState(0);
  const [nElderly, setNElderly] = useState(0);

  const [goingDate, setGoingDate] = useState(null);
  const [backDate, setBackDate] = useState(null);

  const [paiment, setPaiment] = useState({
    name: "",
    card: {
      code: "",
      securityCode: "",
      validate: "",
    },
    plots: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toast = useToast();
  const history = useHistory();

  async function loadCities() {
    const response = await api.get("cities");
    setCities(response.data.data);
  }

  useEffect(() => {
    loadCities();
  }, []);

  useEffect(() => {
    const dcityPrice = cities.find((c) => c.id === Number(destinyCityId))
      ? cities.find((c) => c.id === Number(destinyCityId)).ticket
      : 0;
    const dpcityPrice = cities.find((c) => c.id === Number(departureCityId))
      ? cities.find((c) => c.id === Number(departureCityId)).ticket
      : 0;

    let totalPrice = dcityPrice + dpcityPrice;
    if (isRoundTrip) totalPrice = totalPrice * 2;

    console.log(nAdults);
    if (nAdults > 0) totalPrice = totalPrice + totalPrice * nAdults;
    if (nKids) totalPrice = totalPrice + totalPrice * (nKids / 2);
    if (nElderly) totalPrice = totalPrice + totalPrice * (nElderly / 2);

    setTotal(totalPrice);
  }, [
    destinyCityId,
    departureCityId,
    isRoundTrip,
    nAdults,
    nKids,
    nElderly,
    backDate,
    goingDate,
  ]);

  async function submit() {
    await api.post("tickets", {
      total,
      destinyCityId,
      departureCityId,

      nAdults,
      nKids,
      nElderly,

      goingDate,
      backDate,

      paiment
    });

    toast({
      position: "bottom-right",
      render: () => (
        <Box color="white" p={3} bg="blue.500">
          Passagem comprada!
        </Box>
      ),
    });

    history.push("/");
  }

  return (
    <Box>
      <Heading size="lg" marginBottom="3">
        Comprar Passagem
      </Heading>

      <Flex>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="email-alerts" mb="0">
            Ida e volta?
          </FormLabel>
          <Switch
            id="email-alerts"
            value={isRoundTrip}
            onChange={() => setIsRoundTrip(!isRoundTrip)}
            colorScheme="blue"
          />
        </FormControl>
      </Flex>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
      >
        <SimpleGrid columns={[1, 2]} marginTop="3" spacing="3">
          <Box>
            <Stack direction="column">
              <FormControl id="departure-city" isRequired>
                <FormLabel>Cidade de partida</FormLabel>
                <Select
                  placeholder="Escolha a cidade de partida"
                  value={departureCityId}
                  onChange={(e) => setDepartureCityId(e.target.value)}
                >
                  {cities.map((city) => (
                    <option value={city.id}>{city.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl id="destiny-city" isRequired>
                <FormLabel>Cidade de destino</FormLabel>
                <Select
                  placeholder="Escolha a cidade de destino"
                  value={destinyCityId}
                  onChange={(e) => setDestinyCityId(e.target.value)}
                >
                  {cities.map((city) => (
                    <option value={city.id}>{city.name}</option>
                  ))}
                </Select>
              </FormControl>

              <Stack spacing="3" direction="row">
                <FormControl id="adult-number" isRequired>
                  <FormLabel>Número de Adultos</FormLabel>
                  <NumberInput
                    min={0}
                    value={nAdults}
                    onChange={(value) => setNAdults(value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl id="kids-number" isRequired>
                  <FormLabel>Número de Crianças</FormLabel>
                  <NumberInput
                    min={0}
                    value={nKids}
                    onChange={(value) => setNKids(value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl id="elderly-number" isRequired>
                  <FormLabel>Número de Idosos</FormLabel>
                  <NumberInput
                    min={0}
                    value={nElderly}
                    onChange={(value) => setNElderly(value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Stack>
            </Stack>
          </Box>
          <Box>
            <Stack direction="column">
              <FormControl id="going-date" isRequired>
                <FormLabel>Data de ida</FormLabel>
                <Input
                  type="datetime-local"
                  value={goingDate}
                  onChange={(e) => setGoingDate(e.target.value)}
                />
              </FormControl>
              {isRoundTrip && (
                <FormControl id="going-date" isRequired>
                  <FormLabel>Data de volta</FormLabel>
                  <Input
                    type="datetime-local"
                    value={backDate}
                    onChange={(e) => setBackDate(e.target.value)}
                  />
                </FormControl>
              )}
            </Stack>
          </Box>
        </SimpleGrid>

        <Flex marginTop="3" justifyContent="flex-end">
          <Heading size="lg">
            Total:{" "}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(total)}
          </Heading>
        </Flex>

        <Flex marginTop="3" justifyContent="flex-end">
          <Button type="submit" colorScheme="blue">
            Pagamento
          </Button>
        </Flex>
      </form>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <ModalHeader>Pagamento</ModalHeader>
            <ModalBody>
              <FormControl id="credit-card" isRequired>
                <FormLabel>Nome</FormLabel>
                <Input
                  type="text"
                  placeholder="Nome"
                  value={paiment.name}
                  onChange={(e) =>
                    setPaiment({ ...paiment, name: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="credit-card" isRequired>
                <FormLabel>Cartão de Crédito</FormLabel>
                <Input
                  as={InputMask}
                  type="text"
                  placeholder="0000-0000-0000-0000"
                  mask="9999-9999-9999-9999"
                  maskChar={null}
                  value={paiment.card.code}
                  onChange={(e) =>
                    setPaiment({
                      ...paiment,
                      card: { ...paiment.card, code: e.target.value },
                    })
                  }
                />
              </FormControl>

              <Stack direction="row" spacing="3">
                <FormControl id="credit-card" isRequired>
                  <FormLabel>Validade</FormLabel>
                  <Input
                    as={InputMask}
                    type="text"
                    placeholder="MM/AA"
                    mask="99/99"
                    maskChar={null}
                    value={paiment.card.validate}
                    onChange={(e) =>
                      setPaiment({
                        ...paiment,
                        card: { ...paiment.card, validate: e.target.value },
                      })
                    }
                  />
                </FormControl>
                <FormControl id="credit-card" isRequired>
                  <FormLabel>Cod. de Segurança</FormLabel>
                  <Input
                    as={InputMask}
                    type="text"
                    placeholder="000"
                    mask="999"
                    maskChar={null}
                    value={paiment.card.securityCode}
                    onChange={(e) =>
                      setPaiment({
                        ...paiment,
                        card: { ...paiment.card, securityCode: e.target.value },
                      })
                    }
                  />
                </FormControl>
              </Stack>

              <FormControl id="plots" isRequired>
                <FormLabel>Parcelas</FormLabel>
                <Select
                  placeholder="Escolha a quantidade de parcelas"
                  value={paiment.plots}
                  onChange={(e) =>
                    setPaiment({
                      ...paiment,
                      plots: e.target.value,
                    })
                  }
                >
                  {[...Array(12).keys()].map((value) => (
                    <option value={value + 1}>{`x${
                      value + 1
                    } - ${new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(total / (value + 1))}`}</option>
                  ))}
                </Select>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" colorScheme="blue" mr={3}>
                Confirmar Pagamento
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
