import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, Button, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import { sourceAPI, novelAPI } from '../../api';
import { Breadcrumb, Loading } from '../../components';
import ChapterListDropDown from './ChapterListDropDown';
import ChapterListFloating from './ChapterListFloating';

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
  },
  [`& .${classes.root}`]: {
    marginLeft: '10%',
  },
  [`& .${classes.content}`]: {
    marginLeft: '5%',
    marginRight: '5%',
  },
}));

const NavigationContainer = styled(Container)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

const NavButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1)
}));

const NovelReading = () => {
  const { title, chapter } = useParams();
  const navigate = useNavigate();
  const initialChapter = chapter ? chapter : 'chuong-1';
  const [currentChapter, setCurrentChapter] = useState(initialChapter);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(null);
  const [chapters, setChapters] = useState(null);
  const [content, setContent] = useState(null);
  const [fullTitle, setFullTitle] = useState(null);
  const [sources, setSources] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const formatChapter = (chapter) => {
    return chapter?.replace('chuong-', 'Chương ');
  };

  const updateLocalStorage = (title, chapter) => {
    const novel = { title, chapter };
    let novelList = JSON.parse(localStorage.getItem('novelList')) || [];
  
    const novelIndex = novelList.findIndex(item => item.title === title);
  
    if (novelIndex === -1) {
      novelList.push(novel);
    } else {
      novelList[novelIndex] = novel;
    }

    console.log(novelList)
  
    localStorage.setItem('novelList', JSON.stringify(novelList));
  };

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const result = await sourceAPI.getAllSources();
        setSources(result.data);
        return result.data;
      } catch (error) {
        console.error('Error fetching sources:', error);
      }
    };

    const fetchNovelDetail = async (source) => {
      if (source && title) {
        try {
          const result = await novelAPI.getNovelDetail({ title, source });
          return result.data;
        } catch (error) {
          console.error('Error fetching novel detail:', error);
        }
      }
    };

    const fetchNovelChapters = async (source) => {
      if (source && title) {
        try {
          const result = await novelAPI.getNovelChapterList({ title, pageNumber: 1, source});
          const chapterIndex = result?.data?.raw_chapter_number_list 
                              ? result?.data?.raw_chapter_number_list.indexOf(currentChapter) 
                              : 0;

          setCurrentChapterIndex(chapterIndex);
          setChapters(result?.data?.raw_chapter_number_list);
        } catch (error) {
          console.error('Error fetching novel detail:', error);
        }
      }
    }

    const fetchNovelContent = async (chapterNumber, source) => {
      try {
        if (chapterNumber && source && title) {
          const result = await novelAPI.getNovelChapterContent({ title, chapterNumber, source });
          
          setContent(result.data.content);
        }
      } catch (error) {
        console.error('Error fetching novel content:', error);
      }
    };

    const fetchData = async (currentChapter) => {
      const sourcesResult = await fetchSources();
      if (sourcesResult) {
        await fetchNovelChapters(sourcesResult);
        await fetchNovelContent(currentChapter, sourcesResult);
        const detail = await fetchNovelDetail(sourcesResult);
        console.log(detail)
        setBreadcrumbs([
          {
            name: detail.title,
            link: `/gioi-thieu/${title}`,
          },
          {
            name: `${formatChapter(currentChapter)}`,
            link: `/doc-truyen/${title}/${currentChapter}`,
          },
        ]);

        setFullTitle(detail.title);
        updateLocalStorage(detail.title, currentChapter);
      }
    };

    fetchData(currentChapter);
  }, [title, currentChapter]);

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

  const handleServer = (server) => {
    const fetchNovelContent = async (chapterNumber, source) => {
      try {
        if (chapterNumber && source) {
          const result = await novelAPI.getNovelChapterContent({ title, chapterNumber, source });
          setContent(result.data.content);
        }
      } catch (error) {
        console.error('Error fetching novel content:', error);
      }
    };
    const source = [server];
    fetchNovelContent(currentChapter, source);
  };

  if (!sources || !title) {
    return (
      <Loading/>
    )
  }

  return (
    <Root>
      <Paper className={classes.paper}>
        <NavigationContainer>
          <Grid>
            <Breadcrumb breadcrumbs={breadcrumbs}/>
          </Grid>
          <ChapterListFloating title={title} chapters={chapters}/>
          <Typography variant="h5" gutterBottom className={classes.title}>
            {fullTitle}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {formatChapter(currentChapter)}
          </Typography>
          <Box>
            <NavButton variant="outlined" onClick={handlePrevious} disabled={currentChapterIndex <= 0}>
              &lt; Chương trước
            </NavButton>
            <NavButton>
              <ChapterListDropDown title={title} chapters={chapters}/>
            </NavButton>
            <NavButton variant="outlined" onClick={handleNext} disabled={chapters && currentChapterIndex >= chapters.length - 1}>
              Chương tiếp &gt;
            </NavButton>
          </Box>
          <Box>
            {sources?.map((source, index) => (
              <NavButton key={index} variant="outlined" onClick={() => {handleServer(source)}}>
              Server {index + 1}
              </NavButton>
            ))}
          </Box>
        </NavigationContainer>
        <Typography variant="subtitle1" gutterBottom className={classes.content}>
          {<div dangerouslySetInnerHTML={{ __html: content }} /> || 'Nội dung chương đang được tải...'}
        </Typography>
        <NavigationContainer>
          <Box>
            <NavButton variant="outlined" onClick={handlePrevious} disabled={currentChapterIndex <= 0}>
              &lt; Chương trước
            </NavButton>
            <NavButton>
              <ChapterListDropDown title={title} chapters={chapters}/>
            </NavButton>
            <NavButton variant="outlined" onClick={handleNext} disabled={chapters && currentChapterIndex >= chapters.length - 1}>
              Chương tiếp &gt;
            </NavButton>
          </Box>
          <Box>
            {sources?.map((source, index) => (
              <NavButton key={index} variant="outlined" onClick={() => {handleServer(source)}}>
              Server {index + 1}
              </NavButton>
            ))}
          </Box>
        </NavigationContainer>
      </Paper>
    </Root>
  );
};

export default NovelReading;