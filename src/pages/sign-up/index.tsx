import Page from "@/components/common/Page";
import SignUpForm from "@/components/auth/SignUpForm";
import { AuthPageContainer } from "@/styles/auth";

interface Props {
  title: string;
}

const SignUp: React.FC<Props> = ({ title }) => {
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
