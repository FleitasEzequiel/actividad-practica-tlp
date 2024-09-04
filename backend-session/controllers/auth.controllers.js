import { pool } from "../db/database.js"

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await pool.query("SELECT * FROM users WHERE username= ? AND password = ?",[username,password])
  
  if (user[0].length != 0) {
    console.log(user[0])
    // Guardar información del usuario en la sesión
    req.session.userId = user[0].id;
    req.session.username = user[0].username;

    return res.json({
      message: "Inicio de sesión exitoso",
      user: { id: user.id, username: user.username },
    });
  } else {
    return res.status(401).json({ message: "Credenciales incorrectas" });
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
