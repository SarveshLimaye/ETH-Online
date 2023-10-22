import React, { useState, useRef } from "react";
import { usersideabi } from "../../utils/contractsabi/usersideabi.json";
import { ethers } from "ethers";
import {
  Progress,
  Icon,
  toast,
  Text,
  chakra,
  VisuallyHidden,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  InputLeftAddon,
  InputGroup,
  Textarea,
  FormHelperText,
  InputRightElement,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from "@chakra-ui/react";
import recordsideabi from "../../utils/contractsabi/recordsideabi.json";
import { useAccountAbstraction } from "../../store/accountAbstractionContext";

export default function UserForm() {
  const inputRef = useRef(null);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const toast = useToast();
  const [recordImage, setRecordImage] = useState();
  const { web3Provider } = useAccountAbstraction();

  console.log(web3Provider);

  const [ipfsUrl, setIpfsUrl] = useState("");

  const changeHandler = () => {
    setRecordImage(inputRef.current?.files[0]);
  };

  const uploadIPFS = async () => {
    const form = new FormData();
    form.append("file", recordImage ? recordImage : "");

    const options = {
      method: "POST",
      body: form,
      headers: {
        Authorization: import.meta.env.VITE_NFTPort_API_KEY,
      },
    };

    await fetch("https://api.nftport.xyz/v0/files", options)
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        // console.log(response.ipfs_url);
        setIpfsUrl(response.ipfs_url);

        if (recordImage) {
          toast({
            title: "Aadhar Card Uploaded to the IPFS.",
            description: "Congratulations 🎉 ",
            status: "success",
            duration: 1000,
            isClosable: true,
            position: "top-right",
          });
        } else {
          toast({
            title: "Aadhar card not Uploaded to the IPFS.",
            description: "Please attach the degree certificate ",
            status: "error",
            duration: 1000,
            isClosable: true,
            position: "top-right",
          });
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = async () => {
    const provider = new ethers.providers.Web3Provider(web3Provider.provider);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      "0x57453f282818272faa71cfb6ca3e685a38cec6c4",
      recordsideabi,
      signer
    );

    const tx = await contract.createUser(name, userName, bio, ipfsUrl, email);
    await signer.sendTransaction(tx);
  };

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form"
      >
        <Heading w="100%" textAlign={"center"} fontWeight="normal">
          User Registration
        </Heading>
        <Flex mt="2%">
          <FormControl mr="5%">
            <FormLabel htmlFor="first-name" fontWeight={"normal"}>
              Name
            </FormLabel>
            <Input
              id="first-name"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
        </Flex>
        <Flex mt="2%">
          <FormControl mr="5%">
            <FormLabel htmlFor="first-name" fontWeight={"normal"}>
              UserName
            </FormLabel>
            <Input
              id="first-name"
              placeholder="Enter user name"
              onChange={(e) => setUserName(e.target.value)}
            />
          </FormControl>
        </Flex>
        <Flex mt="2%">
          <FormControl mr="5%">
            <FormLabel htmlFor="first-name" fontWeight={"normal"}>
              Bio
            </FormLabel>
            <Textarea
              id="first-name"
              placeholder="Enter bio"
              onChange={(e) => setBio(e.target.value)}
            />
          </FormControl>
        </Flex>
        <Flex mt="2%">
          <FormControl mr="5%">
            <FormLabel htmlFor="first-name" fontWeight={"normal"}>
              Email
            </FormLabel>
            <Input
              id="first-name"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
        </Flex>

        <FormControl mt="2%">
          <FormLabel
            fontWeight={"normal"}
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
          >
            Profile Photo
          </FormLabel>

          <Flex
            mt={1}
            justify="center"
            px={6}
            pt={5}
            pb={6}
            borderWidth={2}
            _dark={{
              color: "gray.500",
            }}
            borderStyle="dashed"
            rounded="md"
          >
            <Stack spacing={1} textAlign="center">
              <Icon
                mx="auto"
                boxSize={12}
                color="gray.400"
                _dark={{
                  color: "gray.500",
                }}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Icon>
              <Text>{recordImage?.name}</Text>
              <Flex
                fontSize="sm"
                color="gray.600"
                _dark={{
                  color: "gray.400",
                }}
                alignItems="baseline"
              >
                <chakra.label
                  htmlFor="file-upload"
                  cursor="pointer"
                  rounded="md"
                  fontSize="md"
                  color="brand.600"
                  _dark={{
                    color: "brand.200",
                  }}
                  pos="relative"
                  _hover={{
                    color: "brand.400",
                    _dark: {
                      color: "brand.300",
                    },
                  }}
                >
                  <span>{"Upload Profile Photo"}</span>
                  <VisuallyHidden>
                    <input
                      ref={inputRef}
                      onChange={changeHandler}
                      id="file-upload"
                      name="file-upload"
                      type="file"
                    />
                  </VisuallyHidden>
                </chakra.label>
                <Text pl={1}>or drag and drop</Text>
              </Flex>
              <Text
                fontSize="xs"
                color="gray.500"
                _dark={{
                  color: "gray.50",
                }}
              >
                PNG, JPG, GIF up to 10MB
              </Text>
            </Stack>
          </Flex>
          <Flex>
            <Button onClick={uploadIPFS} mt="2%">
              Upload to IPFS
            </Button>
          </Flex>
        </FormControl>
        <Button onClick={handleSubmit} mt="2%">
          Submit
        </Button>
      </Box>
    </>
  );
}
