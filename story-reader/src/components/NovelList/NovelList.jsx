import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { normalizeString } from '../../utils/stringUtils';

const PREFIX = 'NovelList';
const classes = {
  root: `${PREFIX}-root`,
  card: `${PREFIX}-card`,
  cardMedia: `${PREFIX}-cardMedia`,
  cardContent: `${PREFIX}-cardContent`,
  chip: `${PREFIX}-chip`,
  title: `${PREFIX}-title`,
  chapter: `${PREFIX}-chapter`,
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
    width: '20%',
  },
  [`& .${classes.cardContent}`]: {
    width: '80%',
  },
  [`& .${classes.chip}`]: {
    marginRight: theme.spacing(1),
  },
  [`& .${classes.title}`]: {
    cursor: 'pointer',
  },
  [`& .${classes.chapter}`]: {
    cursor: 'pointer',
  }
}));

const NovelList = ({ novels }) => {
  const navigate = useNavigate();

  const handleNovel = (novelName) => {
    navigate(`/gioi-thieu/${normalizeString(novelName)}`);
  };

  const handleReadNovel = (novelName, chapterNumber) => {
    navigate(`/doc-truyen/${normalizeString(novelName)}/${chapterNumber}`);
  };

  return (
    <Root className={classes.root}>
      <Grid container spacing={2}>
        {novels?.map((novel, index) => (
          <Grid item xs={12} key={index}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cardMedia}
                image={novel.imageUrl}
                title={novel.title}
              />
              <CardContent className={classes.cardContent}>
                <Typography 
                  className={classes.title}
                  component="h6" 
                  variant="h6" 
                  onClick={()=>handleNovel(novel.title)}
                >
                  {novel.title}
                </Typography>
                <Typography variant="subtitle1">
                  {novel.author}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Root>
  );
};

export default NovelList;
