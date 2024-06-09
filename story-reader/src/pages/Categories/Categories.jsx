import React, { useState } from 'react';
import { Container, Pagination, Typography } from '@mui/material';
import { Breadcrumb, NovelList, Loading } from '../../components';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { normalizeString } from '../../utils/stringUtils';
import { useAllCategories, useNovelByCategory } from '../../hooks/categoryHook';
import toast from 'react-hot-toast';

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

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const {
    isPending: isLoadingNovels,
    error: novelsError,
    data: { novels, total_pages: totalPages } = {},
  } = useNovelByCategory(category, page);

  const { error: categoriesError, categories } = useAllCategories();
  const capitalizedCategories = categories?.data?.categories;
  const title = capitalizedCategories?.find(
    (cat) => normalizeString(cat) === category
  ); // matchingCategory

  const breadcrumbs = [
    {
      name: title,
      link: `/the-loai/${category}`,
    },
  ];

  if (novelsError) {toast.error(novelsError.message || novelsError.response);}
  if (categoriesError)
  {toast.error(categoriesError.message || categoriesError.response);}

  if (isLoadingNovels) {
    return <Loading />;
  }

  return (
    <Root className={classes.root}>
      <Container>
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <Typography className={classes.title} component="h5" variant="h5">
          Truyện {title}
        </Typography>
        <NovelList novels={novels} />
        <div className={classes.pagination}>
          <Pagination
            count={totalPages}
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
