import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { normalizeString } from '../../utils/stringUtils';
import { novelAPI } from '../../api';
import { Loading } from '../../components';

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

const ChapterListDropDown = ({ title, source }) => {
  const navigate = useNavigate();
  const [totalChapters, setTotalChapters] = useState(null);

  useEffect(() => {
    if (title && source){
      const fetchLatestChapter = async (title, source) => {
        try {
          const firstPageResult = await novelAPI.getNovelChapterList({ title, pageNumber: 1, source });
          const { total_pages } = firstPageResult?.data;
          
          if (total_pages){
            const lastPageResult = await novelAPI.getNovelChapterList({ title, pageNumber: total_pages, source });
            const latestChapter = lastPageResult?.data?.chapters?.length;
            setTotalChapters((total_pages - 1) * 50 + latestChapter);
          }
        } catch (error) {
          console.error('Error fetching latest chapter:', error);
        } 
      };
  
      fetchLatestChapter(title, source);
    }
  }, [title, source]);

  const handleChapter = (chapterNumber) => {
    navigate(`/doc-truyen/${normalizeString(title)}/${chapterNumber}`);
    window.location.reload();
  };

  if (!totalChapters) {
    return (
      <Loading/>
    )
  }

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
        {Array.from({ length: totalChapters }, (_, index) => (
            <CustomMenuItem key={index} value={index + 1}>
            {`Chương ${index + 1}`}
            </CustomMenuItem>
        ))}
        </CustomSelect>
      </Paper>
    </Root>
  );
};

export default ChapterListDropDown;
