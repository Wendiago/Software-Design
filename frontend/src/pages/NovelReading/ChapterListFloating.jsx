import { useState } from "react";
import {
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { normalizeString } from "../../utils/stringUtils";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PropTypes from "prop-types";

const PREFIX = "ChapterListFloating";
const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  button: `${PREFIX}-button`,
  floatingPanel: `${PREFIX}-floatingPanel`,
  list: `${PREFIX}-list`,
  listItem: `${PREFIX}-listItem`,
};

const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    position: "relative",
    padding: theme.spacing(2),
  },
  [`& .${classes.button}`]: {
    backgroundColor: theme.palette.background.default,
    position: "fixed",
    top: theme.spacing(10),
    right: theme.spacing(2),
  },
  [`& .${classes.floatingPanel}`]: {
    position: "fixed",
    top: 0,
    right: 0,
    width: "300px",
    height: "100%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    zIndex: 1300,
    overflowY: "auto",
    padding: theme.spacing(2),
  },
  [`& .${classes.list}`]: {
    maxHeight: "100%",
    overflowY: "auto",
  },
  [`& .${classes.listItem}`]: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const ChapterListFloating = ({ title, chapters }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleTogglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleChapter = (chapterNumber) => {
    navigate(`/doc-truyen/${normalizeString(title)}/${chapterNumber}`);
    setIsPanelOpen(false);
  };

  const formatChapter = (chapter) => chapter.replace("chuong-", "Chương ");
  const novelListReaded =
    JSON.parse(localStorage.getItem("novelListReaded")) || [];
  const readChapters =
    novelListReaded.find((novel) => normalizeString(novel.title) === title)
      ?.chapters || [];

  return (
    <Root className={classes.root}>
      {isPanelOpen ? (
        <Paper className={classes.floatingPanel}>
          <Typography variant="h6">
            <Button onClick={handleTogglePanel}>
              <FaChevronRight />
            </Button>
            Chọn chương
          </Typography>
          <List className={classes.list}>
            {chapters?.map((chapter, index) => (
              <ListItem
                key={index}
                className={classes.listItem}
                onClick={() => handleChapter(chapter)}
              >
                <ListItemText
                  primary={formatChapter(chapter)}
                  style={{
                    color: readChapters.includes(chapter)
                      ? theme.palette.text.secondary
                      : theme.palette.text.primary,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : (
        <Button className={classes.button} onClick={handleTogglePanel}>
          <FaChevronLeft />
        </Button>
      )}
    </Root>
  );
};

ChapterListFloating.propTypes = {
  title: PropTypes.string.isRequired,
  chapters: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export default ChapterListFloating;
