import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (searchValue.trim() !== '') {
      navigate(`/tim-kiem/${searchValue.trim()}`);
    }
  };

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };
    
  return (
    <table style={{ width: '90%' }}>
      <tbody>
        <tr>
          <td style={{ paddingRight: '5px' }}>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              style={{ padding: '5px', borderRadius: '5px', border: 'none', width: '95%' }}
              onChange={handleInputChange}
            />
          </td>
          <td>
            <IconButton
              size="small"
              edge="start"
              color="inherit"
              aria-label="search"
              onClick={handleSearch}
            >
              <FaSearch />
            </IconButton>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default SearchBar;
