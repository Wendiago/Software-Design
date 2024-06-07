import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { normalizeString } from '../../utils/stringUtils';

const PREFIX = 'NovelList';
const classes = {
  root: `${PREFIX}-root`,
  grid: `${PREFIX}-grid`,
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
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  [`& .${classes.grid}`]: {
    display: 'grid',
    gridTemplateColumns: '10% 85%',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  [`& .${classes.cardMedia}`]: {
    width: '100%',
    height: 'auto',
    minHeight: '100px',
    minWidth: '40px'
  },
  [`& .${classes.cardContent}`]: {
    width: '100%',
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

  return (
    <Root className={classes.root}>
      <Grid container spacing={2}>
        {novels?.map((novel, index) => (
          <Grid item xs={12} key={index} className={classes.grid}>
            <img className={classes.cardMedia} src={novel.imageUrl} alt={novel.title}/>
            <Card className={classes.card}>
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
