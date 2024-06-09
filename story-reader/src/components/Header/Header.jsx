import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa'; 
import { AppBar, Toolbar, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Category, LogoButton, Searchbar, Setting } from '../../components';
import PropTypes from 'prop-types';

const Header = ({ selectedTheme, toggleTheme }) => {
  const [showContent, setShowContent] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 

  const handleIconClick = () => {
    setShowContent(!showContent);
  };

  return (
    <AppBar position="fixed" color="primary">
      {isMobile ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '5px'}}>
            <LogoButton/>
            <IconButton 
              onClick={handleIconClick}
              size="large"
              color="inherit"
              aria-label="option"
              aria-controls="option-menu"
              style={{ marginLeft: 'auto', marginRight: '10px'}}
            >
              <FaBars />
            </IconButton>
          </div>
          {showContent && (
            <div style={{ textAlign: 'left' }}>
              <div style={{flexGrow: 1, marginLeft: '10px' }}>
                <Category/>
              </div>
              <div style={{ flexGrow: 1, marginLeft: '10px' }}>
                <Setting selectedTheme={selectedTheme} toggleTheme={toggleTheme}/>
              </div>
              <div style={{ flexGrow: 1, marginLeft: '10px' }}>
                <Searchbar/>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Toolbar>
          <div style={{ flexGrow: 1 }}>
            <LogoButton/>
          </div>
          <div style={{ flexGrow: 1 }}>
            <Category/>
          </div>
          <div style={{ flexGrow: 1 }}>
            <Searchbar/>
          </div>
          <div style={{ flexGrow: 1}}>
            <Setting selectedTheme={selectedTheme} toggleTheme={toggleTheme}/>
          </div>
        </Toolbar>
      )}
    </AppBar>
  );
};

Header.propTypes = {
  selectedTheme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Header;
