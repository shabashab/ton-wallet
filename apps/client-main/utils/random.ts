export const generateRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min
}
