import Page from "@/components/common/Page";
import SignUpForm from "@/components/auth/SignUpForm";
import { AuthPageContainer } from "@/styles/auth";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "@/store/selectors";

interface Props {
  title: string;
}

const SignUp: React.FC<Props> = ({ title }) => {
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
        <SignUpForm />
      </AuthPageContainer>
    </Page>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      title: 'Sign Up | Money Management'
    },
  }
}


export default SignUp;
