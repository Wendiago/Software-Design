import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { downloadAPI } from '../../api';
import { useAllSources } from '../../hooks/useAllSources';
import { Button } from '@mui/material';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { useAllSupportFileFormats } from '../../hooks/supportFileFormatHook';
import PropTypes from 'prop-types';

function NovelDownloadButton({ title }) {
  const { source } = useAllSources();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const { fileFormats } = useAllSupportFileFormats();
  
  const handleDownload = async (fileFormat) => {
    setIsPending(true);
    setError(null);

    try {
      const data = await downloadAPI.downloadNovel({ title, source, fileFormat });
      const blob = new Blob([data], { type: `application/${fileFormat}` }); 
      saveAs(blob, `${title}.${fileFormat}`);
    } catch (err) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <div>
        {isPending ? 'Đang tải...' : ''}
        &nbsp;
        {fileFormats?.map((fileFormat, index) => (
          <Button key={index} onClick={() => {handleDownload(fileFormat);}} disabled={isPending}>
            {fileFormat}
            &nbsp;
            <FaCloudDownloadAlt />
          </Button>
        ))}
      </div>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </div>
  );
}

NovelDownloadButton.propTypes = {
  title: PropTypes.string.isRequired,
};

export default NovelDownloadButton;
