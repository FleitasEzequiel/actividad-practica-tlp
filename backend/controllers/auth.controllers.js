import { pool } from "../db/database.js";
import generarJwt from "../helpers/generar-jwt.js";
export const login = async (req, res) => {
  const { username, password } = req.body;
  const [[user]] = await pool.query(
    "SELECT * FROM users WHERE username = ? and password = ?",
    [username, password]
  );
  console.log(user);
  if (user) {
    // Generar token JWT
    const token = await generarJwt(user.id);

    // Almacenar el token en la sesión del servidor
    req.session.token = token;

    // Almacenar el token en una cookie segura
    res.cookie("authToken", token, {
      httpOnly: true, // La cookie no es accesible desde JavaScript
      secure: false, // Cambiar a true en producción con HTTPS
      maxAge: 3600000, // Expiración en milisegundos (1 hora)
    });

    return res.json({
      message: "Inicio de sesión exitoso",
      user: { id: user.id, username: user.username },
    });
  } else {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }
};
export const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const peticion = await pool.query(
      "INSERT INTO users(username,password) VALUES(?,?)",
      [username, password]
    );
    return res.json({
      message: "Registro exitoso",
    });
  } catch (error) {
    res.json({
      message: "Error al registrar usuario",
      error,
    });
  }
};
export const session = async (req, res) => {
  console.log(req.user);
  return res.json({
    message: "Acceso permitido a área protegida",
    user: req.user,
  });
};
export const logOut = async (req, res) => {
  console.log(req.session);
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error al cerrar la sesión" });
    }
    res.clearCookie("connect.sid"); // Nombre de cookie por defecto para express-session
    return res.json({ message: "Sesión cerrada exitosamente" });
  });
};
