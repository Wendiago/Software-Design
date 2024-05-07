import React from 'react';
import logo from '../../logo.svg'; // Import your logo file
import { FaCog, FaList, FaCaretDown , FaSearch } from 'react-icons/fa'; // Import the setting icon from react-icons library

const Searchbar = () => {
    return (
        <header style={headerStyle}>
            <div style={logoContainerStyle}>
                <img src={logo} style={logoStyle} alt="logo" />
            </div>
            <div style={flexContainerStyle}>
                <div style={categoryStyle}>
                    <FaList />
                    <span style={categoryTextStyle}>Thể loại</span>
                    <FaCaretDown  />
                </div>
            </div>
            <div style={flexContainerStyle}>
                <div style={searchContainerStyle}>
                    <input type="text" placeholder="Tìm kiếm..." style={searchInputStyle} />
                    <FaSearch />
                </div>
            </div>
            <div style={flexContainerStyle}>
                <div style={categoryStyle}>
                    <FaCog />
                    <span style={categoryTextStyle}>Tùy chỉnh</span>
                    <FaCaretDown  />
                </div>
            </div>
        </header>
    );
}

export default Searchbar;

// Styles
const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: 'white',
};

const logoContainerStyle = {
    marginRight: '10px',
};

const logoStyle = {
    height: '30px', // Adjust the height as needed
};

const flexContainerStyle = {
    display: 'flex',
    alignItems: 'center',
};

const categoryStyle = {
    margin: '0 10px',
    display: 'flex',
    alignItems: 'center',
    color: 'white',
};

const categoryTextStyle = {
    marginLeft: '5px',
};

const searchContainerStyle = {
    margin: '0 10px',
    display: 'flex',
    alignItems: 'center',
    color: 'white',
};

const searchInputStyle = {
    padding: '5px',
    borderRadius: '5px',
    border: 'none',
    marginRight: '5px',
};
