import { GridItem, Image } from "@chakra-ui/react";
import React from 'react'


function SingleCard({gameCard, handleChoice, flipCard, disabled}) {
   const handleClick = () => {
      if (!disabled) {
         handleChoice(gameCard)
      }
   }
   
   
   return (
      <GridItem
         w={{
            base: "100px",
            md: "125px",
            xl: "140px",
         }}
      >
         {flipCard ? (
            <Image
               borderRadius="5px"
               src={require(`../../assets/img/${gameCard.name}.png`)}
               alt={gameCard.name}
            />
         ) : (
            <Image
               src={require("../../assets/img/back.png")}
               alt={"card back"}
               onClick={handleClick}
            />
         )}
      </GridItem>
   );
         }
         
         export default SingleCard
         