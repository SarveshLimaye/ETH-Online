import { AccountAbstractionProvider } from "../../store/accountAbstractionContext";

const Providers = ({ children }: { children: JSX.Element }) => {
  return <AccountAbstractionProvider>{children}</AccountAbstractionProvider>;
};

export default Providers;
