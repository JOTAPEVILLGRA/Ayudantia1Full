import { updateUser, deleteUser as deleteUserService } from "../services/user.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
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
  const { sub: id } = req.user || {}; 
  if (!id) return handleErrorClient(res, 401, "Usuario no autenticado");

  try {
    const { email, password } = req.body || {};
    if ((!email || !email.trim()) && (!password || !password.trim())) {
      return handleErrorClient(res, 400, "Nada para actualizar");
    }

    const updated = await updateUser(id, { email, password });
    return handleSuccess(res, 200, "Perfil actualizado correctamente", {
      id: updated.id,
      email: updated.email,
    });
  } catch (err) {
    if (err.message === "Usuario no encontrado") {
      return handleErrorClient(res, 404, err.message);
    }
    return handleErrorServer(res, 500, "Error al actualizar el perfil", err.message);
  }
}

export async function deleteProfile(req, res) {
  const { sub: id } = req.user || {}; 
  if (!id) return handleErrorClient(res, 401, "Usuario no autenticado");

  try {
    await deleteUserService(id); 
    return handleSuccess(res, 200, "Perfil eliminado correctamente");
  } catch (err) {
    if (err.message === "Usuario no encontrado") {
      return handleErrorClient(res, 404, err.message);
    }
    return handleErrorServer(res, 500, "Error al eliminar el perfil", err.message);
  }
}