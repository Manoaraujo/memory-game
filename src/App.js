import {
   Box,
   Button,
   Center,
   Container,
   Flex,
   Grid,
   Image,
   Modal,
   ModalBody,
   ModalContent,
   ModalHeader,
   ModalOverlay,
   Select,
   Text,
   useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import cardData from "../src/assets/cards.json";
import SingleCard from "./components/singleCard";

import { useTranslation } from "react-i18next";
import i18n from "./Contexts/languageContext/i18n";
// import i18n from './i18n';  // Importe o arquivo de configuração do i18n

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
   const { t } = useTranslation(); // Hook de tradução

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
      setAllStatusTrue(false);
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
      <Container
         p={1}
         maxW="100vw"
         h={{
            base: "110vh",
            xl: "100vh",
         }}
         bgGradient="linear(blue.100 0%, green.100 100%)"
      >
         <Box display="flex" w="50" m={1}>
            <Select
               borderRadius={4}
               color="blue.600"
               bg="blue.200"
               size="sm"
               w="50"
               onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
               <option value="pt">PT</option>
               <option value="en">EN</option>
            </Select>
         </Box>
         <Center display="flex" flexDirection="column" gap="2">
            {/* Language Selector */}
            <Flex gap={1} align="center">
               <Image
                  w="60px"
                  src={require("../src/assets/img/head.png")}
                  alt="head img"
               />
               <Text
                  color="blue.800"
                  as="b"
                  fontSize={{ base: "2xl", md: "2xl", lg: "3xl" }}
               >
                  {t("gameTitle")}
               </Text>
            </Flex>
            <Button
               colorScheme="blue"
               onClick={shuffleCards}
               w="100px"
               size="sm"
            >
               {t("newGame")}
            </Button>
            {gameCards.length > 0 ? (
               <>
                  <Text color="blue.800">
                     {t("timeRemaining", { seconds: timer })}
                  </Text>
                  <Text color="blue.800">{t("turns", { turns })}</Text>
               </>
            ) : (
               <></>
            )}
            <Grid
               w={{
                  base: "320px",
                  md: "540px",
                  xl: "580px",
               }}
               templateColumns={{
                  base: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
               }}
               gap={{
                  base: 2,
                  md: 2,
                  lg: 2,
               }}
            >
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

            {/* Modal Popup */}
            <Modal isOpen={isOpen} onClose={onClose}>
               <ModalOverlay />
               <ModalContent
                  w={{
                     base: "320px",
                     md: "540px",
                  }}
               >
                  <ModalBody
                     borderRadius={6}
                     bg="blue.100"
                     display="flex"
                     flexDirection="column"
                     align="center"
                  >
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
                           {allStatusTrue ? t("wellDone") : t("gameOver")}
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
                        {t("tryAgain")}
                     </Button>
                     <Button
                        m={3}
                        onClick={() => {
                           onClose();
                           resetTimer();
                        }}
                        variant="ghost"
                     >
                        {t("notNow")}
                     </Button>
                  </ModalBody>
               </ModalContent>
            </Modal>
         </Center>
      </Container>
   );
}

export default MemoryGameApp;
