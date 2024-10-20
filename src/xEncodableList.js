// holds a list of things stored by id 
// the things will be new instances of the ThingClass passed in using the classParams
// ABANDONED - recording for posterity - gets too complicated when we nest lists within lists as the params change on the way down
class EncodableList {
    id = '?';
    delim = '^';
    list = {};
    ThingClass = null;
    classParams = null;

    constructor(params) {
      this.id = params.id ?? this.id;
      this.delim = params.delim ?? this.delim;
      this.classParams = params.classParams ?? this.classParams;
      this.ThingClass = params.ThingClass; // it will barf if no class when instantiating
    }
  
    add(thing) {
      this.list[thing.id] = thing;
    }

    get(thingId) {
      return this.list[thingId];  
    }
  
    encode() {
      let encodedString = this.id;
      let delim = '';
      for (const thingId in this.list) {
        const thing = this.list[thingId];
        encodedString += delim;
        encodedString += thing.encode();
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
        const thing = new this.ThingClass(this.classParams);
        this.add(thing);
      };
  
    }
  
  
  }