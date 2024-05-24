import React, { useState, useEffect } from 'react';
import { IconButton, Toolbar, Menu, MenuItem, Switch, useMediaQuery, useTheme } from '@mui/material';
import { FaCog, FaCaretDown, FaMinus, FaPlus } from 'react-icons/fa';

const Setting = ({ selectedTheme, toggleTheme }) => {
    const [anchorE1, setAnchorE1] = useState(null);
    const [showSetting, setShowSetting] = useState(false);

    const theme = useTheme();
    const [fontSize, setFontSize] = useState(theme.typography.fontSize);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 

    const handleSettingClick = (event) => {
        setAnchorE1(event.currentTarget);
        setShowSetting(true);
    };

    const handleSettingClose = () => {
        setAnchorE1(null);
        setShowSetting(false);
    };

    const handleSettingMobileClick = () => {
        setAnchorE1(null);
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
    
    return (
        <div>
            {isMobile ? (
                <div>
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
            ) : (
                <div>
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
                        <FaCaretDown />
                    </IconButton>
                    <Menu
                        id="setting-menu"
                        anchorEl={anchorE1}
                        open={Boolean(anchorE1)}
                        onClose={handleSettingClose}
                        PaperProps={{ style: { background: theme.palette.background.default || '#ffffff' } }}
                    >
                        <MenuItem>
                            <span>Cỡ chữ:</span>
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                <IconButton size="small" style={{ background: 'white', marginRight: '3px' }} onClick={() => adjustTextSize('decrease')}>
                                    <FaMinus />
                                </IconButton>
                                {fontSize}
                                <IconButton size="small" style={{ background: 'white', marginLeft: '3px' }} onClick={() => adjustTextSize('increase')}>
                                    <FaPlus />
                                </IconButton>
                            </div>
                        </MenuItem>
                        <MenuItem>
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
            )}
        </div>
    );
};

export default Setting;
