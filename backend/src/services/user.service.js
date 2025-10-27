import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = userRepository.create({
    email: data.email,
    password: hashedPassword,
  });

  return await userRepository.save(newUser);
}

export async function findUserByEmail(email) {
  return await userRepository.findOneBy({ email });
}
export async function updateUser(id, { email, password }) {
  const user = await userRepository.findOneBy({ id });
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  if (email && email.trim()) {
    user.email = email.trim();
  }

  if (password && password.trim()) {
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
  }

  return await userRepository.save(user);
}
export async function deleteUser(id) {
  const user = await userRepository.findOneBy({ id });
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  await userRepository.delete(id);
  return true;
}