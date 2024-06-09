import React, { useState } from 'react';
import { Container, Pagination } from '@mui/material';
import { Breadcrumb, NovelList, Loading } from '../../components';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { useNovelSearched } from '../../hooks/novelHook';
import toast from 'react-hot-toast';

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

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const {
    isPending: isLoadingNovels,
    error: novelsError,
    data: { novels, total_pages: totalPages } = {},
  } = useNovelSearched(author, page);

  const breadcrumbs = [
    {
      name: novels?.at(0).author,
      link: `/tac-gia/${author}`,
    },
  ];

  if (novelsError) {toast.error(novelsError.message || novelsError.response);}

  if (isLoadingNovels) {
    return <Loading />;
  }

  return (
    <Root className={classes.root}>
      <Container>
        <Breadcrumb breadcrumbs={breadcrumbs} />
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

export default AuthorRelated;
