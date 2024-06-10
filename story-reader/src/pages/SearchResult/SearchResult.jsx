import { useState } from 'react';
import { Container, Pagination, Typography } from '@mui/material';
import { NovelList, Loading } from '../../components';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { useNovelSearched } from '../../hooks/novelHook';
import toast from 'react-hot-toast';

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

  const {
    isPending: isLoadingNovels,
    error: novelsError,
    data: { novels, total_pages: totalPages } = {},
  } = useNovelSearched(keyword, page);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (novelsError) {toast.error(novelsError.message || novelsError.response);}

  if (isLoadingNovels) {
    return <Loading />;
  }

  return (
    <Root className={classes.root}>
      <Container>
        <Typography className={classes.title} component="h5" variant="h5">
          Tìm kiếm với từ khóa: {keyword}
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

export default SearchResult;
