import React, { useState, useEffect } from "react";
import {
  Box,
  Center,
  Button,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import recordabi from "../../utils/contractsabi/recordsideabi.json";
import SongCard from "../../components/Songcard/SongCard";

export default function AllMusic() {
  const [musicPage, setMusicPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [songsArray, setSongsArray] = useState([]);

  const handleClick = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      setLoading(true);
      setMusicPage(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        import.meta.env.VITE_RECORDSIDE_ADDRESS,
        recordabi,
        signer
      );
      const accounts = await provider.listAccounts();
      let totalSongs = Number(await contract.totalRecords());
      //console.log(totalSongs);
      let songInfo, publisherInfo, tempUserId;
      for (let i = 1; i < totalSongs; i++) {
        songInfo = await contract.recordIdtoRecord(i);
        tempUserId = Number(songInfo.publisher);
        publisherInfo = await contract.userIdtoUser(tempUserId);
        setSongsArray((prevState) => [
          ...prevState,
          { songPayload: songInfo, pubPayload: publisherInfo },
        ]);
        // console.log(publisherInfo);
        // console.log(tempUserId);
        // console.log(songInfo);
      }
      setLoading(false);
    }
  };

  if (loading) {
    return <Center mt={2}>Loading...</Center>;
  }

  return (
    <Box>
      {musicPage ? (
        <Box m={4}>
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {songsArray &&
              songsArray.map((song) => (
                <GridItem h="10">
                  <SongCard song={song} />
                </GridItem>
              ))}
          </Grid>
        </Box>
      ) : (
        <Center mt={2}>
          <Button onClick={handleClick}>Load Songs</Button>
        </Center>
      )}
    </Box>
  );
}
