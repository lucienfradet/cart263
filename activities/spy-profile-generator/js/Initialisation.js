class Initialisation extends State {
  constructor() {
    super();
    this.usersName = '';
  }

  update() {

  }

  display() {
    background(0);
    // Prompt
    push();
    fill(255);
    textFont(font.yoster);
    textSize(23);
    textAlign(CENTER, CENTER);
    text(`Entrez votre nom:`, width/2, height/2 - height/16);
    pop();

    // A line under their text entry
    push();
    stroke(150);
    line(width/2 - width/4, height/2 + height/16, width/2 + width/4, height/2 + height/16);
    pop();

    // The current name data they're typing in
    push();
    fill(255);
    textFont(font.yoster);
    textSize(48);
    textAlign(CENTER, BOTTOM);
    text(this.usersName, width/2, height/2 + height/16);
    pop();
  }

  keyTyped() {
      this.usersName += key;
  }

  keyPressed() {
    if (keyCode === BACKSPACE) {
      // This is a way to remove the last character in a string!
      this.usersName = this.usersName.slice(0, this.usersName.length - 1);
    }
    else if (keyCode === ENTER) {

      let aliasPart1 = random(objectsData.objects);
      let aliasPart2 = random(scientistData.scientists);

      spyProfile = {
        realName: this.usersName,
        alias: aliasPart1 + ' ' + aliasPart2,
        secretWeapon: random(Object.keys(religionData)),
        password: this.setPassword()
      }
      spyProfile.weaponDescription = religionData[spyProfile.secretWeapon];
      console.log(spyProfile);

      this.storeData(spyProfile);
      this.setPassword();

      state = new Game();
    }
  }

  storeData(data) {
    let dataString = JSON.stringify(data);
    localStorage.setItem(DATA_NAME, dataString);
  }

  setPassword() {
    let password = prompt("Entrez un nouveau mot de passe");
    let passwordConfirmation = prompt("Confirmez votre mot de passe");

    if (password === passwordConfirmation) {
      return password;
      break setPassword;
    }
    else {
      alert('Les mots de passes ne correspondent pas!')
      this.setPassword();
    }
  }
}
