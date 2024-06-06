import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { normalizeString } from '../../utils/stringUtils';

const PREFIX = 'Homepage';
const classes = {
  root: `${PREFIX}-root`,
  item: `${PREFIX}-item`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.root}`]: {
    marginTop: theme.spacing(2),
  },
  [`& .${classes.item}`]: {
    cursor: 'pointer',
  },
}));

const Homepage = () => {
  const [novelList, setNovelList] = useState([]);
  const navigate = useNavigate();
  
  const formatChapter = (chapter) => {
    return chapter?.replace('chuong-', 'Chương ');
  };

  useEffect(() => {
    const storedNovelList = JSON.parse(localStorage.getItem('novelList')) || [];
    setNovelList(storedNovelList);
  }, []);

  const handleNovel = (title, chapter) => {
    navigate(`/doc-truyen/${normalizeString(title)}/${chapter}`);
  };

  return (
    <Root>
      <Container>
        <Typography variant="h4" gutterBottom>
          Chào mừng đến với website đọc truyện siêu hay, siêu hot
        </Typography>
        {novelList.length > 0 ? (
          <div>
            <Typography variant="h5" gutterBottom>
              Truyện đã đọc gần đây
            </Typography>
            <Grid container spacing={3}>
              {novelList?.map((novel, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Card className={classes.item} onClick={() => handleNovel(novel.title, novel.chapter)}>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {novel.title}
                      </Typography>
                      <Typography variant="body2">
                        {formatChapter(novel.chapter)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        ) : (
          <Typography variant="body1">
            Chưa có truyện nào được đọc gần đây.
          </Typography>
        )}
      </Container>
    </Root>
  );
};

export default Homepage;
