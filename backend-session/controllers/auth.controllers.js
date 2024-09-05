import { pool } from "../db/database.js";
import generarJwt from "../helpers/generar-jwt.js";
export const login = async (req, res) => {
  const { username, password } = req.body;
  const [user] = await pool.query(
    "SELECT * FROM users WHERE username = ? and password = ?",
    [username, password]
  );
  if (user[0] != undefined) {
    // Guardar información del usuario en la sesión
    req.session.userId = user[0].id;
    req.session.username = user[0].username;

    // Generar token JWT
    const token = await generarJwt(user[0].id);

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
  if (req.session.userId) {
    return res.json({
      loggedIn: true,
      user: { id: req.session.userId, username: req.session.username },
    });
  } else {
    return res
      .status(401)
      .json({ loggedIn: false, message: "No hay sesión activa" });
  }
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
