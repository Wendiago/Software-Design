import React, { useState, useEffect } from 'react';
import { Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import BookInfo from './BookInfo';
import ChapterList from './ChapterList';
import SidebarNav from './SidebarNav';
import { Breadcrumb } from '../../components';
import { normalizeString } from '../../utils/stringUtils';
import { styled } from '@mui/material/styles';
import { novelAPI } from '../../api';

const PREFIX = 'StoryIntroduction';
const classes = {
  root: `${PREFIX}-root`,
  sidebar: `${PREFIX}-sidebar`,
  content: `${PREFIX}-content`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
  },
  [`& .${classes.sidebar}`]: {
    width: '30%',
  },
  [`& .${classes.content}`]: {
    width: '70%',
    padding: theme.spacing(2),
  },
}));

const StoryIntroduction = () => {
  const [novel, setNovel] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  useEffect(() => {
    const fetchNovelDetail = async () => {
      try {
        const currentUrl = window.location.href;
        const parts = currentUrl.split('/');
        const name = parts[parts.length - 1];
        console.log(name)
        const result = await novelAPI.getNovelDetail(name);
        setNovel(result.data);
        setBreadcrumbs({
          name: result.data.title,
          link: `gioi-thieu${normalizeString(result.data.title)}`
        });
      } catch (error) {
        console.error('Error fetching novel detail:', error);
      }
    };

    fetchNovelDetail();
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Root className={classes.root}>
      <Container>
        {isMobile ? (
          <Grid>
            <Breadcrumb breadcrumbs={breadcrumbs}/>
            <BookInfo />
            <ChapterList title={novel.title}/>
          </Grid>
        ): (
          <Grid container>
            <Breadcrumb breadcrumbs={breadcrumbs}/>
            <Grid item className={classes.content}>
              <BookInfo />
              <ChapterList title={novel.title}/>
            </Grid>
            <Grid item className={classes.sidebar}>
              <SidebarNav />
            </Grid>
          </Grid>
        )}
      </Container>
    </Root>
  );
};

export default StoryIntroduction;
