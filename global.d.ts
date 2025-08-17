declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';

declare module 'next/image' {
  import * as React from 'react';

  type ImageProps = React.ComponentProps<'img'> & {
    width?: number | string;
    height?: number | string;
    priority?: boolean;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    unoptimized?: boolean;
  };

  const Image: React.FC<ImageProps>;
  export default Image;
}
