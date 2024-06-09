import React, { useState } from "react";
import { Typography, Grid, Paper, Box, Rating, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { normalizeString } from "../../utils/stringUtils";
import { DownloadButton } from "../../components";

const PREFIX = "NovelInfo";
const classes = {
  root: `${PREFIX}-root`,
  image: `${PREFIX}-image`,
  details: `${PREFIX}-details`,
  title: `${PREFIX}-title`,
  info: `${PREFIX}-info`,
  rating: `${PREFIX}-rating`,
  paper: `${PREFIX}-paper`,
  description: `${PREFIX}-description`,
  showMoreButton: `${PREFIX}-showMoreButton`,
};

const Root = styled("div")(({ theme }) => ({
  [`& .${classes.paper}`]: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
  [`& .${classes.image}`]: {
    width: "100%",
    height: "auto",
  },
  [`& .${classes.details}`]: {
    padding: theme.spacing(2),
  },
  [`& .${classes.title}`]: {
    textTransform: "uppercase",
    marginBottom: theme.spacing(1),
  },
  [`& .${classes.info}`]: {
    marginBottom: theme.spacing(1),
  },
  [`& .${classes.rating}`]: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  [`& .${classes.description}`]: {
    whiteSpace: "pre-line",
  },
  [`& .${classes.showMoreButton}`]: {
    marginTop: theme.spacing(1),
  },
}));

const NovelInfo = ({ novel }) => {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  const handleCategory = (categoryName) => {
    navigate(`/the-loai/${normalizeString(categoryName)}`);
  };

  const handleAuthor = (authorName) => {
    navigate(`/tac-gia/${normalizeString(authorName)}`);
  };

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const shortDescription =
    novel?.description?.split(".").slice(0, 3).join(". ") + "...";
  const genresList = novel?.genres?.split(", ");

  return (
    <Root>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <img
              src={novel?.image}
              alt="Book Cover"
              className={classes.image}
            />
            <Typography variant="body1" className={classes.info}>
              <div>
                Tác giả:&nbsp;
                <span
                  onClick={() => handleAuthor(novel?.author)}
                  style={{ cursor: "pointer" }}
                >
                  {novel?.author}
                </span>
              </div>
              <div>
                Thể loại:
                {genresList?.map((category, index) => (
                  <span
                    key={index}
                    onClick={() => handleCategory(category)}
                    style={{ cursor: "pointer" }}
                  >
                    &nbsp;{category}
                    {index < genresList.length - 1 ? "," : ""}
                  </span>
                ))}
              </div>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8} className={classes.details}>
            <Typography variant="h4" className={classes.title}>
              {novel?.title}
            </Typography>
            <Box className={classes.rating}>
              <Rating value={novel?.rating / 2} readOnly />
              <Typography
                variant="body2"
                component="span"
                style={{ marginLeft: 8 }}
              >
                {novel?.rating}/10
              </Typography>
            </Box>
            <DownloadButton title={novel?.title}/>
            <Typography variant="body2" className={classes.description}>
              {showMore ? novel?.description : shortDescription}
            </Typography>
            <Button onClick={handleShowMore} className={classes.showMoreButton}>
              {showMore ? "Thu gọn" : "Xem thêm"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Root>
  );
};

export default NovelInfo;
