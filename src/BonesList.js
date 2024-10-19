class BonesList {
  name = '';
  delim = ';';
  list = {};
  constructor(name) {
    this.name = name;
  }

  add(bone) {
    this.list[bone.id] = bone;
  }

  encode() {
    let encodedString = this.name;
    let delim = '';
    for (const boneId in this.list) {
      const bone = this.list[boneId];
      encodedString += delim;
      encodedString += bone.encode();
      delim = this.delim;

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
    const parts = encodedString.split(this.delim);


    for (const part of parts) {
      const bone = new Bones(part);
      this.add(bone);
    };

  }


}