import React, { useState, useEffect } from 'react';
import logo from '../../logo.svg'; // Import your logo file
import { FaCog, FaList, FaCaretDown, FaSearch, FaBars, FaPlus, FaMinus } from 'react-icons/fa'; // Import the setting icon from react-icons library
import { AppBar, Toolbar, IconButton, Button, Menu, MenuItem, Switch, useMediaQuery, useTheme, Table, TableBody, TableCell, TableRow } from '@mui/material'; // Import Material-UI components
import { useNavigate } from 'react-router-dom';

const Header = ({ selectedTheme, toggleTheme }) => {
    const [category, setCategory] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorE2, setAnchorE2] = useState(null);
    const [showContent, setShowContent] = useState(false);
    const [showCategory, setShowCategory] = useState(false);
    const [showSetting, setShowSetting] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    const moveHome = () => {
        navigate(`/trang-chu`);
    };

    const handleCategory = (categoryId) => {
        navigate(`/the-loai/${categoryId}`);
        setShowCategory(false);
        setAnchorEl(false);
    }

    const handleSearch = () => {
        if (searchValue.trim() !== '') {
            navigate(`/tim-kiem/${searchValue.trim()}`);
        }
    };

    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
    };

    const theme = useTheme();
    const [fontSize, setFontSize] = useState(theme.typography.fontSize);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 

    const handleCategoryClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCategoryClose = () => {
        setAnchorEl(null);
    };

    const handleSettingClick = (event) => {
        setAnchorE2(event.currentTarget);
    };

    const handleSettingClose = () => {
        setAnchorE2(null);
    };

    const handleIconClick = () => {
        setShowContent(!showContent);
    };

    const handleCategoryMobileClick = () => {
        setShowCategory(!showCategory);
    };

    const handleSettingMobileClick = () => {
        setShowSetting(!showSetting);
    };

    useEffect(() => {
        const storedFontSize = localStorage.getItem('fontSize');
        const baseFontSize = 16;
        const initialFontSize = storedFontSize ? parseInt(storedFontSize) : baseFontSize;
    
        const root = document.documentElement;
        root.style.fontSize = `${initialFontSize}px`;
        setFontSize(initialFontSize);
    }, []);

    const adjustTextSize = (action) => {
        const root = document.documentElement;
    
        let newFontSize = fontSize;
        if (action === 'increase') {
            newFontSize += 1;
        } else if (action === 'decrease') {
            newFontSize -= 1;
        }
    
        root.style.fontSize = `${newFontSize}px`;
        setFontSize(newFontSize);
    
        localStorage.setItem('fontSize', newFontSize);
        console.log(newFontSize)
    };

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

    return (
        <AppBar position="static" color="primary">
                {isMobile ? (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', padding: '5px'}}>
                        <Button onClick={moveHome}>
                            <img src={logo} alt="logo" style={{ marginRight: '10px', height: '30px'}} />
                        </Button>
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
                            <div style={{ flexGrow: 1, marginLeft: '10px' }}>
                                <IconButton
                                    size="small"
                                    edge="end"
                                    color="inherit"
                                    aria-label="settings"
                                    aria-haspopup="true"
                                    onClick={handleSettingMobileClick}
                                >
                                    <FaCog />
                                    <span style={{ marginRight: '5px', marginLeft: '5px' }}>Thiết lập</span>
                                    <FaCaretDown/>
                                </IconButton>
                                {showSetting && (
                                    <div id="setting-menu" style={{ visibility: 'visible', marginLeft: '20px' }}>
                                        <Toolbar>
                                            <span>Cỡ chữ:</span>
                                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                                <IconButton size="small" style={{background: 'white', marginRight: '3px'}} onClick={() => adjustTextSize('decrease')}>
                                                    <FaMinus />
                                                </IconButton>
                                                {fontSize}
                                                <IconButton size="small" style={{background: 'white', marginLeft: '3px'}} onClick={() => adjustTextSize('increase')}>
                                                    <FaPlus />
                                                </IconButton>
                                            </div>
                                        </Toolbar>
                                        <Toolbar>
                                            <span>Chủ đề:</span>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{ marginRight: '5px', marginLeft: '5px' }}>Sáng</span>
                                                <Switch 
                                                    checked={selectedTheme === 'light'}
                                                    onChange={() => toggleTheme('light')} 
                                                />
                                                <span style={{ marginRight: '5px', marginLeft: '5px' }}>Tối</span>
                                                <Switch 
                                                    checked={selectedTheme === 'dark'}
                                                    onChange={() => toggleTheme('dark')} 
                                                />
                                                <span style={{ marginRight: '5px', marginLeft: '5px' }}>Nâu</span>
                                                <Switch 
                                                    checked={selectedTheme === 'brown'}
                                                    onChange={() => toggleTheme('brown')} 
                                                />
                                            </div>
                                        </Toolbar>
                                    </div>
                                )}
                            </div>
                            <div style={{ flexGrow: 1, marginLeft: '10px' }}>
                                <table style={{ width: '100%' }}>
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
                                                paddingLeft='5px'
                                                onClick={handleSearch}
                                            >
                                                <FaSearch />
                                            </IconButton>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
                ) : (
                    <Toolbar>
                        <div style={{ flexGrow: 1 }}>
                            <Button onClick={moveHome}>
                                <img src={logo} alt="logo" style={{ marginRight: '10px', height: '30px'}} />
                            </Button>
                        </div>
                        <div style={{ flexGrow: 1 }}>
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
                                <FaCaretDown/>
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
                                                    <TableCell style={{ cursor: 'pointer' }}onClick={() => handleCategory(cat.id)}>{cat.name}</TableCell>
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
                        <div style={{ flexGrow: 1 }}>
                            <table style={{ width: '80%' }}>
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
                        </div>
                        <div style={{ flexGrow: 1}}>
                            <IconButton
                                size="small"
                                edge="end"
                                color="inherit"
                                aria-label="settings"
                                aria-haspopup="true"
                                onClick={handleSettingClick}
                            >
                                <FaCog />
                                <span style={{ marginRight: '5px', marginLeft: '5px' }}>Thiết lập</span>
                                <FaCaretDown/>
                            </IconButton>
                            <Menu
                                id="setting-menu"
                                anchorEl={anchorE2}
                                open={Boolean(anchorE2)}
                                onClose={handleSettingClose}
                                slotProps={{
                                    paper: {
                                        style: {
                                            background: theme.palette.background.default || '#ffffff'
                                        }
                                    }
                                }}
                            >
                                <MenuItem>
                                    <span>Cỡ chữ:</span>
                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                        <IconButton size="small" style={{background: 'white', marginRight: '3px'}} onClick={() => adjustTextSize('decrease')}>
                                            <FaMinus />
                                        </IconButton>
                                        {fontSize}
                                        <IconButton size="small" style={{background: 'white', marginLeft: '3px'}} onClick={() => adjustTextSize('increase')}>
                                            <FaPlus />
                                        </IconButton>
                                    </div>
                                </MenuItem>
                                <MenuItem >
                                    <span>Chủ đề:</span>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ marginRight: '5px', marginLeft: '5px' }}>Sáng</span>
                                        <Switch 
                                            checked={selectedTheme === 'light'}
                                            onChange={() => toggleTheme('light')} 
                                        />
                                        <span style={{ marginRight: '5px', marginLeft: '5px' }}>Tối</span>
                                        <Switch 
                                            checked={selectedTheme === 'dark'}
                                            onChange={() => toggleTheme('dark')} 
                                        />
                                        <span style={{ marginRight: '5px', marginLeft: '5px' }}>Nâu</span>
                                        <Switch 
                                            checked={selectedTheme === 'brown'}
                                            onChange={() => toggleTheme('brown')} 
                                        />
                                    </div>
                                </MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                )}
        </AppBar>
    );
}

export default Header;
