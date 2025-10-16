// pages/404.tsx

import React from 'react';
import { GetStaticProps } from 'next';

interface Props {
  message: string;
}

const Custom404: React.FC<Props> = ({ message }) => {
  return <h1>{message}</h1>;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      message: '404 - Page Not Found',
    },
  };
};

export default Custom404;
