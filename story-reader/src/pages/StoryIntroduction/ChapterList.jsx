import React, { useState } from 'react';
import { List, ListItem, ListItemText, Paper, Typography, Grid, Pagination } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { normalizeString } from '../../utils/stringUtils';

const PREFIX = 'ChapterList';
const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`,
  title: `${PREFIX}-title`,
  paper: `${PREFIX}-paper`,
  pagination: `${PREFIX}-pagination`,
};

const Root = styled('div')(({ theme }) => ({
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
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
}));

const chapters = [
  "Chương 1: Đêm",
  "Chương 2: Tai nghe là giả",
  "Chương 3: Cứu người",
  "Chương 4: Võ sĩ",
  "Chương 5: Lương thiếp",
  "Chương 6: Phụ huynh",
  "Chương 7: Từ tâm đường",
  "Chương 8: Hôn nhân đại sự",
  "Chương 9: Thưởng phạt",
  "Chương 10: Ngựa quen đường cũ",
  "Chương 11: Ngõ tối",
  "Chương 12: Thiếu niên cùng cẩu",
  "Chương 13: Dư Thất",
  "Chương 14: Từ hôn",
  "Chương 15: Phá gia chi tử",
  "Chương 16: Người yêu nhau cuối cùng cũng sống cùng nhau",
  "Chương 17: Nhị đường tỷ",
  "Chương 18: Mộng",
  "Chương 19: Trà lâu",
  "Chương 20: Uyển chuyển",
  "Chương 21: Đúng đắn",
  "Chương 22: Tâm không nan lừa hôn",
  "Chương 23: Tửu tiên",
  "Chương 24: Tỷ muội",
  "Chương 25: Ứng nghiệm",
  "Chương 26: Mất mặt",
  "Chương 27: Trò khôi hài",
  "Chương 28: Đừng để ta nghe thấy là được",
  "Chương 29: Dụ dỗ",
  "Chương 30: Còn muốn đánh nữa hay không hả?",
  "Chương 31: Đây là xá muội",
  "Chương 32: Tên khốn nạn lừa hôn",
  "Chương 33: Tủi tiên",
  "Chương 34: Tỷ muội",
  "Chương 35: Ứng nghiệm",
  "Chương 36: Trò cũ",
  "Chương 37: Tiên cô",
  "Chương 38: Mồi câu",
  "Chương 39: Nhược điểm",
  "Chương 40: Lòng người hiểm ác",
  "Chương 41: Dương danh hiếu tâm",
  "Chương 42: Lên đài",
  "Chương 43: Lĩnh âm (Cầu đặt đơn trước)",
  "Chương 44: Lòng người hiểm ác",
];

const ChapterList = ({ title }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const chaptersPerPage = 30;

  const handleChapter = (chapterNumber) => {
    navigate(`/doc-truyen/${normalizeString(title)}/chuong-${chapterNumber}`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * chaptersPerPage;
  const endIndex = startIndex + chaptersPerPage;
  const currentChapters = chapters.slice(startIndex, endIndex);

  const columnChapters = Math.ceil(currentChapters.length / 2);

  return (
    <Root>
      <Paper className={classes.paper}>
        <Typography variant="h6" className={classes.title}>DANH SÁCH CHƯƠNG</Typography>
        <Grid container spacing={2} className={classes.list}>
          <Grid item xs={6}>
            <List>
              {currentChapters.slice(0, columnChapters)?.map((chapter, index) => (
                <ListItem button key={index} onClick={() => handleChapter(startIndex + index + 1)}>
                  <ListItemText primary={chapter} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={6}>
            <List>
              {currentChapters.slice(columnChapters)?.map((chapter, index) => (
                <ListItem button key={index} onClick={() => handleChapter(startIndex + columnChapters + index + 1)}>
                  <ListItemText primary={chapter} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
        <div className={classes.pagination}>
          <Pagination
            count={Math.ceil(chapters.length / chaptersPerPage)}
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
