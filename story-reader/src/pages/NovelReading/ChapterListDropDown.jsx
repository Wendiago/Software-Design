import React from 'react';
import { Select, MenuItem, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { normalizeString } from '../../utils/stringUtils';

const PREFIX = 'ChapterList';
const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  select: `${PREFIX}-select`,
  text: `${PREFIX}-text`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.paper}`]: {
    backgroundColor: theme.palette.background.default,
    maxHeight: '40px',
  },
  [`& .${classes.root}`]: {
    marginTop: theme.spacing(2),
  },
  [`& .${classes.select}`]: {
    maxWeight: '100px',
    maxHeight: '38px',
    borderColor: theme.palette.primary.main,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '& .MuiSelect-icon': {
      color: theme.palette.primary.main,
    },
  },
  [`& .${classes.text}`]: {
    color: theme.palette.text.primary,
  },
}));

const CustomSelect = styled(Select)(({ theme }) => ({
    color: theme.palette.primary.main,
}));

const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
    color: theme.palette.text.primary,
    '&.Mui-selected': {
        color: theme.palette.primary.main,
    },
}));

const ChapterListDropDown = ({ title, chapters }) => {
  const navigate = useNavigate();

  const handleChapter = (chapterNumber) => {
    navigate(`/doc-truyen/${normalizeString(title)}/${chapterNumber}`);
    window.location.reload();
  };

  const formatChapter = (chapter) => {
    return chapter?.replace('chuong-', 'Chương ');
  };

  return (
    <Root>
      <Paper className={classes.paper}>
        <CustomSelect
        className={classes.select}
        value=""
        onChange={(event) => handleChapter(event.target.value)}
        displayEmpty
        MenuProps={{
            PaperProps: {
            style: {
                maxHeight: 400,
            },
            },
        }}
        >
        <CustomMenuItem value="" disabled>
          Chọn chương
        </CustomMenuItem>
        {chapters?.map((chapter, index) => (
            <CustomMenuItem key={index} value={chapter}>
            {formatChapter(chapter)}
            </CustomMenuItem>
        ))}
        </CustomSelect>
      </Paper>
    </Root>
  );
};

export default ChapterListDropDown;
