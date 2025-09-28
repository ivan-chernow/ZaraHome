import React from 'react';

interface NewProps {
  className?: string;
}

const New: React.FC<NewProps> = React.memo(() => {
  return (
    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
      NEW
    </div>
  );
});

New.displayName = 'New';

export default New;
