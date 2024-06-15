import { Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import NovelInfo from './NovelInfo';
import ChapterList from './ChapterList';
import AuthorBar from './AuthorBar';
import { Breadcrumb, Loading } from '../../components';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { useNovelDetail } from '../../hooks/novelHook';
import toast from 'react-hot-toast';

const PREFIX = 'NovelIntroduction';
const classes = {
  root: `${PREFIX}-root`,
  sidebar: `${PREFIX}-sidebar`,
  content: `${PREFIX}-content`,
  breadcrumbs: `${PREFIX}-breadcrumbs`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
  },
  [`& .${classes.sidebar}`]: {
    width: '30%',
  },
  [`& .${classes.content}`]: {
    width: '70%',
    padding: theme.spacing(2),
  },
  [`& .${classes.breadcrumbs}`]: {
    width: '100%',
  },
}));

const NovelIntroduction = () => {
  const { title } = useParams();

  const {
    isPending: isLoadingNovelDetail,
    error: novelDetailError,
    data: novel,
  } = useNovelDetail(title);

  const breadcrumbs = [
    {
      name: novel?.title,
      link: `/gioi-thieu/${title}`,
    },
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (novelDetailError)
  {toast.error(novelDetailError.message || novelDetailError.response);}

  if (isLoadingNovelDetail) {
    return <Loading />;
  }

  return (
    <Root className={classes.root}>
      <Container>
        {isMobile ? (
          <Grid>
            <Breadcrumb breadcrumbs={breadcrumbs} />
            <NovelInfo novel={novel} />
            <ChapterList title={title} />
          </Grid>
        ) : (
          <Grid container>
            <Grid item className={classes.breadcrumbs}>
              <Breadcrumb breadcrumbs={breadcrumbs} />
            </Grid>
            <Grid item className={classes.content}>
              <NovelInfo novel={novel} />
              <ChapterList title={title} />
            </Grid>
            <Grid item className={classes.sidebar}>
              <AuthorBar title={novel?.title} author={novel?.author} />
            </Grid>
          </Grid>
        )}
      </Container>
    </Root>
  );
};

export default NovelIntroduction;
