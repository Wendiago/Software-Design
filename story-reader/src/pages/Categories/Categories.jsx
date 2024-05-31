import React, { useState, useEffect, Component } from 'react';
import { Container, Pagination, Typography } from '@mui/material';
import { Breadcrumb, NovelList, Loading } from '../../components';
import { styled } from '@mui/material/styles';
import { sourceAPI, categoryAPI } from '../../api';
import { useParams } from 'react-router-dom';
import { normalizeString } from '../../utils/stringUtils';

const PREFIX = 'Categories';
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
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1),
  },
}));

const Categories = () => {
  const { category } = useParams();
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState('');
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
      if (category && source) {
        try {
          const result = await categoryAPI.getNovelByCategory({ category, pageNumber: page, source });
          const categories = await categoryAPI.getAllCategories({source});
          const capitalizedCategories = categories?.data?.categories;
          const matchingCategory = capitalizedCategories.find(cat => normalizeString(cat) === category);

          setNovels(result.data.novels);
          setBreadcrumbs([
            {
              name: matchingCategory,
              link: `/the-loai/${category}`
            },
          ]);
          setTotalPage(result.data.total_pages);
          setTitle(matchingCategory);
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
  }, [category, page]);

  if (!novels){
    return (
      <Loading/>
    )
  }

  return (
    <Root className={classes.root}>
      <Container>
        <Breadcrumb breadcrumbs={breadcrumbs}/>
        <Typography 
          className={classes.title}
          component="h5" 
          variant="h5" 
        >
          Truyện {title}
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

export default Categories;
