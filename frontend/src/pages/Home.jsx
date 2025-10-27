import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, deleteProfile } from '../services/profile.service';
import { logout } from '../services/auth.service';
import { showErrorAlert, showSuccessAlert } from '../helpers/sweetAlert';

const Home = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const ObtenerPerfil = async () => {
    try {
      const response = await getProfile();
      if (response.status === 'Success') {
        setProfileData(response.data);
        setError(null);
        showSuccessAlert('Perfil obtenido', 'Información cargada correctamente');
      }
    } catch (err) {
      setError(err.message);
      showErrorAlert('Error', err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const ModificarPerfil = async (e) => {
    e.preventDefault();
    
    // Crear objeto solo con campos no vacíos
    const dataToUpdate = {};
    if (formData.email.trim()) dataToUpdate.email = formData.email;
    if (formData.password.trim()) dataToUpdate.password = formData.password;

    if (Object.keys(dataToUpdate).length === 0) {
      showErrorAlert('Error', 'Debes completar al menos un campo');
      return;
    }

    try {
      const response = await updateProfile(dataToUpdate);
      if (response.status === 'Success') {
        showSuccessAlert('Perfil actualizado', 'Tu perfil ha sido actualizado correctamente');
        setShowUpdateForm(false);
        setFormData({ email: '', password: '' });
        // Actualizar los datos mostrados
        await ObtenerPerfil();
      }
    } catch (err) {
      setError(err.message);
      showErrorAlert('Error', err.message);
    }
  };

  const EliminarPerfil = async () => {
    // Confirmación antes de eliminar
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.');
    
    if (!confirmed) return;

    try {
      const response = await deleteProfile();
      if (response.status === 'Success') {
        showSuccessAlert('Perfil eliminado', 'Tu perfil ha sido eliminado correctamente');
        // Cerrar sesión y redirigir al login
        await logout();
        navigate('/auth');
      }
    } catch (err) {
      setError(err.message);
      showErrorAlert('Error', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-2xl transform transition-all hover:scale-105">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Página de Inicio
        </h1>
        
        <div className="space-y-4">
          <button 
            onClick={ObtenerPerfil}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            Obtener Perfil
          </button>

          <button 
            onClick={() => setShowUpdateForm(!showUpdateForm)}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            {showUpdateForm ? 'Cancelar Modificación' : 'Modificar Perfil'}
          </button>

          <button 
            onClick={EliminarPerfil}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Eliminar Perfil
          </button>
        </div>

       
        {showUpdateForm && (
          <form onSubmit={ModificarPerfil} className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Actualizar Información</h2>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Nuevo Email (opcional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="nuevo@email.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Nueva Contraseña (opcional)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nueva contraseña"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              Guardar Cambios
            </button>
          </form>
        )}

        {/* Mensajes de error */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {/* Datos del perfil */}
        {profileData && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Información del Perfil</h2>
            <pre className="text-sm text-gray-700 overflow-auto">{JSON.stringify(profileData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
