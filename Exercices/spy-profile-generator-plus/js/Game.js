//Displays the players profile

class Game extends State {
  constructor({accountJustCreated}) {
    super();
    this.accountJustCreated = accountJustCreated;

    //Deals with the openning and closing of the description text
    this.descriptionOpen = false;
    this.hoverFillColor = {
      r: 255,
      g: 255,
      b: 255
    };

    //text display parameters
    this.textPosX = width/30;
    this.fontSize = 23;

    if (!this.accountJustCreated) {
      checkPassword(); //check password if account not just created
    }
  }

  update() {
    //change color of the text 'button' when mouseOver
    if (mouseX < this.textPosX //mouse to the left
      || mouseY < height/2 + 2 * height/16 - this.fontSize //mouse on top
      || mouseX > this.textPosX + textWidth(`!...!`) * 2.5 ////mouse to the right
      || mouseY > height/2 + 2 * height/16) { //mouse under
      this.hoverFillColor = {
        r: 255,
        g: 255,
        b: 255
      }
    }
    else {
      this.hoverFillColor = {
        r: 0,
        g: 255,
        b: 0
      }
    }
  }

  display() {
    push();
    fill(255);
    textFont(font.yoster);
    textSize(this.fontSize);
    textAlign();

    let titleName = 'Votre nom: ';
    let titleAlias = "Votre nom d'espion: ";
    let titleWeapon = 'Votre arme secrète: ';

    let nameSize = textWidth(titleName);
    let aliasSize = textWidth(titleAlias);
    let weaponSize = textWidth(titleWeapon);

    //display descriptions
    text(titleName, this.textPosX, height/2 - height/16);
    text(titleAlias, this.textPosX, height/2);
    text(titleWeapon, this.textPosX, height/2 + height/16);

    //Display information
    fill(0, 255, 0);
    text(spyProfile.realName, this.textPosX + nameSize, height/2 - height/16);
    text(spyProfile.alias, this.textPosX + aliasSize, height/2);
    text(spyProfile.secretWeapon, this.textPosX + weaponSize, height/2 + height/16);

    //Displays the 'button' or the weapon description
    fill(this.hoverFillColor.r, this.hoverFillColor.g, this.hoverFillColor.b);
    if (!this.descriptionOpen) {
      text(`!...!`, this.textPosX, height/2 + 2 * height/16);
    }
    else {
      let descName = "Description de votre arme secrète: ";
      let descSize = textWidth(descName);
      textWrap(WORD);
      fill(255);
      text(descName, this.textPosX, height/2 + 2 * height/16);
      fill(0, 255, 0);
      text(spyProfile.weaponDescription, this.textPosX, height/2 + height/7 + 15, width - this.textPosX);
    }
    pop();
  }

  //Open or close the description if the player clics the 'button'
  mousePressed() {
    if (!this.descriptionOpen) {
      if (mouseX < this.textPosX //mouse to the left
        || mouseY < height/2 + 2 * height/16 - this.fontSize //mouse on top
        || mouseX > this.textPosX + textWidth(`!...!`) * 2.5 ////mouse to the right
        || mouseY > height/2 + 2 * height/16) { //mouse under
      }
      else {
        this.descriptionOpen = true;
      }
    }
    else {
      if (mouseY > height/2 + 2 * height/16 - this.fontSize) {
        this.descriptionOpen = false;
      }
    }
  }
}
