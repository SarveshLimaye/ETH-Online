import React from "react";
import {
  Button,
  ButtonGroup,
  Divider,
  Text,
  Heading,
  Stack,
  Image,
  Card,
  CardBody,
  CardFooter,
  Link,
} from "@chakra-ui/react";

const SongCard = ({ song }) => {
  console.log(song);
  return (
    <Card maxW="sm">
      <CardBody>
        <Image
          src={song.songPayload.bannerURL}
          alt="Song Banner"
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{song.songPayload.recordName}</Heading>
          <Text>{song.songPayload.description}</Text>
          <Text color="blue.600" fontSize="2xl">
            By {song.pubPayload.name}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Link
            href={`https://localhost:3000/record/${song.songPayload.recordId}`}
          >
            Listen Now
          </Link>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default SongCard;
