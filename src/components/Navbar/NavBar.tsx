import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  useColorMode,
  Link,
  Stack,
} from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import Avatar from "avataaars";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useAccountAbstraction } from "../../store/accountAbstractionContext";
import { generateRandomAvatarOptions } from "../../utils/avatar";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    loginWeb3Auth,
    logoutWeb3Auth,
    ownerAddress,
    safes,
    isAuthenticated,
  } = useAccountAbstraction();

  console.log(safes);

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={10}>
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
          mx="auto"
        >
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack
            spacing={8}
            alignItems={"center"}
            fontSize="26px"
            fontWeight="0"
            ml="2"
            color="brand.00"
          >
            <Link href="/">ETHOnline</Link>
          </HStack>
          <Flex alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
              marginRight={4}
            >
              <Link href={"/all"}>
                <Button w="full" variant="ghost">
                  Music
                </Button>
              </Link>
              <Link href={"/user-registration"}>
                <Button w="full" variant="ghost">
                  User-Registration
                </Button>
              </Link>

              <Link href={"/add"}>
                <Button w="full" variant="ghost">
                  Add Music
                </Button>
              </Link>
              {isAuthenticated ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                      avatarStyle="Circle"
                      {...generateRandomAvatarOptions()}
                    />
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      Welcome,{" "}
                      {ownerAddress.slice(0, 4) +
                        "..." +
                        ownerAddress.slice(-4)}
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem as={Link} to="/profile">
                      Profile
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={logoutWeb3Auth}>Sign Out</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Button variant="contained" onClick={loginWeb3Auth}>
                  Connect
                </Button>
              )}
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
            </HStack>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <Link href={"/buy"}>
                <Button w="full" variant="ghost">
                  Buy
                </Button>
              </Link>
              <Link href={"/sell"}>
                <Button w="full" variant="ghost">
                  Sell
                </Button>
              </Link>

              <Button w="full" variant="ghost">
                Connect
              </Button>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
