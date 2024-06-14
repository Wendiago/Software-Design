/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { Container, Grid, Box, Button, Typography, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useParams, useNavigate } from "react-router-dom";
import { Breadcrumb, Loading } from "../../components";
import ChapterListDropDown from "./ChapterListDropDown";
import ChapterListFloating from "./ChapterListFloating";
import { useAllSources } from "../../hooks/useAllSources";
import {
  useNovelChapterContent,
  useNovelChapterList,
  useNovelDetail,
} from "../../hooks/novelHook";
import toast from "react-hot-toast";
import { usePrioritizedSources } from "../../contexts/PrioritizedSourcesContext";
import ServerNav from "./ServerNav";

const PREFIX = "NovelReading";
const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  paper: `${PREFIX}-paper`,
  content: `${PREFIX}-content`,
  noContent: `${PREFIX}-noContent`,
};

const Root = styled("div")(({ theme }) => ({
  [`& .${classes.title}`]: {
    textTransform: "uppercase",
    marginBottom: theme.spacing(1),
  },
  [`& .${classes.paper}`]: {
    backgroundColor: theme.palette.background.paper,
    whiteSpace: "pre-line",
    fontSize: "var(--font-size)",
    lineHeight: "var(--line-height)",
    fontFamily: "var(--font-family)",
  },
  [`& .${classes.root}`]: {
    marginLeft: "10%",
  },
  [`& .${classes.content}`]: {
    marginLeft: "5%",
    marginRight: "5%",
    fontSize: "var(--font-size)",
    lineHeight: "var(--line-height)",
    fontFamily: "var(--font-family)",
  },
  [`& .${classes.noContent}`]: {
    textAlign: "center",
  },
}));

const NavigationContainer = styled(Container)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

const NavButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const NovelReading = () => {
  const { title, chapter } = useParams();
  const navigate = useNavigate();

  const currentChapter = chapter || "chuong-1";

  const { source: sources } = useAllSources();
  const { prioritizedSources } = usePrioritizedSources();
  const [currentSource, setCurrentSource] = useState(prioritizedSources);

  // , addPrioritizedSource, deletePrioritizedSource
  const { data: { raw_chapter_number_list: chapters } = {} } =
    useNovelChapterList(title, 1);
  const currentChapterIndex = chapters?.indexOf(currentChapter);

  const sourcesToFetch = currentSource.length != 0 ? currentSource : sources;
  const { isPending: isLoadingContent, data: { content } = {} } =
    useNovelChapterContent(title, currentChapter, sourcesToFetch);

  const { data: { title: fullTitle } = {} } = useNovelDetail(title);

  const breadcrumbs = [
    {
      name: fullTitle,
      link: `/gioi-thieu/${title}`,
    },
    {
      name: `${formatChapter(currentChapter)}`,
      link: `/doc-truyen/${title}/${currentChapter}`,
    },
  ];

  useEffect(
    function () {
      updateLocalStorage(fullTitle, currentChapter);
    },
    [fullTitle, currentChapter]
  );

  function formatChapter(chapter) {
    return chapter?.replace("chuong-", "Chương ");
  }

  function updateLocalStorage(title, chapter) {
    if (title) {
      const novel = { title, chapter };
      let novelList =
        JSON.parse(localStorage.getItem("novelListRecently")) || [];
      let novelListReaded =
        JSON.parse(localStorage.getItem("novelListReaded")) || [];

      const novelIndex = novelList.findIndex((item) => item.title === title);
      const novelIndexReaded = novelListReaded.findIndex(
        (item) => item.title === title
      );

      if (novelIndex === -1) {
        novelList.push(novel);
      } else {
        novelList[novelIndex] = novel;
      }

      if (novelIndexReaded === -1) {
        novelListReaded.push({ title, chapters: [chapter] });
      } else {
        if (!novelListReaded[novelIndexReaded].chapters.includes(chapter)) {
          novelListReaded[novelIndexReaded].chapters.push(chapter);
        }
      }

      localStorage.setItem("novelListRecently", JSON.stringify(novelList));
      localStorage.setItem("novelListReaded", JSON.stringify(novelListReaded));
    }
  }

  const handlePrevious = () => {
    if (chapters && currentChapterIndex > 0) {
      const newChapter = chapters[currentChapterIndex - 1];
      navigate(`/doc-truyen/${title}/${newChapter}`);
    }
  };

  const handleNext = () => {
    if (chapters && currentChapterIndex < chapters.length - 1) {
      const newChapter = chapters[currentChapterIndex + 1];
      navigate(`/doc-truyen/${title}/${newChapter}`);
    }
  };

  const handleServer = (source) => {
    if (currentSource?.at(0) === source) return;

    toast.success(
      <p>
        Chuyển sang server <strong>{source}</strong> thành công 😊
      </p>
    );
    setCurrentSource([source]);
  };

  if (!sources || !title) {
    return <Loading />;
  }

  return (
    <Root>
      <Paper className={classes.paper}>
        <NavigationContainer>
          <Grid>
            <Breadcrumb breadcrumbs={breadcrumbs} />
          </Grid>
          <ChapterListFloating title={title} chapters={chapters} />
          <Typography variant="h5" gutterBottom className={classes.title}>
            {fullTitle}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {formatChapter(currentChapter)}
          </Typography>
          <Box>
            <NavButton
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentChapterIndex <= 0}
            >
              &lt; Chương trước
            </NavButton>
            <NavButton>
              <ChapterListDropDown title={title} chapters={chapters} />
            </NavButton>
            <NavButton
              variant="outlined"
              onClick={handleNext}
              disabled={chapters && currentChapterIndex >= chapters.length - 1}
            >
              Chương tiếp &gt;
            </NavButton>
          </Box>

          <ServerNav
            sources={sources}
            currentSource={currentSource}
            title={title}
            onHandleServer={handleServer}
          />
        </NavigationContainer>
        <Typography
          variant="subtitle1"
          gutterBottom
          className={classes.content}
        >
          {isLoadingContent && (
            <div className={classes.noContent}>
              Nội dung chương đang được tải...
            </div>
          )}
          {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
          {!content && !isLoadingContent && (
            <div className={classes.noContent}>
              Oops!!! Server{" "}
              <strong>{currentSource ? currentSource[0] : sources[0]}</strong>{" "}
              không hỗ trợ truyện này
            </div>
          )}
        </Typography>
        <NavigationContainer>
          <Box>
            <NavButton
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentChapterIndex <= 0}
            >
              &lt; Chương trước
            </NavButton>
            <NavButton>
              <ChapterListDropDown title={title} chapters={chapters} />
            </NavButton>
            <NavButton
              variant="outlined"
              onClick={handleNext}
              disabled={chapters && currentChapterIndex >= chapters.length - 1}
            >
              Chương tiếp &gt;
            </NavButton>
          </Box>
          <ServerNav
            sources={sources}
            currentSource={currentSource}
            title={title}
            onHandleServer={handleServer}
          />
        </NavigationContainer>
      </Paper>
    </Root>
  );
};

export default NovelReading;
