import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel } from '@mui/material';
import useFetchCategories from '../../hooks/useFetchCategories';

const FieldsProducts = ({item, handleChange}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      let response = await useFetchCategories();
      if(response.data) {
        setCategories(response.data);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          name="name"
          value={item.name || ''}
          onChange={handleChange}
        />
        <InputLabel id="category">Kategorie</InputLabel>
        <Select
          labelId="category"
          label="Kategorie"
          fullWidth
          variant="standard"
          name="category_id"
          value={item.category_id || ''}
          onChange={handleChange}
        >
          {categories.map((category, index) => (
            <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
          ))}
        </Select>
        <TextField
          margin="dense"
          label="Hersteller"
          type="text"
          fullWidth
          variant="standard"
          name="manufacturer"
          value={item.manufacturer || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          multiline
          label="Beschreibung"
          type="text"
          fullWidth
          variant="standard"
          name="description"
          value={item.description || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Preis"
          type="text"
          fullWidth
          variant="standard"
          name="price"
          value={item.price || 0.0}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Stock"
          type="text"
          fullWidth
          variant="standard"
          name="stock"
          value={item.stock || 0}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Rating"
          type="text"
          fullWidth
          variant="standard"
          name="rating"
          value={item.rating || 0}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Image-Url"
          type="text"
          fullWidth
          variant="standard"
          name="image_url"
          value={item.image_url || ''}
          onChange={handleChange}
        />
      </DialogContent>
    </>
  )
};

const FieldsCategories = ({item, handleChange}) => {
  return (
    <>
      <DialogTitle>Add Category</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          name="name"
          value={item.name || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Beschreibung"
          type="text"
          fullWidth
          variant="standard"
          name="description"
          value={item.description || ''}
          onChange={handleChange}
        />
      </DialogContent>
    </>
  )
};

const AddModal = ({ open, handleClose, handleSave, type }) => {
  const [newItem, setNewItem] = useState({});

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
    console.log(newItem);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {type == 'products' && (
        <FieldsProducts item={newItem} handleChange={handleChange} />
      )}
      {type == 'categories' && (
        <FieldsCategories item={newItem} handleChange={handleChange} />
      )}
      <DialogActions>
        <Button onClick={handleClose}>Abbrechen</Button>
        <Button onClick={() => handleSave(newItem, type)}>Speichern</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddModal;