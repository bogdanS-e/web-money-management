import ConfirmSignUpForm from "@/components/auth/ConfirmSignUpForm";
import Page from "@/components/common/Page";
import { AuthPageContainer } from "@/styles/auth";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "@/store/selectors";

interface Props {
  title: string;
  email: string;
  code: string;
}

const SignUp: React.FC<Props> = ({ title, email, code }) => {
  const router = useRouter();
  
  const isLoggedIn = useSelector(selectIsLoggedIn);

  if (isLoggedIn) {
    router.push('/', undefined, { shallow: true });
    return null;
  }

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <Page title={title}>
      <AuthPageContainer vertical='start'>
        <ConfirmSignUpForm email={email} code={code} />
      </AuthPageContainer>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  const { email, code } = query;
  
  if (!email || !code) {
    res.setHeader('location', '/sign-up');
    res.statusCode = 302;
    res.end();
  }
  
  return {
    props: {
      title: 'Confirm Sign Up | Money Management',
      email,
      code,
    },
  }
}


export default SignUp;
