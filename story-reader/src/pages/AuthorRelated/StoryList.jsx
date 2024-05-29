import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Chip,
  Pagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { normalizeString } from '../../utils/stringUtils';

const PREFIX = 'StoryList';
const classes = {
  root: `${PREFIX}-root`,
  card: `${PREFIX}-card`,
  cardMedia: `${PREFIX}-cardMedia`,
  cardContent: `${PREFIX}-cardContent`,
  chip: `${PREFIX}-chip`,
  title: `${PREFIX}-title`,
  chapter: `${PREFIX}-chapter`,
  pagination: `${PREFIX}-pagination`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    flexGrow: 1,
  },
  [`& .${classes.card}`]: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  [`& .${classes.cardMedia}`]: {
    width: 160,
  },
  [`& .${classes.cardContent}`]: {
    flex: '1 0 auto',
  },
  [`& .${classes.chip}`]: {
    marginRight: theme.spacing(1),
  },
  [`& .${classes.title}`]: {
    cursor: 'pointer',
  },
  [`& .${classes.chapter}`]: {
    cursor: 'pointer',
  },
  [`& .${classes.pagination}`]: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2, 0),
  },
}));

const itemsPerPage = 5;

const StoryList = ({ stories }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(stories.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleStory = (storyName) => {
    navigate(`/gioi-thieu/${normalizeString(storyName)}`);
  };

  const handleReadStory = (storyName, chapterNumber) => {
    navigate(`/doc-truyen/${normalizeString(storyName)}/${chapterNumber}`);
  };

  const paginatedStories = stories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Root className={classes.root}>
      <Grid container spacing={2}>
        {paginatedStories?.map((story, index) => (
          <Grid item xs={12} key={index}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cardMedia}
                image={story.imageUrl}
                title={story.title}
              />
              <CardContent className={classes.cardContent}>
                <Typography 
                  className={classes.title}
                  component="h5" 
                  variant="h5" 
                  onClick={()=>handleStory(story.title)}
                >
                  {story.title}
                </Typography>
                <Typography variant="subtitle1">
                  {story.author}
                </Typography>
                <div>
                  <Chip
                    label={story.status}
                    className={classes.chip}
                    color="primary"
                  />
                  {story.isHot && (
                    <Chip label="Hot" className={classes.chip} color="secondary" />
                  )}
                  <Typography 
                    className={classes.chapter}
                    variant="subtitle2" 
                    onClick={()=>handleReadStory(story.title, story.chapters)}
                  >
                    Chương {story.chapters}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div className={classes.pagination}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
        />
      </div>
    </Root>
  );
};

export default StoryList;
