import bcrypt from "bcrypt";

const passwordSalting = async (params: string): Promise<string> => {
  const salt = await bcrypt.genSalt(15);

  const saltedPassword = await bcrypt.hash(params, salt);

  return <string>saltedPassword;
};

export default passwordSalting;