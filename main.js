#!/usr/bin/env node
import sharp from "sharp";
import chalk from "chalk";
const args = process.argv.slice(2);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function stringPrint(string_, time_, color_) {
  for (let char of string_) {
    process.stdout.write(chalk[color_](char));
    await sleep(time_);
  }
  console.log();
}
if (args.length === 0) {
  console.log("⚠️ No images provided.");
  process.exit(1);
}
console.log("");

await stringPrint("Orbital Vision System (OVS)", 40, "green");
console.log("");
console.log(chalk.italic.green("Processing images ["));
console.log("");
for (let a = 1; a < args.length; a++) {
  // console.log(chalk.cyan(args[a]));
  await stringPrint(args[a], 10, "cyan");
  console.log("");
}
console.log(chalk.italic.green("]"));
console.log("");
await stringPrint("Initializing...", 40, "blue");
await stringPrint("Loading dependencies...", 40, "yellow");
await stringPrint("Loading images into memory...", 40, "yellow");

const total_array = [];

class Fingerprint {
  constructor(imageUrl) {
    this.imageUrl = imageUrl;
  }

  async generate() {
    try {
      const { data, info } = await sharp(this.imageUrl)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const byteArray = Array.from(data);

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
await stringPrint("Initializing image processing...", 25, "yellow");
for (let i = 1; i < args.length; i++) {
  const test = new Fingerprint(args[i]);
  total_array.push(await test.generate());
}
const test = new Fingerprint(args[0]);
const testArray = await test.generate();
const match = [];
await stringPrint("Initializing image matching...", 25, "yellow");
for (let i = 0; i < total_array.length; i++) {
  let weight = 0;
  const array_1 = total_array[i];

  const minLength = Math.min(array_1.length, testArray.length);

  for (let j = 0; j < minLength; j++) {
    if (array_1[j] === testArray[j]) {
      weight++;
    }
  }
  console.log("");
  await stringPrint("weight: " + (weight / testArray.length) * 100, 40, "red");
  match.push((weight / testArray.length) * 100);
}
console.log("");

Math.max(...match);
const maxValue = Math.max(...match);
const index = match.indexOf(maxValue);
console.log("");
await stringPrint("best match: ", 20, "red");
console.log(chalk.bgBlackBright.italic.white(args[index + 1]));
