import { updateUser, deleteUser } from "../services/user.service.js";
import { handleSuccess, handleErrorClient } from "../Handlers/responseHandlers.js";
import { userBodyValidation } from "../validations/usuario.validation.js";

export function getPublicProfile(req, res) {
  handleSuccess(res, 200, "Perfil público obtenido exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export function getPrivateProfile(req, res) {
  const user = req.user;
  handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
    message: `¡Hola, ${user.email}! Este es tu perfil privado. Solo tú puedes verlo.`,
    userData: user,
  });
}

export async function patchProfile(req, res) {
  const { id } = req.user || {};
  if (!id) return handleErrorClient(res, 401, "Usuario no autenticado");

  try {
    const { error } = userBodyValidation.validate(req.body);
    if (error) {
      return handleErrorClient(
        res,
        400,
        error.details.map((d) => d.message).join(", ")
      );
    }

    const { email, password } = req.body;
    const payload = {};
    if (typeof email === "string") payload.email = email;
    if (typeof password === "string" && password.trim() !== "") payload.password = password;

    if (Object.keys(payload).length === 0) {
      return handleErrorClient(res, 400, "No hay campos para actualizar");
    }

    const updatedUser = await updateUser(id, payload);
    if (updatedUser?.password) delete updatedUser.password;

    return handleSuccess(res, 200, "Perfil actualizado", { user: updatedUser });
  } catch (err) {
    return handleErrorClient(res, 400, err.message);
  }
}

export async function deleteProfile(req, res) {
  const { id } = req.user || {};
  if (!id) return handleErrorClient(res, 400, "ID de usuario no encontrado en el token.");

  try {
    await deleteUser(id);
    return handleSuccess(res, 200, "Perfil eliminado exitosamente");
  } catch (err) {
    return handleErrorClient(res, 400, err.message);
  }
}