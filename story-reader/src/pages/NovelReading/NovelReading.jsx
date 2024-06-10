import { useState, useEffect } from 'react';
import { Container, Grid, Box, Button, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb, Loading, DownloadButton } from '../../components';
import ChapterListDropDown from './ChapterListDropDown';
import ChapterListFloating from './ChapterListFloating';
import { useAllSources } from '../../hooks/useAllSources';
import {
  useNovelChapterContent,
  useNovelChapterList,
  useNovelDetail,
} from '../../hooks/novelHook';

const PREFIX = 'NovelReading';
const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  paper: `${PREFIX}-paper`,
  content: `${PREFIX}-content`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.title}`]: {
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1),
  },
  [`& .${classes.paper}`]: {
    backgroundColor: theme.palette.background.paper,
    whiteSpace: 'pre-line',
    fontSize: 'var(--font-size)',
    lineHeight: 'var(--line-height)',
    fontFamily: 'var(--font-family)',
  },
  [`& .${classes.root}`]: {
    marginLeft: '10%',
  },
  [`& .${classes.content}`]: {
    marginLeft: '5%',
    marginRight: '5%',
    fontSize: 'var(--font-size)',
    lineHeight: 'var(--line-height)',
    fontFamily: 'var(--font-family)',
  },
}));

const NavigationContainer = styled(Container)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

const NavButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const NovelReading = () => {
  const { title, chapter } = useParams();
  const navigate = useNavigate();
  const initialChapter = chapter ? chapter : 'chuong-1';
  const [currentChapter, setCurrentChapter] = useState(initialChapter);

  const { source: sources } = useAllSources();
  const [currentSource, setCurrentSource] = useState(sources);
  const { data: { raw_chapter_number_list: chapters } = {} } =
    useNovelChapterList(title, 1);
  const currentChapterIndex = chapters?.indexOf(currentChapter);

  const { data: { content } = {} } = useNovelChapterContent(
    title,
    currentChapter,
    currentSource || sources
  );

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
    return chapter?.replace('chuong-', 'Chương ');
  }

  function updateLocalStorage(title, chapter) {
    if (title) {
      const novel = { title, chapter };
      let novelList = JSON.parse(localStorage.getItem('novelListRecently')) || [];
      let novelListReaded = JSON.parse(localStorage.getItem('novelListReaded')) || [];
  
      const novelIndex = novelList.findIndex((item) => item.title === title);
      const novelIndexReaded = novelListReaded.findIndex(item => item.title === title);
  
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
  
      localStorage.setItem('novelListRecently', JSON.stringify(novelList));
      localStorage.setItem('novelListReaded', JSON.stringify(novelListReaded));
    }
  }

  const handlePrevious = () => {
    if (chapters && currentChapterIndex > 0) {
      const newChapter = chapters[currentChapterIndex - 1];
      setCurrentChapter(newChapter);
      navigate(`/doc-truyen/${title}/${newChapter}`);
    }
  };

  const handleNext = () => {
    if (chapters && currentChapterIndex < chapters.length - 1) {
      const newChapter = chapters[currentChapterIndex + 1];
      setCurrentChapter(newChapter);
      navigate(`/doc-truyen/${title}/${newChapter}`);
    }
  };

  const handleServer = (source) => {
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
          <ChapterListFloating title={title} chapters={chapters}/>
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
          <Box>
            {sources?.map((source, index) => (
              <NavButton
                key={index}
                variant="outlined"
                onClick={() => {
                  handleServer(source);
                }}
              >
                Server {index + 1}
              </NavButton>
            ))}
            <DownloadButton title={title}/>
          </Box>
        </NavigationContainer>
        <Typography
          variant="subtitle1"
          gutterBottom
          className={classes.content}
        >
          {<div dangerouslySetInnerHTML={{ __html: content }} /> ||
            'Nội dung chương đang được tải...'}
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
          <Box>
            {sources?.map((source, index) => (
              <NavButton
                key={index}
                variant="outlined"
                onClick={() => {
                  handleServer(source);
                }}
              >
                Server {index + 1}
              </NavButton>
            ))}
            <DownloadButton title={title}/>
          </Box>
        </NavigationContainer>
      </Paper>
    </Root>
  );
};

export default NovelReading;
