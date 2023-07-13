import React, { useState, useEffect } from 'react';

import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  FormText,
  Input,
  Label,
} from "reactstrap";
import { Link } from "react-router-dom";
import Widget from "../../components/Widget/Widget";
import Footer from "../../components/Footer/Footer";
import loginImage from "../../assets/loginImage.svg";
import SofiaLogo from "../../components/Icons/SofiaLogo.js";
import GoogleIcon from "../../components/Icons/AuthIcons/GoogleIcon.js";
import TwitterIcon from "../../components/Icons/AuthIcons/TwitterIcon.js";
import FacebookIcon from "../../components/Icons/AuthIcons/FacebookIcon.js";
import GithubIcon from "../../components/Icons/AuthIcons/GithubIcon.js";
import LinkedinIcon from "../../components/Icons/AuthIcons/LinkedinIcon.js";




const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      window.location.replace('http://localhost:3000/#/Transfer');
    } else {
      setLoading(false);
    }
  }, []);

  const onSubmit = e => {
    e.preventDefault();

    const user = {
      email: email,
      password: password
    };

    fetch('http://127.0.0.1:8000/api/v1/users/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
      .then(data => {
        if (data.key) {
          localStorage.clear();
          localStorage.setItem('token', data.key);
          window.location.replace('http://localhost:3000/#/MarketPlace');
        } else {
          setEmail('');
          setPassword('');
          localStorage.clear();
          setErrors(true);
        }
      });
  };

  return (
    <div>
      {errors === true && <h2>Cannot log in with provided credentials</h2>}
      {loading === false && (
            <div className="auth-page">
            <Container className="col-12">
              <Row className="d-flex align-items-center">
                <Col xs={12} lg={6} className="left-column">
                  <Widget className="widget-auth widget-p-lg">
                    <div className="d-flex align-items-center justify-content-between py-3">
                      <p className="auth-header mb-0">Login</p>
                      <div className="logo-block">
                        <SofiaLogo />
                        <p className="mb-0">SOFIA</p>
                      </div>
                    </div>
                    <div className="auth-info my-2">
                      <p>This is a real dapp with django.py backend - use <b>"test@test.com / password"</b> to login! Or you can create your account through sign up form</p>
                    </div>
        <form onSubmit={onSubmit}>
          <FormGroup className="my-3">
          <FormText htmlFor='email'>Email address:</FormText> 
          <Input
            name='email'
            type='email'
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
          />
         </FormGroup>
         <FormGroup  className="my-3">
                  <div className="d-flex justify-content-between">
                    <FormText htmlFor="password">Password</FormText>
                    <Link to="#">Forgot password?</Link>
                  </div>
                  <Input
            name='password'
            type='password'
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
          /> 
           </FormGroup>
           <div className="bg-widget d-flex justify-content-center">
                  <Button className="rounded-pill my-3" type="submit" color="secondary-red" value='Login'>Login</Button>
                </div>
                <p className="dividing-line my-3">&#8195;Or&#8195;</p>
                <div className="d-flex align-items-center my-3">
                  <p className="social-label mb-0">Login with</p>
                  <div className="socials">
                    <a href="#"><GoogleIcon /></a>
                    <a href="#"><TwitterIcon /></a>
                    <a href="#"><FacebookIcon /></a>
                    <a href="#"><GithubIcon /></a>
                    <a href="#"><LinkedinIcon /></a>
                  </div>
                </div>
                <Link to="/Signup">Don’t have an account? Sign Up here</Link>
        </form>
        </Widget>
          </Col>
          <Col xs={0} lg={6} className="right-column">
            <div>
              <img src={loginImage} alt="Error page" />
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
      )}
    </div>
  );
};

export default Login;
