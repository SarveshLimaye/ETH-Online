import React, { useState, useRef, useEffect } from "react";
import { ethers } from "ethers";
import {
  Progress,
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
  Icon,
  chakra,
  VisuallyHidden,
  Text,
  Stack,
  ring,
} from "@chakra-ui/react";

import { useAccountAbstraction } from "../../store/accountAbstractionContext";

import recordsideabi from "../../utils/contractsabi/recordsideabi.json";

import { useToast } from "@chakra-ui/react";
import { EthersAdapter } from "@safe-global/protocol-kit";
const Form = () => {
  const [recordName, setRecordName] = useState("");
  const [recordDescription, setRecordDescription] = useState("");
  const toast = useToast();
  const inputRef = useRef(null);
  const inputRef2 = useRef(null);
  const [displayFile, setDisplayFile] = useState();
  const [displayBanner, setDisplayBanner] = useState();
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [ipfsUrl2, setIpfsUrl2] = useState("");
  const [ipfsJson, setIpfsJson] = useState("");

  const {
    loginWeb3Auth,
    logoutWeb3Auth,
    ownerAddress,
    safeSelected,
    safeBalance,
    isAuthenticated,
    web3Provider,
  } = useAccountAbstraction();

  const changeHandler = () => {
    setDisplayFile(inputRef.current?.files[0]);
    setDisplayBanner(inputRef2.current?.files[0]);
  };
  const uploadAudio2IPFS = async () => {
    const form = new FormData();
    form.append("file", displayFile ? displayFile : "");
    //  form.append("file", displayBanner ? displayBanner : "");

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
        if (displayFile) {
          toast({
            title: "Song Uploaded to the IPFS.",
            description: "Congratulations 🎉 ",
            status: "success",
            duration: 1000,
            isClosable: true,
            position: "top-right",
          });
        } else {
          toast({
            title: "Document not Uploaded to the IPFS.",
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

  const uploadBanner2IPFS = async () => {
    const form = new FormData();

    form.append("file", displayBanner ? displayBanner : "");

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
        setIpfsUrl2(response.ipfs_url);
        if (displayBanner) {
          toast({
            title: "Banner Uploaded to the IPFS.",
            description: "Congratulations 🎉 ",
            status: "success",
            duration: 1000,
            isClosable: true,
            position: "top-right",
          });
        } else {
          toast({
            title: "Banner not Uploaded to the IPFS.",
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

    console.log(web3Provider);
    const signer = provider.getSigner();
    console.log(signer);
    // const ethAdapter = new EthersAdapter({
    //   ethers,
    //   signerOrProvider: signer || web3Provider,
    // });

    // const safeSDK = await Safe.create({
    //   ethAdapter,
    //   safeAddress,
    // });
    const contract = new ethers.Contract(
      "0x57453f282818272faa71cfb6ca3e685a38cec6c4",
      recordsideabi,
      signer
    );
    //  const accounts = await provider.listAccounts();

    const json = {
      name: recordName,
      description: recordDescription,
      song: ipfsUrl,
    };

    const tx = await contract.createRecord(
      recordName,
      recordDescription,
      ipfsUrl,
      ipfsUrl2,
      "https://ipfs.io/ipfs/QmQQEqK951KXLfJjVjZZAJJEQvioMh2w9uevoHHEqE4mpm"
    );

    await signer.sendTransaction(tx);

    toast({
      title: "Song Uploaded.",
      description: "Please wait for the transaction to be confirmed",
      status: "info",
      duration: 1000,
      isClosable: true,
      position: "top-right",
    });
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
        <SimpleGrid columns={1} spacing={6}>
          <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
            Create a new song
          </Heading>
          <FormControl mr="2%">
            <FormLabel htmlFor="name" fontWeight={"normal"}>
              Record Name
            </FormLabel>
            <Input
              id="name"
              placeholder="Record Name"
              autoComplete="name"
              onChange={(e) => setRecordName(e.target.value)}
            />
          </FormControl>
          <FormControl id="email" mt={1}>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              About the Record
            </FormLabel>
            <Textarea
              placeholder="Description about the document."
              rows={3}
              shadow="sm"
              focusBorderColor="brand.400"
              fontSize={{
                sm: "sm",
              }}
              onChange={(e) => setRecordDescription(e.target.value)}
            />
            <FormHelperText>
              Brief description about the document. URLs are hyperlinked.
            </FormHelperText>
          </FormControl>
          <FormControl mt="2%">
            <FormLabel
              fontWeight={"normal"}
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              Upload Audio File
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

                <Text>{displayFile?.name}</Text>
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
                    <span>{"Upload Audio File"}</span>
                    <VisuallyHidden>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        ref={inputRef}
                        onChange={changeHandler}
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
          </FormControl>

          <Button onClick={uploadAudio2IPFS} mt="2%">
            Upload the song to IPFS
          </Button>

          <FormControl mt="2%">
            <FormLabel
              fontWeight={"normal"}
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              Upload Song Banner
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
                <Text>{displayBanner?.name}</Text>
                <Flex
                  fontSize="sm"
                  color="gray.600"
                  _dark={{
                    color: "gray.400",
                  }}
                  alignItems="baseline"
                >
                  <chakra.label
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
                    <span>{"Upload Banner"}</span>
                    <VisuallyHidden>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        ref={inputRef2}
                        onChange={changeHandler}
                        accept=".pdf,.docx,.doc"
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
                  PDF, DOCX, DOC up to 10MB
                </Text>
              </Stack>
            </Flex>
          </FormControl>

          <Button onClick={uploadBanner2IPFS}>Upload the banner to IPFS</Button>
          <Button
            // w="7rem"
            colorScheme="blue"
            variant="solid"
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit
          </Button>
        </SimpleGrid>
      </Box>
    </>
  );
};

export default Form;
