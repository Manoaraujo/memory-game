import {
   Box,
   Button,
   Center,
   Flex,
   Grid,
   Image,
   Modal,
   ModalBody,
   ModalContent,
   ModalHeader,
   ModalOverlay,
   Text,
   useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import cardData from "../src/assets/cards.json";
import SingleCard from "./components/singleCard";

const cards = cardData;

function MemoryGameApp() {
   const [gameCards, setGameCards] = useState([]);
   const [turns, setTurns] = useState(0);
   const [cardOne, setCardOne] = useState(null);
   const [cardTwo, setCardTwo] = useState(null);
   const [disabled, setDisabled] = useState(false);
   const [timer, setTimer] = useState(45);
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [allStatusTrue, setAllStatusTrue] = useState(false);

   useEffect(() => {
      let interval;

      if (timer > 0 && turns > 0) {
         interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
         }, 1000);
      } else if (timer === 0) {
         clearInterval(interval);
         onOpen();
      }

      return () => clearInterval(interval);
   }, [timer, turns, onOpen]);

   // shuffleCards

   const shuffleCards = () => {
      const shuffledCards = [...cards, ...cards]
         .sort(() => Math.random() - 0.5)
         .map((card) => ({ ...card, id: Math.random() }));
      setCardOne(null);
      setCardTwo(null);
      setGameCards(shuffledCards);
      setTurns(0);
      setTimer(45);
      setAllStatusTrue(false)
   };

   const handleChoice = (card) => {
      cardOne ? setCardTwo(card) : setCardOne(card);
   };

   //compare cards
   useEffect(() => {
      if (cardOne && cardTwo) {
         setDisabled(true);
         if (cardOne.img === cardTwo.img) {
            setGameCards((prevCards) => {
               return prevCards.map((card) => {
                  return card.img === cardOne.img
                     ? { ...card, match: true }
                     : card;
               });
            });
            resetTurn();
         } else {
            setTimeout(() => {
               resetTurn();
            }, 1000);
         }
      }
   }, [cardOne, cardTwo]);

   //reset turn

   const resetTurn = () => {
      setCardOne(null);
      setCardTwo(null);
      setTurns((turn) => turn + 1);
      setDisabled(false);
   };

   // check if all matches
   useEffect(() => {
      if (gameCards.every((card) => card.match === true) && turns > 0) {
         setAllStatusTrue(true);
         onOpen();
      }
   }, [gameCards, turns, onOpen]);

   const resetTimer = () => {
      setTimer(0);
   };


   return (
      <Center
         // bgColor={"lightblue"}
         m="5"
         p={3}
         display="flex"
         flexDirection="column"
         gap="2"
      >
         <Flex gap={2} align="center">
            <Image
               w="40px"
               src={require("../src/assets/img/head.png")}
               alt="head img"
            />

            <Text as="b" fontSize="xl">
               Memory Game
            </Text>
         </Flex>
         <Button onClick={shuffleCards} w="100px" size="sm">
            New Game
         </Button>
         {gameCards.length > 0 ? (
            <>
               <Text>Time remaining: {timer} seconds</Text>
               <Text> Turns: {turns}</Text>
            </>
         ) : (
            <></>
         )}
         <Grid w="540px" templateColumns="repeat(4, 1fr)" gap={3}>
            {gameCards.map((gameCard) => (
               <SingleCard
                  key={gameCard.id}
                  gameCard={gameCard}
                  handleChoice={handleChoice}
                  flipCard={
                     gameCard === cardOne ||
                     gameCard === cardTwo ||
                     gameCard.match
                  }
                  disabled={disabled}
               />
            ))}
         </Grid>

         {/* modal pop up */}

         <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
               <ModalBody display="flex" flexDirection="column" align="center">
                  <Box>
                     {allStatusTrue ? (
                        <Image
                           w="100px"
                           src={require("../src/assets/img/win.png")}
                           alt="fireworks img"
                        />
                     ) : (
                        <Image
                           w="100px"
                           src={require("../src/assets/img/sad.png")}
                           alt="sad face img"
                        />
                     )}
                     <ModalHeader>
                        {allStatusTrue ? "WELL DONE!" : "GAME OVER"}
                     </ModalHeader>
                  </Box>
                  <Button
                     colorScheme="blue"
                     m={3}
                     onClick={() => {
                        shuffleCards();
                        onClose();
                     }}
                  >
                     Try Again
                  </Button>
                  <Button
                     m={3}
                     onClick={() => {
                        onClose();
                        resetTimer();
                     }}
                     variant="ghost"
                  >
                     Not Now
                  </Button>
               </ModalBody>
            </ModalContent>
         </Modal>
      </Center>
   );
}

export default MemoryGameApp;
