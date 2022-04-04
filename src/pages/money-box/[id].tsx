import Page from "@/components/common/Page";
import Error from 'next/error'

import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { selectIsLoggedIn, selectUser, selectUserMoneyBox } from "@/store/selectors";
import MoneyBoxPage from "@/components/money-box-page/MoneyBoxPage";

interface Props {

}

const BudgetId: React.FC<Props> = () => {
  const router = useRouter();

  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const moneyBox = useSelector(selectUserMoneyBox(router.query.id as string));

  if (isLoggedIn === false) {
    router.push('/sign-in', undefined, { shallow: true });
    return null;
  }

  if (user && !moneyBox) {
    return <Error statusCode={404} />
  }

  if (!moneyBox) return null;

  return (
    <Page>
      <MoneyBoxPage moneyBox={moneyBox} />
    </Page>
  );
};


export default BudgetId;
