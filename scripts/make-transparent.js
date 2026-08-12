import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

function processPng(filePath) {
  if (!fs.existsSync(filePath)) return;
  const buffer = fs.readFileSync(filePath);

  if (buffer[0] !== 137 || buffer[1] !== 80 || buffer[2] !== 78 || buffer[3] !== 71) {
    console.error("Not a valid PNG file:", filePath);
    return;
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let idatBuffers = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);

    if (type === "IHDR") {
      width = buffer.readUInt32BE(offset + 8);
      height = buffer.readUInt32BE(offset + 12);
      bitDepth = buffer[offset + 16];
      colorType = buffer[offset + 17];
    } else if (type === "IDAT") {
      idatBuffers.push(buffer.subarray(offset + 8, offset + 8 + length));
    } else if (type === "IEND") {
      break;
    }

    offset += 12 + length;
  }

  if (colorType !== 6 && colorType !== 2) {
    console.log("Unsupported colorType:", colorType);
    return;
  }

  const compressed = Buffer.concat(idatBuffers);
  const decompressed = zlib.inflateSync(compressed);

  const bytesPerPixel = colorType === 6 ? 4 : 3;
  const newRaw = Buffer.alloc(height * (1 + width * 4));

  let srcIdx = 0;
  let dstIdx = 0;

  for (let y = 0; y < height; y++) {
    const filterType = decompressed[srcIdx++];
    newRaw[dstIdx++] = filterType;

    for (let x = 0; x < width; x++) {
      let r = decompressed[srcIdx];
      let g = decompressed[srcIdx + 1];
      let b = decompressed[srcIdx + 2];
      let a = colorType === 6 ? decompressed[srcIdx + 3] : 255;

      srcIdx += bytesPerPixel;

      // Detect white background pixels (R, G, B > 225)
      if (r > 225 && g > 225 && b > 225) {
        a = 0; // Make transparent
      }

      newRaw[dstIdx] = r;
      newRaw[dstIdx + 1] = g;
      newRaw[dstIdx + 2] = b;
      newRaw[dstIdx + 3] = a;
      dstIdx += 4;
    }
  }

  const newCompressed = zlib.deflateSync(newRaw);

  const newIhdr = Buffer.alloc(13);
  newIhdr.writeUInt32BE(width, 0);
  newIhdr.writeUInt32BE(height, 4);
  newIhdr[8] = 8;
  newIhdr[9] = 6;
  newIhdr[10] = 0;
  newIhdr[11] = 0;
  newIhdr[12] = 0;

  const chunks = [];
  chunks.push(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  chunks.push(makeChunk("IHDR", newIhdr));
  chunks.push(makeChunk("IDAT", newCompressed));
  chunks.push(makeChunk("IEND", Buffer.alloc(0)));

  const finalBuffer = Buffer.concat(chunks);
  fs.writeFileSync(filePath, finalBuffer);
  console.log("Successfully created 100% transparent PNG logo for:", filePath);
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, "ascii");
  data.copy(buf, 8);
  const crc = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

processPng(path.join(process.cwd(), "src", "assets", "jeddaw-logo.png"));
processPng(path.join(process.cwd(), "public", "jeddaw-logo.png"));
