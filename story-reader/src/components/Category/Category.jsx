import React, { useState } from 'react';
import { IconButton, useMediaQuery, useTheme, Menu, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaList, FaCaretDown } from 'react-icons/fa';
import { normalizeString } from '../../utils/stringUtils';
import { useAllCategories } from '../../hooks/categoryHook';

const Category = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
  const [anchorEl, setAnchorEl] = useState(null);
  const [showCategory, setShowCategory] = useState(false);
  const { categories } = useAllCategories();
  const capitalizedCategories = categories?.data?.categories;

  const handleCategory = (categoryName) => {
    navigate(`/the-loai/${normalizeString(categoryName)}`);
    setShowCategory(false);
    setAnchorEl(false);
  };

  const handleCategoryClick = (event) => {
    setAnchorEl(event.currentTarget);
    setShowCategory(true);
  };

  const handleCategoryClose = () => {
    setAnchorEl(null);
    setShowCategory(false);
  };

  const handleCategoryMobileClick = () => {
    setAnchorEl(null);
    setShowCategory(!showCategory);
  };

  return (
    <div>
      {isMobile ? (
        <div>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="menu"
            aria-controls="category-menu"
            aria-haspopup="true"
            onClick={handleCategoryMobileClick}
          >
            <FaList />
            <span style={{ marginRight: '5px', marginLeft: '5px' }}>Thể loại</span>
            <FaCaretDown/>
          </IconButton>
          {showCategory && (
            <div id="category-menu" style={{ visibility: 'visible'}}>
              <Table>
                <TableBody>
                  {capitalizedCategories?.map((cat, index) => (
                    index % 4 === 0 && (
                      <TableRow key={index}>
                        <TableCell style={{color: 'white', cursor: 'pointer'}} onClick={() => handleCategory(cat)}>{cat}</TableCell>
                        {capitalizedCategories[index + 1] && <TableCell style={{color: 'white', cursor: 'pointer'}} onClick={() => handleCategory(capitalizedCategories[index + 1])}>{capitalizedCategories[index + 1]}</TableCell>}
                        {capitalizedCategories[index + 2] && <TableCell style={{color: 'white', cursor: 'pointer'}} onClick={() => handleCategory(capitalizedCategories[index + 2])}>{capitalizedCategories[index + 2]}</TableCell>}
                        {capitalizedCategories[index + 3] && <TableCell style={{color: 'white', cursor: 'pointer'}} onClick={() => handleCategory(capitalizedCategories[index + 3])}>{capitalizedCategories[index + 3]}</TableCell>}
                      </TableRow>
                    )
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      ) : (
        <div>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="menu"
            aria-controls="category-menu"
            aria-haspopup="true"
            onClick={handleCategoryClick}
          >
            <FaList />
            <span style={{ marginRight: '5px', marginLeft: '5px' }}>Thể loại</span>
            <FaCaretDown />
          </IconButton>
          <Menu
            id="category-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCategoryClose}
            slotProps={{
              paper: {
                style: {
                  background: theme.palette.background.default
                }
              }
            }}
          >
            <Table>
              <TableBody>
                {capitalizedCategories?.map((cat, index) => (
                  index % 4 === 0 && (
                    <TableRow key={index}>
                      <TableCell style={{ cursor: 'pointer'}} onClick={() => handleCategory(cat)}>{cat}</TableCell>
                      {capitalizedCategories[index + 1] && <TableCell style={{ cursor: 'pointer'}} onClick={() => handleCategory(capitalizedCategories[index + 1])}>{capitalizedCategories[index + 1]}</TableCell>}
                      {capitalizedCategories[index + 2] && <TableCell style={{ cursor: 'pointer'}} onClick={() => handleCategory(capitalizedCategories[index + 2])}>{capitalizedCategories[index + 2]}</TableCell>}
                      {capitalizedCategories[index + 3] && <TableCell style={{ cursor: 'pointer'}} onClick={() => handleCategory(capitalizedCategories[index + 3])}>{capitalizedCategories[index + 3]}</TableCell>}
                    </TableRow>
                  )
                ))}
              </TableBody>
            </Table>
          </Menu>
        </div>
      )}
    </div>
  );
};

export default Category;
