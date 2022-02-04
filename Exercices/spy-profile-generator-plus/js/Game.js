class Game extends State {
  constructor({accountJustCreated}) {
    super();
    this.accountJustCreated = accountJustCreated;
    if (!this.accountJustCreated) {
      checkPassword();
    }
  }

  update() {

  }

  display() {
    push();
    fill(255);
    textFont(font.yoster);
    textSize(23);
    textAlign();

    let xPos = width/30;

    let titleName = 'Votre nom: ';
    let titleAlias = "Votre nom d'espion: ";
    let titleWeapon = 'Votre arme secrète: ';

    let nameSize = textWidth(titleName);
    let aliasSize = textWidth(titleAlias);
    let weaponSize = textWidth(titleWeapon);

    text(titleName, xPos, height/2 - height/16);
    text(titleAlias, xPos, height/2);
    text(titleWeapon, xPos, height/2 + height/16);

    fill(0, 255, 0);
    text(spyProfile.realName, xPos + nameSize, height/2 - height/16);
    text(spyProfile.alias, xPos + aliasSize, height/2);
    text(spyProfile.secretWeapon, xPos + weaponSize, height/2 + height/16);
    pop();
  }
}
