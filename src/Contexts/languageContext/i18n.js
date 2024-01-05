// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Adicione os recursos para cada idioma aqui
const resources = {
   en: {
      translation: {
         gameTitle: "Memory Game",
         newGame: "New Game",
         timeRemaining: "Time remaining: {{seconds}} seconds",
         turns: "Turns: {{turns}}",
         wellDone: "WELL DONE!",
         gameOver: "GAME OVER",
         tryAgain: "Try Again",
         notNow: "Not Now",
      },
   },
   pt: {
      translation: {
         gameTitle: "Jogo da Memória",
         newGame: "Novo Jogo",
         timeRemaining: "Tempo restante: {{seconds}} segundos",
         turns: "Rodadas: {{turns}}",
         wellDone: "PARABÉNS!",
         gameOver: "FIM DE JOGO",
         tryAgain: "Tentar Novamente",
         notNow: "Agora Não",
      },
   },
};

i18n.use(initReactI18next).init({
   resources,
   lng: "pt", 
   keySeparator: false, 
   interpolation: {
      escapeValue: false, 
   },
});

export default i18n;
