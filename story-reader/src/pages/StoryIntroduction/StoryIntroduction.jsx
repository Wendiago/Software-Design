import React from 'react';
import { Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import BookInfo from './BookInfo';
import ChapterList from './ChapterList';
import SidebarNav from './SidebarNav';
import { styled } from '@mui/material/styles';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const title = 'Nàng Không Muốn Làm Hoàng Hậu';

  return (
    <Root className={classes.root}>
      <Container>
        {isMobile ? (
          <Grid>
            <BookInfo />
            <ChapterList title={title}/>
          </Grid>
        ): (
          <Grid container>
            <Grid item className={classes.content}>
              <BookInfo />
              <ChapterList title={title}/>
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
