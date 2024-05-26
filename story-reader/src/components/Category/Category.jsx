import React, { useState, useEffect } from 'react';
import { IconButton, useMediaQuery, useTheme, Menu, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaList, FaCaretDown } from 'react-icons/fa';
import { normalizeString } from '../../utils/stringUtils';

const Category = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
    const [category, setCategory] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [showCategory, setShowCategory] = useState(false);

    const handleCategory = (categoryName) => {
        navigate(`/the-loai/${normalizeString(categoryName)}`);
        setShowCategory(false);
        setAnchorEl(false);
    }

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

    // useEffect(() => {
    //     fetch('https://reqres.in/api/users')
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             setCategory(data.data);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data:', error);
    //         });
    // }, []);
    
    useEffect(() => {
        const data = [
            'Tiên Hiệp',  
            'Kiếm Hiệp', 
            'Ngôn Tình', 
            'Đam Mỹ',
            'Quan Trường', 
            'Võng Du',
            'Khoa Huyễn', 
            'Hệ Thống',
            'Huyền Huyễn',
            'Dị Giới',
            'Dị Năng',
            'Quân Sự',
            'Lịch Sử',
            'Xuyên Không',
            'Xuyên Nhanh',
            'Trọng Sinh',
            'Trinh Thám',
            'Thám Hiểm',
            'Linh Dị',
            'Ngược',
            'Sủng',
            'Cung Đấu',
            'Nữ Cường',
            'Gia Đấu',
            'Đông Phương',
            'Đô Thị',
            'Bách Hợp',
            'Hài Hước',
            'Điền Văn',
            'Cổ Đại',
            'Mạt Thế',
            'Truyện Teen',
            'Phương Tây',
            'Nữ Phụ',
            'Light Novel',
            'Việt Nam',
            'Đoản Văn',
            'Khác',
        ]
        setCategory(data);
    }, []);

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
                                {category?.map((cat, index) => (
                                    index % 4 === 0 && (
                                        <TableRow key={index}>
                                            <TableCell style={{color: 'white', cursor: 'pointer'}} onClick={() => handleCategory(cat)}>{cat}</TableCell>
                                            {category[index + 1] && <TableCell style={{color: 'white', cursor: 'pointer'}} onClick={() => handleCategory(category[index + 1])}>{category[index + 1]}</TableCell>}
                                            {category[index + 2] && <TableCell style={{color: 'white', cursor: 'pointer'}} onClick={() => handleCategory(category[index + 2])}>{category[index + 2]}</TableCell>}
                                            {category[index + 3] && <TableCell style={{color: 'white', cursor: 'pointer'}} onClick={() => handleCategory(category[index + 3])}>{category[index + 3]}</TableCell>}
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
                            {category?.map((cat, index) => (
                                index % 4 === 0 && (
                                    <TableRow key={index}>
                                        <TableCell style={{ cursor: 'pointer'}} onClick={() => handleCategory(cat)}>{cat}</TableCell>
                                        {category[index + 1] && <TableCell style={{ cursor: 'pointer'}} onClick={() => handleCategory(category[index + 1])}>{category[index + 1]}</TableCell>}
                                        {category[index + 2] && <TableCell style={{ cursor: 'pointer'}} onClick={() => handleCategory(category[index + 2])}>{category[index + 2]}</TableCell>}
                                        {category[index + 3] && <TableCell style={{ cursor: 'pointer'}} onClick={() => handleCategory(category[index + 3])}>{category[index + 3]}</TableCell>}
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
}

export default Category;
