import React, { useState, useEffect } from 'react';
import { Container, Pagination, Typography } from '@mui/material';
import { NovelList, Loading } from '../../components';
import { styled } from '@mui/material/styles';
import { sourceAPI, novelAPI } from '../../api';
import { useParams } from 'react-router-dom';

const PREFIX = 'SearchResult';
const classes = {
  root: `${PREFIX}-root`,
  pagination: `${PREFIX}-pagination`,
  title: `${PREFIX}-title`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    minHeight: '100vh',
  },
  [`& .${classes.pagination}`]: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2, 0),
  },
  [`& .${classes.title}`]: {
    marginTop: theme.spacing(2),
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1),
  },
}));

const SearchResult = () => {
  const { keyword } = useParams();
  const [page, setPage] = useState(1);
  const [novels, setNovels] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const handlePageChange = (event, value) => {
    setPage(value);
  }

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const result = await sourceAPI.getAllSources();
        return result.data;
      } catch (error) {
        console.error('Error fetching sources:', error);
      }
    };

    const fetchNovelList = async (source) => {
      if (keyword && source) {
        try {
          const result = await novelAPI.searchNovel({ keyword, pageNumber: page, source });
          console.log(result)
          setNovels(result.data.novels);
          setTotalPage(result.data.total_pages);
        } catch (error) {
          console.error('Error fetching novel detail:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchData = async () => {
      const result = await fetchSources();
      if (result) {
        await fetchNovelList(result);
      }
    };

    fetchData();
  }, [keyword, page]);

  if (loading){
    return (
      <Loading/>
    )
  };

  return (
    <Root className={classes.root}>
      <Container>
        <Typography
          className={classes.title}
          component="h5" 
          variant="h5" 
        >
          Tìm kiếm với từ khóa: {keyword}
        </Typography>
        <NovelList novels={novels}/>
        <div className={classes.pagination}>
          <Pagination
            count={totalPage}
            page={page}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
          />
        </div>
      </Container>
    </Root>
  );
};

export default SearchResult;
