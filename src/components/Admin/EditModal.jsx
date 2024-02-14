import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, InputLabel, Select, MenuItem } from '@mui/material';
import useFetchCategories from '../../hooks/useFetchCategories';

const FieldsProducts = ({item, setItem, handleChange}) => {
  const [categories, setCategories] = useState([]);

  // Prepare Data
  useEffect(() => {
    console.log(item);
    const tmp = item;
    delete tmp.category_name;
    setItem(tmp);
  }, []);

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
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          name="name"
          value={item.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Hersteller"
          type="text"
          fullWidth
          variant="standard"
          name="manufacturer"
          value={item.manufacturer}
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
          label="Beschreibung"
          type="text"
          multiline
          fullWidth
          variant="standard"
          name="description"
          value={item.description}
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
          value={item.stock || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Rating"
          type="text"
          fullWidth
          variant="standard"
          name="rating"
          value={item.rating || ''}
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
      <DialogTitle>Edit Category</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          name="name"
          value={item.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Beschreibung"
          type="text"
          fullWidth
          variant="standard"
          name="description"
          value={item.description}
          onChange={handleChange}
        />
      </DialogContent>
    </>
  )
};

const EditModal = ({ open, handleClose, item, handleSave, type }) => {
  const [editedItem, setEditedItem] = useState(item);

  const handleChange = (e) => {
    setEditedItem({ ...editedItem, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {type == 'products' && (
        <FieldsProducts item={editedItem} setItem={setEditedItem} handleChange={handleChange} />
      )}
      {type == 'categories' && (
        <FieldsCategories item={editedItem} setItem={setEditedItem} handleChange={handleChange} />
      )}
      <DialogActions>
        <Button onClick={handleClose}>Abbrechen</Button>
        <Button onClick={() => handleSave(editedItem, type)}>Speichern</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;