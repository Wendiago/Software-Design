import React, { useState } from 'react';
import { Button, Paper, List, ListItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { normalizeString } from '../../utils/stringUtils';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 

const PREFIX = 'ChapterListFloating';
const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  button: `${PREFIX}-button`,
  floatingPanel: `${PREFIX}-floatingPanel`,
  list: `${PREFIX}-list`,
  listItem: `${PREFIX}-listItem`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    position: 'relative',
    padding: theme.spacing(2),
  },
  [`& .${classes.button}`]: {
    backgroundColor: theme.palette.background.default,
    position: 'fixed',
    top: theme.spacing(10),
    right: theme.spacing(2),
  },
  [`& .${classes.floatingPanel}`]: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '300px',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    zIndex: 1300,
    overflowY: 'auto',
    padding: theme.spacing(2),
  },
  [`& .${classes.list}`]: {
    maxHeight: '100%',
    overflowY: 'auto',
  },
  [`& .${classes.listItem}`]: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const ChapterListFloating = ({ title, chapters }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();

  const handleTogglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleChapter = (chapterNumber) => {
    navigate(`/doc-truyen/${normalizeString(title)}/${chapterNumber}`);
    setIsPanelOpen(false);
    window.location.reload();
  };

  const formatChapter = (chapter) => chapter.replace('chuong-', 'Chương ');

  return (
    <Root className={classes.root}>
        {isPanelOpen ? (
            <Paper className={classes.floatingPanel}>
                <Typography variant="h6">
                    <Button onClick={handleTogglePanel}>
                        <FaChevronRight/>
                    </Button>
                    Chọn chương
                </Typography>
                <List className={classes.list}>
                    {chapters.map((chapter, index) => (
                    <ListItem 
                        key={index} 
                        className={classes.listItem} 
                        onClick={() => handleChapter(chapter)}
                    >
                        {formatChapter(chapter)}
                    </ListItem>
                    ))}
                </List>
            </Paper>
        ) : (
        <Button className={classes.button} onClick={handleTogglePanel}>
            <FaChevronLeft/>
        </Button>
        )}
    </Root>
  );
};

export default ChapterListFloating;
