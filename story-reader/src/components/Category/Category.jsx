import React, { useState, useEffect } from 'react';
import { IconButton, useMediaQuery, useTheme, Menu, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaList, FaCaretDown } from 'react-icons/fa';

const Category = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
    const [category, setCategory] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [showCategory, setShowCategory] = useState(false);

    const handleCategory = (categoryId) => {
        navigate(`/the-loai/${categoryId}`);
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
            { name: 'Tiên Hiệp', id: 'tien-hiep' },
            { name: 'Kiếm Hiệp', id: 'kiem-hiep' },
            { name: 'Ngôn Tình', id: 'ngon-tinh' },
            { name: 'Đam Mỹ', id: 'dam-my' },
            { name: 'Quan Trường', id: 'quan-truong' },
            { name: 'Võng Du', id: 'vong-du' },
            { name: 'Khoa Huyễn', id: 'khoa-huyen' },
            { name: 'Hệ Thống', id: 'he-thong' },
            { name: 'Huyền Huyễn', id: 'huyen-huyen' },
            { name: 'Dị Giới', id: 'di-gioi' },
            { name: 'Dị Năng', id: 'di-nang' },
            { name: 'Quân Sự', id: 'quan-su' },
            { name: 'Lịch Sử', id: 'lich-su' },
            { name: 'Xuyên Không', id: 'xuyen-khong' },
            { name: 'Xuyên Nhanh', id: 'xuyen-nhanh' },
            { name: 'Trọng Sinh', id: 'trong-sinh' },
            { name: 'Trinh Thám', id: 'trinh-tham' },
            { name: 'Thám Hiểm', id: 'tham-hiem' },
            { name: 'Linh Dị', id: 'linh-di' },
            { name: 'Ngược', id: 'nguoc' },
            { name: 'Sủng', id: 'sung' },
            { name: 'Cung Đấu', id: 'cung-dau' },
            { name: 'Nữ Cường', id: 'nu-cuong' },
            { name: 'Gia Đấu', id: 'gia-dau' },
            { name: 'Đông Phương', id: 'dong-phuong' },
            { name: 'Đô Thị', id: 'do-thi' },
            { name: 'Bách Hợp', id: 'bach-hop' },
            { name: 'Hài Hước', id: 'hai-huoc' },
            { name: 'Điền Văn', id: 'dien-van' },
            { name: 'Cổ Đại', id: 'co-dai' },
            { name: 'Mạt Thế', id: 'mat-the' },
            { name: 'Truyện Teen', id: 'truyen-teen' },
            { name: 'Phương Tây', id: 'phuong-tay' },
            { name: 'Nữ Phụ', id: 'nu-phu' },
            { name: 'Light Novel', id: 'light-novel' },
            { name: 'Việt Nam', id: 'viet-nam' },
            { name: 'Đoản Văn', id: 'doan-van' },
            { name: 'Khác', id: 'khac' }
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
                                {category.map((cat, index) => (
                                    index % 4 === 0 && (
                                        <TableRow key={index}>
                                            <TableCell style={{color: 'white', cursor: 'pointer'}} onClick={() => handleCategory(cat.id)}>{cat.name}</TableCell>
                                            {category[index + 1] && <TableCell style={{color: 'white', cursor: 'pointer'}} onClick={() => handleCategory(category[index + 1].id)}>{category[index + 1].name}</TableCell>}
                                            {category[index + 2] && <TableCell style={{color: 'white', cursor: 'pointer'}} onClick={() => handleCategory(category[index + 2].id)}>{category[index + 2].name}</TableCell>}
                                            {category[index + 3] && <TableCell style={{color: 'white', cursor: 'pointer'}} onClick={() => handleCategory(category[index + 3].id)}>{category[index + 3].name}</TableCell>}
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
                            {category.map((cat, index) => (
                                index % 4 === 0 && (
                                    <TableRow key={index}>
                                        <TableCell style={{ cursor: 'pointer' }} onClick={() => handleCategory(cat.id)}>{cat.name}</TableCell>
                                        {category[index + 1] && <TableCell style={{ cursor: 'pointer' }} onClick={() => handleCategory(category[index + 1].id)}>{category[index + 1].name}</TableCell>}
                                        {category[index + 2] && <TableCell style={{ cursor: 'pointer' }} onClick={() => handleCategory(category[index + 2].id)}>{category[index + 2].name}</TableCell>}
                                        {category[index + 3] && <TableCell style={{ cursor: 'pointer' }} onClick={() => handleCategory(category[index + 3].id)}>{category[index + 3].name}</TableCell>}
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
