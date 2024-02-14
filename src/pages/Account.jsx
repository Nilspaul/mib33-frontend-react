import React, { useState, useContext, useEffect, useLayoutEffect } from 'react';
import { Alert, AppBar, Box, Button, Container, Grid, Stack, Table, TableBody, TableCell, TextField, Toolbar, Typography } from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import Cookies from 'universal-cookie';
import AppProvider from '../AppProvider';
import AppContext from '../AppContext';
import { useLocalStorage } from '../hooks/useStorage';

const cookies = new Cookies();
const API_URL = import.meta.env.VITE_API_URL;

const RenderLogin = ({title, loggedInUser, setLoggedInUser}) => {
  let location = useLocation();

  const [alert, setAlert] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if(loggedInUser) {
      navigate("/account");
    }
  }, [loggedInUser]);


  useEffect(() => {
    if(location.state) {
      if(location.state.account == 'created') {
        setAlert('Account created. You can now log in!');
      }
    }
    console.log("state", location.state);
  },[location]);

  const handleLogin = async () => {
    try {
      await fetch(`${API_URL}/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }).then((res) => {
        return res.json()
      }).then((res) => {
        if(res.userId) {
          const userdata = {
            id: res.userId,
            role: res.roleId,
            name: res.name,
            email: res.email
          }
          setLoggedInUser(userdata);
        }
        cookies.set('jwt-token', res.token, { path: '/', sameSite: true });
      });
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  const handleBtnRegister = () => {
    navigate("/account/register");
  }

  return (
    <>
      
      {alert && (
        <Box pb={4}>
          <Alert severity="success">{alert}</Alert>
        </Box>
      )}
      <Typography variant="h4" align="center"  component="div" sx={{ flexGrow: 1 }}>{title}</Typography>
      <div className='form-login'>
        <TextField
          margin="dense"
          label="E-Mail"
          type="text"
          fullWidth
          variant="standard"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          variant="standard"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" fullWidth onClick={handleLogin}>Login</Button>
      </div>
      <Box py={3}>
        <Button variant="outlined" fullWidth onClick={handleBtnRegister}>No account? Register now!</Button>
      </Box>
    </>
  )
};

const RenderLogout = ({title, loggedInUser, setLoggedInUser}) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log(loggedInUser);
    if(!loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser]);

  const handleLogout = () => {
    console.log("clicked");
    try {
      setLoggedInUser(null);
      cookies.set('jwt-token', '', { path: '/', sameSite: true });
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  return (
    <>
      <Typography variant="h4" align="center" component="div" sx={{ flexGrow: 1 }}>{title}</Typography>
      <div className='form-login'>
        <Box py={4}>
          <Button variant="contained" fullWidth onClick={handleLogout}>Please, let me go!</Button>
        </Box>
      </div>
    </>
  )
};

const RenderRegister = ({title, loggedInUser, setLoggedInUser}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const navigate = useNavigate();


  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_URL}/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        if(data) {
          throw new Error(data.error);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      const data = await response.json();
      if(data) {
        navigate('/account/login', { state: { account: "created" } });
        return res.json();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Typography variant="h4" align="center"  component="div" sx={{ flexGrow: 1 }}>{title}</Typography>
      <div className='form-login'>
        {error && (
          <Box py={4}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <TextField
          margin="dense"
          label="E-Mail"
          type="text"
          fullWidth
          variant="standard"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Your Name"
          type="text"
          fullWidth
          variant="standard"
          name="name"
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          variant="standard"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" fullWidth onClick={handleRegister}>Register</Button>
      </div>
    </>
  )
};

const AccountHeader = ({title, navItems}) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container>
          <Grid item xs={3}>
          <Button variant="outlined" color="inherit" startIcon={<ArrowBackIosIcon />} href="/">Back</Button>
          </Grid>
          <Grid item xs={6}>
          <Typography variant="h6" align="center" component="div" sx={{ flexGrow: 1 }}>{title}</Typography>
          </Grid>
          <Grid item xs={3}>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

const AccountContent = ({action}) => {
  const { loggedInUser, setLoggedInUser } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="fullpage">
      <div className="account">
        <AccountHeader title={`${loggedInUser ? 'Your Account' : 'Account'}`} />
        <Container maxWidth="sm">
          <Box py={10}>
            {!action && (
              <>
                <Typography variant="h4" align="center" component="div" sx={{ flexGrow: 1 }}>Hello {loggedInUser?.name || 'Stranger'}!</Typography>
                <Stack py={4} spacing={2} direction="row" justifyContent="center">
                  {!loggedInUser && (
                    <Button variant="contained" onClick={() => navigate("/account/login")}>Login</Button>
                  )}
                  {loggedInUser && (
                    <>
                      {loggedInUser.role === 2 && (
                        <Button variant="contained" startIcon={<AdminPanelSettingsIcon />} onClick={() => navigate("/admin")}>Admin</Button>
                      )}
                      <Button variant="contained" onClick={() => navigate("/account/logout")}>Logout</Button>
                    </>
                  )}
                </Stack>
              </>
            )}
            {action == 'login' && (
              <RenderLogin title={'Login'} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
            )}
            {action == 'register' && (
              <RenderRegister title={'Register'} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
            )}
            {action == 'logout' && (
              <RenderLogout title={'Logout'} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
            )}
          </Box>
        </Container>
      </div>
    </div>
  );
};

const Account = ({action}) => {
  return (
    <AppProvider>
      <AccountContent action={action} />
    </AppProvider>
  );
};

export default Account;