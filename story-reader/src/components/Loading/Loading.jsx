import React from "react";
import ReactLoading from "react-loading";
import { useTheme } from "@mui/material/styles";

const Loading = () => {
  const theme = useTheme();

  return (
    <div className="fixed inset-0 flex items-center justify-center ">
      <div className="m-auto">
        <ReactLoading
          type={"spinningBubbles"}
          height={50}
          width={50}
          color={theme.palette.text.primary}
        />
      </div>
    </div>
  );
};

export default Loading;
