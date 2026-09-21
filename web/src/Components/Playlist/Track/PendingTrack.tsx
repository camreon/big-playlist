// ABOUTME: Placeholder row shown for a submitted URL while the server resolves it.
// ABOUTME: Stands in for the real track so the playlist reacts the moment you hit add.
import React from 'react';
import { PendingTrackProps } from '../../../interfaces';
import './Track.css';

export const PendingTrack: React.FC<PendingTrackProps> = ({ pageUrl }) => {
  return (
    <div
      role="status"
      aria-label={`Adding ${pageUrl}`}
      className="px-6 py-4 opacity-50 track-item"
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600"></div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate" title={pageUrl}>
            {pageUrl}
          </p>
          <p className="text-sm text-gray-500">Adding&hellip;</p>
        </div>
      </div>
    </div>
  );
};
