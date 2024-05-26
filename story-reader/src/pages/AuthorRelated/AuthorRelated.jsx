import React from 'react';
import { Container } from '@mui/material';
import { Breadcrumb } from '../../components';
import StoryList from './StoryList';
import { styled } from '@mui/material/styles';
import { normalizeString } from '../../utils/stringUtils';

const PREFIX = 'AuthorRelated';
const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    minHeight: '100vh',
  },
}));

const AuthorRelated = () => {
  const author = 'Tích Tiểu Tặc'
  const stories = [
    {
        title: 'Ngạo Thế Đan Thần',
        author: author,
        imageUrl: 'https://lh3.googleusercontent.com/pw/AJFCJaVjuIBFnTKQ5soBnZlRWVtCxD3sg1ILwmCHYgnNBJtHdpQlmtRRAJm28EmxtxPtR3UE8bxLUMLsf_PCPFivFFj_YYYnnkXgbjPUyBdCzx1TaicW3dK17dpLz7pSoYMq0muNmrmYxWjTwey3ThHPBdgt=w215-h322-s-no?authuser=0',
        status: 'Full',
        isHot: true,
        chapters: 3808,
    },
    {
        title: 'Nàng Không Muốn Làm Hoàng Hậu',
        author: author,
        imageUrl: 'https://lh3.googleusercontent.com/pw/AJFCJaVjuIBFnTKQ5soBnZlRWVtCxD3sg1ILwmCHYgnNBJtHdpQlmtRRAJm28EmxtxPtR3UE8bxLUMLsf_PCPFivFFj_YYYnnkXgbjPUyBdCzx1TaicW3dK17dpLz7pSoYMq0muNmrmYxWjTwey3ThHPBdgt=w215-h322-s-no?authuser=0',
        status: 'Full',
        isHot: true,
        chapters: 3808,
    },
    {
        title: 'Nàng Không Muốn Làm Hoàng Hậu',
        author: author,
        imageUrl: 'https://lh3.googleusercontent.com/pw/AJFCJaVjuIBFnTKQ5soBnZlRWVtCxD3sg1ILwmCHYgnNBJtHdpQlmtRRAJm28EmxtxPtR3UE8bxLUMLsf_PCPFivFFj_YYYnnkXgbjPUyBdCzx1TaicW3dK17dpLz7pSoYMq0muNmrmYxWjTwey3ThHPBdgt=w215-h322-s-no?authuser=0',
        status: 'Full',
        isHot: true,
        chapters: 3808,
    },
    {
        title: 'Nàng Không Muốn Làm Hoàng Hậu',
        author: author,
        imageUrl: 'https://lh3.googleusercontent.com/pw/AJFCJaVjuIBFnTKQ5soBnZlRWVtCxD3sg1ILwmCHYgnNBJtHdpQlmtRRAJm28EmxtxPtR3UE8bxLUMLsf_PCPFivFFj_YYYnnkXgbjPUyBdCzx1TaicW3dK17dpLz7pSoYMq0muNmrmYxWjTwey3ThHPBdgt=w215-h322-s-no?authuser=0',
        status: 'Full',
        isHot: true,
        chapters: 3808,
    },
    {
        title: 'Nàng Không Muốn Làm Hoàng Hậu',
        author: author,
        imageUrl: 'https://lh3.googleusercontent.com/pw/AJFCJaVjuIBFnTKQ5soBnZlRWVtCxD3sg1ILwmCHYgnNBJtHdpQlmtRRAJm28EmxtxPtR3UE8bxLUMLsf_PCPFivFFj_YYYnnkXgbjPUyBdCzx1TaicW3dK17dpLz7pSoYMq0muNmrmYxWjTwey3ThHPBdgt=w215-h322-s-no?authuser=0',
        status: 'Full',
        isHot: true,
        chapters: 3808,
    },
    {
        title: 'Nàng Không Muốn Làm Hoàng Hậu',
        author: author,
        imageUrl: 'https://lh3.googleusercontent.com/pw/AJFCJaVjuIBFnTKQ5soBnZlRWVtCxD3sg1ILwmCHYgnNBJtHdpQlmtRRAJm28EmxtxPtR3UE8bxLUMLsf_PCPFivFFj_YYYnnkXgbjPUyBdCzx1TaicW3dK17dpLz7pSoYMq0muNmrmYxWjTwey3ThHPBdgt=w215-h322-s-no?authuser=0',
        status: 'Full',
        isHot: true,
        chapters: 3808,
    },
    {
        title: 'Nàng Không Muốn Làm Hoàng Hậu',
        author: author,
        imageUrl: 'https://lh3.googleusercontent.com/pw/AJFCJaVjuIBFnTKQ5soBnZlRWVtCxD3sg1ILwmCHYgnNBJtHdpQlmtRRAJm28EmxtxPtR3UE8bxLUMLsf_PCPFivFFj_YYYnnkXgbjPUyBdCzx1TaicW3dK17dpLz7pSoYMq0muNmrmYxWjTwey3ThHPBdgt=w215-h322-s-no?authuser=0',
        status: 'Full',
        isHot: true,
        chapters: 3808,
    },
  ];

  const breadcrumbs = [
    {
        name: author,
        link: `/tac-gia/${normalizeString(author)}`
    }
  ]

  return (
    <Root className={classes.root}>
      <Container>
        <Breadcrumb breadcrumbs={breadcrumbs}/>
        <StoryList stories={stories} />
      </Container>
    </Root>
  );
};

export default AuthorRelated;
