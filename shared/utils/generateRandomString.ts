export default function generateRandomString() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

  // Function to generate a random part with specified length
  function getRandomPart(length: number) {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const part2 = getRandomPart(3).toUpperCase();
  const part3 = getRandomPart(3).toUpperCase();

  return `${part2}${part3}`;
}
