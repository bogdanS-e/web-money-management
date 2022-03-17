import Page from "@/components/common/Page";
import Error from 'next/error'

import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { selectIsLoggedIn, selectUser, selectUserBudget } from "@/store/selectors";
import BudgetPage from "@/components/budget-page/BudgetPage";

interface Props {

}

const BudgetId: React.FC<Props> = () => {
  const router = useRouter();

  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const budget = useSelector(selectUserBudget(router.query.id as string));

  if (isLoggedIn === false) {
    router.push('/sign-in', undefined, { shallow: true });
    return null;
  }

  if (user && !budget) {
    return <Error statusCode={404} />
  }

  if (!budget) return null;

  return (
    <Page>
      <BudgetPage budget={budget} />
    </Page>
  );
};


export default BudgetId;
