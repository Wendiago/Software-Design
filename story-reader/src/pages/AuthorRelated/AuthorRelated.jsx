import React, { useState, useEffect } from 'react';
import { Container, Pagination } from '@mui/material';
import { Breadcrumb, NovelList, Loading } from '../../components';
import { styled } from '@mui/material/styles';
import { sourceAPI, novelAPI } from '../../api';
import { useParams } from 'react-router-dom';

const PREFIX = 'AuthorRelated';
const classes = {
  root: `${PREFIX}-root`,
  pagination: `${PREFIX}-pagination`,
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
}));

const AuthorRelated = () => {
  const { author } = useParams();
  const [page, setPage] = useState(1);
  const [novels, setNovels] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [totalPage, setTotalPage] = useState(1);

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
      if (author && source) {
        try {
          const result = await novelAPI.searchNovel({ keyword: author, pageNumber: page, source });
          setNovels(result.data.novels);
          setBreadcrumbs([
            {
              name: result.data.novels[0].author,
              link: `/tac-gia/${author}`
            },
          ]);
          setTotalPage(result.data.total_pages);
        } catch (error) {
          console.error('Error fetching novel detail:', error);
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
  }, [author, page]);

  if (!novels){
    return (
      <Loading/>
    )
  }

  return (
    <Root className={classes.root}>
      <Container>
        <Breadcrumb breadcrumbs={breadcrumbs}/>
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

export default AuthorRelated;
