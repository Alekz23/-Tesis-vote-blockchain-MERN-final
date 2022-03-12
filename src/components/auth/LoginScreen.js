import React from 'react';
import { useDispatch } from 'react-redux';
import { startLogin } from '../../actions/auth';
import { useForm } from '../../hooks/useForm';

import './login.css';
import './styles/css/util.css';
import './styles/css/main.css';
import './styles/vendor/select2/select2.min.css';
import './styles/vendor/daterangepicker/daterangepicker.css';
import './styles/vendor/animsition/css/animsition.min.css';
import './styles/vendor/css-hamburgers/hamburgers.min.css';
import './styles/vendor/animate/animate.css';
import './styles/images/icons/favicon.ico';
import './styles/fonts/iconic/css/material-design-iconic-font.min.css';
import './styles/fonts/font-awesome-4.7.0/css/font-awesome.min.css';
import './styles/vendor/bootstrap/css/bootstrap.min.css';

import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
var validator = require("email-validator");




export const LoginScreen = () => {

	const [valuesLogin, handleInputChangeLogin] = useForm({
		"correo": "alekz@gmail.com",
		"password": "123456"

	})
	const { correo, password } = valuesLogin;




	const dispatch = useDispatch();

	const handleSubmit = (e) => {
		e.preventDefault();
		//console.log(valuesLogin)

		if (validator.validate(correo) === false) {

			return toast.error('Correo inválido', {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}

		if (password.length === 0) {

			return toast.error('Por favor, ingrese una contraseña', {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}


		dispatch(startLogin(correo, password));

	}

	// const navigate = useNavigate();

	// const handleNavigate=()=>{
	// 	navigate('/resultados',
	// 	{
	// 		replace: true
	// 	});
	// }



	return <div className='fondo-login'>
		<div className="fondo-login">
			<ToastContainer></ToastContainer>
			<div className="container-login100">


				<div className="wrap-login100">

					<form className="login100-form validate-form" onSubmit={handleSubmit}>
						<span className="login100-form-title p-b-26">
							Bienvenido
						</span>
						<span className="login100-form-title p-b-48">
							<i className="fa-brands fa-ethereum"></i>
						</span>
						<small id="emailHelp" className="form-text text-muted">Correo</small>

						<div className="wrap-input100 validate-input" data-validate="Valid email is: a@b.c">
							<input className="input100" type="text"
								name="correo" value={correo} onChange={handleInputChangeLogin} />
						</div>

						<small id="emailHelp" className="form-text text-muted">Contraseña</small>

						<div className="wrap-input100 validate-input" data-validate="Enter password">
							<span className="btn-show-pass">
								<i className="zmdi zmdi-eye"></i>
							</span>
							<input className="input100" type="password"

								name="password" value={password} onChange={handleInputChangeLogin} />
						</div>

						<div className="container-login100-form-btn">
							<div className="wrap-login100-form-btn">
								<div className="login100-form-bgbtn"></div>
								<button className="login100-form-btn">
									Login
								</button>
							</div>
						</div>

						<div className="text-center p-t-115">
							<span className="txt1">
								Don’t have an account?
							</span>


						</div>
					</form>
				</div>
			</div>
		</div>
		<script src="'./styles/js/main.js"></script>
		<script src="'./styles/vendor/countdowntime/countdowntime.js"></script>

		<script src="'./styles/vendor/daterangepicker/daterangepicker.js"></script>
		<script src="'./styles/vendor/daterangepicker/moment.min.js"></script>
		<script src="'./styles/vendor/select2/select2.min.js"></script>
		<script src="'./styles/vendor/bootstrap/js/bootstrap.min.js"></script>

		<script src="'./styles/vendor/bootstrap/js/popper.js"></script>
		<script src="'./styles/vendor/animsition/js/animsition.min.js"></script>
		<script src="'./styles/vendor/jquery/jquery-3.2.1.min.js"></script>



	</div>
}