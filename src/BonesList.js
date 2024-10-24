class BonesList {
  id = '';
  static DELIM = ';';
  list = {};
  constructor(id) {
    this.id = id;
  }

  add(bone) {
    this.list[bone.id] = bone;
  }

  encode() {
    let encodedString = this.id;
    let delim = '';
    for (const boneId in this.list) {
      const bone = this.list[boneId];
      encodedString += delim;
      encodedString += bone.encode();
      delim = BonesList.DELIM;

    }

    return encodedString;
  }

  decode(encodedString) {
    // first char is the layer eg 'a' = 'surface'
    // take off first character and store it for later use eg 'a'

    const name = encodedString[0];
    // remove first character from encodedString
    encodedString = encodedString.substring(1);

    // divide remainder by delim
    const parts = encodedString.split(BonesList.DELIM);


    for (const part of parts) {
      const bone = new Bones(part);
      this.add(bone);
    };

  }


}