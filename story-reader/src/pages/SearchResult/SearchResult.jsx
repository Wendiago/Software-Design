import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const PREFIX = "AnimeSearch";
const classes = {
  root: `${PREFIX}-root`,
  appBar: `${PREFIX}-appBar`,
  card: `${PREFIX}-card`,
  cardMedia: `${PREFIX}-cardMedia`,
  cardContent: `${PREFIX}-cardContent`,
  searchContainer: `${PREFIX}-searchContainer`,
  searchInput: `${PREFIX}-searchInput`,
  searchButton: `${PREFIX}-searchButton`,
};

const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    flexGrow: 1,
  },
  [`& .${classes.appBar}`]: {
    marginBottom: theme.spacing(2),
  },
  [`& .${classes.card}`]: {
    display: "flex",
    marginBottom: theme.spacing(2),
  },
  [`& .${classes.cardMedia}`]: {
    width: 160,
  },
  [`& .${classes.cardContent}`]: {
    flex: "1 0 auto",
  },
  [`& .${classes.searchContainer}`]: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  [`& .${classes.searchInput}`]: {
    marginRight: theme.spacing(2),
    flexGrow: 1,
  },
  [`& .${classes.searchButton}`]: {
    height: "56px",
  },
}));

const data = [
  {
    title: "One Piece",
    imageUrl:
      "https://wallpapers.com/images/hd/one-piece-pictures-de2t2bhjiyhtaszq.jpg",
    author: "Oda Eiichiro",
  },
  {
    title: "One Piece",
    imageUrl:
      "https://wallpapers.com/images/hd/one-piece-pictures-de2t2bhjiyhtaszq.jpg",
    author: "Oda Eiichiro",
  },
  {
    title: "One Piece",
    imageUrl:
      "https://wallpapers.com/images/hd/one-piece-pictures-de2t2bhjiyhtaszq.jpg",
    author: "Oda Eiichiro",
  },
  {
    title: "One Piece",
    imageUrl:
      "https://wallpapers.com/images/hd/one-piece-pictures-de2t2bhjiyhtaszq.jpg",
    author: "Oda Eiichiro",
  },
  {
    title: "One Piece",
    imageUrl:
      "https://wallpapers.com/images/hd/one-piece-pictures-de2t2bhjiyhtaszq.jpg",
    author: "Oda Eiichiro",
  },
  {
    title: "One Piece",
    imageUrl:
      "https://wallpapers.com/images/hd/one-piece-pictures-de2t2bhjiyhtaszq.jpg",
    author: "Oda Eiichiro",
  },
  {
    title: "One Piece",
    imageUrl:
      "https://wallpapers.com/images/hd/one-piece-pictures-de2t2bhjiyhtaszq.jpg",
    author: "Oda Eiichiro",
  },
  {
    title: "One Piece",
    imageUrl:
      "https://wallpapers.com/images/hd/one-piece-pictures-de2t2bhjiyhtaszq.jpg",
    author: "Oda Eiichiro",
  },
  {
    title: "One Piece",
    imageUrl:
      "https://wallpapers.com/images/hd/one-piece-pictures-de2t2bhjiyhtaszq.jpg",
    author: "Oda Eiichiro",
  },
];

function SearchResult() {
  return (
    <Root className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6">Kết quả tìm kiếm</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Grid container spacing={3}>
          {data.map((anime, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={anime.imageUrl}
                  title={anime.title}
                />
                <CardContent className={classes.cardContent}>
                  <Typography component="h5" variant="h5">
                    {anime.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {anime.author}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Root>
  );
}

export default SearchResult;
