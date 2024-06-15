import { Select, MenuItem, Paper, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { normalizeString } from "../../utils/stringUtils";
import PropTypes from "prop-types";

const PREFIX = "ChapterList";
const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  select: `${PREFIX}-select`,
  text: `${PREFIX}-text`,
};

const Root = styled("div")(({ theme }) => ({
  [`& .${classes.paper}`]: {
    backgroundColor: theme.palette.background.default,
    maxHeight: "40px",
  },
  [`& .${classes.root}`]: {
    marginTop: theme.spacing(2),
  },
  [`& .${classes.select}`]: {
    maxWeight: "100px",
    maxHeight: "38px",
    borderColor: theme.palette.primary.main,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
    "& .MuiSelect-icon": {
      color: theme.palette.primary.main,
    },
  },
  [`& .${classes.text}`]: {
    color: theme.palette.text.primary,
  },
}));

const CustomSelect = styled(Select)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.text.primary,
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
}));

const ChapterListDropDown = ({ title, chapters }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChapter = (chapterNumber) => {
    navigate(`/doc-truyen/${normalizeString(title)}/${chapterNumber}`);
  };

  const formatChapter = (chapter) => chapter.replace("chuong-", "Chương ");
  const novelListReaded =
    JSON.parse(localStorage.getItem("novelListReaded")) || [];
  const readChapters =
    novelListReaded.find((novel) => normalizeString(novel.title) === title)
      ?.chapters || [];

  return (
    <Root>
      <Paper className={classes.paper}>
        <CustomSelect
          className={classes.select}
          value=""
          onChange={(event) => handleChapter(event.target.value)}
          displayEmpty
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 400,
              },
            },
          }}
        >
          <CustomMenuItem value="" disabled>
            Chọn chương
          </CustomMenuItem>
          {chapters?.map((chapter, index) => (
            <CustomMenuItem key={index} value={chapter}>
              <div
                style={{
                  color: readChapters.includes(chapter)
                    ? theme.palette.text.secondary
                    : theme.palette.text.primary,
                }}
              >
                {formatChapter(chapter)}
              </div>
            </CustomMenuItem>
          ))}
        </CustomSelect>
      </Paper>
    </Root>
  );
};

ChapterListDropDown.propTypes = {
  title: PropTypes.string.isRequired,
  chapters: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export default ChapterListDropDown;
