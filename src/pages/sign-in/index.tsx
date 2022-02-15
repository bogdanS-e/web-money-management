import Page from "@/components/common/Page";
import SignInForm from "@/components/auth/SignInForm";
import { AuthPageContainer } from "@/styles/auth";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "@/store/selectors";
import { useRouter } from "next/router";

interface Props {
  title: string;
}

const SignIn: React.FC<Props> = ({ title }) => {
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
        <SignInForm />
      </AuthPageContainer>
    </Page>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      title: 'Sign In | Money Management'
    },
  }
}


export default SignIn;
