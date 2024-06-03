import React, { useState, useEffect } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Container
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { normalizeString } from '../../utils/stringUtils';
import { novelAPI } from '../../api';
import { Loading } from '../../components';

const PREFIX = 'AuthorBar';
const classes = {
  root: `${PREFIX}-root`,
  section: `${PREFIX}-section`,
  trendingButtonGroup: `${PREFIX}-trendingButtonGroup`,
  item: `${PREFIX}-item`, 
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    flexGrow: 1,
    marginTop: theme.spacing(2),
  },
  [`& .${classes.section}`]: {
    marginBottom: theme.spacing(2),
  },
  [`& .${classes.trendingButtonGroup}`]: {
    marginBottom: theme.spacing(2),
  },
  [`& .${classes.item}`]: {
    cursor: 'pointer',
  },
}));

const AuthorBar = ({ title, author, source }) => {
  const navigate = useNavigate();
  const [novels, setNovels] = useState(null);

  const handleNovel = (novelName) => {
    navigate(`/gioi-thieu/${normalizeString(novelName)}`);
  };

  useEffect(() => {
    const fetchNovelList = async () => {
      if (author && source) {
        try {
          const result = await novelAPI.searchNovel({ keyword: author, pageNumber: 1, source });
          const filteredNovels = result?.data?.novels?.filter(novel => novel.title !== title);
          setNovels(filteredNovels);
        } catch (error) {
          console.error('Error fetching novel detail:', error);
        }
      }
    };

    fetchNovelList();
  }, [title, author, source]);

  if (!novels){
    return (
      <Loading/>
    )
  }

  if (novels.length === 0){
    return (
      <Root className={classes.root}>
      <Container>
        <div className={classes.section}>
          <Typography variant="h6">ĐÂY LÀ TRUYỆN DUY NHẤT CỦA TÁC GIẢ :0</Typography>
        </div>
      </Container>
    </Root>
    )
  }

  return (
    <Root className={classes.root}>
      <Container>
        <div className={classes.section}>
          <Typography variant="h6">TRUYỆN CÙNG TÁC GIẢ</Typography>
          <List>
            {novels?.map((novel, index) => (
              <ListItem key={index}>
                <ListItemText className={classes.item} primary={novel.title} onClick={() => handleNovel(novel.title)} />
              </ListItem>
            ))}
          </List>
        </div>
      </Container>
    </Root>
  );
};

export default AuthorBar;
