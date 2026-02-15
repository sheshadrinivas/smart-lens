import * as fs from "fs";
import crypto from "crypto";

class Fingerprint {
  constructor(imageUrl) {
    this.imageUrl = imageUrl;
  }

  async generate() {
    try {
      const file = await fs.promises.readFile(this.imageUrl);

      const hash = crypto.createHash("sha256").update(file).digest();

      const byteArray = Array.from(hash);

      return byteArray;
    } catch (error) {
      console.error("Could not fetch the image:", error);
    }
  }
  crc32(byteArray) {
    let table = [];

    for (let c = 0; c < 256; c++) {
      let a = c;
      for (let f = 0; f < 8; f++) {
        a = a & 1 ? 0xedb88320 ^ (a >>> 1) : a >>> 1;
      }
      table[c] = a >>> 0;
    }

    let crc = -1;

    for (let i = 0; i < byteArray.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ byteArray[i]) & 0xff];
    }

    return (crc ^ -1) >>> 0;
  }
}

let test = new Fingerprint(
  "/Users/macbook/code/side-projects/detector/graph.png",
);
let test2 = new Fingerprint(
  "/Users/macbook/code/side-projects/detector/graph_1.png",
);
let test3 = new Fingerprint(
  "/Users/macbook/code/side-projects/detector/graph_2.png",
);
const total_array = await Promise.all([test2.generate(), test3.generate()]);
const testArray = await test.generate();

const match = [];
for (let i = 0; i < total_array.length; i++) {
  let weight = 0;
  const array_1 = total_array[i];

  const minLength = Math.min(array_1.length, testArray.length);

  for (let j = 0; j < minLength; j++) {
    if (array_1[j] === testArray[j]) {
      weight++;
    }
  }

  console.log("weight:", weight);
  match.push(weight);
}

Math.max(...match);
const maxValue = Math.max(...match);
const index = match.indexOf(maxValue);

console.log("array:", total_array[index]);
