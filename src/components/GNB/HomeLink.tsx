import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Cookies from 'universal-cookie';

import { GNBContext } from 'src/components/GNB';
import cookieKeys from 'src/constants/cookies';

interface Props {
  passHref?: boolean;
}

// Fixme
export const legacyCookieMap: {[index: string]: string} = {
  general: 'general',
  comic: 'comics',
  romance_serial: 'romance-serial',
  fantasy_serial: 'fantasy-serial',
  bl_serial: 'bl-serial',
};

const HomeLink: React.FunctionComponent<Props> = (props) => {
  const {
    passHref = false,
    children,
  } = props;

  const { origin } = useContext(GNBContext);
  const [genre, setGenre] = useState('');

  useEffect(() => {
    const cookies = new Cookies();
    const cookie = cookies.get(cookieKeys.main_genre);
    setGenre(legacyCookieMap[cookie] ?? cookie);
  }, []);

  if (!process.env.USE_CSR) {
    return React.cloneElement(
      children as React.ReactElement,
      { href: `${origin}/` },
    );
  }
  return (
    <Link
      href={{ pathname: '/[genre]', query: { genre: genre || 'general' } }}
      as={`/${genre}`}
      passHref={passHref}
    >
      {children}
    </Link>
  );
};

export default HomeLink;
