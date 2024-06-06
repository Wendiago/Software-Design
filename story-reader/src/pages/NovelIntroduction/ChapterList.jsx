import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Grid,
  Pagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { normalizeString } from "../../utils/stringUtils";
import { novelAPI } from "../../api";
import { Loading } from "../../components";
import { useNovelChapterList } from "../../hooks/novelHook";
import toast from "react-hot-toast";

const PREFIX = "ChapterList";
const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`,
  title: `${PREFIX}-title`,
  paper: `${PREFIX}-paper`,
  pagination: `${PREFIX}-pagination`,
  item: `${PREFIX}-item`,
};

const Root = styled("div")(({ theme }) => ({
  [`& .${classes.paper}`]: {
    backgroundColor: theme.palette.background.paper,
  },
  [`& .${classes.root}`]: {
    marginTop: theme.spacing(2),
  },
  [`& .${classes.list}`]: {
    padding: theme.spacing(2),
  },
  [`& .${classes.title}`]: {
    padding: theme.spacing(2),
  },
  [`& .${classes.pagination}`]: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  [`& .${classes.item}`]: {
    cursor: "pointer",
  },
}));

const ChapterList = ({ title }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    isPending: isLoadingChapters,
    error: chaptersError,
    data: { chapters, total_pages } = {},
  } = useNovelChapterList(title, page);

  const handleChapter = (chapterNumber) => {
    const normalizeChapter = normalizeString(chapterNumber.split(':')[0]);
    navigate(`/doc-truyen/${normalizeString(title)}/${normalizeChapter}`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const splitChapters = () => {
    const half = Math.ceil(chapters?.length / 2);
    return [chapters?.slice(0, half), chapters?.slice(half)];
  };

  const [leftChapters, rightChapters] = splitChapters();

  if (chaptersError)
    toast.error(chaptersError.message || chaptersError.response);

  if (isLoadingChapters) {
    return <Loading />;
  }

  return (
    <Root>
      <Paper className={classes.paper}>
        <Typography variant="h6" className={classes.title}>
          DANH SÁCH CHƯƠNG
        </Typography>
        {isMobile ? (
          <List>
            {chapters?.map((chapter, index) => (
              <ListItem key={index} onClick={() => handleChapter(chapter)}>
                <ListItemText className={classes.item} primary={chapter} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Grid container spacing={2} className={classes.list}>
            <Grid item xs={6}>
              <List>
                {leftChapters?.map((chapter, index) => (
                  <ListItem key={index} onClick={() => handleChapter(chapter)}>
                    <ListItemText className={classes.item} primary={chapter} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={6}>
              <List>
                {rightChapters?.map((chapter, index) => (
                  <ListItem key={index} onClick={() => handleChapter(chapter)}>
                    <ListItemText className={classes.item} primary={chapter} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        )}
        <div className={classes.pagination}>
          <Pagination
            count={total_pages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </div>
      </Paper>
    </Root>
  );
};

export default ChapterList;
