import * as React from 'react';

interface PartialSeparatorProps {
  name: string;
  wrapped: boolean;
}

export const PartialSeparator: React.FunctionComponent<PartialSeparatorProps> = (props) => {
  const { name, wrapped, children } = props;
  if (wrapped) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: `<!-- ${name}_START -->` }} />
        {children}
        <style dangerouslySetInnerHTML={{ __html: `<!-- ${name}_END -->` }} />
      </>
    );
  }
  return <>{children}</>;
};
