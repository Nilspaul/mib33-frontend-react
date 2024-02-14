import React, { useState, useContext, useEffect, useLayoutEffect } from 'react';
import { AppBar, Box, Button, Container, Grid, Stack, Table, TableBody, TableCell, Toolbar, Typography } from '@mui/material';

import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import EditModal from '../components/Admin/EditModal';
import Cookies from 'universal-cookie';
import AddModal from '../components/Admin/AddModal';
import AppProvider from '../AppProvider';
import AppContext from '../AppContext';
import { useLocalStorage } from '../hooks/useStorage';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/format';
import { truncate } from '../utils/string';
import Truncate from '../components/ui/Truncate';

const cookies = new Cookies();

const API_URL = import.meta.env.VITE_API_URL;

const AdminHeader = ({title}) => {
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

const AdminContent = () => {
  const { loggedInUser, setLoggedInUser } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('products');
  const [data, setData] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const navigate = useNavigate();

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setOpenEditModal(true);
  };

  // Check User-Role
  useEffect(() => {
    if(!loggedInUser || !loggedInUser.role || loggedInUser.role != 2) {
      return navigate("/account/login");
    }
    // TODO: Über API-Request prüfen ob der Nutzer wirklich die Berechtigung hat
  }, [loggedInUser]);


  const handleAddClick = () => {
    setOpenAddModal(true);
  };

  const handleCloseModal = () => {
    setOpenEditModal(false);
    setOpenAddModal(false);
    setCurrentItem(null);
  };

  const handleUpdate = async (editedItem, type) => {
    try {
      const response = await fetch(`${API_URL}/v1/${type}/${editedItem.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedItem),
      });
      if (response.ok) {
        // Aktualisieren Sie hier Ihre Datenliste
        handleCloseModal();
        setActiveTab('');
        setTimeout(() => {
          setActiveTab(type);
        }, 20);
      } else {
        console.error('Fehler beim Speichern der Daten');
      }
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  const handleCreate = async (newItem, type) => {
    console.log("handleCreate", newItem);
    try {
      const response = await fetch(`${API_URL}/v1/${type}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        // Aktualisieren Sie hier Ihre Datenliste
        handleCloseModal();
        setActiveTab('');
        setTimeout(() => {
          setActiveTab(type);
        }, 20);
      } else {
        console.error('Fehler beim Speichern der Daten');
      }
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  // Fetch Data on Tab-Switch
  useEffect(() => {
    const fetchData = async () => {
      let url = '';
      switch (activeTab) {
        case 'products':
          url = `${API_URL}/v1/products`;
          break;
        case 'categories':
          url = `${API_URL}/v1/categories?include=order&sort=order`; // URL für Kategorien
          break;
        // Fügen Sie hier weitere Fälle für andere Tabs hinzu
        default:
          return;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        if(data.data) {
          setData(data.data);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <div className="fullpage">
      <div className="dashboard">
        <AdminHeader title='Admin' />
        <Container maxWidth={'xl'}>
          <Box py={4}>
            <div className="tabs">
              <Stack spacing={2} direction="row" justifyContent='center'>
                <Button variant={`${activeTab == 'products' ? 'contained' : 'outlined'}`} onClick={() => setActiveTab('products')}>Produkte</Button>
                <Button variant={`${activeTab == 'categories' ? 'contained' : 'outlined'}`} onClick={() => setActiveTab('categories')}>Kategorien</Button>
              </Stack>
            </div>
            <div className="content">
              {activeTab === 'products' && (
                <>
                  <Stack py={2} direction="row" justifyContent={'space-between'}>
                    <Typography variant="h6" align="center" component="div">Products</Typography>
                    <Button variant="contained" onClick={() => handleAddClick()}>Add Product</Button>
                  </Stack>
                  
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Kategorie</TableCell>
                          <TableCell>Hersteller</TableCell>
                          <TableCell>Beschreibung</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Stock</TableCell>
                          <TableCell>Rating</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((item) => (
                          <TableRow
                            key={item.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              <Truncate text={item.id} max={10} />
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.category_name}</TableCell>
                            <TableCell>{item.manufacturer}</TableCell>
                            <TableCell>
                              <Truncate text={item.description} max={50} />
                            </TableCell>
                            <TableCell>{formatPrice(item.price)}</TableCell>
                            <TableCell>{item.stock}</TableCell>
                            <TableCell>{item.rating}</TableCell>
                            <TableCell>
                              <Button onClick={() => handleEditClick(item)}>Edit</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>

              )}
              {activeTab === 'categories' && (
                <>
                  <Stack py={2} direction="row" justifyContent={'space-between'}>
                    <Typography variant="h6" align="center" component="div">Categories</Typography>
                    <Button variant="contained" onClick={() => handleAddClick()}>Add Categorie</Button>
                  </Stack>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Beschreibung</TableCell>
                          <TableCell>Order</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((item) => (
                          <TableRow
                            key={item.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              <Truncate text={item.id} max={10} />
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                              <Truncate text={item.description} max={50} />
                            </TableCell>
                            <TableCell>{item.order}</TableCell>
                            <TableCell>
                              <Button onClick={() => handleEditClick(item)}>Edit</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>

              )}
            </div>
          </Box>

        </Container>

      </div>
      {currentItem && (
        <EditModal
          open={openEditModal}
          handleClose={handleCloseModal}
          item={currentItem}
          type={activeTab}
          handleSave={handleUpdate}
        />
      )}
      <AddModal
        open={openAddModal}
        handleClose={handleCloseModal}
        item={currentItem}
        type={activeTab}
        handleSave={handleCreate}
      />
    </div>
  );
};

const Admin = () => {
  return (
    <AppProvider>
      <AdminContent />
    </AppProvider>
  );
};

export default Admin;