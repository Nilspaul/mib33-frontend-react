import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../AppContext';

import './style.scss';
import { useLocalStorage } from '../../hooks/useStorage';
import { formatPrice } from '../../utils/format';

import CountUp from 'react-countup';
import { nl2br } from '../../utils/string';
import { AppBar, Box, Button, Stack, Toolbar, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';


const SummaryHeader = ({title, navItems}) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>{title}</Typography>

        <Stack spacing={4} direction="row">
          {navItems.map((item, index) => (
            item.path && (
              <Button key={item.path} color="inherit" startIcon={item.icon} href={item.path}>{item.name}</Button>
            )
          ))}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}


const calcPrice = (items, price, setPrice, setPreviousPrice) => {
  if (items) {
    let total = 0;
    items.forEach((item) => {
      total += item.price;
    });
    setPreviousPrice(price);
    setPrice(total);
  }
}

const calcTotalPrice = (partsPrice, totalShippingPrice, totalPrice, setPrice, setPreviousPrice) => {
  let total = partsPrice + totalShippingPrice;
  setPreviousPrice(totalPrice);
  setPrice(total);
}

const calcShipping = (items, totalShippingPrice, setTotalShippingPrice, setPreviousTotalShipping) => {
  if (items) {
    let total = 0;
    let weight = 0;
    items.forEach((item) => {
      const specs = JSON.parse(item.specifications);
      console.log(specs.weight);
      weight += (specs.weight || 0);
    });
    if(weight > 0 && weight <= 10) total = 4.99
    if(weight > 10) total = 24.99
    if(weight > 50) total = 32.99
    if(weight > 100) total = 100

    setPreviousTotalShipping(totalShippingPrice);
    setTotalShippingPrice(total);
  }
}

const Summary = () => {
  const { activeStep, activeStepInfo, loggedInUser, basketItems, setBasketItems } = useContext(AppContext);
  const [info, setInfo] = useState(null);

  const [partsPrice, setPartsPrice] = useState(null);
  const [previousPartsPrice, setPreviousPartsPrice] = useState(0);

  const [totalPrice, setTotalPrice] = useState(null);
  const [previousTotal, setPreviousTotal] = useState(0);

  const [totalShippingPrice, setTotalShippingPrice] = useState(null);
  const [previousTotalShipping, setPreviousTotalShipping] = useState(0);

  const [items, setItems] = useState([]);

  const navItems = [
    {
      name: loggedInUser ? `Hey ${loggedInUser?.name || 'Stanger'}` : 'Login',
      path: loggedInUser ? '/account' : '/account/login',
      icon: <AccountCircleIcon />
    },
    {
      name: 'Admin',
      path: (loggedInUser?.role == 2 ? '/admin' : null),
      icon: <AdminPanelSettingsIcon />
    }
  ];

  // Fetch Products and setItems
  useEffect(() => {
    if (basketItems) {
      const ids = basketItems.map(item => item.id);
      const fetchProducts = async (ids) => {
        if(!ids) {
          setItems([]);
          return false;
        }
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/products/?ids=${ids}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if(data) {
            setItems(data.data);
          }
        } catch (e) {
          return false;
        }
      }
      fetchProducts(ids.toString());
    }
  }, [basketItems]);

  // Calculate Total Price
  useEffect(() => {
    calcTotalPrice(partsPrice, totalShippingPrice, totalPrice, setTotalPrice, setPreviousTotal);
  }, [partsPrice, totalShippingPrice]);

  // Calculate Parts-Price
  useEffect(() => {
    calcPrice(items, partsPrice, setPartsPrice, setPreviousPartsPrice);
  }, [items]);

  // Calculate Shipping-Price
  useEffect(() => {
    calcShipping(items, totalShippingPrice, setTotalShippingPrice, setPreviousTotalShipping);
  }, [items]);
  
  // Update Header-Infos
  useEffect(() => {
    if(activeStepInfo && activeStepInfo.name) {
      setInfo(activeStepInfo);
    }
  }, [activeStepInfo]);

  return (
    <div className="summary">
      <SummaryHeader navItems={navItems} title={'Your PC'} />

      <div className="content">
        <div className="info">
          {/* TODO: Wenn Bilder vorhanden entweder auf slug oder image_url gehen  */}
          {info?.slug && ( // erstmal als Slug
            <div className="image">
              <img src={`/assets/images/${info?.slug}.png`} />
            </div>
          )}
          <div className="description">
            <h3 className="headline">{info?.name}</h3>
            <p>{nl2br(info?.description)}</p>
          </div>
        </div>
      </div>

      <hr />
      {/* Dummy-Liste zur Kontrolle */}
      <div className="pricelist">
        <ul>
          {items.map((item, i) => (
            <li key={i} className="name">{item.name} - {formatPrice(item.price)}</li>
          ))}
        </ul>
      </div>
      <div className="price-overview">
        <div className="item">
          <div className="label">Shipping</div>
          <div className="value" title={formatPrice(totalShippingPrice)}><CountUp start={previousTotalShipping} end={totalShippingPrice} duration={0.5} separator="." decimals={2} decimal=","/> €</div>
        </div>
        <div className="item">
          <div className="label">Parts</div>
          <div className="value" title={formatPrice(partsPrice)}><CountUp start={previousPartsPrice} end={partsPrice} duration={0.5} separator="." decimals={2} decimal=","/> €</div>
        </div>
        <div className="item total">
          <div className="label">Total Price</div>
          <div className="value" title={formatPrice(totalPrice)}><CountUp start={previousTotal} end={totalPrice} duration={0.5} separator="." decimals={2} decimal=","/> €</div>
        </div>
        <div className="actions">
          <Button variant='contained' className='btn'><FavoriteBorderIcon /></Button>
          <Button variant='contained' className='btn'>Buy now</Button>
        </div>
      </div>
    </div>
  );
};

export default Summary;