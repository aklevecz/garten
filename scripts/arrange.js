function deterministicLetterRearrange(word) {
  const characters = word.split("");

  const codePoints = characters.map((char) => char.charCodeAt(0));

  const transformedCodePoints = codePoints.map((codePoint) => {
    const constantValue = 10;
    return (codePoint + constantValue) % 65536;
  });

  const rearrangedCharacters = transformedCodePoints.map((codePoint) => String.fromCharCode(codePoint));

  const rearrangedWord = rearrangedCharacters.slice(0, 10).join("");

  return rearrangedWord;
}

export default deterministicLetterRearrange;
