/* eslint-disable react/prop-types */

import { DownloadButton } from "../../components";
import { usePrioritizedSources } from "../../contexts/PrioritizedSourcesContext";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";
import StarIcon from "@mui/icons-material/Star";
import toast from "react-hot-toast";
import { Box, Button, ThemeProvider, createTheme, styled } from "@mui/material";

const PREFIX = "NovelReading";
const classes = {
  server: `${PREFIX}-server`,
};

const Root = styled("div")(() => ({
  [`& .${classes.server}`]: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
}));

const customTheme = createTheme({
  components: {
    NavButton: {
      styleOverrides: {
        primary: {
          color: "#dbe4ff",
          backgroundColor: "#5c7cfa",
          "&:hover": {
            color: "black",
            backgroundColor: "#748ffc",
          },
        },
        secondary: {
          color: "darkblue",
        },
      },
    },
  },
});

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "color",
  name: "NavButton",
  slot: "Root",

  overridesResolver: (props, styles) => [
    styles.root,
    props.color === "primary" && styles.primary,
    props.color === "secondary" && styles.secondary,
  ],
})(({ theme }) => ({
  margin: theme.spacing(1),
}));

const ServerNav = ({ sources, currentSource, title, onHandleServer }) => {
  const { prioritizedSources, addPrioritizedSource, deletePrioritizedSource } =
    usePrioritizedSources();

  function handleTogglePriority(source) {
    if (prioritizedSources.includes(source)) {
      toast(
        <p>
          Đã xóa <strong>{source}</strong> khỏi server ưu tiên
        </p>,
        {
          icon: "👇🏼",
        }
      );
      deletePrioritizedSource(source);
    } else {
      toast(
        <p>
          Đã thêm <strong>{source}</strong> vào server ưu tiên
        </p>,
        {
          icon: "☝🏼",
        }
      );
      addPrioritizedSource(source);
    }
  }

  return (
    <Root>
      <ThemeProvider theme={customTheme}>
        <Box>
          {sources?.map((source, index) => (
            <NavButton
              key={index}
              variant="outlined"
              onClick={() => {
                onHandleServer(source);
              }}
              color={
                (currentSource.length === 0 && index === 0) ||
                currentSource[0] === source
                  ? "primary"
                  : "secondary"
              }
            >
              <div className={classes.server}>
                <span>
                  Server <strong>{source}</strong>
                </span>
                {prioritizedSources.includes(source) ? (
                  <StarIcon
                    color="error"
                    fontSize="large"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePriority(source);
                    }}
                  />
                ) : (
                  <StarBorderPurple500OutlinedIcon
                    color="error"
                    fontSize="large"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePriority(source);
                    }}
                  />
                )}
              </div>
            </NavButton>
          ))}
          <DownloadButton title={title} />
        </Box>
      </ThemeProvider>
    </Root>
  );
};

export default ServerNav;
