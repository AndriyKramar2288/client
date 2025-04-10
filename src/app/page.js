"use client"

import Header from "@/components/common/Header";
import { useMainContext } from "@/components/contexts/MainContext";
import Content from "@/components/main_page/Content";
import Introduction from "@/components/main_page/Introduction";
import { useEffect } from "react";
import { MainContextProvider } from "@/components/contexts/MainContext";

export default function Home() {

  return (
    <MainContextProvider>
      <div className="">
        <Introduction />
        <Header />
        <Content />
      </div>
    </MainContextProvider>
  );
}
