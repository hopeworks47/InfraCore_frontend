"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import type { ProvidersProps } from "@/types/components.types";

export default function Providers({ children }: ProvidersProps) {
    return <Provider store={store}>
        <SessionProvider>{children}</SessionProvider>
    </Provider>;
}
