import React, { useState, useEffect } from 'react';
import { Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import NovelInfo from './NovelInfo';
import ChapterList from './ChapterList';
import SidebarNav from './SidebarNav';
import { Breadcrumb } from '../../components';
import { styled } from '@mui/material/styles';
import { novelAPI, sourceAPI } from '../../api';
import { useParams } from 'react-router-dom';

const PREFIX = 'NovelIntroduction';
const classes = {
  root: `${PREFIX}-root`,
  sidebar: `${PREFIX}-sidebar`,
  content: `${PREFIX}-content`,
  breadcrumbs: `${PREFIX}-breadcrumbs`,
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
  [`& .${classes.breadcrumbs}`]: {
    width: '100%',
  },
}));

const NovelIntroduction = () => {
  const { title } = useParams();
  const [novel, setNovel] = useState([]);
  const [sources, setSources] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const result = await sourceAPI.getAllSources();
        setSources(result.data);
        return result.data;
      } catch (error) {
        console.error('Error fetching sources:', error);
      }
    };

    const fetchNovelDetail = async (source) => {
      if (source) {
        try {
          const result = await novelAPI.getNovelDetail({ title, source });
          console.log(result.data);
          setNovel(result.data);
          setBreadcrumbs([
            {
              name: result.data.title,
              link: `/gioi-thieu/${title}`,
            },
          ]);
        } catch (error) {
          console.error('Error fetching novel detail:', error);
        }
      }
    };

    const fetchData = async () => {
      const result = await fetchSources();
      if (result) {
        await fetchNovelDetail(result);
      }
    };

    fetchData();
  }, [title]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Root className={classes.root}>
      <Container>
        {isMobile ? (
          <Grid>
            <Breadcrumb breadcrumbs={breadcrumbs} />
            <NovelInfo novel={novel} />
            <ChapterList title={title} source={sources} />
          </Grid>
        ) : (
          <Grid container>
            <Grid item className={classes.breadcrumbs}>
              <Breadcrumb breadcrumbs={breadcrumbs} />
            </Grid>
            <Grid item className={classes.content}>
              <NovelInfo novel={novel} />
              <ChapterList title={title} source={sources} />
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

export default NovelIntroduction;
