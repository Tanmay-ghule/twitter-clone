export const generatePassword = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let password = "";

  for (let i = 0; i < 10; i++) {
    password += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  return password;
};
