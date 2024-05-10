import React, { useState, useEffect } from 'react';
import logo from '../../logo.svg'; // Import your logo file
import { FaCog, FaList, FaCaretDown, FaSearch, FaBars, FaPlus, FaMinus } from 'react-icons/fa'; // Import the setting icon from react-icons library
import { AppBar, Toolbar, IconButton, Menu, MenuItem, ListItemIcon, Switch, ListItemText, useMediaQuery, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'; // Import Material-UI components

const Header = ({ selectedTheme, toggleTheme }) => {
    const [category, setCategory] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorE2, setAnchorE2] = useState(null);
    const [showContent, setShowContent] = useState(false);
    const [showCategory, setShowCategory] = useState(false);
    const [showSetting, setShowSetting] = useState(false);

    const theme = useTheme();
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

    const adjustTextSize = (action) => {
        const root = document.documentElement;
        let currentFontSize = parseFloat(window.getComputedStyle(root).fontSize);
    
        if (action === 'increase') {
            currentFontSize += 1;
        } else if (action === 'decrease') {
            currentFontSize -= 1;
        }
    
        root.style.fontSize = `${currentFontSize}px`;
    };

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
            'Khác'
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
                        <img src={logo} alt="logo" style={{ marginRight: '10px', height: '30px'}} />
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
                                    <div id="category-menu" style={{ visibility: 'visible' }}>
                                        <Table>
                                            <TableBody>
                                                {category.map((cat, index) => (
                                                    index % 4 === 0 && (
                                                        <TableRow key={index}>
                                                            <TableCell>{cat}</TableCell>
                                                            {category[index + 1] && <TableCell>{category[index + 1]}</TableCell>}
                                                            {category[index + 2] && <TableCell>{category[index + 2]}</TableCell>}
                                                            {category[index + 3] && <TableCell>{category[index + 3]}</TableCell>}
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
                                    </div>
                                )}
                            </div>
                            <div style={{ flexGrow: 1, marginLeft: '10px' }}>
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ paddingRight: '5px' }}>
                                                <input type="text" placeholder="Tìm kiếm..." style={{ padding: '5px', borderRadius: '5px', border: 'none', width: '95%' }} />
                                            </td>
                                            <td>
                                            <IconButton
                                                size="small"
                                                edge="start"
                                                color="inherit"
                                                aria-label="search"
                                                paddingLeft='5px'
                                                onClick={handleCategoryClick}
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
                            <img src={logo} alt="logo" style={{ marginRight: '10px', height: '30px' }} />
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
                                                    <TableCell>{cat}</TableCell>
                                                    {category[index + 1] && <TableCell>{category[index + 1]}</TableCell>}
                                                    {category[index + 2] && <TableCell>{category[index + 2]}</TableCell>}
                                                    {category[index + 3] && <TableCell>{category[index + 3]}</TableCell>}
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
                                            <input type="text" placeholder="Tìm kiếm..." style={{ padding: '5px', borderRadius: '5px', border: 'none', width: '95%' }} />
                                        </td>
                                        <td>
                                        <IconButton
                                            size="small"
                                            edge="start"
                                            color="inherit"
                                            aria-label="search"
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
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton size="small" onClick={() => adjustTextSize('increase')}>
                                            <FaPlus />
                                        </IconButton>
                                        {window.getComputedStyle(document.documentElement).fontSize}
                                        <IconButton size="small" onClick={() => adjustTextSize('decrease')}>
                                            <FaMinus />
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
