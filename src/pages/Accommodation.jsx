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
import { mask } from "../utils/masks";
import InputMask from "react-input-mask";

export function Accommodation() {
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [total, setTotal] = useState(0);
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState(0);

  const [nAdults, setNAdults] = useState(0);
  const [nKids, setNKids] = useState(0);
  const [nElderly, setNElderly] = useState(0);

  const [nRooms, setNRooms] = useState(0);

  const [goingDate, setGoingDate] = useState(null);
  const [backDate, setBackDate] = useState(null);

  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [plots, sePlots] = useState(1);
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
    const dcityPrice = cities.find((c) => c.id === Number(cityId))
      ? cities.find((c) => c.id === Number(cityId)).accommodation
      : 0;

    let totalPrice = dcityPrice * nRooms;

    if (isRoundTrip) totalPrice = totalPrice * 2;
    if (nAdults > 0) totalPrice = totalPrice + nAdults * 40;
    if (nKids) totalPrice = totalPrice + nKids * 25;
    if (nElderly) totalPrice = totalPrice + nElderly * 25;

    setTotal(totalPrice);
  }, [
    cityId,
    isRoundTrip,
    nAdults,
    nKids,
    nElderly,
    backDate,
    goingDate,
    nRooms,
  ]);

  async function submit() {
    await api.post("accommodations", {
      total,
      cityId,

      nAdults,
      nKids,
      nElderly,

      nRooms,

      goingDate,
      backDate,

      paiment,
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
        Alugar Hospedagem
      </Heading>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
      >
        <SimpleGrid columns={[1, 2]} marginTop="3" spacing="3">
          <Box>
            <Stack direction="column">
              <FormControl id="destiny-city" isRequired>
                <FormLabel>Cidade</FormLabel>
                <Select
                  placeholder="Escolha uma cidade"
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                >
                  {cities.map((city) => (
                    <option value={city.id}>{city.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl id="adult-number" isRequired>
                <FormLabel>Número de Quartos</FormLabel>
                <NumberInput
                  min={0}
                  value={nRooms}
                  onChange={(value) => setNRooms(value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
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
                <FormLabel>Data de entrada</FormLabel>
                <Input
                  type="datetime-local"
                  value={goingDate}
                  onChange={(e) => setGoingDate(e.target.value)}
                />
              </FormControl>
              <FormControl id="going-date" isRequired>
                <FormLabel>Data de saída</FormLabel>
                <Input
                  type="datetime-local"
                  value={backDate}
                  onChange={(e) => setBackDate(e.target.value)}
                />
              </FormControl>
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
