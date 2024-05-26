import React, { useState } from 'react';
import { Typography, Grid, Paper, Box, Rating, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { normalizeString } from '../../utils/stringUtils';

const PREFIX = 'BookInfo';
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

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.paper}`]: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
  [`& .${classes.image}`]: {
    width: '100%',
    height: 'auto',
  },
  [`& .${classes.details}`]: {
    padding: theme.spacing(2),
  },
  [`& .${classes.title}`]: {
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1),
  },
  [`& .${classes.info}`]: {
    marginBottom: theme.spacing(1),
  },
  [`& .${classes.rating}`]: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  [`& .${classes.description}`]: {
    whiteSpace: 'pre-line',
  },
  [`& .${classes.showMoreButton}`]: {
    marginTop: theme.spacing(1),
  },
}));

const BookInfo = () => {
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

  const storyInfo = {
    id: 'nang-khong-muon-lam-hoang-hau',
    title: 'Nàng Không Muốn Làm Hoàng Hậu',
    image: 'https://lh3.googleusercontent.com/pw/AJFCJaVjuIBFnTKQ5soBnZlRWVtCxD3sg1ILwmCHYgnNBJtHdpQlmtRRAJm28EmxtxPtR3UE8bxLUMLsf_PCPFivFFj_YYYnnkXgbjPUyBdCzx1TaicW3dK17dpLz7pSoYMq0muNmrmYxWjTwey3ThHPBdgt=w215-h322-s-no?authuser=0',
    rating: 4,
    ratingInfo: '8.4/10 từ 2761 lượt',
    author: 'Thâm Bích Sắc',
    categoryList: ['Ngôn Tình', 'Cổ đại', 'Ngược', 'Khác'],
    source: 'ST',
    status: 'Full',
    description: 'Phụ mẫu Vân Kiều mất sớm, một mình nàng tự buôn bán nhỏ, còn nhặt được một thư sinh nghèo mi thanh mục tú về làm phu quân, mỗi ngày trôi qua cũng có chút thú vị. Sau này, khi phu quân nàng vào kinh đi thi, hắn bỗng nhiên trở thành Thái tử tôn quý. Ai ai cũng đều nói Vân Kiều nàng có phúc, ấy vậy mà lại được gả cho hoàng tử lưu lạc ở dân gian. Song, Vân Kiều lại cảm thấy vô cùng hụt hẫng. Nàng không quen với cuộc sống cẩm y ngọc thực, cũng không am hiểu cầm kỳ thi hoạ, phong hoa tuyết nguyệt, thậm chí chữ viết cũng rất xấu. Hoa phục của Trung cung mặc lên người nàng không hề giống một Hoàng Hậu. Vân Kiều cẩn tuân lời dạy bảo của Thái hậu, học quy củ, tuân thủ lễ nghi, không sân si, không đố kị, mãi đến khi Bùi Thừa Tư tìm được bạch nguyệt quang trong lòng hắn. Cuối cùng, nàng mới hiểu, hoá ra Bùi Thừa Tư cũng có thể yêu một người đến vậy. Ngày Bùi Thừa Tư sửa tên đổi họ cho bạch nguyệt quang đã mất phu quân kia, cho nàng ta tiến cung phong phi, Vân Kiều uống chén thuốc ph* thai làm mất đi hài tử mà chính nàng đã mong đợi. Đối mặt với cơn giận lôi đình của Bùi Thừa Tư, nàng không màng đến vị trí Hoàng hậu, nàng muốn về lại trấn Quế Hoa. Nàng ghét phải nhìn bầu trời nhỏ hẹp trong cung cấm, nàng muốn trở về thị trấn nhỏ, thiên hạ rộng lớn, hương thơm tỏa khắp đất trời vào cuối thu. Nàng cũng ghét nhìn thấy Bùi Thừa Tư. Từ đầu tới cuối, nàng chỉ yêu chàng thư sinh áo xanh phóng khoáng nọ, chỉ cần nhìn thoáng qua cũng thấy yêu thích vô cùng. Tiếc là, từ lúc hắn rời trấn vào kinh, hắn đã chết rồi. Vai chính: Vân Kiều ┃ vai phụ: Những người còn lại. Lập ý: Nếu ngươi vô tình vậy thì ta sẽ hưu.',
  };

  const shortDescription = storyInfo.description.split('.').slice(0, 3).join('. ') + '...';

  return (
    <Root>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <img src={storyInfo.image} alt="Book Cover" className={classes.image} />
            <Typography variant="body1" className={classes.info}>
              <div>
                Tác giả:&nbsp;
                <span
                  onClick={() => handleAuthor(storyInfo.author)}
                  style={{ cursor: 'pointer' }}
                >
                  {storyInfo.author}
                </span>
              </div>
              <div>
                Thể loại: 
                {storyInfo.categoryList.map((category, index) => (
                  <span
                    key={index}
                    onClick={() => handleCategory(category)}
                    style={{ cursor: 'pointer' }}
                  >
                    &nbsp;{category}{index < storyInfo.categoryList.length - 1 ? ',' : ''}
                  </span>
                ))}
              </div>
              <div>
                Nguồn: {storyInfo.source}
              </div>
              <div>
                Trạng thái: {storyInfo.status}
              </div>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8} className={classes.details}>
            <Typography variant="h4" className={classes.title}>{storyInfo.title}</Typography>
            <Box className={classes.rating}>
              <Rating value={storyInfo.rating} readOnly />
              <Typography variant="body2" component="span" style={{ marginLeft: 8 }}>{storyInfo.ratingInfo}</Typography>
            </Box>
            <Typography variant="body2" className={classes.description}>
              {showMore ? storyInfo.description : shortDescription}
            </Typography>
            <Button
              onClick={handleShowMore}
              className={classes.showMoreButton}
            >
              {showMore ? 'Thu gọn' : 'Xem thêm'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Root>
  );
};

export default BookInfo;
