import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { normalizeString } from '../../utils/stringUtils';
import { Loading } from '../../components';
import { useNovelSearched } from '../../hooks/novelHook';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

const PREFIX = 'AuthorBar';
const classes = {
  root: `${PREFIX}-root`,
  section: `${PREFIX}-section`,
  trendingButtonGroup: `${PREFIX}-trendingButtonGroup`,
  item: `${PREFIX}-item`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    flexGrow: 1,
    marginTop: theme.spacing(2),
  },
  [`& .${classes.section}`]: {
    marginBottom: theme.spacing(2),
  },
  [`& .${classes.trendingButtonGroup}`]: {
    marginBottom: theme.spacing(2),
  },
  [`& .${classes.item}`]: {
    cursor: 'pointer',
  },
}));

const AuthorBar = ({ title, author }) => {
  const navigate = useNavigate();

  const handleNovel = (novelName) => {
    navigate(`/gioi-thieu/${normalizeString(novelName)}`);
  };

  const {
    isPending: isLoadingNovels,
    error: novelsError,
    data: { novels } = {},
  } = useNovelSearched(author, 1);

  const filteredNovels = novels?.filter((novel) => novel.title !== title);

  if (novelsError) {toast.error(novelsError.message || novelsError.response);}

  if (isLoadingNovels) {
    return <Loading />;
  }

  if (!filteredNovels || filteredNovels.length === 0) {
    return (
      <Root className={classes.root}>
        <Container>
          <div className={classes.section}>
            <Typography variant="h6">
              ĐÂY LÀ TRUYỆN DUY NHẤT CỦA TÁC GIẢ :0
            </Typography>
          </div>
        </Container>
      </Root>
    );
  }

  return (
    <Root className={classes.root}>
      <Container>
        <div className={classes.section}>
          <Typography variant="h6">TRUYỆN CÙNG TÁC GIẢ</Typography>
          <List>
            {filteredNovels?.map((novel, index) => (
              <ListItem key={index}>
                <ListItemText
                  className={classes.item}
                  primary={novel.title}
                  onClick={() => handleNovel(novel.title)}
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Container>
    </Root>
  );
};

AuthorBar.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

export default AuthorBar;
