import React from 'react';
import logo from '../../logo.svg';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LogoButton = () => {
  const navigate = useNavigate();

  const moveHome = () => {
    navigate('/trang-chu');
  };

  return (
    <Button onClick={moveHome}>
      <img src={logo} alt="logo" style={{ marginRight: '10px', height: '30px' }} />
    </Button>
  );
};

export default LogoButton;
