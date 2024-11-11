import React, { useEffect, useState, useCallback  } from 'react';
import { Box, TextField, Typography, Button, Paper, Divider, LinearProgress, MenuItem, FormControl, Select, InputLabel, FormHelperText , Link} from '@mui/material';
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';
import usuariosServices from '../service/usuarios.services';
import generosServices from '../service/generos.services';
import PopupEditar from './PopupEditar';

export default function MiPerfil() {
  const userId = localStorage.getItem('userId');
  const [userData, setUserData] = useState({
    nombreCompleto: '', apellido: '', username: '', email: '', edad: '', localidad: '', genero: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [localidades, setLocalidades] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [generos, setGeneros] = useState([]);
  const [errors, setErrors] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [generosData, localidadesData, userData] = await Promise.all([
        generosServices.getGeneros(),
        (await fetch('http://localhost:4002/api/localidad')).json(),
        usuariosServices.getUserById(userId)
      ]);
      setGeneros(generosData);
      setLocalidades(localidadesData);
      setUserData({
        nombreCompleto: userData.name,
        apellido: userData.lastName,
        email: userData.email,
        username: userData.username,
        edad: userData.edad,
        localidad: userData.localidad?.id || '',
        genero: userData.generosMusicalesPreferidos || []
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleUpdateUser = async () => {
    setLoading(true);
    try {
      await usuariosServices.updateUser(userId, {
        ...userData,
        localidad: userData.localidad,
        genres: userData.genero,
        lastName: userData.apellido,
        name: userData.nombreCompleto
      });
      setIsPopupOpen(true);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Error al actualizar los datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%', mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Información de Usuario
          </Typography>

          {loading ? (
            <LinearProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <TextField
                label="Nombre de Usuario"
                name="username"
                value={userData.username}
                fullWidth
                margin="normal"
                onChange={handleInputChange}
              />
              <TextField
                label="Nombre"
                name="nombreCompleto"
                value={userData.nombreCompleto}
                fullWidth
                margin="normal"
                onChange={handleInputChange}
              />
              <TextField
                label="Apellido"
                name="apellido"
                value={userData.apellido}
                fullWidth
                margin="normal"
                onChange={handleInputChange}
              />
              <TextField
                label="Email"
                name="email"
                value={userData.email}
                fullWidth
                margin="normal"
                onChange={handleInputChange}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Edad"
                name="edad"
                value={userData.edad}
                fullWidth
                margin="normal"
                onChange={handleInputChange}
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="localidad-label">Localidad</InputLabel>
                <Select
                  labelId="localidad-label"
                  value={userData.localidad}
                  onChange={(e) => setUserData({ ...userData, localidad: e.target.value })}
                  label="Localidad"
                >
                  {localidades.map((localidad) => (
                    <MenuItem key={localidad.id} value={localidad.id}>
                      {localidad.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" error={Boolean(errors.genero)}>
                <InputLabel id="intereses-label">Intereses musicales</InputLabel>
                <Select
                  labelId="intereses-label"
                  id="intereses-select"
                  multiple
                  label="Intereses musicales"
                  value={userData.genero}
                  onChange={(e) => setUserData({ ...userData, genero: e.target.value })}
                >
                  {generos.map((genre) => (
                    <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.genero}</FormHelperText>
              </FormControl>

              <Button variant="contained" color="primary" onClick={handleUpdateUser} sx={{ mt: 2 }}>
                Guardar Cambios
              </Button>
            </>
          )}
        </Paper>

        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Estadísticas
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Interacción</Typography>
            <LinearProgress variant="determinate" value={70} color="primary" />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Asistencia</Typography>
            <LinearProgress variant="determinate" value={50} color="error" />
          </Box>
        </Paper>
      </Box>

      <PopupEditar trigger={isPopupOpen} setTrigger={setIsPopupOpen}>
        <h3>Evento creado </h3>
        <p>Tu evento ha sido registrado exitosamente.</p>
        <Link component="button" >Ok </Link>
      </PopupEditar>
      <Footer />
    </>
  );
}