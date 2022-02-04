//Deals with login screen/ registration if an unknown name is entered

class Initialisation extends State {
  constructor() {
    super();
    this.usersName = ''; //as it's being typed
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
      let repertoire = this.checkProfileNames(this.usersName); //check if the name matches any of the saved profiles
      if (repertoire !== undefined) {
        this.loadProfile(repertoire);
        state = new Game({accountJustCreated: false}); //YES! start load the next screen but ask for the password
      }
      else {
        this.generateSpyProfile(); //NO! create a new profile
      }
    }
  }

  //load a profile at a perticular index
  loadProfile(i) {
    spyProfile = spyProfiles[i];
  }

  //Go through the array to find matching realNames
  checkProfileNames(name) {
    if (spyProfiles != null) {
      for (let i = 0; i < spyProfiles.length; i++) {
        let profileName = spyProfiles[i].realName;
        if (name === profileName) {
          return i;
        }
      }
      return undefined;
    }
  }

  //Creates a new profile
  generateSpyProfile() {
    let aliasPart1 = random(objectsData.objects);
    let aliasPart2 = random(scientistData.scientists);

    spyProfile = {
      realName: this.usersName,
      alias: aliasPart1 + ' ' + aliasPart2, //combine two data to generate the alias
      secretWeapon: random(Object.keys(religionData)), //Secret weapon is a fake ass religion, just like real spies!
      password: this.setPassword() //create new password
    }
    spyProfile.weaponDescription = religionData[spyProfile.secretWeapon]; //load the last data from the random secretWeapon

    spyProfiles = spyProfiles || []; //check if array is null and create one if so
    spyProfiles.push(spyProfile);
    console.log(spyProfiles);

    this.storeData(spyProfiles); //store data in the localStorage

    state = new Game({accountJustCreated: true}); //get to the display screen but don't ask for the password gad damn enough already!
  }

  storeData(data) {
    let dataString = JSON.stringify(data);
    localStorage.setItem(DATA_NAME, dataString);
  }

  //Asks the player to create a new password and confirm it.
  setPassword() {
    while (true) {
      let password = prompt("Entrez un nouveau mot de passe");
      let passwordConfirmation = prompt("Confirmez votre mot de passe");

      if (password === passwordConfirmation) {
        return password;
      }
      else {
        alert('Les mots de passes ne correspondent pas!')
      }
    }
  }
}
