import { Provider } from "react-redux";
import { ReactNode } from "react";
import { store } from "@/store/index";

export default function ReduxProviders({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}