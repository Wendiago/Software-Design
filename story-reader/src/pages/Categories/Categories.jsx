import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";

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
];

const PREFIX = "Categories";
const classes = {
  root: `${PREFIX}-root`,
  appBar: `${PREFIX}-appBar`,
  card: `${PREFIX}-card`,
  cardMedia: `${PREFIX}-cardMedia`,
  cardContent: `${PREFIX}-cardContent`,
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
    width: "100%",
  },
  [`& .${classes.cardMedia}`]: {
    width: 160,
  },
  [`& .${classes.cardContent}`]: {
    flex: "1 0 auto",
  },
}));

const Categories = () => {
  return (
    <Root className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6">Truyện Alime</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        {/* <Typography variant="h4" gutterBottom>
          Truyện Alime
        </Typography> */}
        <List>
          {data.map((item, index) => (
            <ListItem key={index}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={item.imageUrl}
                  title={item.title}
                />
                <CardContent className={classes.cardContent}>
                  <Typography component="h5" variant="h5">
                    {item.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {item.author}
                  </Typography>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      </Container>
    </Root>
  );
};

export default Categories;
