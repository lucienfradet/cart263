//Array containing taunts to be used when the player guesses incorrectly

const insultes = [
  `voyons! tu peux faire mieux`,
  `tu m'niaise tu!?`,
  `sacrament. c'est ton meilleur guess?`,
  `gros, big, tu me décourage`,
  `ah pis toé tu pensais que s't'es ça la réponse?`,
  `P't'être que si tu t'lavais les oreilles une fois de temps-en-temps ça irrait mieux.`,
  `Si t'es pas capable, pèse sur P pis ya personne qui va rire... hahaha`,
  `Ok. Tu peux demander de l'aide à quelqu'un de l'audience. BIN NON BIG. On est pas au Cercle. J'ai tu l'air de Charles Lafortune!?`
]

class Discouragements {
  constructor() {
    this.selection = insultes[Math.floor(Math.random()*insultes.length)];
  }
}
