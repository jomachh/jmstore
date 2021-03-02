import "../styles/navbar.scss";
import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Dimmer, Modal } from "./";
import { connect } from "react-redux";
import { save_user, log_out } from "../redux/actions";
import { API_URL } from "../constants";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const NavBar = ({ user, saveUser, logOut }) => {
  const [show, setShow] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const newUser = useCallback(async () => {
    try {
      const url = `${API_URL}auth/sign-in`;
      const body = JSON.stringify({
        email,
        password,
        name,
        phone,
      });
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body,
      });
      const res = await req.json();
      if (res.error === 0) {
        console.log(res.user);
        saveUser(res.user);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  }, [email, name, password, phone, saveUser]);

  const logIn = useCallback(async () => {
    try {
      const url = `${API_URL}auth/log-in`;
      const body = JSON.stringify({
        email,
        password,
      });
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body,
      });
      const res = await req.json();
      if (res.error === 0) {
        console.log(res.user);
        saveUser(res.user);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  }, [email, password, saveUser]);

  const actionsLogin = useMemo(
    () => [
      {
        name: "Cancelar",
        onClick: () => {
          setShow(false);
          setEmail("");
          setPassword("");
        },
        negative: true,
      },
      {
        name: "Ingresar",
        onClick: () => {
          logIn().finally(() => {
            setShow(false);
            setEmail("");
            setPassword("");
          });
        },
        positive: true,
      },
    ],
    [logIn]
  );

  const actionsSignIn = useMemo(
    () => [
      {
        name: "Cancelar",
        onClick: () => {
          setShow(false);
          setEmail("");
          setPassword("");
          setName("");
          setPhone("");
        },
        negative: true,
      },
      {
        name: "Crear cuenta",
        onClick: () => {
          newUser().finally(() => {
            setShow(false);
            setEmail("");
            setPassword("");
            setName("");
            setPhone("");
          });
        },
        positive: true,
      },
    ],
    [newUser]
  );

  const loginLayout = useMemo(
    () => (
      <div className="auth-container">
        <div className="auth-element">
          <label>Correo electrónico</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="auth-element">
          <label>Contraseña</label>
          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <label>
          ¿No tienes una cuenta?{" "}
          <strong onClick={() => setSignIn(true)}>Registrate aquí.</strong>
        </label>
      </div>
    ),
    [email, password]
  );

  const signinLayout = useMemo(
    () => (
      <div className="auth-container">
        <div className="auth-element">
          <label>Nombre completo</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="auth-element">
          <label>Correo electrónico</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="auth-element">
          <label>Número celular</label>
          <input
            value={phone}
            placeholder="8888 8888"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="auth-element">
          <label>Contraseña</label>
          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <label>
          ¿Ya tienes una cuenta?{" "}
          <strong onClick={() => setSignIn(false)}>Ingresa aquí.</strong>
        </label>
      </div>
    ),
    [name, email, password, phone]
  );

  return (
    <div>
      <div className="navBarContainer">
        <div className="logo">
          P&M
          <br />
          store
        </div>
        <div className="navBar">
          <ul className="links">
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/products/Ropa">Ropa</Link>
            </li>
            <li>
              <Link to="/products/Joyas">Joyas</Link>
            </li>
            <li>
              <Link to="/products/Maquillaje">Maquillaje</Link>
            </li>
          </ul>
          {user ? (
            <div
              className="authSection"
              onClick={() => {
                MySwal.fire({
                  title: "¿Deseas cerrar sesión?",
                  icon: "question",
                  confirmButtonText: "Sí",
                  showDenyButton: true,
                  denyButtonText: "No",
                }).then((result) => {
                  if (result.isConfirmed) {
                    logOut();
                  } else {
                  }
                });
              }}
            >
              <h4>{user.name}</h4>
            </div>
          ) : (
            <div className="authSection" onClick={() => setShow(true)}>
              <h4>Iniciar sesión</h4>
            </div>
          )}
        </div>
      </div>
      <Dimmer show={show}>
        <Modal
          title={signIn ? "Registro" : "Iniciar sesión"}
          actions={signIn ? actionsSignIn : actionsLogin}
        >
          {signIn ? signinLayout : loginLayout}
        </Modal>
      </Dimmer>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.authReducer.user,
});

export default connect(mapStateToProps, {
  saveUser: save_user,
  logOut: log_out,
})(NavBar);
