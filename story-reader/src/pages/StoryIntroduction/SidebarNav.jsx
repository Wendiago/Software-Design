import React from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
  ButtonGroup,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { normalizeString } from '../../utils/stringUtils';

const PREFIX = 'SidebarNav';
const classes = {
  root: `${PREFIX}-root`,
  section: `${PREFIX}-section`,
  trendingButtonGroup: `${PREFIX}-trendingButtonGroup`,
  item: `${PREFIX}-item`, 
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    flexGrow: 1,
    marginTop: theme.spacing(2),
  },
  [`& .${classes.section}`]: {
    marginBottom: theme.spacing(2),
  },
  [`& .${classes.trendingButtonGroup}`]: {
    marginBottom: theme.spacing(2),
  },
  [`& .${classes.item}`]: {
    cursor: 'pointer',
  },
}));

const TruyenCungTacGia = ({ stories }) => {
  const navigate = useNavigate();

  const handleStory = (storyName) => {
    console.log(storyName);
    navigate(`/gioi-thieu/${normalizeString(storyName)}`);
  };

  return (
    <div className={classes.section}>
      <Typography variant="h6">TRUYỆN CÙNG TÁC GIẢ</Typography>
      <List>
        {stories?.map((story, index) => (
          <ListItem key={index}>
            <ListItemText className={classes.item} primary={story.title} onClick={() => handleStory(story.title)} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

const TruyenDangHot = ({ trendingStories }) => {
  const [selectedTab, setSelectedTab] = React.useState('day');
  const navigate = useNavigate();

  const handleStory = (storyName) => {
    navigate(`/gioi-thieu/${normalizeString(storyName)}`);
  };

  return (
    <div className={classes.section}>
      <Typography variant="h6">TRUYỆN ĐANG HOT</Typography>
      <ButtonGroup
        variant="outlined"
        size="small"
        className={classes.trendingButtonGroup}
      >
        <Button onClick={() => setSelectedTab('day')}>NGÀY</Button>
        <Button onClick={() => setSelectedTab('month')}>THÁNG</Button>
        <Button onClick={() => setSelectedTab('allTime')}>ALL TIME</Button>
      </ButtonGroup>
      <List>
        {trendingStories[selectedTab]?.map((story, index) => (
          <ListItem key={index}>
            <ListItemText
              className={classes.item}
              primary={story.title}
              secondary={story.genre}
              onClick={() => handleStory(story.title)}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

const SidebarNav = () => {
  const sameAuthorStories = [
    { title: "Chương Hoan", link: "#" },
    { title: "Thiều Quang Đến Chậm", link: "#" }
  ];

  const trendingStories = {
    day: [
      { title: "Thần Đạo Đan Tôn", genre: "Tiên Hiệp, Huyền Huyễn" },
      { title: "Linh Vũ Thiên Hạ", genre: "Tiên Hiệp, Dị Giới, Huyền Huyễn" },
      { title: "Đấu Phá Thương Khung", genre: "Tiên Hiệp, Dị Giới, Huyền Huyễn" }
      // Add more as needed
    ],
    month: [
      { title: "Mẹ Vợ Không Lỗi Về", genre: "Ngôn Tình, Ngược, Sủng" },
      { title: "Thế Giới Hoàn Mỹ", genre: "Tiên Hiệp, Kiếm Hiệp, Huyền Huyễn" },
      { title: "Cô Vợ Ngọt Ngào Có Chút Bất Lương", genre: "Ngôn Tình, Trọng Sinh" }
      // Add more as needed
    ],
    allTime: [
      { title: "Phàm Nhân Tu Tiên", genre: "Tiên Hiệp" },
      { title: "Linh Vũ Thiên Hạ", genre: "Tiên Hiệp, Dị Giới, Huyền Huyễn" },
      { title: "Đấu Phá Thương Khung", genre: "Tiên Hiệp, Dị Giới, Huyền Huyễn" }
      // Add more as needed
    ]
  };

  return (
    <Root className={classes.root}>
      <Container>
        <TruyenCungTacGia stories={sameAuthorStories} />
        <TruyenDangHot trendingStories={trendingStories} />
      </Container>
    </Root>
  );
};

export default SidebarNav;
