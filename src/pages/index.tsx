import { useRequest } from '@/utils/hooks';
import React, { useEffect } from 'react';


interface Props {}

const Home: React.FC<Props> = () => {
  useEffect(() => {
    const fetchUser = async () => {
      console.log('FEEEEEEETCH');
      
      const resp = await fetch('/api/user/get-all');
      console.log(resp);
      
    }
    fetchUser();
  }, []);

  return (
    <>
     <h1>hi there</h1>
    </>
  );
};


export default Home;
