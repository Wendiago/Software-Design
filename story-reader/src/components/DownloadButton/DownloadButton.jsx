import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { downloadAPI } from '../../api';
import { useAllSources } from '../../hooks/useAllSources';
import { Button } from '@mui/material';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { useAllSupportFileFormats } from '../../hooks/supportFileFormatHook';

function NovelDownloadButton({ title }) {
  const { source } = useAllSources();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const { file_formats } = useAllSupportFileFormats();
  
  const handleDownload = async (file_format) => {
    setIsPending(true);
    setError(null);

    try {
        const data = await downloadAPI.downloadNovel({ title, source, file_format });
        const blob = new Blob([data], { type: `application/${file_format}` }); 
        saveAs(blob, `${title}.${file_format}`);
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
        {file_formats?.map((file_format, index) => (
          <Button key={index} onClick={() => {handleDownload(file_format)}} disabled={isPending}>
            {file_format}
            &nbsp;
            <FaCloudDownloadAlt />
          </Button>
        ))}
      </div>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </div>
  );
}

export default NovelDownloadButton;
