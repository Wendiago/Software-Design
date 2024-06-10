import { Breadcrumbs, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PREFIX = 'Breadcrumb';
const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    padding: theme.spacing(2, 0),
  },
}));

const Breadcrumb = ({ breadcrumbs }) => {
  const navigate = useNavigate();
  const handleBreadcrumb = (breadcrumb) => {
    navigate(breadcrumb);
  };

  return (
    <Root className={classes.root}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/">
          Truyện
        </Link>
        {breadcrumbs?.map((item, index) => (
          <Link
            key={index}
            onClick={() => handleBreadcrumb(item.link)}
            component="button"
          >
            {item.name}
          </Link>
        ))}
      </Breadcrumbs>
    </Root>
  );
};

Breadcrumb.propTypes = {
  breadcrumbs: PropTypes.array.isRequired
};

export default Breadcrumb;
