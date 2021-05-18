import React from 'react';

import {
  Button,
  Typography,
} from '@material-ui/core';

export const BackupCodes = ({
  codes,
  showButton,
  regenerateBackupCodes,
}) => (
  <div className="backup-codes">
    {(codes && codes.length > 0) && (
      <div>
        <Typography>
          BackupCodes
        </Typography>
        <code className="backup-codes__codes">
          {codes.join('\n')}
        </code>
      </div>
    )}
    {showButton && (
      <div className="backup-codes__regenerate">
        <Button
          onClick={regenerateBackupCodes}
          variant="outlined"
          style={{ backgroundColor: '#0398D5', color: '#FFFFFF', marginTop: 30 }}
          color="primary"
        >
          Regenerate primary method backup codes
        </Button>
      </div>
    )}
  </div>
);
