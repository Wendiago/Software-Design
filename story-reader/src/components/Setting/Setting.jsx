import React, { useState, useEffect } from 'react';
import { 
    IconButton, 
    Toolbar, 
    Menu, 
    MenuItem, 
    Switch, 
    useMediaQuery, 
    useTheme, 
    Select, 
    FormControl
} from '@mui/material';
import { FaCog, FaCaretDown, FaMinus, FaPlus } from 'react-icons/fa';

const Setting = ({ selectedTheme, toggleTheme }) => {
    const [anchorE1, setAnchorE1] = useState(null);
    const [showSetting, setShowSetting] = useState(false);

    const theme = useTheme();
    const [fontSize, setFontSize] = useState(theme.typography.fontSize);
    const [lineHeight, setLineHeight] = useState(theme.typography.lineHeight); 
    const [fontFamily, setFontFamily] = useState(theme.typography.fontFamily); 
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
        const storedLineHeight = localStorage.getItem('lineHeight');
        const storedFontFamily = localStorage.getItem('fontFamily');

        const initialFontSize = storedFontSize ? parseInt(storedFontSize) : 16;
        const initialLineHeight = storedLineHeight ? parseFloat(storedLineHeight) : 1.5;
        const initialFontFamily = storedFontFamily ? storedFontFamily : 'Arial';
    
        const root = document.documentElement;
        root.style.setProperty('--font-size', `${initialFontSize}px`);
        root.style.setProperty('--line-height', `${initialLineHeight}`);
        root.style.setProperty('--font-family', initialFontFamily);
        setFontSize(initialFontSize);
        setLineHeight(initialLineHeight);
        setFontFamily(initialFontFamily);
    }, []);

    const adjustTextSize = (action) => {
        const root = document.documentElement;
        let newFontSize = fontSize;
        if (action === 'increase') {
            newFontSize += 1;
        } else if (action === 'decrease') {
            newFontSize -= 1;
        }
        root.style.setProperty('--font-size', `${newFontSize}px`);
        setFontSize(newFontSize);
        localStorage.setItem('fontSize', newFontSize);
    };

    const adjustLineHeight = (action) => {
        const root = document.documentElement;
        let newLineHeight = lineHeight;
        if (action === 'increase') {
            newLineHeight += 0.1;
        } else if (action === 'decrease') {
            newLineHeight -= 0.1;
        }
        root.style.setProperty('--line-height', `${newLineHeight}`);
        setLineHeight(newLineHeight);
        localStorage.setItem('lineHeight', newLineHeight);
    };

    const handleFontFamilyChange = (event) => {
        const newFontFamily = event.target.value;
        const root = document.documentElement;
        root.style.setProperty('--font-family', newFontFamily);
        setFontFamily(newFontFamily);
        localStorage.setItem('fontFamily', newFontFamily);
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
                                <span>Font chữ:</span>
                                <FormControl size="small" style={{ marginLeft: '10px', minWidth: '100px' }}>
                                    <Select
                                        native
                                        value={fontFamily}
                                        onChange={handleFontFamilyChange}
                                    >
                                        <option value="Arial">Arial</option>
                                        <option value="Courier New">Courier New</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                    </Select>
                                </FormControl>
                            </Toolbar>
                            <Toolbar>
                                <span>Cỡ chữ:</span>
                                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                    <IconButton disabled={fontSize === 1} size="small" style={{background: 'white', marginRight: '3px'}} onClick={() => adjustTextSize('decrease')}>
                                        <FaMinus />
                                    </IconButton>
                                    {fontSize}
                                    <IconButton size="small" style={{background: 'white', marginLeft: '3px'}} onClick={() => adjustTextSize('increase')}>
                                        <FaPlus />
                                    </IconButton>
                                </div>
                            </Toolbar>
                            <Toolbar>
                                <span>Khoảng cách dòng:</span>
                                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                    <IconButton disabled={lineHeight?.toFixed(1) === 0.1} size="small" style={{background: 'white', marginRight: '3px'}} onClick={() => adjustLineHeight('decrease')}>
                                        <FaMinus />
                                    </IconButton>
                                    {lineHeight?.toFixed(1)}
                                    <IconButton size="small" style={{background: 'white', marginLeft: '3px'}} onClick={() => adjustLineHeight('increase')}>
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
                            <span>Font chữ:</span>
                            <FormControl size="small" style={{ marginLeft: '10px', minWidth: '100px' }}>
                                <Select
                                    native
                                    value={fontFamily}
                                    onChange={handleFontFamilyChange}
                                >
                                    <option value="Arial">Arial</option>
                                    <option value="Courier New">Courier New</option>
                                    <option value="Times New Roman">Times New Roman</option>
                                </Select>
                            </FormControl>
                        </MenuItem>
                        <MenuItem>
                            <span>Cỡ chữ:</span>
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                <IconButton disabled={fontSize === 1} size="small" style={{ background: 'white', marginRight: '3px' }} onClick={() => adjustTextSize('decrease')}>
                                    <FaMinus />
                                </IconButton>
                                {fontSize}
                                <IconButton size="small" style={{ background: 'white', marginLeft: '3px' }} onClick={() => adjustTextSize('increase')}>
                                    <FaPlus />
                                </IconButton>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <span>Khoảng cách dòng:</span>
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                <IconButton disabled={lineHeight?.toFixed(1) === 0.1} size="small" style={{ background: 'white', marginRight: '3px' }} onClick={() => adjustLineHeight('decrease')}>
                                    <FaMinus />
                                </IconButton>
                                {lineHeight?.toFixed(1)}
                                <IconButton size="small" style={{ background: 'white', marginLeft: '3px' }} onClick={() => adjustLineHeight('increase')}>
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
