import React, { useState, useEffect } from 'react';
import { Container, Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import { sourceAPI, novelAPI } from '../../api';

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

  const initialChapter = chapter ? parseInt(chapter, 10) : (parseInt(localStorage.getItem('currentChapter'), 10) || 1);

  const [currentChapter, setCurrentChapter] = useState(initialChapter);
  const [content, setContent] = useState('');
  const [sources, setSources] = useState([]);

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

    const fetchNovelContent = async (chapterNumber, sources) => {
      try {
        if (chapterNumber && sources) {
          const source = [
            "truyenfull",
            "truyencv"
          ];
          const result = await novelAPI.getNovelChapter({ title, chapterNumber, source });
          console.log(result)
          setContent(result.data.content);
        }
      } catch (error) {
        console.error('Error fetching novel content:', error);
      }
    };

    const fetchData = async (currentChapter) => {
      const sourcesResult = await fetchSources();
      if (sourcesResult) {
        await fetchNovelContent(currentChapter, sourcesResult);
      }
    };

    fetchData(currentChapter);
  }, [title, currentChapter]);

  const handlePrevious = () => {
    if (currentChapter > 1) {
      const newChapter = currentChapter - 1;
      setCurrentChapter(newChapter);
      navigate(`/doc-truyen/${title}/${newChapter}`);
    }
  };

  const handleNext = () => {
    const newChapter = currentChapter + 1;
    setCurrentChapter(newChapter);
    navigate(`/doc-truyen/${title}/${newChapter}`);
  };

  return (
    <NavigationContainer>
      <Typography variant="h5" gutterBottom>
        NÀNG KHÔNG MUỐN LÀM HOÀNG HẬU
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Chương {currentChapter}
      </Typography>
      <Box>
        <NavButton variant="outlined" onClick={handlePrevious} disabled={currentChapter <= 1}>
          &lt; Chương trước
        </NavButton>
        <NavButton variant="outlined" onClick={handleNext}>
          Chương tiếp &gt;
        </NavButton>
      </Box>
      <Typography variant="subtitle1" gutterBottom>
        {content || 'Nội dung chương đang được tải...'}
      </Typography>
      <Box>
        <NavButton variant="outlined" onClick={handlePrevious} disabled={currentChapter <= 1}>
          &lt; Chương trước
        </NavButton>
        <NavButton variant="outlined" onClick={handleNext}>
          Chương tiếp &gt;
        </NavButton>
      </Box>
    </NavigationContainer>
  );
};

export default NovelReading;
